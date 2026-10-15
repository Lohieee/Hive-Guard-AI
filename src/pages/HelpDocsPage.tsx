import React from 'react';
import {
  HelpCircle,
  Cpu,
  Wifi,
  ThermometerSun,
  Scale,
  Bug,
  ShieldCheck,
  Terminal,
  Code2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface HelpDocsPageProps {
  onNavigate: (route: string) => void;
  onOpenSimulator: () => void;
}

export const HelpDocsPage: React.FC<HelpDocsPageProps> = ({ onNavigate, onOpenSimulator }) => {
  return (
    <div className="space-y-8 pb-16 font-sans animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Hardware & Knowledge Base</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          ESP32 Hardware Wiring & Calibration Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Complete schematic diagrams, DHT22 sensor calibration, HX711 load cell scales, and cloud ingestion endpoints.
        </p>
      </div>

      {/* Hardware Schematic Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E3D9] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">ESP32 Pinout & Sensor Connections</h3>
            <p className="text-xs text-slate-500">Standard GPIO assignment for the HIVEGUARD AI Node v1.2</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Sensor Component</th>
                <th className="py-2.5 px-4">ESP32 GPIO</th>
                <th className="py-2.5 px-4">Operating Voltage</th>
                <th className="py-2.5 px-4">Biological Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">DHT22 (AM2302)</td>
                <td className="py-3 px-4 font-mono text-emerald-800 font-bold">GPIO 4</td>
                <td className="py-3 px-4">3.3V / 5V DC</td>
                <td className="py-3 px-4 text-slate-600">Brood nest central core temperature & relative humidity</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">HX711 Load Cell Amp</td>
                <td className="py-3 px-4 font-mono text-emerald-800 font-bold">DT: GPIO 16, SCK: GPIO 17</td>
                <td className="py-3 px-4">3.3V DC</td>
                <td className="py-3 px-4 text-slate-600">Hive weight, nectar flow gains & swarm departure drop</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">IR Optical Beam Break</td>
                <td className="py-3 px-4 font-mono text-emerald-800 font-bold">GPIO 18 (Interrupt)</td>
                <td className="py-3 px-4">3.3V DC</td>
                <td className="py-3 px-4 text-slate-600">Hive entrance flight activity counter (foraging intensity)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Voltage Divider (Battery)</td>
                <td className="py-3 px-4 font-mono text-emerald-800 font-bold">GPIO 34 (ADC1)</td>
                <td className="py-3 px-4">0 – 3.3V (Scaled from LiPo)</td>
                <td className="py-3 px-4 text-slate-600">Solar battery level percentage and deep sleep monitor</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Biological Benchmarks Reference */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E3D9] shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <ThermometerSun className="w-5 h-5 text-amber-600" />
          <span>Apiculture Microclimate Science & Thresholds</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
            <h4 className="font-bold text-amber-950">Brood Nest Thermoregulation (34.5°C – 35.5°C)</h4>
            <p>
              Honeybee worker bees actively cluster, flex their thoracic flight muscles to generate heat, and fetch water to fan when cooling is needed. A healthy colony maintains a remarkably tight central core between 34.5°C and 35.5°C. Temperatures sustained above 38.0°C cause brood malformation and wax comb softening.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1.5">
            <h4 className="font-bold text-sky-950">Moisture & Relative Humidity (50% – 75%)</h4>
            <p>
              Excessive humidity (&gt;80%) inside unventilated hives leads to condensation dripping onto the brood cluster, promoting <em>Ascosphaera apis</em> (chalkbrood mold) and fungal spore multiplication. Bottom board ventilation sliders help regulate humidity during monsoon season.
            </p>
          </div>
        </div>
      </div>

      {/* Firmware Code Snippet */}
      <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-100">esp32_firmware.ino (Flash via Arduino IDE)</span>
          </div>
          <span className="text-[10px] text-slate-400">Located at /iot/esp32_firmware.ino</span>
        </div>

        <pre className="text-slate-300 overflow-x-auto p-2 leading-relaxed">
{`#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

const char* INGEST_ENDPOINT = "https://YOUR_PROJECT.supabase.co/functions/v1/iot-ingest";
const char* DEVICE_CODE     = "ESP32-HG-001";
const char* DEVICE_TOKEN    = "sec_token_99a8b7c6d5e4f3a2b1";

// Reads calibrated DHT22 & HX711 and transmits JSON payload securely`}
        </pre>
      </div>

      {/* Simulator Shortcut */}
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-slate-900">Don't have physical hardware on hand?</h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Use the built-in Hardware Simulator to test heat spikes, abnormal humidity, and SMS notifications.
          </p>
        </div>
        <button
          onClick={onOpenSimulator}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
        >
          Open Hardware Simulator
        </button>
      </div>
    </div>
  );
};
