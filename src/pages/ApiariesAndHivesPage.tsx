import React, { useState } from 'react';
import {
  Layers,
  Plus,
  MapPin,
  Cpu,
  Edit2,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  X,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { db } from '../services/mockDb';
import { Hive, Apiary } from '../types';

interface ApiariesAndHivesPageProps {
  onNavigate: (route: string, hiveId?: string) => void;
  selectedApiaryId: string;
}

export const ApiariesAndHivesPage: React.FC<ApiariesAndHivesPageProps> = ({
  onNavigate,
  selectedApiaryId,
}) => {
  const [hives, setHives] = useState<Hive[]>(db.getHives());
  const [apiaries, setApiaries] = useState<Apiary[]>(db.getApiaries());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [showAddApiaryModal, setShowAddApiaryModal] = useState(false);
  const [showAddHiveModal, setShowAddHiveModal] = useState(false);

  // Add Apiary Form State
  const [newApiaryName, setNewApiaryName] = useState('');
  const [newApiaryLocation, setNewApiaryLocation] = useState('');
  const [newApiaryNotes, setNewApiaryNotes] = useState('');

  // Add Hive Form State
  const [newHiveName, setNewHiveName] = useState('');
  const [newHiveCode, setNewHiveCode] = useState('');
  const [newHiveApiaryId, setNewHiveApiaryId] = useState(apiaries[0]?.id || '');
  const [newHiveSpecies, setNewHiveSpecies] = useState('Apis cerana indica');
  const [newHiveDeviceId, setNewHiveDeviceId] = useState('');
  const [newHiveNotes, setNewHiveNotes] = useState('');

  // Filtering
  const filteredHives = hives.filter((h) => {
    const matchesApiary = selectedApiaryId === 'all' || h.apiary_id === selectedApiaryId;
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.hive_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.apiary_name && h.apiary_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || h.status === statusFilter;
    return matchesApiary && matchesSearch && matchesStatus;
  });

  const handleCreateApiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiaryName.trim()) return;

    db.createApiary({
      name: newApiaryName,
      location: newApiaryLocation || 'Undisclosed Location',
      notes: newApiaryNotes
    });

    setApiaries(db.getApiaries());
    setNewApiaryName('');
    setNewApiaryLocation('');
    setNewApiaryNotes('');
    setShowAddApiaryModal(false);
  };

  const handleCreateHive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHiveName.trim() || !newHiveCode.trim() || !newHiveApiaryId) return;

    db.createHive({
      name: newHiveName,
      hive_code: newHiveCode,
      apiary_id: newHiveApiaryId,
      bee_species: newHiveSpecies,
      device_code: newHiveDeviceId,
      notes: newHiveNotes
    });

    setHives(db.getHives());
    setNewHiveName('');
    setNewHiveCode('');
    setNewHiveDeviceId('');
    setNewHiveNotes('');
    setShowAddHiveModal(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans animate-in fade-in duration-200">
      {/* Title & Top Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Apiary & Hive Management
          </h1>
          <p className="text-xs text-slate-600">
            Organize yards, assign ESP32 sensor hardware, and view colony registration records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddApiaryModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Apiary</span>
          </button>
          <button
            onClick={() => setShowAddHiveModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Hive</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E3D9] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hives by name, code, or apiary..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold text-slate-800 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="all">All Hives ({hives.length})</option>
            <option value="active">Active</option>
            <option value="quarantined">Quarantined</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Apiaries Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apiaries.map((apiary) => {
          const apiaryHives = hives.filter((h) => h.apiary_id === apiary.id);
          return (
            <div
              key={apiary.id}
              className="bg-white rounded-2xl p-5 border border-[#E8E3D9] shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{apiary.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apiary.location}</span>
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  {apiaryHives.length} Hives Active
                </span>
              </div>

              {apiary.notes && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {apiary.notes}
                </p>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Registered: {new Date(apiary.created_at).toLocaleDateString()}</span>
                <span className="font-medium text-emerald-800">
                  {apiaryHives.filter((h) => h.device?.connection_status === 'online').length} Nodes Online
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Registered Hives List */}
      <div className="bg-white rounded-3xl border border-[#E8E3D9] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Registered Bee Colony Roster</h3>
            <p className="text-xs text-slate-500">Click any colony to inspect telemetry records and alerts</p>
          </div>
          <span className="text-xs font-bold text-slate-500">{filteredHives.length} Colonies</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredHives.map((hive) => {
            const reading = hive.current_reading || db.getLatestReading(hive.id);
            return (
              <div
                key={hive.id}
                onClick={() => onNavigate('hive-detail', hive.id)}
                className="p-4 sm:p-5 hover:bg-[#FAF8F5] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-emerald-800 text-white tracking-wider shrink-0">
                    {hive.hive_code}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {hive.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>{hive.apiary_name}</span>
                      <span>•</span>
                      <span className="italic">{hive.bee_species}</span>
                      <span>•</span>
                      <span className="font-mono text-emerald-700 font-semibold">{hive.device?.device_code}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 text-xs justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Temp</span>
                    <span className="font-black text-slate-900 text-sm">
                      {reading ? `${reading.temperature_c}°C` : '35.0°C'}
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Humidity</span>
                    <span className="font-black text-slate-900 text-sm">
                      {reading ? `${reading.humidity_percent}%` : '60%'}
                    </span>
                  </div>

                  <div>
                    <StatusBadge status={hive.risk_level || 'normal'} size="sm" />
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-800 transition-transform group-hover:translate-x-0.5 hidden sm:block" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Create Apiary */}
      {showAddApiaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Add New Apiary Yard</h3>
              <button onClick={() => setShowAddApiaryModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApiary} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Apiary Name *
                </label>
                <input
                  type="text"
                  required
                  value={newApiaryName}
                  onChange={(e) => setNewApiaryName(e.target.value)}
                  placeholder="e.g. Hilltop Honey Orchard"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location / Region
                </label>
                <input
                  type="text"
                  value={newApiaryLocation}
                  onChange={(e) => setNewApiaryLocation(e.target.value)}
                  placeholder="e.g. Wayanad Foothills, Kerala"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={newApiaryNotes}
                  onChange={(e) => setNewApiaryNotes(e.target.value)}
                  placeholder="Floral sources, shade conditions, accessibility..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddApiaryModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900"
                >
                  Create Apiary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Hive */}
      {showAddHiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Register New Hive Colony</h3>
              <button onClick={() => setShowAddHiveModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHive} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Hive Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newHiveCode}
                    onChange={(e) => setNewHiveCode(e.target.value.toUpperCase())}
                    placeholder="e.g. HG-005"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Colony Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newHiveName}
                    onChange={(e) => setNewHiveName(e.target.value)}
                    placeholder="e.g. Cedar Sentinel"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assign to Apiary *
                </label>
                <select
                  value={newHiveApiaryId}
                  onChange={(e) => setNewHiveApiaryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  {apiaries.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Bee Species
                  </label>
                  <select
                    value={newHiveSpecies}
                    onChange={(e) => setNewHiveSpecies(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Apis cerana indica">Apis cerana indica (Indian honeybee)</option>
                    <option value="Apis mellifera">Apis mellifera (European honeybee)</option>
                    <option value="Tetragonula iridipennis">Tetragonula iridipennis (Stingless bee)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ESP32 Device ID
                  </label>
                  <input
                    type="text"
                    value={newHiveDeviceId}
                    onChange={(e) => setNewHiveDeviceId(e.target.value.toUpperCase())}
                    placeholder="e.g. ESP32-HG-005"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Installation Notes
                </label>
                <textarea
                  rows={2}
                  value={newHiveNotes}
                  onChange={(e) => setNewHiveNotes(e.target.value)}
                  placeholder="Frame count, queen origin, installation date..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddHiveModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900"
                >
                  Register Hive Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
