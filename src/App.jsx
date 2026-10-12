import React, { useState, useMemo, useEffect } from 'react';
import {
  Database,
  ArrowRight,
  Key,
  Calculator,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Sun,
  Moon,
  Info,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Users,
  Download,
  Hash,
  GraduationCap,
  Split,
  Table
} from 'lucide-react';
import './App.css';
import {
  parseAttributes,
  parseFDs,
  computeClosure,
  findCandidateKeys,
  determineNormalForm,
  PRESETS
} from './utils/normalization';
import LearnModal from './components/LearnModal';
import DevelopedByModal from './components/DevelopedByModal';
import HelpModal from './components/HelpModal';
import DownloadModal from './components/DownloadModal';
import DoubleHashingVisualizer from './components/DoubleHashingVisualizer';
import PracticeModal from './components/PracticeModal';
import NormalizationSimulator from './components/NormalizationSimulator';

function App() {
  // Global Inputs State
  const [attributesInput, setAttributesInput] = useState("A, B, C, D");
  const [fdsInput, setFdsInput] = useState("A -> B\nB -> C\nC -> D");

  // Theme State: 'dark' | 'light'
  const [theme, setTheme] = useState('dark');

  // Synchronize body class for theme
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  // Active Tab: Member 1, Member 2, or Member 3
  const [activeTab, setActiveTab] = useState('closure'); // 'closure' | 'keys' | 'normal-form'

  // Simulator full-width expansion state
  const [isSimulatorExpanded, setIsSimulatorExpanded] = useState(false);

  // Mandatory Sections Modal State: null | 'learn' | 'developed' | 'help' | 'download'
  const [activeModal, setActiveModal] = useState(null);

  // Member 1 state: Attribute Closure Target
  const [closureTargetInput, setClosureTargetInput] = useState("A");

  // Member 2 UI state: Accordion open
  const [showKeysDerivation, setShowKeysDerivation] = useState(true);

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // 1. Memoized Parsed Inputs
  const parsedAttributes = useMemo(() => {
    return parseAttributes(attributesInput);
  }, [attributesInput]);

  const parsedFDs = useMemo(() => {
    return parseFDs(fdsInput);
  }, [fdsInput]);

  // Load Preset
  const handleLoadPreset = (preset) => {
    setAttributesInput(preset.attributes);
    setFdsInput(preset.fds);
    // Auto fill first attribute as closure target
    const parsed = parseAttributes(preset.attributes);
    if (parsed.length > 0) {
      setClosureTargetInput(parsed[0]);
    }
  };

  // Reset inputs
  const handleReset = () => {
    setAttributesInput("");
    setFdsInput("");
    setClosureTargetInput("");
  };

  // Load problem from Practice Center
  const handleLoadPracticeProblem = (problem) => {
    if (problem.targetTab === 'double-hashing') {
      setActiveTab('double-hashing');
    } else {
      if (problem.attributes) setAttributesInput(problem.attributes);
      if (problem.fds) setFdsInput(problem.fds);
      setActiveTab(problem.targetTab || 'closure');
      const parsed = parseAttributes(problem.attributes || '');
      if (parsed.length > 0) {
        setClosureTargetInput(parsed[0]);
      }
    }
  };

  // Load schema from Normalization Simulation Lab into Analyzer
  const handleLoadSimulationSchema = (scenario) => {
    if (scenario.analyzerAttributes) setAttributesInput(scenario.analyzerAttributes);
    if (scenario.analyzerFDs) setFdsInput(scenario.analyzerFDs);
    setActiveTab('normal-form');
    const parsed = parseAttributes(scenario.analyzerAttributes || '');
    if (parsed.length > 0) {
      setClosureTargetInput(parsed[0]);
    }
  };

  // 2. Member 1 Logic: Attribute Closure calculation for the target input
  const parsedClosureTarget = useMemo(() => {
    return parseAttributes(closureTargetInput);
  }, [closureTargetInput]);

  const closureResult = useMemo(() => {
    if (parsedClosureTarget.length === 0 || parsedAttributes.length === 0) {
      return { closure: [], steps: [] };
    }
    return computeClosure(parsedClosureTarget, parsedFDs);
  }, [parsedClosureTarget, parsedFDs, parsedAttributes]);

  // 3. Member 2 Logic: Candidate Key calculation
  const candidateKeysObj = useMemo(() => {
    return findCandidateKeys(parsedAttributes, parsedFDs);
  }, [parsedAttributes, parsedFDs]);

  // 4. Member 3 Logic: Normal Form calculation
  const normalFormObj = useMemo(() => {
    return determineNormalForm(
      parsedAttributes,
      parsedFDs,
      candidateKeysObj.candidateKeys,
      candidateKeysObj.primeAttributes,
      candidateKeysObj.nonPrimeAttributes
    );
  }, [parsedAttributes, parsedFDs, candidateKeysObj]);

  // 5. Unified printable closure for combined report export
  const printableClosure = useMemo(() => {
    let target = parsedClosureTarget;
    let res = closureResult;
    if ((!target || target.length === 0) && parsedAttributes.length > 0) {
      target = candidateKeysObj.candidateKeys.length > 0 ? candidateKeysObj.candidateKeys[0] : [parsedAttributes[0]];
      res = computeClosure(target, parsedFDs);
    }
    return { target, res };
  }, [parsedClosureTarget, closureResult, parsedAttributes, candidateKeysObj, parsedFDs]);

  return (
    <div className={`app-wrapper ${theme === 'light' ? 'light-theme' : ''}`}>
      <div className="app-container">

        {/* Decorative Ambient Light */}
        <div className="glow-gradient"></div>

        {/* Prominent Top Navigation Bar (Criterion 3: Mandatory Sections) */}
        <nav className="site-navbar">
          <div className="nav-brand">
            <div className="nav-logo-box">
              <Database size={22} className="text-violet-400" />
            </div>
            <div className="brand-text">
              <span className="brand-title">Normalization & FD Analyzer</span>

            </div>
          </div>

          <div className="nav-actions">
            <button
              className={`nav-btn ${activeModal === 'learn' ? 'active' : ''}`}
              onClick={() => setActiveModal('learn')}
              id="nav-learn-btn"
            >
              <BookOpen size={16} className="nav-icon text-violet-400" />
              <span>Learn</span>
            </button>

            <button
              className={`nav-btn ${activeModal === 'practice' ? 'active' : ''}`}
              onClick={() => setActiveModal('practice')}
              id="nav-practice-btn"
              title="Practice Center: Quizzes, Problems, and PYQs"
            >
              <GraduationCap size={16} className="nav-icon text-pink-400" />
              <span>Practice</span>
              <span className="nav-new-tag">New</span>
            </button>

            <button
              className={`nav-btn ${activeTab === 'simulation' && activeModal === null ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('simulation');
                setActiveModal(null);
              }}
              id="nav-simulation-btn"
              title="Interactive Normalization Table Simulator"
            >
              <Split size={16} className="nav-icon text-cyan-400" />
              <span>Simulation Lab</span>
              <span className="nav-new-tag" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>Live</span>
            </button>

            <button
              className={`nav-btn ${activeModal === 'help' ? 'active' : ''}`}
              onClick={() => setActiveModal('help')}
              id="nav-help-btn"
            >
              <HelpCircle size={16} className="nav-icon text-blue-400" />
              <span>Help</span>
            </button>

            <button
              className={`nav-btn ${activeModal === 'download' ? 'active' : ''}`}
              onClick={() => setActiveModal('download')}
              id="nav-download-btn"
            >
              <Download size={16} className="nav-icon text-emerald-400" />
              <span>Download</span>
            </button>

            <button
              className={`nav-btn ${activeModal === 'developed' ? 'active' : ''}`}
              onClick={() => setActiveModal('developed')}
              id="nav-developed-btn"
            >
              <Users size={16} className="nav-icon text-amber-400" />
              <span>Developed By</span>
            </button>

            <div className="nav-divider"></div>

            <button
              className="nav-btn theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle Light/Dark Theme"
              id="theme-toggle-btn"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={16} className="text-amber-400" />
                  <span>☀️ Day Mode</span>
                </>
              ) : (
                <>
                  <Moon size={16} className="text-violet-400" />
                  <span>🌙 Night Mode</span>
                </>
              )}
            </button>

            <button className="nav-btn reset-btn" onClick={handleReset} title="Reset all inputs">
              <RefreshCw size={15} />
              <span>Reset</span>
            </button>
          </div>
        </nav>

        {/* Title Section */}
        <header className="app-header">
          <h1 className="title-display">Interactive Normalization & FD Analyzer</h1>
          <p className="subtitle">Analyze schemas, calculate closures, discover candidate keys, and verify normal forms step-by-step.</p>
        </header>

        {/* Dashboard Grid */}
        <div className={`dashboard-grid ${activeTab === 'simulation' && isSimulatorExpanded ? 'expanded-mode' : ''}`}>

          {/* Left Column: Relation & FD Management */}
          {!(activeTab === 'simulation' && isSimulatorExpanded) && (
            <aside className="glass-panel">
              <h2 className="panel-title">
              <Database size={20} className="text-violet-500" />
              <span>Relation Inputs</span>
            </h2>

            {/* Attributes Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="attr-input">Attributes (Relation R)</label>
              <input
                id="attr-input"
                type="text"
                className="form-input"
                placeholder="e.g. A, B, C, D"
                value={attributesInput}
                onChange={(e) => setAttributesInput(e.target.value)}
              />
              <span className="preset-desc" style={{ marginTop: '0.25rem', display: 'block' }}>
                Enter comma or space separated letters.
              </span>
            </div>

            {/* FDs Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="fd-input">Functional Dependencies (F)</label>
              <textarea
                id="fd-input"
                className="form-input form-textarea"
                placeholder="e.g.&#10;A -> B&#10;B -> C"
                value={fdsInput}
                onChange={(e) => setFdsInput(e.target.value)}
              />
              <span className="preset-desc" style={{ marginTop: '0.25rem', display: 'block' }}>
                Use <code>-&gt;</code> or <code>→</code>. One FD per line.
              </span>
            </div>

            {/* Current Parsed Relation Preview */}
            <div className="schema-preview-box">
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Parsed Schema Preview</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>
                R({parsedAttributes.length > 0 ? parsedAttributes.join(', ') : 'ø'})
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Parsed FDs: </span>
                {parsedFDs.length > 0 ? (
                  <ul style={{ listStyle: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-secondary)', paddingLeft: '0.5rem', marginTop: '0.25rem' }}>
                    {parsedFDs.map((fd, i) => (
                      <li key={fd.id}>• {fd.text}</li>
                    ))}
                  </ul>
                ) : (
                  <span style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>None parsed</span>
                )}
              </div>
            </div>

            {/* Presets Container */}
            <div className="preset-container">
              <span className="form-label">Load Test Templates</span>
              <div className="preset-list">
                {PRESETS.map((preset, index) => (
                  <button
                    key={index}
                    className="preset-item"
                    onClick={() => handleLoadPreset(preset)}
                  >
                    <div className="preset-name">{preset.name}</div>
                    <div className="preset-desc">{preset.description}</div>
                  </button>
                ))}

                <button
                  className="preset-item"
                  onClick={() => setActiveTab('simulation')}
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.12))',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    marginTop: '0.5rem',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Split size={14} className="text-cyan-400" />
                    <div className="preset-name" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Interactive NF Simulator</div>
                  </div>
                  <div className="preset-desc" style={{ marginTop: '0.2rem' }}>
                    Watch a table violating 1NF, 2NF, 3NF transform live step-by-step.
                  </div>
                </button>
              </div>
            </div>
          </aside>
          )}

          {/* Right Column: Module Outputs */}
          <main className="glass-panel" style={{ minHeight: '600px' }}>

            {/* Tabs Header - Work Division */}
            <nav className="tabs-header">
              <button
                className={`tab-btn ${activeTab === 'closure' ? 'active' : ''}`}
                onClick={() => setActiveTab('closure')}
              >
                <Calculator size={18} />
                <span>Attribute Closure</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'keys' ? 'active' : ''}`}
                onClick={() => setActiveTab('keys')}
              >
                <Key size={18} />
                <span>Candidate Keys</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'normal-form' ? 'active' : ''}`}
                onClick={() => setActiveTab('normal-form')}
              >
                <ShieldAlert size={18} />
                <span>Normal Form Analyzer</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'simulation' ? 'active' : ''}`}
                onClick={() => setActiveTab('simulation')}
                id="tab-simulation-btn"
              >
                <Split size={18} />
                <span>NF Simulation Lab</span>
                <span className="tab-pill-badge" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>Interactive</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'double-hashing' ? 'active' : ''}`}
                onClick={() => setActiveTab('double-hashing')}
              >
                <Hash size={18} />
                <span>Double Hashing</span>
                <span className="tab-pill-badge">New</span>
              </button>
            </nav>

            {/* Tab 1: Member 1 Module - Attribute Closure */}
            {activeTab === 'closure' && (
              <section className="module-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>Attribute Closure Calculator</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Finds $X^+$ step-by-step using the Armstrong's Axioms closure algorithm.</p>
                  </div>
                </div>

                {parsedAttributes.length === 0 ? (
                  <div className="empty-state">
                    <Database className="empty-icon" size={48} />
                    <p>Define relation attributes on the left first.</p>
                  </div>
                ) : (
                  <>
                    {/* Input Area */}
                    <div className="form-group" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                      <div style={{ flexGrow: 1 }}>
                        <label className="form-label" htmlFor="closure-input">Find Closure of Attributes</label>
                        <input
                          id="closure-input"
                          type="text"
                          className="form-input"
                          placeholder="e.g. A, B"
                          value={closureTargetInput}
                          onChange={(e) => setClosureTargetInput(e.target.value)}
                        />
                      </div>
                      <div style={{ padding: '0.5rem 0', display: 'flex', gap: '0.25rem' }}>
                        {/* Auto-suggest buttons from available attributes */}
                        {parsedAttributes.slice(0, 6).map(attr => (
                          <button
                            key={attr}
                            className="attr-pill non-prime"
                            style={{ cursor: 'pointer', margin: 0 }}
                            onClick={() => {
                              // If current target already has it, clear, otherwise append
                              if (closureTargetInput.toUpperCase().includes(attr)) {
                                setClosureTargetInput(prev =>
                                  prev.split(/[\s,]+/).map(a => a.toUpperCase().trim()).filter(a => a !== attr && a !== "").join(', ')
                                );
                              } else {
                                setClosureTargetInput(prev => prev ? `${prev}, ${attr}` : attr);
                              }
                            }}
                          >
                            +{attr}
                          </button>
                        ))}
                      </div>
                    </div>

                    {parsedClosureTarget.length === 0 ? (
                      <div className="empty-state">
                        <Info className="empty-icon" size={32} />
                        <p>Select or type attributes above to view their closure.</p>
                      </div>
                    ) : (
                      <>
                        {/* Results Box */}
                        <div className="closure-display-box">
                          <div className="closure-result-label">
                            Closure of &#123;{parsedClosureTarget.join(', ')}&#125;⁺
                          </div>
                          <div className="closure-result-val">
                            &#123;{closureResult.closure.join(', ')}&#125;
                          </div>
                        </div>

                        {/* Step by step Timeline */}
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                          Step-by-Step Expansion Derivation
                        </h4>
                        <div className="timeline">
                          {closureResult.steps.map((step, idx) => (
                            <div className="timeline-step" key={idx}>
                              <div className="step-marker">{step.step}</div>
                              <div className="step-card">
                                <div className="step-header">
                                  <div className="step-title">
                                    {step.fdApplied === 'Initial State' ? (
                                      <span className="text-violet-400">Initialize Closure Set</span>
                                    ) : step.fdApplied === 'None' ? (
                                      <span className="text-emerald-400">Fixed Point Stabilized</span>
                                    ) : (
                                      <span>Applied Dependency: <code style={{ color: 'var(--color-secondary)' }}>{step.fdApplied}</code></span>
                                    )}
                                  </div>
                                  <div className="step-badge">
                                    X⁺ = &#123;{step.current.join(', ')}&#125;
                                  </div>
                                </div>
                                <div className="step-desc">
                                  {step.explanation}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </section>
            )}

            {/* Tab 2: Member 2 Module - Candidate Keys */}
            {activeTab === 'keys' && (
              <section className="module-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>Candidate Keys Finder</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Finds all minimal keys by analyzing left/right FD presence and checking subset closures.</p>
                  </div>
                </div>

                {parsedAttributes.length === 0 ? (
                  <div className="empty-state">
                    <Database className="empty-icon" size={48} />
                    <p>Define relation attributes on the left first.</p>
                  </div>
                ) : (
                  <>
                    {/* Keys Results Header */}
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      Discovered Candidate Key(s)
                    </div>
                    <div className="keys-grid">
                      {candidateKeysObj.candidateKeys.map((key, index) => (
                        <div className="key-card" key={index}>
                          <div className="key-card-label">Candidate Key {index + 1}</div>
                          <div className="key-card-val">&#123;{key.join('')}&#125;</div>
                          <Key className="key-card-icon" size={48} />
                        </div>
                      ))}
                    </div>

                    {/* Attributes Categorization */}
                    <div className="attributes-section">

                      {/* Prime Attributes */}
                      <div className="attribute-card">
                        <div className="attribute-card-title">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span>Prime Attributes ({candidateKeysObj.primeAttributes.length})</span>
                        </div>
                        <div>
                          {candidateKeysObj.primeAttributes.length > 0 ? (
                            candidateKeysObj.primeAttributes.map(attr => (
                              <span className="attr-pill prime" key={attr}>{attr}</span>
                            ))
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>None found</span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                          Attributes that are part of at least one candidate key.
                        </p>
                      </div>

                      {/* Non-Prime Attributes */}
                      <div className="attribute-card">
                        <div className="attribute-card-title">
                          <XCircle size={16} className="text-red-500" />
                          <span>Non-Prime Attributes ({candidateKeysObj.nonPrimeAttributes.length})</span>
                        </div>
                        <div>
                          {candidateKeysObj.nonPrimeAttributes.length > 0 ? (
                            candidateKeysObj.nonPrimeAttributes.map(attr => (
                              <span className="attr-pill non-prime" key={attr}>{attr}</span>
                            ))
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>None found</span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                          Attributes that do not appear in any candidate key.
                        </p>
                      </div>

                    </div>

                    {/* Computation Derivation Steps */}
                    <div className="accordion">
                      <button
                        className="accordion-header"
                        onClick={() => setShowKeysDerivation(!showKeysDerivation)}
                      >
                        <span>Interactive Calculation Derivation Path</span>
                        {showKeysDerivation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {showKeysDerivation && (
                        <div className="accordion-body">
                          <div className="explanation-list">
                            {candidateKeysObj.steps.map((step, idx) => (
                              <div className="explanation-item" key={idx} style={{
                                fontWeight: step.startsWith('  →') ? 'bold' : 'normal',
                                color: step.startsWith('  →') ? 'var(--color-primary)' : 'var(--text-primary)'
                              }}>
                                {step}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </section>
            )}

            {/* Tab 3: Member 3 Module - Normal Form Analyzer */}
            {activeTab === 'normal-form' && (
              <section className="module-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>Normal Form Analyzer</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Checks BCNF, 3NF, and 2NF criteria per functional dependency to identify violations.</p>
                  </div>
                </div>

                {parsedAttributes.length === 0 ? (
                  <div className="empty-state">
                    <Database className="empty-icon" size={48} />
                    <p>Define relation attributes on the left first.</p>
                  </div>
                ) : (
                  <>
                    {/* Normal Form Hero Card */}
                    <div className="nf-hero-card">
                      <div className="nf-badge-main">{normalFormObj.highestNF}</div>
                      <div className="nf-subtitle-main">
                        Highest Satisfied Normal Form for Relation R
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '540px', marginInline: 'auto' }}>
                        {normalFormObj.highestNF.includes('BCNF') && 'The schema satisfies BCNF (3.5NF). Every non-trivial functional dependency has a determinant that is a superkey. All functional dependency-based redundancy is eliminated.'}
                        {normalFormObj.highestNF === '3NF' && 'Satisfies 3NF. There are no transitive dependencies. However, BCNF (3.5NF) is violated because some determinant is not a superkey.'}
                        {normalFormObj.highestNF === '2NF' && 'Satisfies 2NF. There are no partial dependencies (no non-prime attribute depends on a proper subset of a key). 3NF is violated due to transitive dependencies.'}
                        {normalFormObj.highestNF === '1NF' && 'The relation violates 2NF due to partial dependencies. It is in 1NF (atomic attributes).'}
                      </p>
                    </div>

                    {/* Step-by-Step Normal Form Derivation Timeline */}
                    <div className="nf-steps-container">
                      <div className="nf-steps-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <ShieldAlert size={18} className="text-violet-400" />
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            Step-by-Step Normal Form Derivation Path (1NF → 2NF → 3NF → 3.5NF → 4NF)
                          </h4>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          Hierarchical proof testing each normal form criterion in ascending order with formal academic verification.
                        </p>
                      </div>

                      <div className="nf-step-timeline">
                        {normalFormObj.steps && normalFormObj.steps.map((step, sIdx) => (
                          <div className={`nf-step-item ${step.status.toLowerCase()}`} key={sIdx}>
                            <div className="nf-step-marker">
                              {step.status === 'PASS' && <CheckCircle2 size={18} className="step-icon-pass" />}
                              {step.status === 'FAIL' && <XCircle size={18} className="step-icon-fail" />}
                              {step.status === 'SKIPPED' && <ShieldAlert size={18} className="step-icon-skip" />}
                            </div>
                            <div className="nf-step-card">
                              <div className="nf-step-card-header">
                                <span className="nf-step-title">{step.title}</span>
                                <span className={`nf-step-status-pill ${step.status.toLowerCase()}`}>
                                  {step.badge}
                                </span>
                              </div>
                              <p className="nf-step-explanation">{step.explanation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dependency Verification Report */}
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      Diagnostic Report Per Functional Dependency ({parsedFDs.length})
                    </div>

                    {parsedFDs.length === 0 ? (
                      <div className="empty-state">
                        <Info className="empty-icon" size={32} />
                        <p>No functional dependencies to verify. An empty set of FDs vacuously satisfies BCNF.</p>
                      </div>
                    ) : (
                      <div className="fd-report-list">
                        {normalFormObj.fdReports.map((report, idx) => (
                          <div className="fd-report-card" key={idx}>
                            <div className="fd-report-header">
                              <span className="fd-text-badge">{report.fd.text}</span>
                              <div className="fd-nf-badges">
                                <span className={`nf-status-badge ${report.is2NF ? 'pass' : 'fail'}`}>
                                  2NF: {report.is2NF ? 'pass' : 'fail'}
                                </span>
                                <span className={`nf-status-badge ${report.is3NF ? 'pass' : 'fail'}`}>
                                  3NF: {report.is3NF ? 'pass' : 'fail'}
                                </span>
                                <span className={`nf-status-badge ${report.isBCNF ? 'pass' : 'fail'}`}>
                                  BCNF: {report.isBCNF ? 'pass' : 'fail'}
                                </span>
                              </div>
                            </div>
                            <div className="fd-report-body">
                              <div className="fd-diagnostics-title">Analyzer Reasonings & Criteria</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                {report.reasons.map((reason, rIdx) => (
                                  <div className="diagnostic-step" key={rIdx}>
                                    {reason.includes('satisfies') || reason.includes('Satisfies') ? (
                                      <CheckCircle2 size={14} className="text-emerald-500 diagnostic-icon" />
                                    ) : (
                                      <XCircle size={14} className="text-red-500 diagnostic-icon" />
                                    )}
                                    <span>{reason}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </section>
            )}

            {/* Tab 4: Double Hashing Visualizer */}
            {activeTab === 'double-hashing' && (
              <section className="module-content">
                <DoubleHashingVisualizer />
              </section>
            )}

            {/* Tab 5: Normalization Simulation Table Lab */}
            {activeTab === 'simulation' && (
              <section className="module-content">
                <NormalizationSimulator
                  onSendToAnalyzer={handleLoadSimulationSchema}
                  isExpanded={isSimulatorExpanded}
                  onToggleExpand={() => setIsSimulatorExpanded(prev => !prev)}
                />
              </section>
            )}

          </main>
        </div>

        {/* Informational Guidelines / Educational presets */}
        <section className="helper-grid">

          <div className="helper-card">
            <h3 className="helper-card-title">1. Attribute Closures</h3>
            <p className="helper-card-desc">
              The closure of attribute set $X$, written $X^+$, is the set of all attributes that are functionally determined by $X$. Calculated by starting with $X$ and repeatedly adding the RHS of FDs whose LHS is a subset of the current closure.
            </p>
            <div className="helper-card-meta">
              Formally: If X → Y and Y → Z, then X → Z (Transitivity)
            </div>
          </div>

          <div className="helper-card">
            <h3 className="helper-card-title">2. Candidate Keys</h3>
            <p className="helper-card-desc">
              A candidate key is a minimal set of attributes that can uniquely identify any tuple in the relation. This means its closure is the entire relation ($K^+ = R$), and no proper subset of $K$ is also a key.
            </p>
            <div className="helper-card-meta">
              Prime: In some key. Non-prime: Not in any key.
            </div>
          </div>

          <div className="helper-card">
            <h3 className="helper-card-title">3. Normal Forms Criteria</h3>
            <p className="helper-card-desc">
              Normal forms reduce data redundancy.
              <strong> 2NF:</strong> No non-prime attribute depends on a proper subset of a candidate key.
              <strong> 3NF:</strong> Every FD X → Y satisfies: X is a superkey OR Y is prime.
              <strong> BCNF:</strong> Every FD X → Y satisfies: X is a superkey.
            </p>
            <div className="helper-card-meta">
              Satisfiability: BCNF ⊂ 3NF ⊂ 2NF ⊂ 1NF
            </div>
          </div>

          <div className="helper-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('double-hashing')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="helper-card-title">4. Double Hashing Simulator</h3>
              <span className="attr-pill prime" style={{ fontSize: '0.7rem' }}>Interactive</span>
            </div>
            <p className="helper-card-desc">
              Open addressing collision resolution using two hash functions: h(k, i) = (h₁(k) + i × h₂(k)) mod m. Eliminates both primary and secondary clustering with tombstone deletion support.
            </p>
            <div className="helper-card-meta">
              h₁(k) = k mod m | h₂(k) = 1 + (k mod m')
            </div>
          </div>

          <div className="helper-card" style={{ cursor: 'pointer' }} onClick={() => setActiveModal('practice')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="helper-card-title">5. Practice & PYQs Center</h3>
              <span className="attr-pill prime" style={{ fontSize: '0.7rem', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>New</span>
            </div>
            <p className="helper-card-desc">
              Practice interactive timed/untimed quizzes, solve step-by-step normalization & hashing problems, and study GATE / University Previous Year Questions with full image screenshot uploads.
            </p>
            <div className="helper-card-meta">
              Quizzes • Step-by-Step Problems • GATE PYQs
            </div>
          </div>

          <div className="helper-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('simulation')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="helper-card-title">6. Interactive NF Table Simulator</h3>
              <span className="attr-pill prime" style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}>Interactive Lab</span>
            </div>
            <p className="helper-card-desc">
              Experience normalization with live relational tables! Start with an unnormalized table violating 1NF, 2NF, and 3NF, then watch it flatten into 1NF, decompose into 2NF tables, and achieve 3NF & BCNF with live anomaly testing.
            </p>
            <div className="helper-card-meta">
              Live Stages: UNF ➔ 1NF ➔ 2NF ➔ 3NF ➔ BCNF
            </div>
          </div>

        </section>

        {/* Modals for Mandatory Sections (Criterion 3) */}
        <LearnModal
          isOpen={activeModal === 'learn'}
          onClose={() => setActiveModal(null)}
        />

        <DevelopedByModal
          isOpen={activeModal === 'developed'}
          onClose={() => setActiveModal(null)}
        />

        <HelpModal
          isOpen={activeModal === 'help'}
          onClose={() => setActiveModal(null)}
        />

        <DownloadModal
          isOpen={activeModal === 'download'}
          onClose={() => setActiveModal(null)}
          reportData={{
            attributes: parsedAttributes,
            fds: parsedFDs,
            candidateKeysObj,
            normalFormObj,
            closureTarget: parsedClosureTarget,
            closureResult
          }}
        />

        <PracticeModal
          isOpen={activeModal === 'practice'}
          onClose={() => setActiveModal(null)}
          onLoadProblem={handleLoadPracticeProblem}
        />

        {/* ========================================================================== */}
        {/* Unified 3-in-1 Printable Academic Report (Combined PDF Export)            */}
        {/* ========================================================================== */}
        <div className="printable-combined-report">
          {/* Header & Course Attribution */}
          <div className="print-header-block">
            <div className="print-meta-top">
              <span>Course: Database Management Systems (DA1 Evaluation)</span>
              <span>Date: {new Date().toLocaleDateString()}</span>
            </div>
            <h1 className="print-title">DBMS Normalization & Functional Dependency Comprehensive Analysis Report</h1>
            <p className="print-guide">
              <strong>Project Supervisor & Guide:</strong> Dr. Swaminathan A, Assistant Professor
            </p>
            <div className="print-badge-summary">
              <span><strong>Relation:</strong> R({parsedAttributes.join(', ')})</span>
              <span><strong>Highest Normal Form:</strong> {normalFormObj.highestNF}</span>
              <span><strong>Candidate Keys:</strong> {candidateKeysObj.candidateKeys.map(k => '{' + k.join('') + '}').join(', ') || 'None'}</span>
            </div>
          </div>

          {/* Section 1: Schema & Functional Dependencies */}
          <section className="print-section">
            <h2 className="print-section-title">1. Relation Schema & Given Functional Dependencies</h2>
            <div className="print-grid-two">
              <div className="print-box">
                <strong>Relation Attributes ({parsedAttributes.length}):</strong>
                <p>R({parsedAttributes.join(', ')})</p>
              </div>
              <div className="print-box">
                <strong>Functional Dependencies ({parsedFDs.length}):</strong>
                {parsedFDs.length > 0 ? (
                  <p>{parsedFDs.map(f => f.text).join('  |  ')}</p>
                ) : (
                  <p>None (Relation is vacuously in BCNF)</p>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Attribute Closure Calculation */}
          <section className="print-section">
            <h2 className="print-section-title">2. Module 1: Attribute Closure Calculation (X⁺)</h2>
            <p className="print-sub-desc">
              Computed closure for attribute set <strong>{'{' + (printableClosure.target || []).join(', ') + '}⁺'}</strong> = <strong>{'{' + (printableClosure.res?.closure || []).join(', ') + '}'}</strong>
            </p>
            <table className="print-table">
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Step #</th>
                  <th style={{ width: '25%' }}>Applied Functional Dependency</th>
                  <th style={{ width: '25%' }}>Resulting Attribute Set</th>
                  <th style={{ width: '40%' }}>Step Explanation & Logic</th>
                </tr>
              </thead>
              <tbody>
                {printableClosure.res?.steps && printableClosure.res.steps.length > 0 ? (
                  printableClosure.res.steps.map((s, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center' }}>{s.step}</td>
                      <td><code>{s.fdApplied}</code></td>
                      <td><code>{'{' + s.current.join(', ') + '}'}</code></td>
                      <td>{s.explanation}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>No functional dependencies applied.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* Section 3: Candidate Keys & Attribute Classification */}
          <section className="print-section">
            <h2 className="print-section-title">3. Module 2: Candidate Keys & Attribute Classification</h2>
            <div className="print-grid-three">
              <div className="print-box">
                <strong>Discovered Candidate Keys:</strong>
                <p style={{ fontWeight: 700, color: '#4338ca' }}>
                  {candidateKeysObj.candidateKeys.map(k => '{' + k.join('') + '}').join(', ') || 'None'}
                </p>
              </div>
              <div className="print-box">
                <strong>Prime Attributes:</strong>
                <p>{'{' + candidateKeysObj.primeAttributes.join(', ') + '}' || 'None'}</p>
                <small style={{ color: '#64748b' }}>Appears in at least one candidate key</small>
              </div>
              <div className="print-box">
                <strong>Non-Prime Attributes:</strong>
                <p>{'{' + candidateKeysObj.nonPrimeAttributes.join(', ') + '}' || 'None'}</p>
                <small style={{ color: '#64748b' }}>Appears in zero candidate keys</small>
              </div>
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <strong>Attribute Partitioning:</strong>
              <ul style={{ marginLeft: '1.5rem', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                <li><strong>Essential (Must-have) Attributes:</strong> {'{' + candidateKeysObj.essentialAttributes.join(', ') + '}'} (Never appear on RHS; must be in every key)</li>
                <li><strong>RHS-Only Attributes:</strong> {'{' + candidateKeysObj.rhsOnlyAttributes.join(', ') + '}'} (Can never be part of any minimal candidate key)</li>
              </ul>
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <strong>Candidate Key Derivation Path:</strong>
              <ol style={{ marginLeft: '1.5rem', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {candidateKeysObj.steps.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ol>
            </div>
          </section>

          {/* Section 4: Step-by-Step Normal Form Derivation (1NF to 4NF) */}
          <section className="print-section">
            <h2 className="print-section-title">4. Module 3: Step-by-Step Normal Form Hierarchical Derivation</h2>
            <div style={{ marginBottom: '0.75rem', fontWeight: 600 }}>
              Highest Satisfied Normal Form: <span style={{ color: '#4338ca', fontSize: '1.05rem' }}>{normalFormObj.highestNF}</span>
            </div>
            <table className="print-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Normal Form Level</th>
                  <th style={{ width: '18%' }}>Audit Status</th>
                  <th style={{ width: '60%' }}>Formal Rule Proof & Academic Verification</th>
                </tr>
              </thead>
              <tbody>
                {normalFormObj.steps && normalFormObj.steps.map((st, idx) => (
                  <tr key={idx}>
                    <td><strong>{st.title}</strong></td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`print-badge ${st.status.toLowerCase()}`}>
                        {st.status} ({st.badge})
                      </span>
                    </td>
                    <td>{st.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Section 5: Per-FD Diagnostic Audit Table */}
          <section className="print-section">
            <h2 className="print-section-title">5. Per-Functional Dependency Diagnostic Audit Table</h2>
            <table className="print-table">
              <thead>
                <tr>
                  <th style={{ width: '18%' }}>Functional Dependency</th>
                  <th style={{ width: '10%' }}>2NF</th>
                  <th style={{ width: '10%' }}>3NF</th>
                  <th style={{ width: '12%' }}>BCNF (3.5NF)</th>
                  <th style={{ width: '50%' }}>Diagnostic Technical Reasons & Identified Violations</th>
                </tr>
              </thead>
              <tbody>
                {normalFormObj.fdReports && normalFormObj.fdReports.length > 0 ? (
                  normalFormObj.fdReports.map((rep, idx) => (
                    <tr key={idx}>
                      <td><code>{rep.fd.text}</code></td>
                      <td style={{ textAlign: 'center' }}>{rep.is2NF ? '✅ PASS' : '❌ FAIL'}</td>
                      <td style={{ textAlign: 'center' }}>{rep.is3NF ? '✅ PASS' : '❌ FAIL'}</td>
                      <td style={{ textAlign: 'center' }}>{rep.isBCNF ? '✅ PASS' : '❌ FAIL'}</td>
                      <td>
                        <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.8rem' }}>
                          {rep.reasons.map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>No functional dependencies to verify.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* Evaluation Signoff Block */}
          <div className="print-signoff-block">
            <div className="print-signoff-box">
              <p>Student Contributor Verification</p>
              <div className="signoff-line"></div>
              <span>DBMS Project Team</span>
            </div>
            <div className="print-signoff-box">
              <p>Faculty Guide & Supervisor</p>
              <div className="signoff-line"></div>
              <span>Dr. Swaminathan A, Assistant Professor</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
