import React, { useState } from 'react';
import { X, BookOpen, Video, Bookmark, CheckCircle2, ChevronRight } from 'lucide-react';

export default function LearnModal({ isOpen, onClose }) {
  const [activeSubTab, setActiveSubTab] = useState('concepts'); // 'concepts' | 'video' | 'references'
  const [activeConcept, setActiveConcept] = useState('intro'); // 'intro' | 'axioms' | 'closure' | 'keys' | 'forms'

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="modal-icon-badge">
              <BookOpen size={22} className="text-violet-400" />
            </div>
            <div>
              <h2 className="modal-title">Learn: Database Normalization & FDs</h2>
              <p className="modal-subtitle">Master relational theory, Armstrong's Axioms, Candidate Keys, and Normal Forms.</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="modal-subnav">
          <button 
            className={`subnav-btn ${activeSubTab === 'concepts' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('concepts')}
          >
            <BookOpen size={16} />
            <span>1. Concept Explanation</span>
          </button>
          <button 
            className={`subnav-btn ${activeSubTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('video')}
          >
            <Video size={16} />
            <span>2. Animated Video</span>
          </button>
          <button 
            className={`subnav-btn ${activeSubTab === 'references' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('references')}
          >
            <Bookmark size={16} />
            <span>3. Academic References</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          
          {/* SUBTAB 1: CONCEPT EXPLANATION */}
          {activeSubTab === 'concepts' && (
            <div className="concepts-layout">
              {/* Concept Sidebar */}
              <div className="concepts-sidebar">
                <button 
                  className={`concept-nav-item ${activeConcept === 'intro' ? 'active' : ''}`}
                  onClick={() => setActiveConcept('intro')}
                >
                  <ChevronRight size={14} />
                  <span>Introduction & Anomalies</span>
                </button>
                <button 
                  className={`concept-nav-item ${activeConcept === 'axioms' ? 'active' : ''}`}
                  onClick={() => setActiveConcept('axioms')}
                >
                  <ChevronRight size={14} />
                  <span>Armstrong's Axioms</span>
                </button>
                <button 
                  className={`concept-nav-item ${activeConcept === 'closure' ? 'active' : ''}`}
                  onClick={() => setActiveConcept('closure')}
                >
                  <ChevronRight size={14} />
                  <span>Attribute Closure (X⁺)</span>
                </button>
                <button 
                  className={`concept-nav-item ${activeConcept === 'keys' ? 'active' : ''}`}
                  onClick={() => setActiveConcept('keys')}
                >
                  <ChevronRight size={14} />
                  <span>Candidate Keys Discovery</span>
                </button>
                <button 
                  className={`concept-nav-item ${activeConcept === 'forms' ? 'active' : ''}`}
                  onClick={() => setActiveConcept('forms')}
                >
                  <ChevronRight size={14} />
                  <span>Normal Forms (1NF &rarr; BCNF)</span>
                </button>
              </div>

              {/* Concept Details Panel */}
              <div className="concept-detail-card">
                
                {activeConcept === 'intro' && (
                  <div>
                    <h3 className="content-heading">Relational Normalization & Data Anomalies</h3>
                    <p className="content-paragraph">
                      <strong>Database Normalization</strong> is the systematic approach of decomposing tables to eliminate data redundancy and undesirable characteristics like insertion, update, and deletion anomalies. It was originally proposed by <strong>Edgar F. Codd</strong> in 1970 as part of the relational database model.
                    </p>

                    <h4 className="content-subheading">The Three Major Database Anomalies:</h4>
                    <div className="anomalies-grid">
                      <div className="anomaly-box">
                        <div className="anomaly-title text-amber-400">1. Update Anomaly</div>
                        <p className="anomaly-desc">If employee address data is repeated in multiple rows, changing the address requires updating every single row. Failing to update all instances causes data inconsistency.</p>
                      </div>
                      <div className="anomaly-box">
                        <div className="anomaly-title text-red-400">2. Insertion Anomaly</div>
                        <p className="anomaly-desc">Occurs when certain attributes cannot be inserted into the database without the presence of other attributes (e.g., cannot add a new department without assigning at least one employee if EmployeeID is part of the primary key).</p>
                      </div>
                      <div className="anomaly-box">
                        <div className="anomaly-title text-violet-400">3. Deletion Anomaly</div>
                        <p className="anomaly-desc">The unintended loss of data due to the deletion of other data (e.g., deleting the last student enrolled in a course accidentally erases the entire course record).</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeConcept === 'axioms' && (
                  <div>
                    <h3 className="content-heading">Functional Dependencies & Armstrong's Axioms</h3>
                    <p className="content-paragraph">
                      A <strong>Functional Dependency (FD)</strong> denoted as <code>X &rarr; Y</code> between two sets of attributes indicates that the values of attribute set <code>X</code> uniquely identify or determine the values of attribute set <code>Y</code>.
                    </p>
                    <h4 className="content-subheading">Armstrong's Axioms (Sound and Complete):</h4>
                    <ul className="axiom-list">
                      <li>
                        <strong>1. Reflexivity:</strong> If <code>Y &sube; X</code>, then <code>X &rarr; Y</code>.
                        <div className="axiom-example">Example: &#123;A, B&#125; &rarr; A is always trivially true.</div>
                      </li>
                      <li>
                        <strong>2. Augmentation:</strong> If <code>X &rarr; Y</code>, then <code>XZ &rarr; YZ</code> for any attribute set <code>Z</code>.
                        <div className="axiom-example">Example: If A &rarr; B, then AC &rarr; BC.</div>
                      </li>
                      <li>
                        <strong>3. Transitivity:</strong> If <code>X &rarr; Y</code> and <code>Y &rarr; Z</code>, then <code>X &rarr; Z</code>.
                        <div className="axiom-example">Example: If RollNo &rarr; CourseID and CourseID &rarr; Department, then RollNo &rarr; Department.</div>
                      </li>
                    </ul>

                    <h4 className="content-subheading">Secondary Derived Rules:</h4>
                    <div className="derived-rules-box">
                      <div>• <strong>Union Rule:</strong> If X &rarr; Y and X &rarr; Z, then X &rarr; YZ.</div>
                      <div>• <strong>Decomposition Rule:</strong> If X &rarr; YZ, then X &rarr; Y and X &rarr; Z.</div>
                      <div>• <strong>Pseudo-transitivity Rule:</strong> If X &rarr; Y and WY &rarr; Z, then WX &rarr; Z.</div>
                    </div>
                  </div>
                )}

                {activeConcept === 'closure' && (
                  <div>
                    <h3 className="content-heading">Attribute Closure (X⁺) Calculation</h3>
                    <p className="content-paragraph">
                      The <strong>Attribute Closure</strong> of an attribute set <code>X</code> under functional dependencies <code>F</code>, denoted as <code>X⁺</code>, is the complete set of all attributes that can be functionally determined by <code>X</code>.
                    </p>
                    <h4 className="content-subheading">Fixed-Point Closure Algorithm:</h4>
                    <div className="algorithm-steps">
                      <div className="algo-step-item">
                        <span className="algo-num">1</span>
                        <div><strong>Initialize:</strong> Set <code>Closure = X</code>.</div>
                      </div>
                      <div className="algo-step-item">
                        <span className="algo-num">2</span>
                        <div><strong>Scan & Expand:</strong> For each FD <code>(LHS &rarr; RHS)</code> in F, if <code>LHS &sube; Closure</code>, then <code>Closure = Closure &cup; RHS</code>.</div>
                      </div>
                      <div className="algo-step-item">
                        <span className="algo-num">3</span>
                        <div><strong>Fixed-Point Convergence:</strong> Repeat Step 2 until a complete iteration adds no new attributes (<code>added == false</code>).</div>
                      </div>
                      <div className="algo-step-item">
                        <span className="algo-num">4</span>
                        <div><strong>Superkey Criterion:</strong> If <code>X⁺ = R</code> (the entire set of attributes in the relation), then <code>X</code> is a <strong>Superkey</strong> for relation R.</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeConcept === 'keys' && (
                  <div>
                    <h3 className="content-heading">Candidate Keys Discovery & Search Space Pruning</h3>
                    <p className="content-paragraph">
                      A <strong>Candidate Key</strong> is a minimal superkey. This means:
                      1. Its closure determines the whole relation (<code>K⁺ = R</code>), AND
                      2. No proper subset of <code>K</code> can determine <code>R</code> (Minimality).
                    </p>

                    <h4 className="content-subheading">Relational Theory Pruning Strategy:</h4>
                    <div className="rules-grid">
                      <div className="rule-card">
                        <span className="rule-badge">Essential Attributes</span>
                        <p>Attributes that <strong>never appear on the RHS</strong> of any FD. Because no dependency can ever generate them, they <strong>MUST</strong> be part of every single candidate key!</p>
                      </div>
                      <div className="rule-card">
                        <span className="rule-badge">RHS-Only Attributes</span>
                        <p>Attributes that appear <strong>only on the RHS</strong>. They never determine any new attributes, so they can <strong>never</strong> be part of any minimal candidate key.</p>
                      </div>
                      <div className="rule-card">
                        <span className="rule-badge">Middle Attributes</span>
                        <p>Attributes appearing on both LHS and RHS. Subsets of middle attributes are tested in increasing order of size to guarantee minimality.</p>
                      </div>
                    </div>

                    <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: 'rgba(129, 140, 248, 0.1)', borderRadius: '8px', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
                      <strong>Prime Attributes:</strong> Any attribute that is part of <em>at least one</em> candidate key.<br/>
                      <strong>Non-Prime Attributes:</strong> Any attribute that does not appear in <em>any</em> candidate key.
                    </div>
                  </div>
                )}

                {activeConcept === 'forms' && (
                  <div>
                    <h3 className="content-heading">Normal Forms Hierarchy: 1NF &rarr; 2NF &rarr; 3NF &rarr; BCNF</h3>
                    <p className="content-paragraph">
                      Normal forms represent progressively stricter standards of relational database quality. Each level builds upon the previous: <code>BCNF &sub; 3NF &sub; 2NF &sub; 1NF</code>.
                    </p>

                    <div className="nf-summary-table">
                      <div className="nf-row">
                        <div className="nf-badge-cell text-emerald-400">1NF</div>
                        <div className="nf-desc-cell">
                          <strong>First Normal Form:</strong> All column values must be atomic (indivisible single values, no multivalued or repeating groups).
                        </div>
                      </div>
                      <div className="nf-row">
                        <div className="nf-badge-cell text-emerald-400">2NF</div>
                        <div className="nf-desc-cell">
                          <strong>Second Normal Form:</strong> Must be in 1NF and have <strong>No Partial Dependencies</strong>. No non-prime attribute may depend on a proper subset of any candidate key.
                        </div>
                      </div>
                      <div className="nf-row">
                        <div className="nf-badge-cell text-violet-400">3NF</div>
                        <div className="nf-desc-cell">
                          <strong>Third Normal Form:</strong> Must be in 2NF and have <strong>No Transitive Dependencies</strong>. For every non-trivial FD <code>X &rarr; Y</code>, either <strong>X is a Superkey</strong> OR <strong>Y is a Prime Attribute</strong>.
                        </div>
                      </div>
                      <div className="nf-row">
                        <div className="nf-badge-cell text-violet-400">BCNF</div>
                        <div className="nf-desc-cell">
                          <strong>Boyce-Codd Normal Form:</strong> Stricter version of 3NF. For every non-trivial FD <code>X &rarr; Y</code>, <strong>X MUST be a Superkey</strong>.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* SUBTAB 2: ANIMATED VIDEO */}
          {activeSubTab === 'video' && (
            <div className="video-section">
              <div className="video-header-info">
                <h3 className="content-heading">Animated & Educational Video Lecture</h3>
                <p className="content-paragraph">
                  Watch this comprehensive tutorial covering database normalization, functional dependency closures, candidate keys, and step-by-step normal form conversions (1NF to BCNF).
                </p>
              </div>

              <div className="video-container">
                <iframe 
                  className="responsive-iframe"
                  src="https://www.youtube-nocookie.com/embed/UrYLYV7WSHM?rel=0" 
                  title="Database Normalization Complete Tutorial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>

              <div className="video-meta-box">
                <div>
                  <strong>Topic Covered:</strong> Relational Database Normalization (1NF, 2NF, 3NF, BCNF)
                </div>
                <div style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                  Visual explanation showing why schema anomalies occur and how relational decomposition eliminates redundant data.
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: ACADEMIC REFERENCES */}
          {activeSubTab === 'references' && (
            <div className="references-section">
              <h3 className="content-heading">Academic & Research References</h3>
              <p className="content-paragraph">
                The following standard textbooks, foundational research publications, and educational platforms were referenced in developing the algorithms and educational modules for this project.
              </p>

              <div className="ref-category">
                <h4 className="ref-cat-title">📚 Standard Textbooks</h4>
                <ul className="ref-list">
                  <li>
                    <strong>Silberschatz, A., Korth, H. F., & Sudarshan, S.</strong> (2020). <em>Database System Concepts</em> (7th ed.). McGraw-Hill Education. (Chapters 7 & 8: Relational Database Design and Normalization).
                  </li>
                  <li>
                    <strong>Elmasri, R., & Navathe, S. B.</strong> (2016). <em>Fundamentals of Database Systems</em> (7th ed.). Pearson. (Chapters 14 & 15: Functional Dependencies and Normalization).
                  </li>
                  <li>
                    <strong>Ramakrishnan, R., & Gehrke, J.</strong> (2003). <em>Database Management Systems</em> (3rd ed.). McGraw-Hill. (Chapter 19: Schema Refinement and Normal Forms).
                  </li>
                </ul>
              </div>

              <div className="ref-category">
                <h4 className="ref-cat-title">📄 Foundational Research Papers</h4>
                <ul className="ref-list">
                  <li>
                    <strong>Codd, E. F.</strong> (1970). <em>"A Relational Model of Data for Large Shared Data Banks."</em> Communications of the ACM, 13(6), 377–387.
                  </li>
                  <li>
                    <strong>Codd, E. F.</strong> (1972). <em>"Further Normalization of the Data Base Relational Model."</em> Courant Computer Science Symposia Series 6: Data Base Systems, Prentice-Hall.
                  </li>
                  <li>
                    <strong>Boyce, R. F., & Codd, E. F.</strong> (1974). <em>"Recent Investigations in Relational Data Base Systems."</em> Proceedings of the IFIP Congress 74, 1017–1021.
                  </li>
                  <li>
                    <strong>Armstrong, W. W.</strong> (1974). <em>"Dependency Structures of Data Base Relationships."</em> Information Processing 74 (North-Holland), 580–583.
                  </li>
                </ul>
              </div>

              <div className="ref-category">
                <h4 className="ref-cat-title">🌐 Educational Portals & Online Materials</h4>
                <ul className="ref-list">
                  <li>
                    <strong>Stanford University InfoLab / Coursera:</strong> Prof. Jennifer Widom, <em>Databases: Relational Databases and SQL</em>.
                  </li>
                  <li>
                    <strong>Neso Academy:</strong> Video Series on <em>Database Management Systems & Normalization</em>.
                  </li>
                  <li>
                    <strong>GeeksforGeeks DBMS Portal:</strong> <em>Finding Attribute Closures, Candidate Keys, and Normal Forms in DBMS</em>.
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
