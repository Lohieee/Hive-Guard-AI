// HIVEGUARD AI - Sensor Stream & IoT Simulation Engine
// Provides live hardware stream updates and interactive simulation modes.

import { db } from './mockDb';
import { alertEngine, AlertTriggerResult } from './alertEngine';
import { SensorReading } from '../types';

export type SimulationScenario =
  | 'normal'
  | 'heatwave_spike'
  | 'humidity_abnormal'
  | 'swarm_event'
  | 'chilling_risk'
  | 'device_offline';

type Listener = (data: { reading: SensorReading; alertResult?: AlertTriggerResult }) => void;

export class SensorEngine {
  private static instance: SensorEngine;
  private intervalId: any = null;
  private listeners: Set<Listener> = new Set();
  private isRunning = false;

  private constructor() {}

  public static getInstance(): SensorEngine {
    if (!SensorEngine.instance) {
      SensorEngine.instance = new SensorEngine();
    }
    return SensorEngine.instance;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(data: { reading: SensorReading; alertResult?: AlertTriggerResult }) {
    this.listeners.forEach((fn) => {
      try {
        fn(data);
      } catch (e) {
        console.error('Sensor listener error:', e);
      }
    });
  }

  public startSimulationHeartbeat(intervalMs = 12000) {
    if (this.isRunning) return;
    this.isRunning = true;

    this.intervalId = setInterval(() => {
      const hives = db.getHives();
      if (hives.length === 0) return;

      // Pick a random hive to emit slight biological drift
      const targetHive = hives[Math.floor(Math.random() * hives.length)];
      const last = db.getLatestReading(targetHive.id);

      const baseTemp = last ? last.temperature_c : 35.0;
      const baseHum = last ? last.humidity_percent : 60.0;
      const baseWeight = last ? (last.weight_kg || 25.0) : 25.0;

      // Small natural microclimate fluctuation (±0.15°C)
      const driftTemp = Number((baseTemp + (Math.random() * 0.3 - 0.15)).toFixed(1));
      const driftHum = Number(Math.max(40, Math.min(85, baseHum + (Math.random() * 1.0 - 0.5))).toFixed(1));
      const driftWeight = Number((baseWeight + (Math.random() * 0.02 - 0.01)).toFixed(2));
      const activity = Math.max(0, Math.round((last?.activity_count || 120) + (Math.random() * 30 - 15)));

      const newReading = db.appendReading({
        hive_id: targetHive.id,
        device_id: targetHive.device?.id,
        temperature_c: driftTemp,
        humidity_percent: driftHum,
        weight_kg: driftWeight,
        activity_count: activity,
        battery_percent: targetHive.device?.battery_level || 92,
        is_simulated: targetHive.id !== 'hive_01', // Hive 1 is marked as primary live sensor
        recorded_at: new Date().toISOString()
      });

      const alertResult = alertEngine.evaluateReading(newReading);
      this.emit({ reading: newReading, alertResult });
    }, intervalMs);
  }

  public stopSimulationHeartbeat() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  // Trigger Instant Specific Test Scenarios
  public triggerScenario(hiveId: string, scenario: SimulationScenario): { reading: SensorReading; alertResult: AlertTriggerResult } {
    const hive = db.getHiveById(hiveId) || db.getHives()[0];
    const targetHiveId = hive ? hive.id : hiveId;
    const latest = db.getLatestReading(targetHiveId);

    let temp = 35.1;
    let hum = 61.5;
    let weight = latest?.weight_kg || 26.2;
    let activity = 145;

    switch (scenario) {
      case 'heatwave_spike':
        // Sudden dangerous temperature spike
        temp = 39.4;
        hum = 42.0;
        activity = 320; // frantic fanning at entrance
        break;

      case 'humidity_abnormal':
        // Monsoon excessive dampness / condensation
        temp = 34.2;
        hum = 89.2;
        activity = 40;
        break;

      case 'swarm_event':
        // Swarm departure: weight drops by ~2.8 kg, temporary activity surge
        weight = Math.max(15, (latest?.weight_kg || 26.5) - 2.8);
        activity = 450;
        temp = 36.6;
        break;

      case 'chilling_risk':
        // Chilling cold intrusion
        temp = 30.5;
        hum = 72.0;
        activity = 8;
        break;

      case 'device_offline':
        // Disconnect device
        if (hive.device) {
          db.updateDevice(hive.device.id, {
            connection_status: 'offline',
            last_seen_at: new Date(Date.now() - 3600000).toISOString()
          });
        }
        break;

      case 'normal':
      default:
        temp = 35.0;
        hum = 60.0;
        weight = 26.4;
        activity = 160;
        break;
    }

    const newReading = db.appendReading({
      hive_id: targetHiveId,
      device_id: hive.device?.id,
      temperature_c: temp,
      humidity_percent: hum,
      weight_kg: weight,
      activity_count: activity,
      battery_percent: scenario === 'device_offline' ? 5 : 88,
      is_simulated: true,
      recorded_at: new Date().toISOString()
    });

    const alertResult = alertEngine.evaluateReading(newReading);
    this.emit({ reading: newReading, alertResult });

    return { reading: newReading, alertResult };
  }
}

export const sensorEngine = SensorEngine.getInstance();
