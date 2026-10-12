import React, { useState, useMemo } from 'react';
import { 
  Hash, 
  Play, 
  RotateCcw, 
  Search, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Sparkles,
  Info,
  BookOpen
} from 'lucide-react';
import { 
  createEmptyTable, 
  insertKeyWithTrace, 
  searchKeyWithTrace, 
  deleteKeyWithTrace, 
  computeTableMetrics, 
  HASH_PRESETS, 
  H2_FORMULAS 
} from '../utils/doubleHashing';

export default function DoubleHashingVisualizer() {
  // Config state
  const [tableSize, setTableSize] = useState(11);
  const [h2TypeId, setH2TypeId] = useState('add1');
  const [mPrime, setMPrime] = useState(7);
  
  // Table state
  const [table, setTable] = useState(() => createEmptyTable(11));
  
  // Input states
  const [singleKeyInput, setSingleKeyInput] = useState('');
  const [batchKeysInput, setBatchKeysInput] = useState('12, 44, 13, 88, 23, 94, 11');
  const [searchKeyInput, setSearchKeyInput] = useState('');
  const [deleteKeyInput, setDeleteKeyInput] = useState('');
  
  // Interaction & Stepping State
  const [activeTrace, setActiveTrace] = useState(null); // { type, key, steps, currentStepIdx, isPlaying }
  const [highlightedIndices, setHighlightedIndices] = useState([]); // indices currently highlighted in table
  const [currentProbeIndex, setCurrentProbeIndex] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ text: 'Double Hashing table ready. Enter keys or load a preset.', type: 'info' });

  // Compute table metrics
  const metrics = useMemo(() => {
    return computeTableMetrics(table);
  }, [table]);

  // Selected h2 formula object
  const selectedH2 = useMemo(() => {
    return H2_FORMULAS.find(f => f.id === h2TypeId) || H2_FORMULAS[0];
  }, [h2TypeId]);

  // Auto-sync mPrime when table size changes
  const handleTableSizeChange = (newSize) => {
    const size = Math.max(3, Math.min(31, parseInt(newSize, 10) || 7));
    setTableSize(size);
    // Find closest prime less than size for default mPrime
    const primes = [3, 5, 7, 11, 13, 17, 19, 23, 29];
    const candidate = primes.reverse().find(p => p < size) || Math.max(2, size - 1);
    setMPrime(candidate);
    setTable(createEmptyTable(size));
    setActiveTrace(null);
    setHighlightedIndices([]);
    setCurrentProbeIndex(null);
    setStatusMessage({ text: `Reset table with size m = ${size}. Default m' set to ${candidate}.`, type: 'info' });
  };

  // Reset entire table
  const handleResetTable = () => {
    setTable(createEmptyTable(tableSize));
    setActiveTrace(null);
    setHighlightedIndices([]);
    setCurrentProbeIndex(null);
    setStatusMessage({ text: 'Hash table cleared and initialized.', type: 'info' });
  };

  // Load Preset
  const handleLoadPreset = (preset) => {
    setTableSize(preset.tableSize);
    setH2TypeId(preset.h2Type === 'subtraction' ? 'subtraction' : 'add1');
    setMPrime(preset.h2Param);
    setTable(createEmptyTable(preset.tableSize));
    setBatchKeysInput(preset.keys.join(', '));
    setActiveTrace(null);
    setHighlightedIndices([]);
    setCurrentProbeIndex(null);
    setStatusMessage({ text: `Loaded preset "${preset.name}". Click "Batch Insert All" or insert individually.`, type: 'success' });
  };

  // Single Key Insert
  const handleInsertSingle = (e) => {
    if (e) e.preventDefault();
    const key = parseInt(singleKeyInput.trim(), 10);
    if (isNaN(key)) {
      setStatusMessage({ text: 'Please enter a valid integer key.', type: 'error' });
      return;
    }

    const res = insertKeyWithTrace(table, key, tableSize, h2TypeId, mPrime);
    
    if (res.duplicate) {
      setStatusMessage({ text: `Key ${key} is already in the table at index ${res.finalIndex}.`, type: 'warning' });
      setActiveTrace({ type: 'insert', key, ...res, currentStepIdx: res.steps.length - 1 });
      setCurrentProbeIndex(res.finalIndex);
      return;
    }

    if (!res.success) {
      setStatusMessage({ text: `Failed to insert key ${key}: Hash table overflow.`, type: 'error' });
      setActiveTrace({ type: 'insert', key, ...res, currentStepIdx: res.steps.length - 1 });
      return;
    }

    setTable(res.newTable);
    setActiveTrace({ type: 'insert', key, ...res, currentStepIdx: res.steps.length - 1 });
    setCurrentProbeIndex(res.finalIndex);
    setHighlightedIndices(res.steps.map(s => s.index).filter(idx => idx >= 0));
    setSingleKeyInput('');
    setStatusMessage({
      text: `Key ${key} inserted at slot [${res.finalIndex}] in ${res.totalProbes} probe(s). h₁(k)=${res.h1}, h₂(k)=${res.h2}.`,
      type: 'success'
    });
  };

  // Batch Insert All
  const handleBatchInsert = () => {
    const rawKeys = batchKeysInput
      .split(/[\s,]+/)
      .map(k => parseInt(k.trim(), 10))
      .filter(k => !isNaN(k));

    if (rawKeys.length === 0) {
      setStatusMessage({ text: 'Please enter a list of comma-separated numbers.', type: 'error' });
      return;
    }

    let curTable = table;
    let insertedCount = 0;
    let duplicateCount = 0;
    let overflow = false;
    let lastRes = null;

    for (const key of rawKeys) {
      const res = insertKeyWithTrace(curTable, key, tableSize, h2TypeId, mPrime);
      lastRes = res;
      if (res.duplicate) {
        duplicateCount++;
      } else if (res.success) {
        curTable = res.newTable;
        insertedCount++;
      } else {
        overflow = true;
        break;
      }
    }

    setTable(curTable);
    if (lastRes) {
      setActiveTrace({ type: 'insert', key: rawKeys[rawKeys.length - 1], ...lastRes, currentStepIdx: lastRes.steps.length - 1 });
      setCurrentProbeIndex(lastRes.finalIndex);
    }

    if (overflow) {
      setStatusMessage({ text: `Table filled up! Inserted ${insertedCount} keys before overflow.`, type: 'warning' });
    } else {
      setStatusMessage({ 
        text: `Batch operation completed: ${insertedCount} key(s) inserted${duplicateCount > 0 ? `, ${duplicateCount} duplicate(s) skipped` : ''}.`, 
        type: 'success' 
      });
    }
  };

  // Search Key
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const key = parseInt(searchKeyInput.trim(), 10);
    if (isNaN(key)) {
      setStatusMessage({ text: 'Enter an integer to search.', type: 'error' });
      return;
    }

    const res = searchKeyWithTrace(table, key, tableSize, h2TypeId, mPrime);
    const visitedIndices = res.steps.map(s => s.index).filter(idx => idx >= 0);
    setHighlightedIndices(visitedIndices);

    if (res.found) {
      setCurrentProbeIndex(res.foundIndex);
      setStatusMessage({ 
        text: `Key ${key} FOUND at index [${res.foundIndex}] after ${res.probes} probe(s).`, 
        type: 'success' 
      });
    } else {
      setCurrentProbeIndex(null);
      setStatusMessage({ 
        text: `Key ${key} NOT FOUND after ${res.probes} probe(s). Search terminated at empty slot.`, 
        type: 'warning' 
      });
    }

    setActiveTrace({ type: 'search', key, steps: res.steps, currentStepIdx: res.steps.length - 1, totalProbes: res.probes });
  };

  // Delete Key
  const handleDelete = (e) => {
    if (e) e.preventDefault();
    const key = parseInt(deleteKeyInput.trim(), 10);
    if (isNaN(key)) {
      setStatusMessage({ text: 'Enter an integer to delete.', type: 'error' });
      return;
    }

    const res = deleteKeyWithTrace(table, key, tableSize, h2TypeId, mPrime);
    if (!res.success) {
      setStatusMessage({ text: res.message, type: 'error' });
      setActiveTrace({ type: 'delete', key, steps: res.steps, currentStepIdx: res.steps.length - 1 });
      return;
    }

    setTable(res.newTable);
    setCurrentProbeIndex(res.deletedIndex);
    setHighlightedIndices([res.deletedIndex]);
    setStatusMessage({ text: res.message, type: 'success' });
    setDeleteKeyInput('');
    setActiveTrace({ type: 'delete', key, steps: res.steps, currentStepIdx: res.steps.length - 1 });
  };

  return (
    <div className="double-hashing-container">
      
      {/* Top Header & Educational Intro */}
      <div className="dh-header-banner">
        <div className="dh-title-group">
          <div className="dh-icon-box">
            <Hash size={24} className="text-violet-400" />
          </div>
          <div>
            <h3 className="dh-title">Double Hashing Collision Simulator</h3>
            <p className="dh-subtitle">
              Open addressing collision resolution using two independent hash functions:
              <code className="dh-formula-code">h(k, i) = (h₁(k) + i × h₂(k)) mod m</code>
            </p>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="dh-presets-bar">
          <span className="dh-presets-label">Preset Demos:</span>
          {HASH_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              className="dh-preset-btn"
              onClick={() => handleLoadPreset(preset)}
              title={preset.description}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Control Grid: Parameters & Operations */}
      <div className="dh-control-grid">
        
        {/* Card 1: Mathematical Configuration */}
        <div className="dh-card">
          <div className="dh-card-header">
            <Sparkles size={16} className="text-violet-400" />
            <span>Hash Functions & Table Settings</span>
          </div>

          <div className="dh-card-body">
            <div className="dh-fields-row">
              <div className="dh-field">
                <label className="dh-field-label">Table Size (m)</label>
                <div className="dh-table-size-pills">
                  {[7, 11, 13, 17].map(sz => (
                    <button
                      key={sz}
                      type="button"
                      className={`dh-size-pill ${tableSize === sz ? 'active' : ''}`}
                      onClick={() => handleTableSizeChange(sz)}
                    >
                      m = {sz}
                    </button>
                  ))}
                  <input
                    type="number"
                    min="3"
                    max="31"
                    className="dh-mini-input"
                    value={tableSize}
                    onChange={(e) => handleTableSizeChange(e.target.value)}
                    title="Custom table size"
                  />
                </div>
                <small className="dh-field-hint">Prime sizes prevent premature probe cycling.</small>
              </div>

              <div className="dh-field">
                <label className="dh-field-label">Secondary Offset h₂(k)</label>
                <select 
                  className="dh-select"
                  value={h2TypeId}
                  onChange={(e) => setH2TypeId(e.target.value)}
                >
                  {H2_FORMULAS.map(f => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
                <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>m' parameter:</span>
                  <input
                    type="number"
                    min="2"
                    max={tableSize - 1}
                    className="dh-mini-input"
                    value={mPrime}
                    onChange={(e) => setMPrime(Math.max(2, parseInt(e.target.value, 10) || 3))}
                  />
                </div>
              </div>
            </div>

            {/* Active Math Formula Preview */}
            <div className="dh-math-preview">
              <div className="dh-math-item">
                <span className="dh-math-label">Primary:</span>
                <code>h₁(k) = k mod {tableSize}</code>
              </div>
              <div className="dh-math-item">
                <span className="dh-math-label">Secondary:</span>
                <code>h₂(k) = {selectedH2.formula ? selectedH2.label.replace("m'", mPrime) : ''}</code>
              </div>
              <div className="dh-math-item">
                <span className="dh-math-label">Probe Step:</span>
                <code>h(k, i) = (h₁ + i × h₂) mod {tableSize}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Interactive Operations */}
        <div className="dh-card">
          <div className="dh-card-header">
            <Layers size={16} className="text-cyan-400" />
            <span>Operations: Insert, Search, Tombstone Delete</span>
          </div>

          <div className="dh-card-body">
            {/* 1. Single Insert */}
            <div className="dh-op-group">
              <label className="dh-mini-label">Insert Single Key</label>
              <form className="dh-input-group" onSubmit={handleInsertSingle}>
                <input
                  type="number"
                  className="dh-input"
                  placeholder="e.g. 23"
                  value={singleKeyInput}
                  onChange={(e) => setSingleKeyInput(e.target.value)}
                />
                <button type="submit" className="dh-btn dh-btn-primary">
                  <Plus size={15} />
                  <span>Insert Key</span>
                </button>
              </form>
            </div>

            {/* 2. Batch Insert */}
            <div className="dh-op-group">
              <label className="dh-mini-label">Batch Keys Sequence</label>
              <div className="dh-input-group">
                <input
                  type="text"
                  className="dh-input"
                  placeholder="e.g. 12, 44, 13, 88, 23, 94, 11"
                  value={batchKeysInput}
                  onChange={(e) => setBatchKeysInput(e.target.value)}
                />
                <button type="button" className="dh-btn dh-btn-secondary" onClick={handleBatchInsert}>
                  <Play size={14} />
                  <span>Batch Insert All</span>
                </button>
              </div>
            </div>

            {/* 3. Search Key */}
            <div className="dh-op-group">
              <label className="dh-mini-label">Search Table</label>
              <form className="dh-input-group" onSubmit={handleSearch}>
                <input
                  type="number"
                  className="dh-input"
                  placeholder="Enter key to search (e.g. 88)..."
                  value={searchKeyInput}
                  onChange={(e) => setSearchKeyInput(e.target.value)}
                />
                <button type="submit" className="dh-btn dh-btn-outline">
                  <Search size={14} />
                  <span>Search</span>
                </button>
              </form>
            </div>

            {/* 4. Delete Key */}
            <div className="dh-op-group">
              <label className="dh-mini-label">Delete Key (Tombstone)</label>
              <form className="dh-input-group" onSubmit={handleDelete}>
                <input
                  type="number"
                  className="dh-input"
                  placeholder="Enter key to delete (e.g. 13)..."
                  value={deleteKeyInput}
                  onChange={(e) => setDeleteKeyInput(e.target.value)}
                />
                <button type="submit" className="dh-btn dh-btn-danger">
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </form>
            </div>

            {/* 5. Clear Table Action */}
            <div className="dh-clear-row">
              <button 
                type="button" 
                className="dh-btn dh-btn-ghost dh-btn-clear" 
                onClick={handleResetTable} 
                title="Clear and reset hash table"
              >
                <RotateCcw size={14} />
                <span>Clear & Reset Table</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Real-time Status Alert */}
      <div className={`dh-status-bar dh-status-${statusMessage.type}`}>
        {statusMessage.type === 'success' && <CheckCircle2 size={16} className="text-emerald-400" />}
        {statusMessage.type === 'warning' && <AlertTriangle size={16} className="text-amber-400" />}
        {statusMessage.type === 'error' && <AlertTriangle size={16} className="text-red-400" />}
        {statusMessage.type === 'info' && <Info size={16} className="text-blue-400" />}
        <span>{statusMessage.text}</span>
      </div>

      {/* Metrics Bar */}
      <div className="dh-metrics-grid">
        <div className="dh-metric-card">
          <div className="dh-metric-label">Load Factor (α)</div>
          <div className="dh-metric-val">
            <span style={{ color: Number(metrics.loadFactor) > 75 ? 'var(--color-danger)' : Number(metrics.loadFactor) > 50 ? 'var(--color-warning)' : 'var(--color-success)' }}>
              {metrics.loadFactor}%
            </span>
            <small style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
              ({metrics.occupiedCount} / {metrics.totalSlots})
            </small>
          </div>
          <div className="dh-progress-track">
            <div 
              className="dh-progress-fill" 
              style={{ 
                width: `${Math.min(100, Number(metrics.loadFactor))}%`,
                backgroundColor: Number(metrics.loadFactor) > 75 ? 'var(--color-danger)' : Number(metrics.loadFactor) > 50 ? 'var(--color-warning)' : 'var(--color-success)'
              }}
            />
          </div>
        </div>

        <div className="dh-metric-card">
          <div className="dh-metric-label">Total Collisions</div>
          <div className="dh-metric-val text-amber-400">{metrics.totalCollisions}</div>
          <small className="dh-metric-sub">Resolved via h₂(k) probe steps</small>
        </div>

        <div className="dh-metric-card">
          <div className="dh-metric-label">Avg Probes / Insert</div>
          <div className="dh-metric-val text-violet-400">{metrics.avgProbes}</div>
          <small className="dh-metric-sub">Ideal is 1.00 (direct hit)</small>
        </div>

        <div className="dh-metric-card">
          <div className="dh-metric-label">Tombstones (DEL)</div>
          <div className="dh-metric-val text-cyan-400">{metrics.deletedCount}</div>
          <small className="dh-metric-sub">Preserves search probe continuity</small>
        </div>
      </div>

      {/* Hash Table Visual Grid */}
      <div className="dh-table-section">
        <div className="dh-table-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Hash size={18} className="text-violet-400" />
            <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
              Hash Table Array [0 ... {tableSize - 1}]
            </h4>
          </div>
          <div className="dh-legend">
            <span className="dh-legend-item"><span className="dh-legend-dot empty"></span> Empty</span>
            <span className="dh-legend-item"><span className="dh-legend-dot occupied"></span> Occupied</span>
            <span className="dh-legend-item"><span className="dh-legend-dot deleted"></span> Tombstone (DEL)</span>
            <span className="dh-legend-item"><span className="dh-legend-dot active"></span> Active Probe</span>
          </div>
        </div>

        <div className="dh-slots-grid">
          {table.map((slot) => {
            const isCurrent = currentProbeIndex === slot.index;
            const isVisited = highlightedIndices.includes(slot.index);
            
            let slotClass = 'dh-slot-empty';
            if (slot.status === 'OCCUPIED') slotClass = 'dh-slot-occupied';
            if (slot.status === 'DELETED') slotClass = 'dh-slot-deleted';
            if (isCurrent) slotClass += ' dh-slot-current-pulse';
            else if (isVisited) slotClass += ' dh-slot-visited-glow';

            return (
              <div 
                key={slot.index} 
                className={`dh-slot-card ${slotClass}`}
                onClick={() => {
                  if (slot.status === 'OCCUPIED') {
                    setStatusMessage({
                      text: `Slot [${slot.index}] holds key ${slot.key}, inserted after ${slot.probesNeeded} probe(s).`,
                      type: 'info'
                    });
                  }
                }}
              >
                <div className="dh-slot-top">
                  <span className="dh-slot-index">[{slot.index}]</span>
                  {slot.status === 'OCCUPIED' && (
                    <span className="dh-probes-tag">
                      {slot.probesNeeded} {slot.probesNeeded === 1 ? 'probe' : 'probes'}
                    </span>
                  )}
                  {slot.status === 'DELETED' && (
                    <span className="dh-del-tag">DEL</span>
                  )}
                </div>

                <div className="dh-slot-body">
                  {slot.status === 'OCCUPIED' ? (
                    <div className="dh-key-value">{slot.key}</div>
                  ) : slot.status === 'DELETED' ? (
                    <div className="dh-key-tombstone">⟨Tombstone⟩</div>
                  ) : (
                    <div className="dh-key-empty">ø Empty</div>
                  )}
                </div>

                <div className="dh-slot-footer">
                  {slot.status === 'OCCUPIED' && slot.probesNeeded > 1 && (
                    <span className="dh-collision-subtag">
                      {slot.probesNeeded - 1} collision{slot.probesNeeded - 1 > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step-by-Step Derivation Timeline for the Active Operation */}
      {activeTrace && activeTrace.steps && activeTrace.steps.length > 0 && (
        <div className="dh-derivation-section">
          <div className="dh-derivation-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} className="text-violet-400" />
              <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                Step-by-Step Probe Derivation: Operation for Key {activeTrace.key}
              </h4>
            </div>
            <span className="dh-badge-operation">{activeTrace.type.toUpperCase()}</span>
          </div>

          <div className="dh-derivation-timeline">
            {activeTrace.steps.map((step, sIdx) => {
              const isCollision = step.status === 'COLLISION' || step.status === 'COLLISION_SKIP';
              const isSuccess = step.status === 'PLACED' || step.status === 'FOUND';

              return (
                <div key={sIdx} className={`dh-trace-step ${isSuccess ? 'step-success' : isCollision ? 'step-collision' : 'step-neutral'}`}>
                  <div className="dh-trace-marker">
                    <span>i = {step.probe}</span>
                  </div>
                  
                  <div className="dh-trace-card">
                    <div className="dh-trace-card-top">
                      <span className="dh-trace-title">
                        {step.status === 'PLACED' && '✅ Slot Found & Key Inserted'}
                        {step.status === 'COLLISION' && `⚠️ Collision at Slot [${step.index}]`}
                        {step.status === 'FOUND' && '🎯 Key Found!'}
                        {step.status === 'EMPTY_STOP' && '🛑 Empty Slot Reached (Key Not Present)'}
                        {step.status === 'TOMBSTONE_SKIP' && '⏭️ Tombstone Skipped (Continue Probe)'}
                        {step.status === 'COLLISION_SKIP' && `⏭️ Mismatch at Slot [${step.index}] (Continue Probe)`}
                        {step.status === 'DUPLICATE' && '⚠️ Duplicate Key Detected'}
                        {step.status === 'TABLE_FULL' && '❌ Table Overflow'}
                      </span>
                      <span className="dh-trace-slot-badge">Target Slot: [{step.index}]</span>
                    </div>

                    <div className="dh-trace-formula">
                      <code>{step.formulaText || `Probe #${step.probe}`}</code>
                    </div>

                    <p className="dh-trace-desc">{step.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Educational Theory Card: Why Double Hashing? */}
      <div className="dh-theory-card">
        <div className="dh-theory-title">
          <Info size={18} className="text-violet-400" />
          <span>Academic Note: Elimination of Primary & Secondary Clustering</span>
        </div>
        <p className="dh-theory-body">
          Unlike <strong>Linear Probing</strong> (which suffers from primary clustering where contiguous occupied blocks grow larger and degrade performance to $O(n)$) and <strong>Quadratic Probing</strong> (which suffers from secondary clustering since keys with the same initial hash follow identical probe paths), <strong>Double Hashing</strong> uses a secondary hash function $h_2(k)$ to generate an independent step size for each key. Even if two keys collide at $h_1(k_1) = h_1(k_2)$, their probe sequences diverge because $h_2(k_1) \neq h_2(k_2)$, effectively approximating uniform hashing with $O(1)$ expected search time.
        </p>
      </div>

    </div>
  );
}
