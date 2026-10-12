import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 Widescreen standard
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme Colors
    COLOR_BG = RGBColor(15, 23, 42)          # Deep Slate #0F172A
    COLOR_CARD = RGBColor(30, 41, 59)        # Slate #1E293B
    COLOR_BORDER = RGBColor(51, 65, 85)      # Slate Border #334155
    COLOR_PRIMARY = RGBColor(129, 140, 248)  # Indigo Light #818CF8
    COLOR_ACCENT = RGBColor(192, 132, 252)   # Violet Accent #C084FC
    COLOR_EMERALD = RGBColor(52, 211, 153)   # Emerald #34D399
    COLOR_WHITE = RGBColor(248, 250, 252)    # Text Light #F8FAFC
    COLOR_MUTED = RGBColor(148, 163, 184)    # Text Muted #94A3B8

    def apply_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_BG
        bg.line.fill.background()
        return bg

    def add_header(slide, title, category="DBMS NORMALIZATION & FD ANALYZER | DA1"):
        # Category label
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_PRIMARY

        # Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.7))
        tf_t = t_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(24)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_WHITE

    def add_card(slide, left, top, width, height, title=None, subtitle=None):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = COLOR_BORDER
        card.line.width = Pt(1.5)
        
        # Textbox inside
        tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), width - Inches(0.5), height - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        
        if title:
            p_t = tf.paragraphs[0]
            p_t.text = title
            p_t.font.size = Pt(16)
            p_t.font.bold = True
            p_t.font.color.rgb = COLOR_PRIMARY
            p_t.space_after = Pt(6)
            
        if subtitle:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle
            p_sub.font.size = Pt(12)
            p_sub.font.color.rgb = COLOR_MUTED
            p_sub.space_after = Pt(8)
            
        return tf

    # -------------------------------------------------------------
    # SLIDE 1: TITLE SLIDE
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    apply_background(slide1)
    
    # Title badge
    badge = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1), Inches(1.2), Inches(3.8), Inches(0.45))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(30, 27, 75)
    badge.line.color.rgb = COLOR_PRIMARY
    badge.line.width = Pt(1)
    tf_b = badge.text_frame
    p_b = tf_b.paragraphs[0]
    p_b.alignment = PP_ALIGN.CENTER
    p_b.text = "DATABASE MANAGEMENT SYSTEMS • DA1"
    p_b.font.size = Pt(11)
    p_b.font.bold = True
    p_b.font.color.rgb = COLOR_PRIMARY

    # Main title
    t_box = slide1.shapes.add_textbox(Inches(1), Inches(1.8), Inches(11.3), Inches(2.2))
    tf1 = t_box.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "Interactive Normalization &"
    p1.font.size = Pt(40)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_WHITE
    
    p2 = tf1.add_paragraph()
    p2.text = "Functional Dependency Analyzer"
    p2.font.size = Pt(40)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_ACCENT

    p3 = tf1.add_paragraph()
    p3.text = "A full-stack diagnostic environment for schema closure derivation, candidate key discovery, and normal form verification."
    p3.font.size = Pt(15)
    p3.font.color.rgb = COLOR_MUTED
    p3.space_before = Pt(14)

    # 3 Summary Cards at bottom
    c1 = add_card(slide1, Inches(1), Inches(4.7), Inches(3.5), Inches(1.8), "Armstrong Closures")
    p = c1.add_paragraph()
    p.text = "Fixed-point algorithmic calculation of X+ with visual step-by-step expansion timeline."
    p.font.size = Pt(12)
    p.font.color.rgb = COLOR_WHITE

    c2 = add_card(slide1, Inches(4.9), Inches(4.7), Inches(3.5), Inches(1.8), "Candidate Key Finder")
    p = c2.add_paragraph()
    p.text = "Pruned combinatorial search with Essential, RHS-only, and Middle attribute classification."
    p.font.size = Pt(12)
    p.font.color.rgb = COLOR_WHITE

    c3 = add_card(slide1, Inches(8.8), Inches(4.7), Inches(3.5), Inches(1.8), "Normal Form Diagnostics")
    p = c3.add_paragraph()
    p.text = "Automated compliance verification for 1NF, 2NF, 3NF, and BCNF with per-FD justification."
    p.font.size = Pt(12)
    p.font.color.rgb = COLOR_WHITE

    # -------------------------------------------------------------
    # SLIDE 2: PROBLEM UNDERSTANDING & REQUIREMENTS (Rubric 1)
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    apply_background(slide2)
    add_header(slide2, "Problem Statement & Requirements Understanding", "EVALUATION CRITERION 1 • 1 MARK")

    c1 = add_card(slide2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "The Core Challenge in RDBMS", "Why manual normalization fails")
    bullets1 = [
        ("High Computational Complexity", "Finding all candidate keys is NP-hard in the general case, leading to missed composite keys in exam and design settings."),
        ("Redundancy & Schema Anomalies", "Poorly normalized relations suffer from insertion, deletion, and update anomalies that compromise data integrity."),
        ("Human Calculation Errors", "Manual closure calculation is error-prone when schemas exceed 4 attributes or have multiple overlapping FDs."),
        ("Lack of Diagnostic Feedback", "Typical tools only output '3NF' or 'BCNF' without explaining exactly WHICH functional dependency caused the violation.")
    ]
    for title, desc in bullets1:
        p_t = c1.add_paragraph()
        p_t.text = f"• {title}: "
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = COLOR_PRIMARY
        p_t.space_before = Pt(8)
        p_d = c1.add_paragraph()
        p_d.text = f"   {desc}"
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = COLOR_WHITE

    c2 = add_card(slide2, Inches(6.9), Inches(1.8), Inches(5.6), Inches(4.8), "System Requirements & Objectives", "What our application delivers")
    bullets2 = [
        ("Flexible Schema & FD Parser", "Accepts arbitrary attribute names and dependency notations (->, =>, →) with real-time schema validation."),
        ("Explainable Step-by-Step Closures", "Visualizes each iteration of Armstrong's Axioms showing exactly which FD contributed new attributes."),
        ("Automated Candidate Key Discovery", "Accurately partitions attributes into Prime and Non-Prime subsets for precise schema diagnostics."),
        ("Granular Normal Form Auditing", "Tests every single dependency against formal 2NF, 3NF, and BCNF rules to deliver an actionable audit card.")
    ]
    for title, desc in bullets2:
        p_t = c2.add_paragraph()
        p_t.text = f"✔ {title}: "
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = COLOR_EMERALD
        p_t.space_before = Pt(8)
        p_d = c2.add_paragraph()
        p_d.text = f"   {desc}"
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = COLOR_WHITE

    # -------------------------------------------------------------
    # SLIDE 3: SYSTEM ARCHITECTURE & TECH STACK (Rubric 2 & 4)
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    apply_background(slide3)
    add_header(slide3, "System Architecture & Engineering Design", "TECHNICAL IMPLEMENTATION • 2 MARKS")

    # 4 horizontal architecture layers
    layers = [
        ("1. Presentation & Interaction Layer", "React 19 + Lucide Icons", "Handles reactive two-column UI, dark/light theme toggle, interactive attribute pill selectors (+A, +B), and live preview updates.", Inches(1.8)),
        ("2. State & Performance Layer", "Vite 8 + React useMemo Hooks", "Optimized recalculation pipeline with zero lag; memoized derivations ensure smooth updates upon each keystroke without re-rendering delays.", Inches(3.1)),
        ("3. Computational Math Engine", "src/utils/normalization.js", "Pure, decoupled JavaScript algorithmic core executing Armstrong's Axioms, closure calculations, power-set key searches, and normal form proofs.", Inches(4.4)),
        ("4. Automated Verification Suite", "CLI Engine (test-normalization.js)", "Independent automated test suite validating algorithm accuracy on classic exam problems, transitive loops, and edge cases.", Inches(5.7))
    ]

    for title, tech, desc, top in layers:
        card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top, Inches(11.7), Inches(1.1))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = COLOR_BORDER
        card.line.width = Pt(1)

        tb = slide3.shapes.add_textbox(Inches(1.0), top + Inches(0.08), Inches(11.3), Inches(0.95))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = f"{title}   |   "
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_PRIMARY

        run_tech = p1.add_run()
        run_tech.text = f"[{tech}]"
        run_tech.font.size = Pt(12)
        run_tech.font.bold = True
        run_tech.font.color.rgb = COLOR_ACCENT

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = COLOR_WHITE
        p2.space_before = Pt(3)

    # -------------------------------------------------------------
    # SLIDE 4: MODULE 1 - ATTRIBUTE CLOSURE ENGINE (Rubric 2)
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    apply_background(slide4)
    add_header(slide4, "Module 1: Attribute Closure (X⁺) Calculation", "CORE ALGORITHMIC IMPLEMENTATION")

    c1 = add_card(slide4, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Algorithm Formulation", "Fixed-Point Iteration on Armstrong's Axioms")
    p = c1.add_paragraph()
    p.text = "Mathematical Definition:"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = COLOR_PRIMARY

    p_eq = c1.add_paragraph()
    p_eq.text = "Given schema R and set of FDs F, the closure X⁺ is the maximal set of attributes functionally determined by X."
    p_eq.font.size = Pt(11.5)
    p_eq.font.color.rgb = COLOR_WHITE
    p_eq.space_before = Pt(4)

    steps = [
        ("Step 1: Initialization", "Set X⁺ = X. Record initial state in derivation timeline."),
        ("Step 2: Dependency Scan", "Iterate over all FDs (Y → Z) in F. Check if LHS Y ⊆ current X⁺."),
        ("Step 3: Expansion", "If Y ⊆ X⁺ and Z ⊄ X⁺, add Z to X⁺, mark state change, and log the applied rule."),
        ("Step 4: Fixed-Point Halt", "Repeat until a complete scan yields no new attributes (convergence).")
    ]
    for s_title, s_desc in steps:
        p_s = c1.add_paragraph()
        p_s.text = f"• {s_title}: "
        p_s.font.bold = True
        p_s.font.size = Pt(11.5)
        p_s.font.color.rgb = COLOR_EMERALD
        p_s.space_before = Pt(6)
        p_sd = c1.add_paragraph()
        p_sd.text = f"   {s_desc}"
        p_sd.font.size = Pt(11)
        p_sd.font.color.rgb = COLOR_MUTED

    c2 = add_card(slide4, Inches(6.9), Inches(1.8), Inches(5.6), Inches(4.8), "UI & Interactive Features", "Visualizing Armstrong's Axioms")
    ui_points = [
        ("Interactive Quick-Add Pills", "One-click pills (+A, +B, etc.) allow users to quickly toggle attributes in and out of the closure target."),
        ("Visual Step-by-Step Timeline", "Every single iteration generates a timeline step showing the exact FD applied and resulting expansion."),
        ("Fixed-Point Stabilization Alert", "Explicitly highlights when the fixed-point is reached and confirms algorithm termination."),
        ("Real-Time Reactive Updates", "Changing the schema or target immediately recalculates without reloading or blocking.")
    ]
    for title, desc in ui_points:
        p_t = c2.add_paragraph()
        p_t.text = f"✔ {title}"
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = COLOR_PRIMARY
        p_t.space_before = Pt(8)
        p_d = c2.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = COLOR_WHITE

    # -------------------------------------------------------------
    # SLIDE 5: MODULE 2 - CANDIDATE KEYS & CLASSIFICATION (Rubric 2 & 7)
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    apply_background(slide5)
    add_header(slide5, "Module 2: Candidate Key Discovery & Pruning", "COMBINATORIAL OPTIMIZATION")

    c1 = add_card(slide5, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Smart Search Space Pruning", "Avoiding Naive 2^N Exponential Checks")
    prune_rules = [
        ("Essential Attributes (Must-Have)", "Attributes that never appear on the RHS of any FD (or don't appear in F at all). Because no FD can generate them, they MUST be part of every candidate key!"),
        ("RHS-Only Attributes (Excluded)", "Attributes that appear ONLY on the RHS of FDs. They can never contribute new determinations; hence, they are strictly excluded from minimal keys."),
        ("Middle Attributes (Combinatorial Search)", "Attributes appearing on both LHS and RHS. The engine generates subsets of middle attributes and adds them to essential attributes."),
        ("Minimality Pruning", "Subsets are tested in ascending order of size. Any superset of an already discovered key is discarded immediately.")
    ]
    for title, desc in prune_rules:
        p_t = c1.add_paragraph()
        p_t.text = f"• {title}"
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = COLOR_PRIMARY
        p_t.space_before = Pt(6)
        p_d = c1.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = COLOR_WHITE

    c2 = add_card(slide5, Inches(6.9), Inches(1.8), Inches(5.6), Inches(4.8), "Attribute Classification & Output", "Prerequisite for Normal Form Analysis")
    out_points = [
        ("Prime Attributes (Emerald Badge)", "Attributes that belong to AT LEAST ONE candidate key. Crucial for verifying the 3NF condition (where RHS is prime)."),
        ("Non-Prime Attributes (Crimson Badge)", "Attributes that do not appear in ANY candidate key. Crucial for catching 2NF partial dependencies and 3NF transitive dependencies."),
        ("Candidate Key Cards", "Visual cards displaying each discovered minimal key with key icon and formatted set notation (e.g. {AB}, {BC})."),
        ("Interactive Calculation Derivation Path", "Collapsible accordion logging every tested subset closure and minimality verification.")
    ]
    for title, desc in out_points:
        p_t = c2.add_paragraph()
        p_t.text = f"✔ {title}"
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = COLOR_ACCENT
        p_t.space_before = Pt(8)
        p_d = c2.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = COLOR_WHITE

    # -------------------------------------------------------------
    # SLIDE 6: MODULE 3 - NORMAL FORM ANALYZER (Rubric 2 & 7)
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    apply_background(slide6)
    add_header(slide6, "Module 3: Normal Form Diagnostic Engine", "HIERARCHICAL VERIFICATION: 1NF → 2NF → 3NF → BCNF")

    # 3 Cards for the 3 Normal Forms checked
    nf_cards = [
        ("2NF (Second Normal Form)", "Eliminates Partial Dependencies", [
            "Rule: No non-prime attribute should depend on a proper subset of any candidate key.",
            "Engine Check: For each FD X → Y, if LHS X ⊂ Candidate Key K (proper subset) and Y contains non-prime attributes, 2NF is violated.",
            "Result: Prevents redundancy where non-key attributes depend on only part of a composite key."
        ], Inches(0.8)),
        ("3NF (Third Normal Form)", "Eliminates Transitive Dependencies", [
            "Rule: For every non-trivial FD X → Y, either X is a Superkey OR Y is a Prime Attribute.",
            "Engine Check: Evaluates (Y \\ X). If all attributes in (Y \\ X) are prime, 3NF holds even if X is not a superkey.",
            "Result: Guarantees lossless join and dependency preservation while minimizing anomalies."
        ], Inches(4.9)),
        ("BCNF (Boyce-Codd Normal Form)", "Strict Determinant Rule", [
            "Rule: For every non-trivial FD X → Y, X MUST be a Superkey.",
            "Engine Check: Computes closure X⁺. If X⁺ = R, BCNF is satisfied. If X⁺ ⊂ R, BCNF is violated.",
            "Result: The strictest normal form for functional dependencies; eliminates all FD-based redundancy."
        ], Inches(8.8))
    ]

    for title, sub, bullets, left in nf_cards:
        c = add_card(slide6, left, Inches(1.8), Inches(3.65), Inches(4.8), title, sub)
        for b in bullets:
            p = c.add_paragraph()
            p.text = f"• {b}"
            p.font.size = Pt(11)
            p.font.color.rgb = COLOR_WHITE
            p.space_before = Pt(8)

    # -------------------------------------------------------------
    # SLIDE 7: UI/UX & SYSTEM DESIGN (Rubric 3 & 4)
    # -------------------------------------------------------------
    slide7 = prs.slides.add_slide(blank_layout)
    apply_background(slide7)
    add_header(slide7, "Website Structure & UI/UX Design", "SYSTEM DESIGN • 1 MARK")

    c1 = add_card(slide7, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Modern UI/UX Philosophy", "Engineered for clarity and engagement")
    design_bullets = [
        ("Glassmorphism Aesthetic", "Curated HSL color palette, subtle backdrop blurs, ambient radial lighting, and dark/light mode toggle with CSS variables."),
        ("Two-Column Dashboard Grid", "Left column dedicated to relation management, FD input, and presets; right column dedicated to tabbed analytical outputs."),
        ("Micro-Interactions & Quick Actions", "Pill buttons (+A, +B), collapsible calculation paths, and responsive card hovers for effortless exploration."),
        ("Zero Page Reloads", "Instantaneous updates powered by React state memoization — change a character, and the entire normalization tree re-evaluates.")
    ]
    for title, desc in design_bullets:
        p_t = c1.add_paragraph()
        p_t.text = f"★ {title}: "
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = COLOR_PRIMARY
        p_t.space_before = Pt(6)
        p_d = c1.add_paragraph()
        p_d.text = f"   {desc}"
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = COLOR_WHITE

    c2 = add_card(slide7, Inches(6.9), Inches(1.8), Inches(5.6), Inches(4.8), "Educational Value & Documentation", "Built as a student & instructor workbench")
    doc_bullets = [
        ("Hero Normal Form Banner", "Top-level indicator prominently declaring the highest satisfied normal form with an executive explanation."),
        ("Granular Per-FD Report Cards", "Each functional dependency is evaluated individually with color-coded pass/fail badges for 2NF, 3NF, and BCNF."),
        ("Educational Reference Cards", "Bottom section embeds mathematical definitions, formal axioms, and satisfiability hierarchy (BCNF ⊂ 3NF ⊂ 2NF ⊂ 1NF)."),
        ("Ready-to-Use Exam Presets", "Includes standard university exam questions for instant one-click demonstration.")
    ]
    for title, desc in doc_bullets:
        p_t = c2.add_paragraph()
        p_t.text = f"✔ {title}: "
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = COLOR_EMERALD
        p_t.space_before = Pt(6)
        p_d = c2.add_paragraph()
        p_d.text = f"   {desc}"
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = COLOR_WHITE

    # -------------------------------------------------------------
    # SLIDE 8: TESTING & PROJECT PROGRESS (Rubric 6)
    # -------------------------------------------------------------
    slide8 = prs.slides.add_slide(blank_layout)
    apply_background(slide8)
    add_header(slide8, "Testing & Progressive Development", "TESTING & PROGRESS • 2 MARKS")

    c1 = add_card(slide8, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Automated Unit Test Suite", "CLI Execution via test-normalization.js")
    tests = [
        ("Test Case 1: Transitive Dependency", "R(A, B, C, D) | A → B, B → C, C → D\n→ Key: {A} | Result: 2NF Pass, 3NF Fail (Transitive dependency on non-prime)."),
        ("Test Case 2: Partial Dependency", "R(A, B, C, D) | AB → C, A → D\n→ Key: {AB} | Result: 2NF Fail (LHS {A} is proper subset determining non-prime D)."),
        ("Test Case 3: 3NF but not BCNF", "R(A, B, C) | AB → C, C → A\n→ Keys: {AB}, {BC} | Result: 3NF Pass (A is prime), BCNF Fail (C is not superkey)."),
        ("Test Case 4: Multiple Overlapping Keys", "R(A, B, C, D, E) | AB → C, C → D, D → B, D → E\n→ Verified all overlapping candidate keys and prime classification.")
    ]
    for t_name, t_desc in tests:
        p_t = c1.add_paragraph()
        p_t.text = f"✔ {t_name}"
        p_t.font.bold = True
        p_t.font.size = Pt(11.5)
        p_t.font.color.rgb = COLOR_EMERALD
        p_t.space_before = Pt(5)
        p_d = c1.add_paragraph()
        p_d.text = t_desc
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = COLOR_WHITE

    c2 = add_card(slide8, Inches(6.9), Inches(1.8), Inches(5.6), Inches(4.8), "Development Lifecycle & Progress", "Milestone-Driven Engineering Flow")
    milestones = [
        ("Milestone 1: Mathematical Engine & CLI", "Designed core closure and key search algorithms. Verified correctness using automated console test scripts before any UI coding."),
        ("Milestone 2: Reactive State Architecture", "Integrated engine with React 19 memoized hooks (useMemo) to ensure instant UI re-renders upon input changes without latency."),
        ("Milestone 3: Visual Derivation Timelines", "Built step-by-step expansion visualizers, collapsible accordions, and color-coded Prime/Non-Prime attribute tags."),
        ("Milestone 4: Diagnostic UX & Polish", "Engineered per-FD audit report cards, built-in exam presets, and responsive Dark/Light theme switching.")
    ]
    for m_title, m_desc in milestones:
        p_t = c2.add_paragraph()
        p_t.text = f"Phase {m_title}"
        p_t.font.bold = True
        p_t.font.size = Pt(11.5)
        p_t.font.color.rgb = COLOR_PRIMARY
        p_t.space_before = Pt(5)
        p_d = c2.add_paragraph()
        p_d.text = m_desc
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = COLOR_WHITE

    # -------------------------------------------------------------
    # SLIDE 9: CREATIVITY & INNOVATION (Rubric 7)
    # -------------------------------------------------------------
    slide9 = prs.slides.add_slide(blank_layout)
    apply_background(slide9)
    add_header(slide9, "Creativity & Key Innovations", "INNOVATION & EXCELLENCE • 2 MARKS")

    innovations = [
        ("1. Explainable AI / Algorithmic Transparency", "Rather than presenting a 'black-box' result, the system logs every micro-decision: which FD fired, which attribute was added, and why fixed-point convergence occurred.", Inches(0.8), Inches(1.8)),
        ("2. Mathematical Search-Space Pruning", "Replaced brute-force exponential iteration with relational theory optimizations: partitioning attributes into Essential (must-have), RHS-only (excluded), and Middle subsets.", Inches(6.9), Inches(1.8)),
        ("3. Actionable Per-FD Diagnostic Cards", "Instead of a generic 'Not in BCNF' error, the tool highlights the exact offending dependency and cites the violated condition (e.g. proper subset of key {AB}).", Inches(0.8), Inches(4.3)),
        ("4. Interactive One-Click Exam Testbed", "Integrated pre-loaded templates reflecting real-world university exam problems, allowing students and instructors to benchmark theoretical examples instantly.", Inches(6.9), Inches(4.3))
    ]

    for title, desc, left, top in innovations:
        c = add_card(slide9, left, top, Inches(5.6), Inches(2.3), title)
        p = c.add_paragraph()
        p.text = desc
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_WHITE
        p.space_before = Pt(4)

    # -------------------------------------------------------------
    # SLIDE 10: CONCLUSION & DEMONSTRATION SUMMARY
    # -------------------------------------------------------------
    slide10 = prs.slides.add_slide(blank_layout)
    apply_background(slide10)
    add_header(slide10, "Summary & Project Takeaways", "FINAL EVALUATION & CONCLUSION")

    c1 = add_card(slide10, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Project Impact Summary", "What was achieved")
    summary_pts = [
        ("100% Mathematically Rigorous", "Accurately derives Armstrong closures, minimal candidate keys, and normal forms without approximations."),
        ("Pedagogical Excellence", "Serves as an educational companion for DBMS students to visualize and learn schema normalization interactively."),
        ("Modern Web Architecture", "High performance, zero dependencies beyond React and icons, responsive, and aesthetically pleasing with dark/light themes."),
        ("Validated via Comprehensive Testing", "All core features backed by unit tests matching standard database benchmarks.")
    ]
    for title, desc in summary_pts:
        p_t = c1.add_paragraph()
        p_t.text = f"✔ {title}"
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = COLOR_EMERALD
        p_t.space_before = Pt(8)
        p_d = c1.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = COLOR_WHITE

    c2 = add_card(slide10, Inches(6.9), Inches(1.8), Inches(5.6), Inches(4.8), "Future Roadmap & Extension", "Potential evolutions")
    future_pts = [
        ("Lossless Join & Dependency Preservation Test", "Automated decomposition checking using Chase algorithm / tableau tests."),
        ("Synthesis Algorithm (3NF & BCNF)", "Automatically suggesting decomposed relations (R1, R2, ...) to achieve BCNF/3NF with minimal tables."),
        ("SQL DDL Generation", "One-click export of normalized schemas directly into CREATE TABLE DDL scripts with primary and foreign key constraints."),
        ("Exportable PDF Reports", "Generating formal PDF normalization audit certificates for database design documentation.")
    ]
    for title, desc in future_pts:
        p_t = c2.add_paragraph()
        p_t.text = f"★ {title}"
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = COLOR_ACCENT
        p_t.space_before = Pt(8)
        p_d = c2.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = COLOR_WHITE

    # Save presentation
    output_path = "Interactive_Normalization_and_FD_Analyzer_DA1.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_deck()
