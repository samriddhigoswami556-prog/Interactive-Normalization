import React from 'react';
import { X, HelpCircle, ArrowRight, CheckCircle2, Play, Sliders, FileText, Compass } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="modal-icon-badge">
              <HelpCircle size={22} className="text-violet-400" />
            </div>
            <div>
              <h2 className="modal-title">User Manual & Help Guide</h2>
              <p className="modal-subtitle">Step-by-step operational guide for operating the analyzer.</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: '74vh', overflowY: 'auto', padding: '1.75rem' }}>

          {/* Section 1: Overview */}
          <div className="help-section">
            <div className="help-step-tag">Step 1</div>
            <h3 className="help-title">What the Website Does</h3>
            <p className="help-desc">
              The <strong>Interactive Normalization & FD Analyzer</strong> is an automated relational database workbench designed to eliminate manual calculation errors. Given a relational schema <code>R</code> and a set of functional dependencies <code>F</code>, the application:
            </p>
            <ul className="help-bullets">
              <li>• Automatically computes the closure of any attribute set using Armstrong’s Axioms with visual step-by-step reasoning.</li>
              <li>• Discovers all minimal Candidate Keys using search-space pruning, classifying attributes into Prime and Non-Prime.</li>
              <li>• Evaluates whether the schema satisfies 1NF, 2NF, 3NF, or BCNF and pinpoints exact dependency violations.</li>
            </ul>
          </div>

          {/* Section 2: Available Inputs & Syntax */}
          <div className="help-section">
            <div className="help-step-tag">Step 2</div>
            <h3 className="help-title">Available Inputs & How to Provide Them</h3>

            <div className="help-inputs-grid">
              <div className="help-input-card">
                <div className="input-title">1. Relation Attributes (R)</div>
                <p>Located in the left panel under <strong>"Attributes (Relation R)"</strong>.</p>
                <div className="code-example-box">
                  <strong>Syntax:</strong> Comma or space-separated letters/words.<br />
                  <code>A, B, C, D</code> or <code>RollNo, Name, Dept, HOD</code>
                </div>
              </div>

              <div className="help-input-card">
                <div className="input-title">2. Functional Dependencies (F)</div>
                <p>Located in the multiline textarea under <strong>"Functional Dependencies (F)"</strong>.</p>
                <div className="code-example-box">
                  <strong>Syntax:</strong> One FD per line. Use <code>-&gt;</code>, <code>--&gt;</code>, <code>=&gt;</code>, or <code>&rarr;</code>.<br />
                  <code>A -&gt; B</code><br />
                  <code>B, C -&gt; D</code>
                </div>
              </div>

              <div className="help-input-card">
                <div className="input-title">3. Target Closure Attribute</div>
                <p>Found inside the <strong>"Attribute Closure"</strong> tab on the right.</p>
                <div className="code-example-box">
                  <strong>Syntax:</strong> Enter the attributes whose closure you want to find.<br />
                  <code>A</code> or <code>A, B</code> (or click the <code>+A</code> quick pills).
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Buttons & Controls Guide */}
          <div className="help-section">
            <div className="help-step-tag">Step 3</div>
            <h3 className="help-title">Controls & Buttons Guide</h3>

            <div className="controls-table">
              <div className="control-row">
                <div className="control-name-col">
                  <code>☀️ Day / 🌙 Night Mode</code>
                </div>
                <div className="control-desc-col">
                  Toggles the application between high-contrast dark slate mode and clean daylight mode.
                </div>
              </div>

              <div className="control-row">
                <div className="control-name-col">
                  <code>🔄 Reset Inputs</code>
                </div>
                <div className="control-desc-col">
                  Clears all attributes, functional dependencies, and closure targets to start a new analysis.
                </div>
              </div>

              <div className="control-row">
                <div className="control-name-col">
                  <code>Load Test Templates</code>
                </div>
                <div className="control-desc-col">
                  Pre-populates textbook university exam questions (e.g. 2NF partial dependencies, 3NF vs BCNF violations) with one click.
                </div>
              </div>

              <div className="control-row">
                <div className="control-name-col">
                  <code>+A, +B Pill Buttons</code>
                </div>
                <div className="control-desc-col">
                  Quick-selector buttons in the Closure tab that allow you to toggle attributes into the closure target with a single click.
                </div>
              </div>

              <div className="control-row">
                <div className="control-name-col">
                  <code>📥 Download Report</code>
                </div>
                <div className="control-desc-col">
                  Opens the export dialog to generate and download a comprehensive analysis report in PDF, Text, or Document format.
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Internal Processing Flow */}
          <div className="help-section">
            <div className="help-step-tag">Step 4</div>
            <h3 className="help-title">How Internal Processing Takes Place</h3>
            <div className="process-flow">
              <div className="process-step">
                <div className="process-num">1</div>
                <div>
                  <strong>Input Parsing & Sanitation:</strong>
                  <p>Regex engine parses attributes and FDs, cleans whitespace, normalizes arrows, and renders a live schema preview.</p>
                </div>
              </div>
              <div className="process-step">
                <div className="process-num">2</div>
                <div>
                  <strong>Fixed-Point Closure Execution:</strong>
                  <p>Computes <code>X⁺</code> by iteratively matching FD left-hand sides against current closures until no new attributes are found.</p>
                </div>
              </div>
              <div className="process-step">
                <div className="process-num">3</div>
                <div>
                  <strong>Search Space Pruning & Candidate Keys:</strong>
                  <p>Categorizes attributes into Essential (must-have), RHS-only (excluded), and Middle. Evaluates minimal keys and classifies Prime and Non-Prime attributes.</p>
                </div>
              </div>
              <div className="process-step">
                <div className="process-num">4</div>
                <div>
                  <strong>Multi-Tier Normal Form Auditing:</strong>
                  <p>Evaluates each FD against 2NF (partial dependency check), 3NF (prime RHS / superkey check), and BCNF (superkey determinant check).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Interpreting Outputs */}
          <div className="help-section">
            <div className="help-step-tag">Step 5</div>
            <h3 className="help-title">How to Interpret the Output</h3>

            <div className="help-interpret-grid">
              <div className="interpret-box">
                <h4 style={{ color: 'var(--color-primary)', fontSize: '0.95rem' }}>1. Closure Timeline</h4>
                <p>Look at the step-by-step derivation. Each card lists the applied dependency (e.g. <code>Applied Dependency: A &rarr; B</code>) and the expanding closure set until the <em>"Fixed Point Stabilized"</em> badge is shown.</p>
              </div>

              <div className="interpret-box">
                <h4 style={{ color: 'var(--color-primary)', fontSize: '0.95rem' }}>2. Candidate Key Cards</h4>
                <p>Discovered minimal keys are displayed in cards (e.g. <code>&#123;AB&#125;</code>). Look at the <strong>Prime</strong> (Green pill) and <strong>Non-Prime</strong> (Red pill) attribute categories below the cards.</p>
              </div>

              <div className="interpret-box">
                <h4 style={{ color: 'var(--color-primary)', fontSize: '0.95rem' }}>3. Normal Form Diagnostics</h4>
                <p>The top <strong>Hero Banner</strong> declares the highest satisfied normal form. Below it, every FD has badges showing <code>2NF: pass/fail</code>, <code>3NF: pass/fail</code>, and <code>BCNF: pass/fail</code> with exact mathematical reasons.</p>
              </div>

              <div className="interpret-box">
                <h4 style={{ color: 'var(--color-primary)', fontSize: '0.95rem' }}>4. Interactive NF Table Simulator</h4>
                <p>Switch to the <strong>"Simulation Lab"</strong> tab to interact with live database tables. Watch a relation violating 1NF, 2NF, and 3NF decompose step-by-step as you resolve atomicity, partial dependencies, and transitive dependencies, with live anomaly tests and SQL export!</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
