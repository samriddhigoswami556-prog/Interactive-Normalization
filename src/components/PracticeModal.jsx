import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Timer, 
  RotateCcw, 
  BookOpen, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ChevronLeft,
  Filter, 
  Sparkles,
  ArrowRight,
  Maximize2,
  Bot,
  Cpu,
  Flag,
  Search,
  Award,
  BarChart2,
  RefreshCw,
  HelpCircle,
  Check
} from 'lucide-react';
import { QUIZ_QUESTIONS, PRACTICE_PROBLEMS, PREVIOUS_YEAR_QUESTIONS } from '../utils/practiceData';

export default function PracticeModal({ isOpen, onClose, onLoadProblem }) {
  // Main sub-tabs: 'ai-quiz' | 'problems' | 'pyqs'
  const [activeSubTab, setActiveSubTab] = useState('ai-quiz');
  
  // =========================================================================
  // SUB-TAB 1: AI ADAPTIVE QUIZ GENERATOR STATE
  // =========================================================================
  const [aiQuizStarted, setAiQuizStarted] = useState(false);
  const [aiQuestionCount, setAiQuestionCount] = useState(10); // 5 | 10 | 15 | 20
  const [aiDifficulty, setAiDifficulty] = useState('All'); // 'All' | 'Easy' | 'Medium' | 'Hard'
  const [aiTopic, setAiTopic] = useState('All');
  const [aiExamSource, setAiExamSource] = useState('All'); // 'All' | 'GATE' | 'UGC-NET' | 'ISRO'
  const [aiMode, setAiMode] = useState('test'); // 'test' (timed exam) | 'practice' (instant answer feedback)
  const [aiTimeLimitMinutes, setAiTimeLimitMinutes] = useState(15); // in minutes
  
  // Active quiz session states
  const [aiQuestions, setAiQuestions] = useState([]);
  const [aiCurrentIndex, setAiCurrentIndex] = useState(0);
  const [aiSelectedAnswers, setAiSelectedAnswers] = useState({}); // { [qId]: optionIndex }
  const [aiFlagged, setAiFlagged] = useState({}); // { [qId]: bool }
  const [aiSubmitted, setAiSubmitted] = useState(false);
  const [aiTimeLeft, setAiTimeLeft] = useState(900); // in seconds
  const [aiTimerActive, setAiTimerActive] = useState(false);
  const [aiRevealedPracticeExplanations, setAiRevealedPracticeExplanations] = useState({});

  // Full question pool for the AI generator (all questions that have 4 options)
  const fullQuestionPool = useMemo(() => {
    return [...QUIZ_QUESTIONS, ...PREVIOUS_YEAR_QUESTIONS].filter(q => q.options && q.options.length === 4);
  }, []);

  // AI Quiz Generator Function
  const handleGenerateAIQuiz = () => {
    let pool = [...fullQuestionPool];

    // Filter by topic if specified
    if (aiTopic !== 'All') {
      pool = pool.filter(q => q.topic.toLowerCase().includes(aiTopic.toLowerCase()));
    }

    // Filter by difficulty if specified
    if (aiDifficulty !== 'All') {
      pool = pool.filter(q => q.difficulty.toLowerCase() === aiDifficulty.toLowerCase());
    }

    // Filter by exam source if specified
    if (aiExamSource !== 'All') {
      pool = pool.filter(q => q.exam && q.exam.toLowerCase().includes(aiExamSource.toLowerCase()));
    }

    // Fallback if pool is too small: broaden to full pool
    if (pool.length < aiQuestionCount) {
      pool = [...fullQuestionPool];
    }

    // Shuffle pool using Fisher-Yates shuffle
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Select N questions
    const selected = shuffled.slice(0, aiQuestionCount);

    setAiQuestions(selected);
    setAiCurrentIndex(0);
    setAiSelectedAnswers({});
    setAiFlagged({});
    setAiSubmitted(false);
    setAiRevealedPracticeExplanations({});
    const totalSeconds = aiTimeLimitMinutes * 60;
    setAiTimeLeft(totalSeconds);
    setAiTimerActive(aiMode === 'test');
    setAiQuizStarted(true);
  };

  // Timer Effect for AI Timed Exam Mode
  useEffect(() => {
    let timer = null;
    if (isOpen && activeSubTab === 'ai-quiz' && aiQuizStarted && aiMode === 'test' && !aiSubmitted && aiTimerActive && aiTimeLeft > 0) {
      timer = setInterval(() => {
        setAiTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setAiSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, activeSubTab, aiQuizStarted, aiMode, aiSubmitted, aiTimerActive, aiTimeLeft]);

  // Format time display MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle option select
  const handleSelectOption = (questionId, optionIndex) => {
    if (aiSubmitted) return;
    setAiSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));

    if (aiMode === 'practice') {
      setAiRevealedPracticeExplanations(prev => ({
        ...prev,
        [questionId]: true
      }));
    }
  };

  const handleToggleFlag = (questionId) => {
    setAiFlagged(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Compute test scorecard metrics
  const aiScorecard = useMemo(() => {
    if (!aiQuestions.length) return { correct: 0, total: 0, percentage: 0, topicStats: {} };
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    const topicStats = {}; // { [topic]: { correct, total } }

    aiQuestions.forEach(q => {
      const userAns = aiSelectedAnswers[q.id];
      const isCorrect = userAns === q.correctIndex;

      const t = q.topic || 'General';
      if (!topicStats[t]) topicStats[t] = { correct: 0, total: 0 };
      topicStats[t].total++;

      if (userAns === undefined) {
        unattempted++;
      } else if (isCorrect) {
        correct++;
        topicStats[t].correct++;
      } else {
        wrong++;
      }
    });

    const percentage = Math.round((correct / aiQuestions.length) * 100);

    let appraisal = 'Keep Practicing';
    let appraisalClass = 'needs-work';
    if (percentage >= 85) {
      appraisal = 'GATE Topper Level (Outstanding!)';
      appraisalClass = 'master';
    } else if (percentage >= 70) {
      appraisal = 'Strong Mastery (GATE Competitive)';
      appraisalClass = 'proficient';
    } else if (percentage >= 50) {
      appraisal = 'Intermediate (Good Foundation)';
      appraisalClass = 'intermediate';
    }

    return {
      correct,
      wrong,
      unattempted,
      total: aiQuestions.length,
      percentage,
      appraisal,
      appraisalClass,
      topicStats
    };
  }, [aiQuestions, aiSelectedAnswers]);

  // =========================================================================
  // SUB-TAB 2: PRACTICE PROBLEMS STATE
  // =========================================================================
  const [problemFilter, setProblemFilter] = useState('All');
  const [revealedHints, setRevealedHints] = useState({});
  const [revealedSolutions, setRevealedSolutions] = useState({});

  const filteredProblems = useMemo(() => {
    if (problemFilter === 'All') return PRACTICE_PROBLEMS;
    return PRACTICE_PROBLEMS.filter(p => p.topic.toLowerCase().includes(problemFilter.toLowerCase()));
  }, [problemFilter]);

  const toggleHint = (id) => {
    setRevealedHints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSolution = (id) => {
    setRevealedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // =========================================================================
  // SUB-TAB 3: PREVIOUS YEAR QUESTIONS (PYQs - 52 Questions)
  // =========================================================================
  const [pyqSearchQuery, setPyqSearchQuery] = useState('');
  const [pyqExamFilter, setPyqExamFilter] = useState('All');
  const [pyqTopicFilter, setPyqTopicFilter] = useState('All');
  const [pyqDifficultyFilter, setPyqDifficultyFilter] = useState('All');
  const [revealedPyqSolutions, setRevealedPyqSolutions] = useState({});
  const [lightboxImage, setLightboxImage] = useState(null);

  const filteredPyqs = useMemo(() => {
    return PREVIOUS_YEAR_QUESTIONS.filter(item => {
      const qText = (item.question + ' ' + (item.exam || '') + ' ' + (item.topic || '') + ' ' + (item.year || '')).toLowerCase();
      const matchesSearch = !pyqSearchQuery || qText.includes(pyqSearchQuery.toLowerCase());
      const matchesExam = pyqExamFilter === 'All' || item.exam.toLowerCase().includes(pyqExamFilter.toLowerCase());
      const matchesTopic = pyqTopicFilter === 'All' || item.topic.toLowerCase().includes(pyqTopicFilter.toLowerCase());
      const matchesDiff = pyqDifficultyFilter === 'All' || item.difficulty.toLowerCase() === pyqDifficultyFilter.toLowerCase();
      return matchesSearch && matchesExam && matchesTopic && matchesDiff;
    });
  }, [pyqSearchQuery, pyqExamFilter, pyqTopicFilter, pyqDifficultyFilter]);

  const togglePyqSolution = (id) => {
    setRevealedPyqSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content modal-large practice-modal" onClick={e => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="modal-icon-badge">
              <GraduationCap size={22} className="text-violet-400" />
            </div>
            <div>
              <h2 className="modal-title">DBMS Academic Practice & AI Assessment Center</h2>
              <p className="modal-subtitle">
                Generate adaptive AI quizzes, solve step-by-step problems, and explore 50+ authentic GATE & Competitive Exam PYQs.
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Sub-Navigation */}
        <div className="modal-subnav">
          <button 
            className={`subnav-btn ${activeSubTab === 'ai-quiz' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('ai-quiz')}
          >
            <Bot size={16} className="text-violet-400" />
            <span>1. AI Quiz Generator</span>
            <span className="subnav-pill ai-tag">AI Powered</span>
          </button>
          
          <button 
            className={`subnav-btn ${activeSubTab === 'problems' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('problems')}
          >
            <BookOpen size={16} />
            <span>2. Step-by-Step Practice Problems</span>
            <span className="subnav-pill">{PRACTICE_PROBLEMS.length}</span>
          </button>

          <button 
            className={`subnav-btn ${activeSubTab === 'pyqs' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('pyqs')}
          >
            <ImageIcon size={16} />
            <span>3. Competitive Exam PYQs</span>
            <span className="subnav-pill highlight">{PREVIOUS_YEAR_QUESTIONS.length} Questions</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ maxHeight: '76vh', overflowY: 'auto' }}>
          
          {/* ========================================================================= */}
          {/* SUB-TAB 1: AI ADAPTIVE QUIZ GENERATOR                                     */}
          {/* ========================================================================= */}
          {activeSubTab === 'ai-quiz' && (
            <div className="practice-quiz-container">
              
              {/* STATE A: QUIZ GENERATOR CONFIGURATION DECK */}
              {!aiQuizStarted && (
                <div className="ai-quiz-config-card">
                  <div className="ai-generator-hero">
                    <div className="ai-icon-bubble">
                      <Sparkles size={28} className="text-violet-400" />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <h3 className="ai-hero-title">AI Adaptive Quiz & Mock Exam Generator</h3>
                        <span className="ai-generator-badge">Pool: {fullQuestionPool.length} Verified Problems</span>
                      </div>
                      <p className="ai-hero-sub">
                        Select your preferred exam criteria below. The AI generator will assemble a randomized question set sampled dynamically from our repository of GATE CS (2000–2024), UGC-NET, ISRO, and Academic problems.
                      </p>
                    </div>
                  </div>

                  {/* AI Config Grid */}
                  <div className="ai-config-grid">
                    
                    {/* 1. Question Count */}
                    <div className="ai-config-item">
                      <span className="ai-config-label">1. Number of Questions:</span>
                      <div className="ai-pill-selector">
                        {[5, 10, 15, 20].map(count => (
                          <button
                            key={count}
                            className={`ai-pill-btn ${aiQuestionCount === count ? 'active' : ''}`}
                            onClick={() => setAiQuestionCount(count)}
                          >
                            {count} Questions
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Target Difficulty */}
                    <div className="ai-config-item">
                      <span className="ai-config-label">2. Target Difficulty:</span>
                      <div className="ai-pill-selector">
                        {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
                          <button
                            key={diff}
                            className={`ai-pill-btn ${aiDifficulty === diff ? 'active' : ''}`}
                            onClick={() => setAiDifficulty(diff)}
                          >
                            {diff === 'All' ? 'Mixed (Balanced)' : diff}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Topic Focus */}
                    <div className="ai-config-item">
                      <span className="ai-config-label">3. Syllabus Topic Focus:</span>
                      <select
                        className="quiz-filter-select w-full"
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                      >
                        <option value="All">All Topics (Full DBMS Syllabus)</option>
                        <option value="Candidate Keys">Candidate Keys & Superkeys</option>
                        <option value="Normal">Normal Forms (1NF, 2NF, 3NF, BCNF)</option>
                        <option value="Functional Dependencies">Functional Dependencies & Closures</option>
                        <option value="Decomposition">Lossless Join & Dependency Preservation</option>
                        <option value="Double Hashing">Double Hashing & Collision Resolution</option>
                      </select>
                    </div>

                    {/* 4. Exam Source Focus */}
                    <div className="ai-config-item">
                      <span className="ai-config-label">4. Target Competitive Exam:</span>
                      <div className="ai-pill-selector">
                        {['All', 'GATE', 'UGC-NET', 'ISRO'].map(src => (
                          <button
                            key={src}
                            className={`ai-pill-btn ${aiExamSource === src ? 'active' : ''}`}
                            onClick={() => setAiExamSource(src)}
                          >
                            {src === 'All' ? 'All Exams' : src}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 5. Exam Mode & Timer */}
                    <div className="ai-config-item">
                      <span className="ai-config-label">5. Testing Mode:</span>
                      <div className="ai-pill-selector">
                        <button
                          className={`ai-pill-btn ${aiMode === 'test' ? 'active' : ''}`}
                          onClick={() => setAiMode('test')}
                        >
                          <Timer size={14} />
                          <span>Timed Mock Exam</span>
                        </button>
                        <button
                          className={`ai-pill-btn ${aiMode === 'practice' ? 'active' : ''}`}
                          onClick={() => setAiMode('practice')}
                        >
                          <Sparkles size={14} />
                          <span>Practice Mode (Instant Hints)</span>
                        </button>
                      </div>
                    </div>

                    {/* 6. Timer Limit (if timed mode) */}
                    {aiMode === 'test' && (
                      <div className="ai-config-item">
                        <span className="ai-config-label">6. Exam Time Limit:</span>
                        <div className="ai-pill-selector">
                          {[5, 10, 15, 20, 30].map(mins => (
                            <button
                              key={mins}
                              className={`ai-pill-btn ${aiTimeLimitMinutes === mins ? 'active' : ''}`}
                              onClick={() => setAiTimeLimitMinutes(mins)}
                            >
                              {mins} Mins
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Generate Button Bar */}
                  <div className="ai-generate-footer">
                    <div className="ai-stats-summary">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span>{fullQuestionPool.length} competitive questions ready • Random seed generation</span>
                    </div>

                    <button
                      className="ai-generate-btn"
                      onClick={handleGenerateAIQuiz}
                    >
                      <Sparkles size={18} />
                      <span>Generate AI Quiz ({aiQuestionCount} Questions)</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* STATE B: ACTIVE AI QUIZ SESSION (UNSUBMITTED) */}
              {aiQuizStarted && !aiSubmitted && (
                <div className="ai-active-quiz-wrapper">
                  
                  {/* Top Bar with Timer, Progress, and Actions */}
                  <div className="test-status-banner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {aiMode === 'test' ? (
                        <div className={`test-timer-badge ${aiTimeLeft < 120 ? 'pulse-danger' : ''}`}>
                          <Timer size={18} className="text-amber-400" />
                          <span className="test-timer-text">Time Left: {formatTime(aiTimeLeft)}</span>
                        </div>
                      ) : (
                        <div className="test-timer-badge practice">
                          <Sparkles size={16} className="text-emerald-400" />
                          <span className="test-timer-text">Practice Mode (Instant Feedback)</span>
                        </div>
                      )}

                      <span className="ai-badge-sm">AI Session Active</span>
                    </div>

                    <div className="test-progress-info">
                      Question {aiCurrentIndex + 1} of {aiQuestions.length}
                    </div>

                    {/* Quick Question Jumper Dots */}
                    <div className="test-nav-dots">
                      {aiQuestions.map((q, idx) => {
                        const isAnswered = aiSelectedAnswers[q.id] !== undefined;
                        const isFlagged = aiFlagged[q.id];
                        const isCurrent = idx === aiCurrentIndex;
                        return (
                          <button
                            key={q.id || idx}
                            className={`test-dot ${isCurrent ? 'active' : ''} ${isAnswered ? 'answered' : ''} ${isFlagged ? 'flagged' : ''}`}
                            onClick={() => setAiCurrentIndex(idx)}
                            title={`Jump to Question ${idx + 1}`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="dh-btn dh-btn-ghost dh-btn-sm"
                        onClick={handleGenerateAIQuiz}
                        title="Regenerate another random quiz"
                      >
                        <RefreshCw size={14} />
                        <span>Regenerate</span>
                      </button>

                      <button
                        className="dh-btn dh-btn-primary"
                        onClick={() => setAiSubmitted(true)}
                      >
                        <span>Submit Quiz</span>
                      </button>
                    </div>
                  </div>

                  {/* Active Question Display Card */}
                  {aiQuestions[aiCurrentIndex] && (() => {
                    const currentQ = aiQuestions[aiCurrentIndex];
                    const selectedOpt = aiSelectedAnswers[currentQ.id];
                    const isFlagged = aiFlagged[currentQ.id];
                    const isPracticeRevealed = aiMode === 'practice' && aiRevealedPracticeExplanations[currentQ.id];

                    return (
                      <div className="quiz-question-card">
                        <div className="quiz-q-header">
                          <div className="quiz-badges">
                            {currentQ.exam && <span className="pyq-exam-badge">{currentQ.exam} {currentQ.year || ''}</span>}
                            <span className="quiz-topic-pill">{currentQ.topic}</span>
                            <span className={`quiz-diff-pill ${currentQ.difficulty.toLowerCase()}`}>
                              {currentQ.difficulty}
                            </span>
                          </div>

                          <button
                            className={`flag-question-btn ${isFlagged ? 'flagged' : ''}`}
                            onClick={() => handleToggleFlag(currentQ.id)}
                            title="Flag question for review"
                          >
                            <Flag size={14} />
                            <span>{isFlagged ? 'Flagged' : 'Flag Question'}</span>
                          </button>
                        </div>

                        {/* Question Text */}
                        <div className="quiz-q-text">
                          <pre className="pyq-text-pre">{currentQ.question}</pre>
                        </div>

                        {/* Options List */}
                        <div className="quiz-options-list">
                          {currentQ.options.map((opt, optIdx) => {
                            const isSelected = selectedOpt === optIdx;
                            const isCorrectOpt = optIdx === currentQ.correctIndex;

                            let optClass = '';
                            if (aiMode === 'practice' && selectedOpt !== undefined) {
                              if (isCorrectOpt) optClass = 'correct';
                              else if (isSelected) optClass = 'wrong';
                            } else if (isSelected) {
                              optClass = 'selected';
                            }

                            return (
                              <button
                                key={optIdx}
                                className={`quiz-option-btn ${optClass}`}
                                onClick={() => handleSelectOption(currentQ.id, optIdx)}
                              >
                                <span className="option-indicator">
                                  {isSelected && <Check size={14} />}
                                </span>
                                <span className="option-text">{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Practice Mode Instant Explanation */}
                        {isPracticeRevealed && (
                          <div className="problem-solution-card" style={{ marginTop: '1.25rem' }}>
                            <div className="solution-tag">
                              <CheckCircle2 size={16} className="text-emerald-400" />
                              <span>Instant Explanation: Correct Answer is {currentQ.options[currentQ.correctIndex]}</span>
                            </div>
                            <pre className="solution-text">{currentQ.explanation || currentQ.solution}</pre>
                          </div>
                        )}

                        {/* Bottom Navigation */}
                        <div className="quiz-q-footer">
                          <button
                            className="dh-btn dh-btn-ghost"
                            onClick={() => setAiCurrentIndex(prev => Math.max(0, prev - 1))}
                            disabled={aiCurrentIndex === 0}
                          >
                            <ChevronLeft size={16} />
                            <span>Previous</span>
                          </button>

                          <div className="quiz-footer-status">
                            {selectedOpt !== undefined ? (
                              <span className="text-emerald-400 font-semibold text-xs">Answer Recorded</span>
                            ) : (
                              <span className="text-muted text-xs">Select an option</span>
                            )}
                          </div>

                          {aiCurrentIndex < aiQuestions.length - 1 ? (
                            <button
                              className="dh-btn dh-btn-primary"
                              onClick={() => setAiCurrentIndex(prev => Math.min(aiQuestions.length - 1, prev + 1))}
                            >
                              <span>Next</span>
                              <ChevronRight size={16} />
                            </button>
                          ) : (
                            <button
                              className="dh-btn dh-btn-primary"
                              onClick={() => setAiSubmitted(true)}
                            >
                              <span>Submit & Review Score</span>
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* STATE C: TEST SUBMITTED SCORECARD & REVIEW */}
              {aiQuizStarted && aiSubmitted && (
                <div className="quiz-results-card">
                  
                  {/* Hero Scorecard */}
                  <div className="ai-scorecard-hero">
                    <div className="ai-score-ring">
                      <span className="ai-score-num">{aiScorecard.percentage}%</span>
                      <span className="ai-score-sub">{aiScorecard.correct} of {aiScorecard.total} Correct</span>
                    </div>

                    <div className="ai-score-info">
                      <div className="ai-score-badge-row">
                        <span className={`ai-mastery-badge ${aiScorecard.appraisalClass}`}>
                          <Award size={16} />
                          <span>{aiScorecard.appraisal}</span>
                        </span>
                        <span className="ai-tag">AI Evaluation Complete</span>
                      </div>

                      <div className="ai-stats-row">
                        <div className="ai-stat-chip correct">
                          <CheckCircle2 size={16} />
                          <span>Correct: {aiScorecard.correct}</span>
                        </div>
                        <div className="ai-stat-chip wrong">
                          <XCircle size={16} />
                          <span>Wrong: {aiScorecard.wrong}</span>
                        </div>
                        <div className="ai-stat-chip unattempted">
                          <AlertCircle size={16} />
                          <span>Unanswered: {aiScorecard.unattempted}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Topic Mastery Breakdown */}
                  {Object.keys(aiScorecard.topicStats).length > 0 && (
                    <div className="ai-topic-breakdown">
                      <h4 className="topic-breakdown-title">
                        <BarChart2 size={16} className="text-violet-400" />
                        <span>Topic Mastery Breakdown:</span>
                      </h4>
                      <div className="topic-bars-grid">
                        {Object.entries(aiScorecard.topicStats).map(([topic, stat]) => {
                          const pct = Math.round((stat.correct / stat.total) * 100);
                          return (
                            <div className="topic-bar-item" key={topic}>
                              <div className="topic-bar-meta">
                                <span className="topic-name">{topic}</span>
                                <span className="topic-pct">{pct}% ({stat.correct}/{stat.total})</span>
                              </div>
                              <div className="topic-progress-bg">
                                <div className="topic-progress-fill" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Retake & Actions */}
                  <div className="quiz-result-actions" style={{ marginBottom: '2rem' }}>
                    <button className="dh-btn dh-btn-primary" onClick={handleGenerateAIQuiz}>
                      <RotateCcw size={16} />
                      <span>Generate New Random AI Quiz</span>
                    </button>
                    <button className="dh-btn dh-btn-ghost" onClick={() => setAiQuizStarted(false)}>
                      <span>Configure New Quiz Parameters</span>
                    </button>
                    <button className="dh-btn dh-btn-ghost text-violet-400" onClick={() => setActiveSubTab('pyqs')}>
                      <span>Browse 52+ Competitive PYQs</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Full Question Review */}
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    Comprehensive Question-by-Question Solution Review:
                  </h4>
                  <div className="quiz-review-list">
                    {aiQuestions.map((q, qIdx) => {
                      const userAns = aiSelectedAnswers[q.id];
                      const isCorrect = userAns === q.correctIndex;
                      const wasAttempted = userAns !== undefined;

                      return (
                        <div className={`quiz-review-card ${isCorrect ? 'correct-border' : wasAttempted ? 'wrong-border' : 'unattempted-border'}`} key={q.id || qIdx}>
                          <div className="review-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span className="review-q-num">Q{qIdx + 1}</span>
                              {q.exam && <span className="pyq-exam-badge">{q.exam}</span>}
                              <span className="quiz-topic-pill">{q.topic}</span>
                            </div>

                            <div className="review-status-tag">
                              {isCorrect ? (
                                <span className="badge-pass"><CheckCircle2 size={14} /> Correct (+1)</span>
                              ) : wasAttempted ? (
                                <span className="badge-fail"><XCircle size={14} /> Incorrect (0)</span>
                              ) : (
                                <span className="badge-skip"><AlertCircle size={14} /> Unattempted</span>
                              )}
                            </div>
                          </div>

                          <div className="review-q-text">
                            <pre className="pyq-text-pre">{q.question}</pre>
                          </div>

                          <div className="review-options">
                            {q.options.map((opt, optIdx) => {
                              const isThisCorrect = optIdx === q.correctIndex;
                              const isThisUserAns = optIdx === userAns;

                              return (
                                <div 
                                  key={optIdx} 
                                  className={`review-opt-item ${isThisCorrect ? 'correct-highlight' : isThisUserAns ? 'wrong-highlight' : ''}`}
                                >
                                  <span className="review-opt-indicator">
                                    {isThisCorrect && '✓ Official Answer'}
                                    {isThisUserAns && !isThisCorrect && '✗ Your Choice'}
                                  </span>
                                  <span>{opt}</span>
                                </div>
                              );
                            })}
                          </div>

                          <div className="problem-solution-card" style={{ marginTop: '0.75rem' }}>
                            <div className="solution-tag">
                              <CheckCircle2 size={15} className="text-emerald-400" />
                              <span>Derivation & Proof:</span>
                            </div>
                            <pre className="solution-text">{q.explanation || q.solution}</pre>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-TAB 2: STEP-BY-STEP PRACTICE PROBLEMS                                 */}
          {/* ========================================================================= */}
          {activeSubTab === 'problems' && (
            <div className="practice-problems-container">
              {/* Filter Bar */}
              <div className="problems-top-bar">
                <div className="problems-filter-group">
                  <span className="quiz-filter-label">Filter by Topic:</span>
                  <select 
                    className="quiz-filter-select"
                    value={problemFilter}
                    onChange={(e) => setProblemFilter(e.target.value)}
                  >
                    <option value="All">All Topics ({PRACTICE_PROBLEMS.length})</option>
                    <option value="Closure">Closures & Keys</option>
                    <option value="Candidate">Candidate Keys & Primes</option>
                    <option value="Normal">Normal Forms</option>
                    <option value="Double Hashing">Double Hashing</option>
                  </select>
                </div>
              </div>

              {/* Problems List */}
              <div className="problems-list">
                {filteredProblems.map((prob) => {
                  const isHintRevealed = revealedHints[prob.id];
                  const isSolutionRevealed = revealedSolutions[prob.id];

                  return (
                    <div className="problem-card" key={prob.id}>
                      <div className="problem-card-header">
                        <div className="problem-badges">
                          <span className="problem-id-tag">{prob.id.toUpperCase()}</span>
                          <span className="quiz-topic-pill">{prob.topic}</span>
                          <span className={`quiz-diff-pill ${prob.difficulty.toLowerCase()}`}>
                            {prob.difficulty}
                          </span>
                        </div>
                        
                        {onLoadProblem && (
                          <button 
                            className="dh-btn dh-btn-ghost dh-btn-sm"
                            onClick={() => {
                              onLoadProblem(prob);
                              onClose();
                            }}
                            title="Load schema into visual workbench"
                          >
                            <span>Load into Analyzer</span>
                            <ArrowRight size={13} />
                          </button>
                        )}
                      </div>

                      <h3 className="problem-title">{prob.title}</h3>
                      <p className="problem-scenario">{prob.scenario}</p>

                      <div className="problem-schema-box">
                        <div className="schema-row">
                          <span className="schema-lbl">Attributes: </span>
                          <code>{prob.attributes}</code>
                        </div>
                        <div className="schema-row">
                          <span className="schema-lbl">Functional Dependencies: </span>
                          <code style={{ whiteSpace: 'pre-line' }}>{prob.fds}</code>
                        </div>
                      </div>

                      <div className="problem-question-box">
                        <strong>Task Question: </strong>
                        <span>{prob.question}</span>
                      </div>

                      <div className="problem-actions">
                        <button 
                          className="problem-action-btn hint-btn"
                          onClick={() => toggleHint(prob.id)}
                        >
                          <Sparkles size={15} />
                          <span>{isHintRevealed ? 'Hide Conceptual Hint' : '💡 Reveal Conceptual Hint'}</span>
                        </button>

                        <button 
                          className="problem-action-btn solution-btn"
                          onClick={() => toggleSolution(prob.id)}
                        >
                          {isSolutionRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                          <span>{isSolutionRevealed ? 'Hide Step-by-Step Solution' : '📖 View Step-by-Step Solution'}</span>
                        </button>
                      </div>

                      {isHintRevealed && (
                        <div className="problem-hint-card">
                          <span className="hint-tag">💡 Conceptual Hint:</span>
                          <p>{prob.hint}</p>
                        </div>
                      )}

                      {isSolutionRevealed && (
                        <div className="problem-solution-card">
                          <div className="solution-tag">
                            <CheckCircle2 size={16} className="text-emerald-400" />
                            <span>Complete Mathematical Solution & Proof</span>
                          </div>
                          <pre className="solution-text">{prob.solution}</pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-TAB 3: PREVIOUS YEAR QUESTIONS (PYQs - 52 Questions)                  */}
          {/* ========================================================================= */}
          {activeSubTab === 'pyqs' && (
            <div className="practice-pyqs-container">
              {/* PYQ Top Header */}
              <div className="pyq-top-banner">
                <div className="pyq-banner-left">
                  <ImageIcon size={22} className="text-violet-400" />
                  <div>
                    <h4 className="pyq-banner-title">
                      Official Competitive Exam PYQs ({PREVIOUS_YEAR_QUESTIONS.length} Questions)
                    </h4>
                    <p className="pyq-banner-desc">
                      Authentic GATE CS (2000–2024), UGC-NET, ISRO, NIELIT, and University examination problems with official answer keys, full step-by-step mathematical proofs, and derivations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Filtering & Search Controls */}
              <div className="pyq-filters-bar">
                {/* Search Box */}
                <div className="pyq-search-box">
                  <Search size={15} className="search-icon" />
                  <input
                    type="text"
                    className="pyq-search-input"
                    placeholder="Search 52 PYQs by keyword (e.g. BCNF, 2024, cyclic, candidate key)..."
                    value={pyqSearchQuery}
                    onChange={(e) => setPyqSearchQuery(e.target.value)}
                  />
                  {pyqSearchQuery && (
                    <button className="clear-search-btn" onClick={() => setPyqSearchQuery('')}>&times;</button>
                  )}
                </div>

                <div className="pyq-filters-row">
                  <div className="pyq-filter-item">
                    <span className="quiz-filter-label">Exam:</span>
                    <select 
                      className="quiz-filter-select"
                      value={pyqExamFilter}
                      onChange={(e) => setPyqExamFilter(e.target.value)}
                    >
                      <option value="All">All Exams ({PREVIOUS_YEAR_QUESTIONS.length})</option>
                      <option value="GATE">GATE CS ({PREVIOUS_YEAR_QUESTIONS.filter(q => q.exam.toLowerCase().includes('gate')).length})</option>
                      <option value="UGC-NET">UGC-NET ({PREVIOUS_YEAR_QUESTIONS.filter(q => q.exam.toLowerCase().includes('ugc')).length})</option>
                      <option value="ISRO">ISRO CS ({PREVIOUS_YEAR_QUESTIONS.filter(q => q.exam.toLowerCase().includes('isro')).length})</option>
                      <option value="NIELIT">NIELIT ({PREVIOUS_YEAR_QUESTIONS.filter(q => q.exam.toLowerCase().includes('nielit')).length})</option>
                      <option value="University">University Exams ({PREVIOUS_YEAR_QUESTIONS.filter(q => q.exam.toLowerCase().includes('univ')).length})</option>
                    </select>
                  </div>

                  <div className="pyq-filter-item">
                    <span className="quiz-filter-label">Topic:</span>
                    <select 
                      className="quiz-filter-select"
                      value={pyqTopicFilter}
                      onChange={(e) => setPyqTopicFilter(e.target.value)}
                    >
                      <option value="All">All Topics</option>
                      <option value="Candidate">Candidate Keys & Superkeys</option>
                      <option value="Normal">Normal Forms (1NF - BCNF)</option>
                      <option value="Closures">Closures & Armstrong Axioms</option>
                      <option value="Lossless">Lossless Join & Decomposition</option>
                      <option value="Cover">Minimal / Canonical Cover</option>
                      <option value="Double Hashing">Double Hashing</option>
                    </select>
                  </div>

                  <div className="pyq-filter-item">
                    <span className="quiz-filter-label">Difficulty:</span>
                    <select 
                      className="quiz-filter-select"
                      value={pyqDifficultyFilter}
                      onChange={(e) => setPyqDifficultyFilter(e.target.value)}
                    >
                      <option value="All">All Difficulties</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div className="pyq-count-indicator">
                    Showing <strong>{filteredPyqs.length}</strong> of {PREVIOUS_YEAR_QUESTIONS.length}
                  </div>
                </div>
              </div>

              {/* PYQs Cards List */}
              <div className="pyq-cards-list">
                {filteredPyqs.map((pyq) => {
                  const isSolutionOpen = revealedPyqSolutions[pyq.id];

                  return (
                    <div className="pyq-card" key={pyq.id}>
                      <div className="pyq-card-top">
                        <div className="pyq-badge-row">
                          <span className="pyq-exam-badge">{pyq.exam} {pyq.year || ''}</span>
                          <span className="pyq-marks-badge">{pyq.marks}</span>
                          <span className="quiz-topic-pill">{pyq.topic}</span>
                          <span className={`quiz-diff-pill ${pyq.difficulty.toLowerCase()}`}>
                            {pyq.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="pyq-question-text">
                        <pre className="pyq-text-pre">{pyq.question}</pre>
                      </div>

                      {/* Display Options if present */}
                      {pyq.options && (
                        <div className="pyq-options-grid">
                          {pyq.options.map((opt, oIdx) => (
                            <div className="pyq-option-item" key={oIdx}>
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Question Paper Scan / Diagram if present */}
                      {pyq.imageUrl && (
                        <div className="pyq-image-container">
                          <div className="pyq-image-preview-wrapper">
                            <div className="pyq-image-header">
                              <span className="pyq-image-label">
                                <ImageIcon size={14} className="text-violet-400" />
                                <span>Official Exam Question Paper Scan</span>
                              </span>
                              <button 
                                className="dh-btn dh-btn-ghost dh-btn-sm"
                                onClick={() => setLightboxImage(pyq.imageUrl)}
                                title="View Fullscreen"
                              >
                                <Maximize2 size={13} />
                                <span>Fullscreen</span>
                              </button>
                            </div>

                            <div 
                              className="pyq-image-display"
                              onClick={() => setLightboxImage(pyq.imageUrl)}
                              title="Click to zoom image"
                            >
                              <img 
                                src={pyq.imageUrl} 
                                alt={`Question paper scan for ${pyq.exam}`} 
                                className="pyq-img"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Official Answer & Solution Toggle */}
                      <div className="pyq-solution-section">
                        <div className="pyq-answer-bar">
                          <span className="pyq-answer-label">Official Answer Key:</span>
                          <code className="pyq-answer-code">{pyq.correctAnswer}</code>
                        </div>

                        <button 
                          className="pyq-toggle-solution-btn"
                          onClick={() => togglePyqSolution(pyq.id)}
                        >
                          <span>{isSolutionOpen ? 'Hide Step-by-Step Derivation' : 'Show Step-by-Step Derivation & Solution'}</span>
                          <ChevronRight size={15} className={`chevron-icon ${isSolutionOpen ? 'rotate-90' : ''}`} />
                        </button>

                        {isSolutionOpen && (
                          <div className="pyq-solution-box">
                            <div className="solution-tag">
                              <CheckCircle2 size={15} className="text-emerald-400" />
                              <span>Official Verification & Academic Proof</span>
                            </div>
                            <pre className="pyq-solution-pre">{pyq.solution}</pre>
                            {pyq.notes && (
                              <div className="pyq-academic-note">
                                <strong>Exam Tip: </strong>{pyq.notes}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Lightbox Fullscreen Image Modal */}
      {lightboxImage && (
        <div className="lightbox-backdrop" onClick={() => setLightboxImage(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setLightboxImage(null)}>
              <X size={24} />
            </button>
            <img src={lightboxImage} alt="Fullscreen question preview" className="lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
}
