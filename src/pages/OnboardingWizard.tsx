import React, { useState } from 'react';
import {
  User,
  MapPin,
  Cpu,
  Sliders,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { db } from '../services/mockDb';

interface OnboardingWizardProps {
  onComplete: () => void;
  onNavigate: (route: string) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onNavigate }) => {
  const user = db.getUser();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State across the 7 steps
  const [beekeeperName, setBeekeeperName] = useState(user.full_name || 'Ramesh Patil');
  const [organization, setOrganization] = useState(user.organization || 'Western Ghats Honey Cooperative');
  const [apiaryName, setApiaryName] = useState('Meadow Ridge Apiary');
  const [apiaryLocation, setApiaryLocation] = useState('Sakleshpur Foothills, Karnataka');
  const [hiveCount, setHiveCount] = useState(4);
  const [hiveCode, setHiveCode] = useState('HG-101');
  const [hiveName, setHiveName] = useState('Sunrise Comb Alpha');
  const [espDeviceId, setEspDeviceId] = useState('ESP32-HG-101');
  const [tempWarning, setTempWarning] = useState(37.0);
  const [tempCritical, setTempCritical] = useState(38.5);
  const [humMin, setHumMin] = useState(45.0);
  const [humMax, setHumMax] = useState(75.0);
  const [emergencyPhone, setEmergencyPhone] = useState(user.phone || '+919876543210');
  const [smsConsent, setSmsConsent] = useState(true);

  const totalSteps = 7;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      finalizeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finalizeOnboarding = () => {
    // 1. Update User Profile
    db.updateUser({
      full_name: beekeeperName,
      organization: organization,
      phone: emergencyPhone
    });

    // 2. Create the first Apiary
    const createdApiary = db.createApiary({
      name: apiaryName,
      location: apiaryLocation,
      notes: `Registered during initial onboarding with ${hiveCount} planned hives.`
    });

    // 3. Register the first Hive
    const createdHive = db.createHive({
      name: hiveName,
      hive_code: hiveCode,
      apiary_id: createdApiary.id,
      device_code: espDeviceId,
      notes: 'Initial primary hive registered via onboarding wizard.'
    });

    // 4. Save Custom Thresholds
    db.saveAlertSettings({
      id: `set_${createdHive.id}`,
      owner_id: user.id,
      hive_id: createdHive.id,
      temperature_warning: tempWarning,
      temperature_critical: tempCritical,
      temperature_min: 32.0,
      humidity_min: humMin,
      humidity_max: humMax,
      persistence_minutes: 5,
      cooldown_minutes: 30
    });

    // 5. Save Notification Preferences
    db.saveNotificationPreferences({
      sms_enabled: true,
      in_app_enabled: true,
      authorized_phone_numbers: [emergencyPhone],
      sms_consent_given: smsConsent
    });

    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="cursor-pointer inline-block mb-2" onClick={() => onNavigate('landing')}>
            <Logo size="md" showTagline />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Apiary Setup & Onboarding
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Configure your hive monitoring parameters, IoT node pairing, and early SMS thresholds.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="mb-6 bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span className="text-emerald-800 font-extrabold">
              {Math.round((currentStep / totalSteps) * 100)}% Completed
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-700 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E3D9] shadow-md space-y-6">
          {/* STEP 1: Beekeeper Name / Org */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Step 1: Beekeeper & Organization</h3>
                  <p className="text-xs text-slate-500">How should HIVEGUARD AI identify you in alerts?</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Beekeeper Full Name
                </label>
                <input
                  type="text"
                  value={beekeeperName}
                  onChange={(e) => setBeekeeperName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  placeholder="e.g. Ramesh Patil"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Organization / Cooperative Name (Optional)
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  placeholder="e.g. Western Ghats Honey Cooperative"
                />
              </div>
            </div>
          )}

          {/* STEP 2 & 3: First Apiary Details */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Step 2: Add Your First Apiary</h3>
                  <p className="text-xs text-slate-500">Name and categorize your bee yard location</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Apiary Name
                </label>
                <input
                  type="text"
                  value={apiaryName}
                  onChange={(e) => setApiaryName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  placeholder="e.g. Valley Bloom Apiary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location Description / Landmark
                </label>
                <input
                  type="text"
                  value={apiaryLocation}
                  onChange={(e) => setApiaryLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  placeholder="e.g. Coorg Valley, Karnataka (Elev: 920m)"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Apiary Hives Count */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Step 3: Colony Capacity</h3>
                  <p className="text-xs text-slate-500">How many total colonies are hosted at {apiaryName}?</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Total Active Hives at this Apiary
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={hiveCount}
                  onChange={(e) => setHiveCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>You can monitor single hives or deploy IoT sensor nodes across all your colonies.</span>
              </div>
            </div>
          )}

          {/* STEP 4: Register First Hive with ESP32 Device */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Step 4: Register Primary Hive & IoT Node</h3>
                  <p className="text-xs text-slate-500">Pair your ESP32 microcontroller with a unique hive ID</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Unique Hive Code
                  </label>
                  <input
                    type="text"
                    value={hiveCode}
                    onChange={(e) => setHiveCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    placeholder="e.g. HG-001"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Hive Nickname
                  </label>
                  <input
                    type="text"
                    value={hiveName}
                    onChange={(e) => setHiveName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    placeholder="e.g. Golden Comb Alpha"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ESP32 Device ID / Serial
                </label>
                <input
                  type="text"
                  value={espDeviceId}
                  onChange={(e) => setEspDeviceId(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  placeholder="e.g. ESP32-HG-001"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Found on the QR code or sticker of your HIVEGUARD AI hardware module.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Configure Warning Thresholds */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Step 5: Environmental Warning Thresholds</h3>
                  <p className="text-xs text-slate-500">Calibrate alert limits to your bee species and local climate</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <label className="block text-xs font-bold text-amber-900">
                    Temperature Warning Threshold: {tempWarning}°C
                  </label>
                  <input
                    type="range"
                    min="35.5"
                    max="38.0"
                    step="0.1"
                    value={tempWarning}
                    onChange={(e) => setTempWarning(parseFloat(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-amber-800">Safe comfort baseline is 34.5°C to 35.5°C.</p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
                  <label className="block text-xs font-bold text-rose-900">
                    Critical Heat Stroke Limit: {tempCritical}°C
                  </label>
                  <input
                    type="range"
                    min="37.5"
                    max="40.0"
                    step="0.1"
                    value={tempCritical}
                    onChange={(e) => setTempCritical(parseFloat(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-rose-800">Immediate brood melting risk if sustained.</p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2">
                  <label className="block text-xs font-bold text-sky-900">
                    Min Safe Humidity: {humMin}%
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="55"
                    step="1"
                    value={humMin}
                    onChange={(e) => setHumMin(parseFloat(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-sky-800">Prevents desiccated egg mortality.</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <label className="block text-xs font-bold text-emerald-900">
                    Max Safe Humidity: {humMax}%
                  </label>
                  <input
                    type="range"
                    min="65"
                    max="90"
                    step="1"
                    value={humMax}
                    onChange={(e) => setHumMax(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-emerald-800">Prevents chalkbrood mold growth.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Emergency Contact & SMS Consent */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Step 6: Emergency SMS Early Warning</h3>
                  <p className="text-xs text-slate-500">Provide verified phone numbers to receive automated alerts</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Mobile Number with Country Code
                </label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsConsent}
                    onChange={(e) => setSmsConsent(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-emerald-700 border-slate-300 focus:ring-emerald-600"
                  />
                  <div className="text-xs text-amber-900">
                    <span className="font-bold block">Explicit SMS Notification Consent:</span>
                    <span>
                      I authorize HIVEGUARD AI to transmit automated early-warning text messages to this phone number when severe temperature spikes, chalkbrood dampness, or rapid weight loss are detected.
                    </span>
                  </div>
                </label>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500">
                Cooldown protection is enabled by default (30-minute interval between SMS alerts) to prevent message spam during ongoing weather events.
              </div>
            </div>
          )}

          {/* STEP 7: Ready to Launch */}
          {currentStep === 7 && (
            <div className="text-center space-y-4 py-4 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Your Beehive Sentinel is Ready!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Apiary <strong className="text-slate-800">{apiaryName}</strong> and hive <strong className="text-slate-800">{hiveCode}</strong> have been configured with temperature warning at {tempWarning}°C and critical alert at {tempCritical}°C.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-left text-xs space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Apiary:</span>
                  <span className="font-bold">{apiaryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hive ID:</span>
                  <span className="font-bold">{hiveCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">IoT Device:</span>
                  <span className="font-mono font-bold text-emerald-800">{espDeviceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SMS Alerts:</span>
                  <span className="font-bold text-emerald-700">{smsConsent ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={finalizeOnboarding}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Skip Onboarding
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
            >
              <span>{currentStep === totalSteps ? 'Enter Monitoring Dashboard' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
