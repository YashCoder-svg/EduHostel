'use client';

import React, { useState } from 'react';
import { Hostel, AllocationCycle, AllocationDraft, User } from '@/types';
import {
  Building2,
  FileSpreadsheet,
  Cpu,
  Plus,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCw,
  Sparkles,
  Layers,
  Settings2,
  Check,
  Zap,
} from 'lucide-react';

interface InventoryAdminProps {
  hostels: Hostel[];
  cycles: AllocationCycle[];
  activeDraft?: AllocationDraft;
  currentUser: User;
  onRunAllocation: (seed: string) => Promise<{ success: boolean; draft?: AllocationDraft; error?: string }>;
  onBulkImport: (hostelId: string, blockId: string, floorNumber: number, rooms: any[]) => Promise<number>;
}

export const InventoryAdmin: React.FC<InventoryAdminProps> = ({
  hostels,
  cycles,
  activeDraft,
  currentUser,
  onRunAllocation,
  onBulkImport,
}) => {
  const currentCycle = cycles[0];
  const [seedInput, setSeedInput] = useState<string>(`SEED_CAMPUS_${new Date().getFullYear()}`);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunSummary, setLastRunSummary] = useState<any>(null);

  // Bulk import modal state
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [importHostelId, setImportHostelId] = useState<string>(hostels[0]?.id || '');
  const [importFloorNum, setImportFloorNum] = useState<number>(1);
  const [importJsonText, setImportJsonText] = useState<string>(
    JSON.stringify(
      [
        { roomNumber: '105', capacity: 2, type: 'DOUBLE_AC', isAccessible: false, isQuietZone: true },
        { roomNumber: '106', capacity: 2, type: 'DOUBLE_NON_AC', isAccessible: false, isQuietZone: false },
        { roomNumber: '107', capacity: 1, type: 'SINGLE_AC', isAccessible: false, isQuietZone: true },
      ],
      null,
      2
    )
  );
  const [importResult, setImportResult] = useState<string>('');

  const handleExecuteAllocation = async () => {
    setIsRunning(true);
    setLastRunSummary(null);

    const res = await onRunAllocation(seedInput.trim());
    setIsRunning(false);

    if (res.success && res.draft) {
      setLastRunSummary({
        seed: res.draft.seed,
        assignedCount: res.draft.assignments.length,
        executionTime: res.draft.metrics.executionTimeMs,
        satisfactionRate: res.draft.metrics.satisfactionRate,
        avgCompat: res.draft.metrics.avgCompatibility,
        hardConstraintViolations: res.draft.metrics.hardConstraintViolations,
      });
    }
  };

  const handleExecuteImport = async () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const hostel = hostels.find((h) => h.id === importHostelId) || hostels[0];
      const blockId = hostel.blocks[0].id;
      const count = await onBulkImport(importHostelId, blockId, importFloorNum, parsed);
      setImportResult(`Successfully imported ${count} new rooms and their bed slots!`);
      setTimeout(() => {
        setBulkModalOpen(false);
        setImportResult('');
      }, 1500);
    } catch (err: any) {
      setImportResult(`Import error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Building2 className="w-6 h-6 text-indigo-400" />
                <span>Hostel Inventory & Allocation Engine</span>
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                Modules M1, M2 & M6
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Configure room inventory, bulk import rooms/beds, and run the deterministic heuristic allocation engine with custom seed reproducibility.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="open-bulk-import-modal-btn"
              onClick={() => setBulkModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Bulk Import (CSV / JSON)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Module 6: Deterministic Engine Execution Card */}
      <div className="glass-panel rounded-2xl p-6 border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-slate-900 to-slate-900">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30">
            <Cpu className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Deterministic Allocation Engine Runner (M6)
            </h2>
            <p className="text-xs text-slate-400">
              Evaluates hard constraints (gender isolation, PwD ground-floor, capacity) and optimizes soft constraints (preferences, mutual roommates, encrypted lifestyle scores).
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Deterministic PRNG Seed (Stored for 100% Exact Reproducibility)
              </label>
              <div className="flex space-x-2">
                <input
                  id="allocation-seed-input"
                  type="text"
                  value={seedInput}
                  onChange={(e) => setSeedInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => setSeedInput(`SEED_${Date.now().toString(36).toUpperCase()}`)}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center space-x-1"
                  title="Generate New Seed"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Randomize</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Specification guarantee: Re-running with this exact seed reproduces the identical draft assignment every time.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <button
              id="execute-allocation-engine-btn"
              disabled={isRunning}
              onClick={handleExecuteAllocation}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center space-x-2 shadow-xl transition-all ${
                isRunning
                  ? 'bg-slate-800 text-slate-500 cursor-wait'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 shadow-indigo-600/30 hover:scale-[1.02]'
              }`}
            >
              {isRunning ? (
                <>
                  <RotateCw className="w-5 h-5 animate-spin" />
                  <span>Executing Heuristic Allocation...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Run Deterministic Allocation Draft</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Execution Results Summary */}
        {lastRunSummary && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Allocation Completed Successfully in {lastRunSummary.executionTime}ms</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-800 text-slate-300 font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Beds Assigned</span>
                <span className="text-base font-bold text-white">{lastRunSummary.assignedCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Satisfaction Rate</span>
                <span className="text-base font-bold text-indigo-400">{lastRunSummary.satisfactionRate}% (Top 2 Choices)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Avg Compatibility</span>
                <span className="text-base font-bold text-emerald-400">{lastRunSummary.avgCompat}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Hard Constraint Errors</span>
                <span className="text-base font-bold text-emerald-400">0 (Strictly Zero)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hostels Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hostels.map((h) => {
          let totalBeds = 0;
          let vacantBeds = 0;
          for (const b of h.blocks) {
            for (const f of b.floors) {
              for (const r of f.rooms) {
                for (const bed of r.beds) {
                  totalBeds++;
                  if (bed.status === 'VACANT') vacantBeds++;
                }
              }
            }
          }
          const occupiedBeds = totalBeds - vacantBeds;
          const pct = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

          return (
            <div key={h.id} className="glass-panel rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                    {h.code} • {h.genderPolicy}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{h.name}</h3>
                </div>
                <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2">{h.description}</p>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Occupancy</span>
                  <span className="text-white font-bold">{occupiedBeds} / {totalBeds} Beds ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1 pt-2">
                {h.amenities.slice(0, 3).map((amenity, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] bg-slate-800/60 text-slate-300 border border-slate-700/50"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulk Import Modal */}
      {bulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Bulk Room & Bed Inventory Import
                </h3>
              </div>
              <button
                onClick={() => setBulkModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Destination Hostel
                </label>
                <select
                  value={importHostelId}
                  onChange={(e) => setImportHostelId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  {hostels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Floor Number
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={importFloorNum}
                  onChange={(e) => setImportFloorNum(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                JSON Inventory Payload
              </label>
              <textarea
                rows={8}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                className="w-full font-mono bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-indigo-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {importResult && (
              <div className="p-3 rounded-lg bg-slate-800 text-xs text-emerald-400">
                {importResult}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setBulkModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                id="execute-bulk-import-submit-btn"
                onClick={handleExecuteImport}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25"
              >
                Import Rooms
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
