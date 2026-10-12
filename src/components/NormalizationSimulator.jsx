import React, { useState, useRef } from 'react';
import {
  Table,
  Layers,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Database,
  Code,
  ShieldAlert,
  Key,
  ExternalLink,
  Info,
  Check,
  Copy,
  Flame,
  Split,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal
} from 'lucide-react';
import { SIMULATION_SCENARIOS } from '../utils/simulationData';

export default function NormalizationSimulator({ onSendToAnalyzer, isExpanded, onToggleExpand }) {
  // Scenario state: 'university' | 'company'
  const [selectedScenarioId, setSelectedScenarioId] = useState('university');

  // Stage state: index 0 (UNF), 1 (1NF), 2 (2NF), 3 (3NF), 4 (BCNF)
  const [stageIndex, setStageIndex] = useState(0);

  // UI toggles
  const [highlightViolations, setHighlightViolations] = useState(true);
  const [activeAnomalyTab, setActiveAnomalyTab] = useState(null); // null | 'insertion' | 'update' | 'deletion'
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  // Table refs for horizontal sliding
  const tableRefs = useRef({});

  // Slide table horizontally via buttons
  const scrollTable = (tblIndex, delta) => {
    const el = tableRefs.current[tblIndex];
    if (el) {
      el.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  // Click and drag to slide horizontally with mouse
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const activeDragIndexRef = useRef(null);

  const handleMouseDown = (e, tblIndex) => {
    const el = tableRefs.current[tblIndex];
    if (!el) return;
    isDraggingRef.current = true;
    activeDragIndexRef.current = tblIndex;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e, tblIndex) => {
    if (!isDraggingRef.current || activeDragIndexRef.current !== tblIndex) return;
    const el = tableRefs.current[tblIndex];
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    activeDragIndexRef.current = null;
  };

  // Active scenario and stage objects
  const currentScenario = SIMULATION_SCENARIOS.find(s => s.id === selectedScenarioId) || SIMULATION_SCENARIOS[0];
  const currentStage = currentScenario.stages[stageIndex] || currentScenario.stages[0];
  const maxStage = currentScenario.stages.length - 1;

  // Navigation handlers
  const handleNextStage = () => {
    if (stageIndex < maxStage) {
      setStageIndex(prev => prev + 1);
    } else {
      setStageIndex(0); // Loop or restart
    }
    setActiveAnomalyTab(null);
  };

  const handlePrevStage = () => {
    if (stageIndex > 0) {
      setStageIndex(prev => prev - 1);
    }
    setActiveAnomalyTab(null);
  };

  const handleReset = () => {
    setStageIndex(0);
    setActiveAnomalyTab(null);
  };

  const handleCopySql = () => {
    if (currentStage.sqlDDL) {
      navigator.clipboard.writeText(currentStage.sqlDDL);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };

  return (
    <div className="sim-container">
      {/* Simulation Header */}
      <div className="sim-header">
        <div className="sim-header-title-box">
          <div className="sim-icon-glow">
            <Split size={24} className="text-violet-400" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 className="sim-title">Interactive Normalization & Schema Transformation Lab</h2>
              <span className="sim-badge-pulse">Live Visual Simulation</span>
            </div>
            <p className="sim-subtitle">
              Watch an unnormalized table (violating 1NF, 2NF, 3NF) transform and decompose step-by-step as you resolve each normal form rule.
            </p>
          </div>
        </div>

        {/* Scenario Selector & Reset */}
        <div className="sim-header-controls">
          <div className="scenario-selector-group">
            <span className="control-label">Select Dataset Scenario:</span>
            <div className="scenario-pills">
              {SIMULATION_SCENARIOS.map(sc => (
                <button
                  key={sc.id}
                  className={`scenario-pill-btn ${sc.id === selectedScenarioId ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedScenarioId(sc.id);
                    setStageIndex(0);
                    setActiveAnomalyTab(null);
                  }}
                >
                  {sc.shortName}
                </button>
              ))}
            </div>
          </div>

          <button
            className="sim-btn sim-btn-outline"
            onClick={handleReset}
            title="Reset simulation to initial Unnormalized Table"
          >
            <RotateCcw size={15} />
            <span>Restart (UNF)</span>
          </button>
        </div>
      </div>

      {/* Stepper Timeline Progress Bar */}
      <div className="sim-stepper-card">
        <div className="stepper-title-row">
          <span className="stepper-label">PROGRESSION TIMELINE (CLICK TO JUMP):</span>
          <span className="stepper-stage-counter">
            Stage {stageIndex + 1} of {currentScenario.stages.length}
          </span>
        </div>

        <div className="sim-stepper">
          {currentScenario.stages.map((stage, idx) => {
            const isCompleted = idx < stageIndex;
            const isCurrent = idx === stageIndex;
            return (
              <button
                key={stage.id}
                className={`step-bubble ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => {
                  setStageIndex(idx);
                  setActiveAnomalyTab(null);
                }}
              >
                <div className="step-circle">
                  {isCompleted ? <Check size={14} /> : <span>{idx}</span>}
                </div>
                <div className="step-bubble-info">
                  <div className="step-name">{stage.name}</div>
                  <div className={`step-substatus ${stage.badgeColor}`}>
                    {stage.badge}
                  </div>
                </div>
                {idx < currentScenario.stages.length - 1 && (
                  <div className={`step-connector ${idx < stageIndex ? 'filled' : ''}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action & Status Hero Bar */}
      <div className="sim-action-hero">
        <div className="sim-status-summary">
          <div className="sim-stage-badge-large">
            <span className={`badge-pill ${currentStage.badgeColor}`}>
              {currentStage.id}
            </span>
            <span className="stage-title-text">{currentStage.name}</span>
          </div>
          <p className="stage-summary-text">{currentStage.summary}</p>
        </div>

        <div className="sim-primary-actions">
          <div className="sim-btn-group">
            <button
              className="sim-btn sim-btn-secondary"
              onClick={handlePrevStage}
              disabled={stageIndex === 0}
            >
              <ArrowLeft size={16} />
              <span>Previous Stage</span>
            </button>

            <button
              className="sim-btn sim-btn-primary"
              onClick={handleNextStage}
            >
              <span>{stageIndex === maxStage ? 'Restart Simulation' : currentStage.nextActionText || 'Solve Next NF'}</span>
              {stageIndex === maxStage ? <RotateCcw size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>

          <div className="sim-aux-actions">
            {onToggleExpand && (
              <button
                className={`sim-toggle-btn ${isExpanded ? 'active' : ''}`}
                onClick={onToggleExpand}
                title={isExpanded ? 'Restore sidebar split view' : 'Expand table to full width of screen (no zooming required)'}
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                <span>{isExpanded ? 'Exit Full Width' : 'Expand Full Width'}</span>
              </button>
            )}

            <button
              className={`sim-toggle-btn ${isCompact ? 'active' : ''}`}
              onClick={() => setIsCompact(prev => !prev)}
              title={isCompact ? 'Switch to comfortable spacious view' : 'Compact padding to fit more columns'}
            >
              <span>{isCompact ? 'Comfortable View' : 'Compact View'}</span>
            </button>

            <button
              className={`sim-toggle-btn ${highlightViolations ? 'active' : ''}`}
              onClick={() => setHighlightViolations(prev => !prev)}
              title="Highlight non-atomic values, partial dependencies, and transitive columns"
            >
              <Sparkles size={15} />
              <span>{highlightViolations ? 'Violations Highlighted' : 'Show Highlights'}</span>
            </button>

            <button
              className="sim-toggle-btn"
              onClick={() => setShowSqlModal(true)}
              title="View SQL DDL Tables for this stage"
            >
              <Code size={15} />
              <span>SQL Schema</span>
            </button>

            {onSendToAnalyzer && (
              <button
                className="sim-toggle-btn text-violet-400"
                onClick={() => onSendToAnalyzer(currentScenario)}
                title="Send attributes and FDs to Normal Form Analyzer tab"
              >
                <ExternalLink size={15} />
                <span>Send to Analyzer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Normal Form Compliance Grid (1NF, 2NF, 3NF, BCNF) */}
      <div className="nf-matrix-grid">
        {Object.entries(currentStage.nfStatus).map(([nfKey, statusObj]) => (
          <div
            key={nfKey}
            className={`nf-matrix-card ${statusObj.passed ? 'passed' : 'violated'}`}
          >
            <div className="nf-matrix-card-header">
              <div className="nf-key-title">{nfKey}</div>
              <div className={`nf-status-tag ${statusObj.passed ? 'tag-pass' : 'tag-fail'}`}>
                {statusObj.passed ? (
                  <>
                    <CheckCircle2 size={14} />
                    <span>SATISFIED</span>
                  </>
                ) : (
                  <>
                    <XCircle size={14} />
                    <span>VIOLATED</span>
                  </>
                )}
              </div>
            </div>
            <p className="nf-matrix-desc">{statusObj.reason}</p>
          </div>
        ))}
      </div>

      {/* Active Violations Alert Banner (if any) */}
      {currentStage.violations && currentStage.violations.length > 0 && highlightViolations && (
        <div className="sim-violations-alert">
          <div className="violations-alert-header">
            <Flame size={18} className="text-amber-400" />
            <span className="violations-title">Active Database Anomalies & Redundancy Violations:</span>
          </div>
          <div className="violations-list">
            {currentStage.violations.map((v, vIdx) => (
              <div className="violation-item" key={vIdx}>
                <span className="violation-badge">{v.type} Violation</span>
                <span className="violation-label">{v.label}</span>
                <span className="violation-details">— {v.details}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tables Display Area */}
      <div className="sim-tables-wrapper">
        <div className="sim-tables-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} className="text-cyan-400" />
            <h3 className="sim-tables-section-title">
              {currentStage.tables.length === 1 ? 'Current Relational Table' : `Decomposed Relational Schema (${currentStage.tables.length} Tables)`}
            </h3>
          </div>
          <span className="sim-tables-count-badge">
            {currentStage.tables.length} {currentStage.tables.length === 1 ? 'Table' : 'Tables'} in Schema
          </span>
        </div>

        <div className={`sim-tables-grid ${currentStage.tables.length > 1 ? 'multi-tables' : 'single-table'}`}>
          {currentStage.tables.map((tbl, tIdx) => (
            <div className="sim-table-card" key={tIdx}>
              <div className="sim-table-card-header">
                <div className="table-meta">
                  <span className="table-title">{tbl.title}</span>
                  <div className="table-pk-badge">
                    <Key size={13} className="text-amber-400" />
                    <span>PK: {tbl.primaryKey.join(', ')}</span>
                  </div>
                </div>

                <div className="table-scroll-actions">
                  <span className="scroll-guide-tag" title="Click buttons or drag horizontally on the table to slide">
                    <MoveHorizontal size={13} className="text-cyan-400" />
                    <span>Slide / Drag</span>
                  </span>
                  <button
                    type="button"
                    className="table-scroll-btn"
                    onClick={() => scrollTable(tIdx, -250)}
                    title="Slide table left"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    className="table-scroll-btn"
                    onClick={() => scrollTable(tIdx, 250)}
                    title="Slide table right"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div
                className="table-responsive-box"
                ref={el => (tableRefs.current[tIdx] = el)}
                onMouseDown={e => handleMouseDown(e, tIdx)}
                onMouseMove={e => handleMouseMove(e, tIdx)}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
              >
                <table className={`sim-data-table ${isCompact ? 'compact' : ''}`}>
                  <thead>
                    <tr>
                      {tbl.columns.map((col) => {
                        const isHighlightCol =
                          highlightViolations &&
                          (col.isMulti || col.isPartial || col.isTransitiveDet || col.isTransitiveTarget);

                        return (
                          <th
                            key={col.key}
                            className={`sim-th ${col.isPK ? 'pk-col' : ''} ${isHighlightCol ? 'highlight-th' : ''}`}
                          >
                            <div className="th-content">
                              <span>{col.label}</span>
                              <div className="th-badges">
                                {col.isPK && <span className="col-tag pk">PK</span>}
                                {col.isFK && <span className="col-tag fk">FK</span>}
                                {highlightViolations && col.isMulti && (
                                  <span className="col-tag multi">Non-Atomic</span>
                                )}
                                {highlightViolations && col.isPartial && (
                                  <span className="col-tag partial">Partial Dep</span>
                                )}
                                {highlightViolations && col.isTransitiveDet && (
                                  <span className="col-tag trans-det">Transitive (X)</span>
                                )}
                                {highlightViolations && col.isTransitiveTarget && (
                                  <span className="col-tag trans-target">Transitive (Y)</span>
                                )}
                              </div>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.rows.map((row, rIdx) => {
                      const isHighlightedRow =
                        highlightViolations && (row.highlight || row.highlightTransitive || row.isDuplicateGroup);

                      return (
                        <tr
                          key={row.id || rIdx}
                          className={`sim-tr ${isHighlightedRow ? 'highlight-row' : ''}`}
                        >
                          {tbl.columns.map((col) => {
                            const val = row[col.key];
                            const isArrayVal = Array.isArray(val);

                            return (
                              <td
                                key={col.key}
                                className={`sim-td ${col.isPK ? 'pk-cell' : ''} ${
                                  highlightViolations && col.isMulti ? 'multi-cell' : ''
                                } ${
                                  highlightViolations && col.isPartial ? 'partial-cell' : ''
                                } ${
                                  highlightViolations && (col.isTransitiveDet || col.isTransitiveTarget)
                                    ? 'transitive-cell'
                                    : ''
                                }`}
                              >
                                {isArrayVal ? (
                                  <div className="multi-value-chips">
                                    {val.map((item, itemIdx) => (
                                      <span key={itemIdx} className="multi-chip">
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="cell-text">
                                    {val !== undefined && val !== null ? String(val) : '—'}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Anomaly Testing Playground */}
      <div className="sim-anomaly-playground">
        <div className="anomaly-playground-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} className="text-amber-400" />
            <h4 className="anomaly-header-title">Live Anomaly Simulation Lab</h4>
          </div>
          <p className="anomaly-header-sub">
            Test real-world insertion, update, and deletion anomalies against the current normalized schema.
          </p>
        </div>

        <div className="anomaly-action-tabs">
          <button
            className={`anomaly-tab-btn ${activeAnomalyTab === 'insertion' ? 'active' : ''}`}
            onClick={() => setActiveAnomalyTab(prev => (prev === 'insertion' ? null : 'insertion'))}
          >
            <Database size={15} />
            <span>1. Test Insertion Anomaly</span>
          </button>
          <button
            className={`anomaly-tab-btn ${activeAnomalyTab === 'update' ? 'active' : ''}`}
            onClick={() => setActiveAnomalyTab(prev => (prev === 'update' ? null : 'update'))}
          >
            <RotateCcw size={15} />
            <span>2. Test Update Anomaly</span>
          </button>
          <button
            className={`anomaly-tab-btn ${activeAnomalyTab === 'deletion' ? 'active' : ''}`}
            onClick={() => setActiveAnomalyTab(prev => (prev === 'deletion' ? null : 'deletion'))}
          >
            <XCircle size={15} />
            <span>3. Test Deletion Anomaly</span>
          </button>
        </div>

        {/* Anomaly Interactive Output Card */}
        {activeAnomalyTab && currentStage.anomalies && currentStage.anomalies[activeAnomalyTab] && (
          <div className={`anomaly-result-box ${currentStage.anomalies[activeAnomalyTab].severity}`}>
            <div className="anomaly-result-header">
              <span className="anomaly-result-title">
                {currentStage.anomalies[activeAnomalyTab].title}
              </span>
              <span className={`anomaly-severity-badge ${currentStage.anomalies[activeAnomalyTab].severity}`}>
                {currentStage.anomalies[activeAnomalyTab].severity.toUpperCase()}
              </span>
            </div>
            <div className="anomaly-scenario-row">
              <span className="anomaly-scenario-label">What you are trying to do:</span>
              <span className="anomaly-scenario-text">
                {currentStage.anomalies[activeAnomalyTab].scenario}
              </span>
            </div>
            <div className="anomaly-outcome-row">
              <span className="anomaly-outcome-label">DBMS Outcome in this Normal Form:</span>
              <div className="anomaly-outcome-text">
                {currentStage.anomalies[activeAnomalyTab].outcome}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SQL DDL Schema Modal */}
      {showSqlModal && (
        <div className="modal-backdrop" onClick={() => setShowSqlModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Code size={20} className="text-emerald-400" />
                <h3 className="modal-title">SQL DDL Schema: {currentStage.name}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowSqlModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Copy the relational SQL schema corresponding to this normalization stage:
              </p>
              <div className="sql-code-box">
                <pre>{currentStage.sqlDDL}</pre>
                <button className="copy-sql-btn" onClick={handleCopySql}>
                  {copiedSql ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
