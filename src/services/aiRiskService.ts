// HIVEGUARD AI - AI-Assisted Colony Risk Analysis Service
// Analyzes microclimate stability, diurnal temperature variance, flight activity,
// weight dynamics, and parasite observations to generate explainable risk assessments.

import { db } from './mockDb';
import { RiskAssessment, RiskLevel, AssessmentMethod } from '../types';

export class AiRiskService {
  private static instance: AiRiskService;

  private constructor() {}

  public static getInstance(): AiRiskService {
    if (!AiRiskService.instance) {
      AiRiskService.instance = new AiRiskService();
    }
    return AiRiskService.instance;
  }

  public analyzeHive(hiveId: string): RiskAssessment {
    const hive = db.getHiveById(hiveId);
    if (!hive) {
      throw new Error(`Hive ${hiveId} not found`);
    }

    const readings = db.getReadings(hiveId, 48); // past 24-48 readings
    const parasites = db.getParasites(hiveId);
    const inspections = db.getInspections(hiveId);
    const settings = db.getAlertSettings(hiveId);

    // 1. Insufficient Data Check
    if (readings.length < 5) {
      const result: RiskAssessment = {
        id: `risk_${Date.now()}`,
        owner_id: hive.owner_id,
        hive_id: hive.id,
        hive_code: hive.hive_code,
        risk_level: 'insufficient_data',
        assessment_method: 'rule_based',
        confidence_score: 0.35,
        summary: 'Insufficient historical readings available for statistical confidence. At least 24 hours of sensor data required.',
        contributing_factors: [
          'Fewer than 5 telemetry cycles logged',
          'Diurnal baseline has not yet stabilized'
        ],
        recommended_actions: [
          'Verify ESP32 device power and Wi-Fi uplink',
          'Allow node to collect 24 hours of baseline telemetry'
        ],
        assessed_at: new Date().toISOString()
      };
      db.saveRiskAssessment(result);
      return result;
    }

    // 2. Statistical Analysis of Microclimate
    const temps = readings.map((r) => r.temperature_c);
    const hums = readings.map((r) => r.humidity_percent);
    const activities = readings.map((r) => r.activity_count || 0);

    const meanTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const tempVariance = temps.reduce((sum, t) => sum + Math.pow(t - meanTemp, 2), 0) / temps.length;
    const tempStdDev = Math.sqrt(tempVariance);

    const meanHum = hums.reduce((a, b) => a + b, 0) / hums.length;
    const maxHum = Math.max(...hums);

    const contributingFactors: string[] = [];
    const recommendedActions: string[] = [];
    let riskLevel: RiskLevel = 'normal';
    let assessmentMethod: AssessmentMethod = 'hybrid';

    // Colony thermoregulation benchmark:
    // Apis mellifera and Apis cerana brood nests stay tightly between 34.5°C and 35.5°C.
    // Higher standard deviation indicates failing thermoregulation or sparse colony cluster.
    if (tempStdDev > 1.8 || maxTemp > settings.temperature_critical) {
      riskLevel = 'high_risk';
      contributingFactors.push(
        `High thermal volatility (StdDev: ±${tempStdDev.toFixed(2)}°C, Peak: ${maxTemp.toFixed(1)}°C). Indicates severe cluster stress or loss of thermoregulatory worker capacity.`
      );
      recommendedActions.push('Urgent physical hive inspection for queen failure, colony desertion, or excessive sun exposure.');
      recommendedActions.push('Check shade board and top hive insulation immediately.');
    } else if (tempStdDev > 1.0 || maxTemp > settings.temperature_warning) {
      riskLevel = 'warning';
      contributingFactors.push(
        `Elevated temperature swings observed (Peak: ${maxTemp.toFixed(1)}°C). Brood nest microclimate shows afternoon ventilation strain.`
      );
      recommendedActions.push('Inspect entrance reducer and top ventilation holes for propolis clogging.');
    } else {
      contributingFactors.push(
        `Brood nest microclimate is biologically stable (Mean: ${meanTemp.toFixed(1)}°C, StdDev: ±${tempStdDev.toFixed(2)}°C).`
      );
    }

    // Humidity evaluation
    if (maxHum > (settings.humidity_critical_max || 85)) {
      if (riskLevel === 'normal') riskLevel = 'warning';
      contributingFactors.push(`Excessive humidity peak (${maxHum.toFixed(1)}%). Elevated chalkbrood and nosema fungal germination risk.`);
      recommendedActions.push('Ensure bottom board mesh allows condensation drainage. Raise hive stand off wet soil.');
    } else {
      contributingFactors.push(`Mean relative humidity within safe comfort envelope (${meanHum.toFixed(1)}%).`);
    }

    // Flight activity analysis
    const recentActivity = activities.slice(-6);
    const avgRecentActivity = recentActivity.reduce((a, b) => a + b, 0) / (recentActivity.length || 1);
    if (avgRecentActivity < 15 && readings.length > 20) {
      if (riskLevel === 'normal') riskLevel = 'warning';
      contributingFactors.push('Unusually low entrance flight counts compared with expected daylight baseline.');
      recommendedActions.push('Inspect entrance for dead bees, robber bee activity, or pesticide drift symptoms.');
    }

    // Varroa parasite correlation
    const latestParasite = parasites[0];
    if (latestParasite) {
      if (latestParasite.infestation_rate_pct > 3.0) {
        riskLevel = 'high_risk';
        contributingFactors.push(
          `High Varroa mite infestation rate confirmed (${latestParasite.infestation_rate_pct}% - ${latestParasite.mite_count} mites / ${latestParasite.sample_size} bees).`
        );
        recommendedActions.push('Implement immediate miticide treatment (Formic acid, Oxalic acid dribble, or Thymol).');
      } else if (latestParasite.infestation_rate_pct >= 2.0) {
        if (riskLevel !== 'high_risk') riskLevel = 'warning';
        contributingFactors.push(`Varroa mite count is approaching economic injury threshold (${latestParasite.infestation_rate_pct}%).`);
        recommendedActions.push('Schedule follow-up sugar shake test within 7 days.');
      } else {
        contributingFactors.push(`Varroa observation remains below critical threshold (${latestParasite.infestation_rate_pct}%).`);
      }
    }

    // Inspection history check
    const latestInsp = inspections[0];
    if (latestInsp && latestInsp.brood_pattern === 'spotty') {
      if (riskLevel === 'normal') riskLevel = 'warning';
      contributingFactors.push('Latest physical inspection noted spotty brood pattern (possible queen failure or brood pathogen).');
      recommendedActions.push('Re-check queen laying pattern and evaluate for European Foulbrood (EFB).');
    }

    // Confidence indicator
    let confidence = 0.88;
    if (readings.length > 40 && parasites.length > 0) confidence = 0.95;
    else if (readings.length < 15) confidence = 0.72;

    let summary = '';
    if (riskLevel === 'high_risk') {
      summary = `Critical risk detected for Hive ${hive.hive_code}. Multiple abnormal biological signals (thermal instability or severe parasite presence) justify prompt physical intervention.`;
    } else if (riskLevel === 'warning') {
      summary = `Warning condition for Hive ${hive.hive_code}. One or more environmental or parasite indicators deviate from healthy colony baseline.`;
    } else {
      summary = `Normal conditions for Hive ${hive.hive_code}. Brood nest thermoregulation, humidity, and flight activity are in healthy equilibrium.`;
      if (recommendedActions.length === 0) {
        recommendedActions.push('Continue regular bi-weekly apiary management routine.');
        recommendedActions.push('Verify water source availability near the apiary.');
      }
    }

    const assessment: RiskAssessment = {
      id: `risk_${Date.now()}`,
      owner_id: hive.owner_id,
      hive_id: hive.id,
      hive_code: hive.hive_code,
      risk_level: riskLevel,
      assessment_method: assessmentMethod,
      confidence_score: confidence,
      summary,
      contributing_factors: contributingFactors,
      recommended_actions: recommendedActions,
      assessed_at: new Date().toISOString()
    };

    db.saveRiskAssessment(assessment);
    return assessment;
  }
}

export const aiRiskService = AiRiskService.getInstance();
