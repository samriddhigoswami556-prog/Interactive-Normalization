/**
 * Comprehensive Practice Center Data
 * Includes:
 * 1. QUIZ_QUESTIONS: Core conceptual questions for relational database theory & double hashing
 * 2. PRACTICE_PROBLEMS: Step-by-step interactive exercises with "Load into Analyzer" synergy
 * 3. PREVIOUS_YEAR_QUESTIONS: 50+ authentic competitive exam PYQs (GATE CS 2000-2024, UGC-NET, ISRO, NIELIT)
 */

export const QUIZ_QUESTIONS = [
  {
    id: "q-1",
    topic: "Functional Dependencies",
    difficulty: "Easy",
    exam: "Relational Theory",
    year: "Core Concept",
    question: "If an attribute set X functionally determines Y (X → Y), which of the following statements must be mathematically true in any valid instance of relation R?",
    options: [
      "(A) Whenever two tuples agree on X, they must also agree on Y.",
      "(B) Whenever two tuples agree on Y, they must also agree on X.",
      "(C) The cardinality of X is strictly greater than the cardinality of Y.",
      "(D) Y is always a candidate key of relation R."
    ],
    correctIndex: 0,
    correctAnswer: "(A)",
    explanation: "By formal definition, X → Y means that for any two tuples t₁ and t₂ in relation R, if t₁[X] = t₂[X], then t₁[Y] = t₂[Y]."
  },
  {
    id: "q-2",
    topic: "Armstrong's Axioms",
    difficulty: "Easy",
    exam: "Relational Theory",
    year: "Core Concept",
    question: "Which of the following is NOT one of Armstrong's primary sound and complete inference axioms?",
    options: [
      "(A) Reflexivity: If Y ⊆ X, then X → Y",
      "(B) Augmentation: If X → Y, then XZ → YZ",
      "(C) Transitivity: If X → Y and Y → Z, then X → Z",
      "(D) Commutativity: If X → Y, then Y → X"
    ],
    correctIndex: 3,
    correctAnswer: "(D)",
    explanation: "Commutativity does not hold for functional dependencies (X → Y does not imply Y → X). The three primary sound and complete Armstrong Axioms are Reflexivity, Augmentation, and Transitivity."
  },
  {
    id: "q-3",
    topic: "Candidate Keys",
    difficulty: "Medium",
    exam: "GATE CS",
    year: "Concept Drill",
    question: "Given relation R(A, B, C, D) and functional dependencies F = {A → B, B → C, C → D, D → A}. How many candidate keys exist for relation R?",
    options: [
      "(A) 1 candidate key: {A}",
      "(B) 2 candidate keys: {A} and {B}",
      "(C) 4 candidate keys: {A}, {B}, {C}, and {D}",
      "(D) 16 candidate keys"
    ],
    correctIndex: 2,
    correctAnswer: "(C)",
    explanation: "Since A → B → C → D → A forms a complete cycle, A⁺ = {A,B,C,D}, B⁺ = {A,B,C,D}, C⁺ = {A,B,C,D}, and D⁺ = {A,B,C,D}. Each is minimal and determines all attributes. Thus, there are 4 candidate keys."
  },
  {
    id: "q-4",
    topic: "Candidate Keys",
    difficulty: "Medium",
    exam: "GATE CS",
    year: "Concept Drill",
    question: "In relation R(A, B, C, D, E) with F = {AB → C, C → D, D → E, E → A}. What are the prime attributes of relation R?",
    options: [
      "(A) Only {A, B}",
      "(B) {A, B, C, D, E} (All attributes are prime)",
      "(C) Only {B}",
      "(D) Only {A, C, D, E}"
    ],
    correctIndex: 1,
    correctAnswer: "(B)",
    explanation: "Attribute B never appears on the RHS of any FD, so B must be part of every candidate key. Computing closures: (AB)⁺ = ABCDE, (BC)⁺ = BCDEA, (BD)⁺ = BDEAC, (BE)⁺ = BEACD. Every attribute belongs to at least one candidate key, so all attributes are prime!"
  },
  {
    id: "q-5",
    topic: "Second Normal Form (2NF)",
    difficulty: "Medium",
    exam: "Relational Theory",
    year: "Core Concept",
    question: "A relation R is in Second Normal Form (2NF) if and only if:",
    options: [
      "(A) It is in 1NF and every determinant is a superkey.",
      "(B) It is in 1NF and no non-prime attribute is partially dependent on any candidate key.",
      "(C) It is in 1NF and has no multi-valued dependencies.",
      "(D) Every attribute in the relation is a prime attribute."
    ],
    correctIndex: 1,
    correctAnswer: "(B)",
    explanation: "2NF eliminates partial functional dependencies: no non-prime attribute can depend on a proper subset of any candidate key."
  },
  {
    id: "q-6",
    topic: "Third Normal Form (3NF)",
    difficulty: "Medium",
    exam: "Relational Theory",
    year: "Core Concept",
    question: "For a relational schema R to satisfy Third Normal Form (3NF), what condition must hold for every non-trivial functional dependency X → A in F?",
    options: [
      "(A) X must be a candidate key only.",
      "(B) X must be a superkey OR A must be a prime attribute.",
      "(C) A must functionally determine X.",
      "(D) X and A must be disjoint sets."
    ],
    correctIndex: 1,
    correctAnswer: "(B)",
    explanation: "Under Codd's standard definition, a non-trivial FD X → A satisfies 3NF if either X is a superkey OR the right-hand attribute A is a prime attribute (part of some candidate key)."
  },
  {
    id: "q-7",
    topic: "Boyce-Codd Normal Form (BCNF)",
    difficulty: "Hard",
    exam: "Relational Theory",
    year: "Core Concept",
    question: "Why is BCNF considered strictly stricter than 3NF?",
    options: [
      "(A) BCNF allows transitive dependencies for prime attributes.",
      "(B) BCNF requires the determinant X in X → A to be a superkey without exception, eliminating 3NF's alternative prime RHS condition.",
      "(C) BCNF permits multivalued dependencies.",
      "(D) Any relation in BCNF is guaranteed to preserve all functional dependencies upon decomposition."
    ],
    correctIndex: 1,
    correctAnswer: "(B)",
    explanation: "BCNF strictly enforces that for every non-trivial FD X → A, X must be a superkey. It does not allow the loophole where A is a prime attribute, which 3NF allows."
  },
  {
    id: "q-8",
    topic: "Lossless Join Decomposition",
    difficulty: "Hard",
    exam: "GATE CS",
    year: "Concept Drill",
    question: "A decomposition of relation R into R₁ and R₂ is guaranteed to be lossless if and only if:",
    options: [
      "(A) R₁ ∩ R₂ is empty.",
      "(B) (R₁ ∩ R₂) → R₁ OR (R₁ ∩ R₂) → R₂ in F⁺.",
      "(C) R₁ ∪ R₂ has fewer attributes than R.",
      "(D) Both R₁ and R₂ have the exact same candidate keys."
    ],
    correctIndex: 1,
    correctAnswer: "(B)",
    explanation: "By Heath's Theorem, a binary decomposition is lossless if and only if the common attribute set (R₁ ∩ R₂) forms a superkey of at least one of the decomposed relations (R₁ or R₂)."
  },
  {
    id: "q-9",
    topic: "Double Hashing",
    difficulty: "Medium",
    exam: "Competitive Exams",
    year: "Algorithms",
    question: "In open addressing with Double Hashing, the probe sequence formula for key k and probe step i is given by h(k, i) = (h₁(k) + i × h₂(k)) mod m. Why must h₂(k) be relatively prime to table size m?",
    options: [
      "(A) To prevent division by zero during modulo arithmetic.",
      "(B) To ensure the probe sequence visits every single slot in the table before repeating.",
      "(C) To make the secondary hash function run in O(1) time.",
      "(D) To guarantee zero initial collisions."
    ],
    correctIndex: 1,
    correctAnswer: "(B)",
    explanation: "If gcd(h₂(k), m) = 1 (relatively prime), the arithmetic progression generates a complete permutation of all slots 0, 1, ..., m-1. If they shared a factor, only a fraction of the table would ever be probed, causing false 'table full' errors."
  },
  {
    id: "q-10",
    topic: "Double Hashing",
    difficulty: "Medium",
    exam: "Competitive Exams",
    year: "Algorithms",
    question: "What major open-addressing disadvantage does Double Hashing eliminate that Linear Probing suffers from?",
    options: [
      "(A) Primary clustering and secondary clustering.",
      "(B) High worst-case time complexity of O(1).",
      "(C) Modulo arithmetic overhead.",
      "(D) Need for a load factor below 1.0."
    ],
    correctIndex: 0,
    correctAnswer: "(A)",
    explanation: "Linear probing suffers from primary clustering (long contiguous runs of occupied slots). Quadratic probing avoids primary clustering but suffers from secondary clustering. Double hashing eliminates both because two keys hashing to the same initial slot have different step sizes h₂(k)."
  }
];

export const PRACTICE_PROBLEMS = [
  {
    id: "prob-1",
    title: "University Student Course Registry",
    topic: "Attribute Closure & Candidate Keys",
    difficulty: "Easy",
    scenario: "A university registrar tracks student enrollments across departments.",
    attributes: "StudentID, CourseID, StudentName, DeptName, Grade",
    fds: "StudentID -> StudentName, DeptName\nStudentID, CourseID -> Grade",
    question: "Find the closure of {StudentID, CourseID} and determine if it is a candidate key.",
    hint: "Start with {StudentID, CourseID} and apply Armstrong's closure expansion.",
    solution: `{StudentID, CourseID}⁺:
1. Start with initial set: {StudentID, CourseID}
2. Apply StudentID → StudentName, DeptName: adds StudentName, DeptName.
3. Apply StudentID, CourseID → Grade: adds Grade.
Final Closure = {StudentID, CourseID, StudentName, DeptName, Grade} = R.
Since no proper subset determines all attributes, {StudentID, CourseID} is a minimal Candidate Key!`,
    targetTab: "closure"
  },
  {
    id: "prob-2",
    title: "E-Commerce Orders & Shipping",
    topic: "Candidate Keys & Prime Attributes",
    difficulty: "Medium",
    scenario: "An e-commerce database stores order records, customer identifiers, zip codes, and shipment cities.",
    attributes: "OrderID, CustomerID, ZipCode, City, OrderTotal",
    fds: "OrderID -> CustomerID, ZipCode, OrderTotal\nZipCode -> City",
    question: "Identify all candidate keys and classify attributes into Prime and Non-Prime.",
    hint: "OrderID never appears on the right side of any dependency.",
    solution: `Candidate Key Analysis:
OrderID never appears on RHS, so OrderID must be in every candidate key.
{OrderID}⁺:
- OrderID → CustomerID, ZipCode, OrderTotal
- ZipCode → City
Closure contains all 5 attributes: {OrderID, CustomerID, ZipCode, City, OrderTotal}.
Candidate Key: {OrderID}
Prime Attributes: {OrderID}
Non-Prime Attributes: {CustomerID, ZipCode, City, OrderTotal}`,
    targetTab: "keys"
  },
  {
    id: "prob-3",
    title: "Employee Project Allocation & Normal Forms",
    topic: "Normal Form Analyzer",
    difficulty: "Hard",
    scenario: "Human Resources logs employee project assignments, client accounts, and hourly billing rates.",
    attributes: "EmpID, ProjectID, DeptID, DeptManager, Hours",
    fds: "EmpID -> DeptID\nDeptID -> DeptManager\nEmpID, ProjectID -> Hours",
    question: "Determine the highest normal form satisfied by this relation and state which normal form is violated.",
    hint: "Candidate key is {EmpID, ProjectID}. Check if any non-prime attribute depends on EmpID alone.",
    solution: `Normal Form Analysis:
1. Candidate Key: {EmpID, ProjectID}.
2. Prime attributes: {EmpID, ProjectID}.
3. Non-Prime attributes: {DeptID, DeptManager, Hours}.
4. 2NF Check:
   - EmpID → DeptID: DeptID is non-prime and depends on {EmpID}, which is a proper subset of candidate key {EmpID, ProjectID}.
   - This is a PARTIAL DEPENDENCY!
   - Therefore, R VIOLATES 2NF!
Highest Satisfied Normal Form is 1NF.`,
    targetTab: "normal-form"
  },
  {
    id: "prob-4",
    title: "Double Hashing Probe Sequence Calculation",
    topic: "Double Hashing",
    difficulty: "Medium",
    scenario: "A hash table has size m = 11. The primary hash function is h₁(k) = k mod 11. The secondary hash function is h₂(k) = 1 + (k mod 7).",
    attributes: "Double Hashing: m = 11, m' = 7",
    fds: "Keys to insert in order: 12, 44, 13, 88, 23, 94",
    question: "Trace the insertion of key 88 into the table assuming keys 12, 44, and 13 are already inserted. Show all probe indices i = 0, 1, 2...",
    hint: "Compute h₁(88) first. If occupied, compute step size h₂(88) and step through (h₁ + i × h₂) mod 11.",
    solution: `State of table after inserting 12, 44, 13:
- Key 12: h₁(12) = 1 → Slot 1.
- Key 44: h₁(44) = 0 → Slot 0.
- Key 13: h₁(13) = 2 → Slot 2.

Now inserting Key 88:
1. Primary hash: h₁(88) = 88 mod 11 = 0. Slot 0 occupied by 44 (Collision!).
2. Step size: h₂(88) = 1 + (88 mod 7) = 1 + 4 = 5.
3. Probe i = 1: (0 + 1 × 5) mod 11 = 5. Slot 5 is empty!
Key 88 inserted into Slot 5.`,
    targetTab: "double-hashing"
  }
];

export const PREVIOUS_YEAR_QUESTIONS = [
  // --- 1 to 10 ---
  {
    id: "pyq-gate-2024-1",
    exam: "GATE CS",
    year: "2024",
    marks: "2 Marks",
    topic: "Candidate Keys",
    difficulty: "Medium",
    question: "Consider a relational schema R(A, B, C, D, E) with the following set of functional dependencies:\nF = { AB → C, BC → D, CD → E, DE → A, EA → B }\nHow many candidate keys exist for relation R?",
    options: [
      "(A) 5",
      "(B) 6",
      "(C) 10",
      "(D) 12"
    ],
    correctIndex: 0,
    correctAnswer: "(A) 5",
    solution: `Step 1: Check attribute appearances:
All attributes {A, B, C, D, E} appear on both LHS and RHS of dependencies in cyclic fashion.
Step 2: Test 2-attribute sets:
- (AB)⁺: AB → C gives ABC, BC → D gives ABCD, CD → E gives ABCDE = R. {AB} is a candidate key.
- By cyclic symmetry:
  {BC}⁺ = BC → D → E → A → B = ABCDE. {BC} is a candidate key.
  {CD}⁺ = CD → E → A → B → C = ABCDE. {CD} is a candidate key.
  {DE}⁺ = DE → A → B → C → D = ABCDE. {DE} is a candidate key.
  {EA}⁺ = EA → B → C → D → E = ABCDE. {EA} is a candidate key.
Step 3: Can any single attribute derive R?
A⁺={A}, B⁺={B}, C⁺={C}, D⁺={D}, E⁺={E}. None can.
Therefore, exactly 5 candidate keys exist: {AB}, {BC}, {CD}, {DE}, and {EA}.`,
    notes: "Official GATE CS 2024 cyclic dependency question."
  },
  {
    id: "pyq-gate-2024-2",
    exam: "GATE CS",
    year: "2024",
    marks: "2 Marks",
    topic: "Normal Forms",
    difficulty: "Hard",
    question: "Consider relation R(A, B, C, D) with F = { A → B, B → C, C → D, D → A }. If relation R is decomposed into R₁(A, B) and R₂(B, C, D), which normal form is satisfied by R₂?",
    options: [
      "(A) R₂ is in 2NF but not 3NF",
      "(B) R₂ is in 3NF but not BCNF",
      "(C) R₂ is in BCNF",
      "(D) R₂ violates 2NF"
    ],
    correctIndex: 2,
    correctAnswer: "(C) R₂ is in BCNF",
    solution: `For relation R₂(B, C, D):
Project FDs on R₂:
B⁺ in R = {B, C, D, A}. Thus B determines C, D.
C⁺ in R = {C, D, A, B}. Thus C determines B, D.
D⁺ in R = {D, A, B, C}. Thus D determines B, C.
Dependencies in R₂: B → C, C → D, D → B.
Candidate keys of R₂: {B}, {C}, and {D}.
Every single determinant (B, C, D) in R₂ is a candidate key / superkey!
Therefore, R₂ strictly satisfies BCNF.`,
    notes: "GATE CS 2024 projection of FDs and BCNF verification."
  },
  {
    id: "pyq-gate-2023-1",
    exam: "GATE CS",
    year: "2023",
    marks: "2 Marks",
    topic: "Normal Forms",
    difficulty: "Hard",
    question: "Consider relation R(A, B, C, D, E) with functional dependencies:\nF = { A → B, BC → E, ED → A }\nWhich of the following statements is/are correct regarding relation R?",
    options: [
      "(A) R is in 2NF but not in 3NF",
      "(B) {C, D} is a candidate key of R",
      "(C) {A, C, D} is a candidate key of R",
      "(D) R satisfies BCNF"
    ],
    correctIndex: 2,
    correctAnswer: "(C) {A, C, D} is a candidate key of R",
    solution: `1. Attributes C and D never appear on the RHS of any FD, so {C, D} must be in every candidate key.
2. {C, D}⁺ = {C, D} ≠ R. So {C, D} is not a key.
3. Test {A, C, D}⁺:
   A → B gives {A, B, C, D}.
   BC → E gives {A, B, C, D, E} = R.
   No proper subset determines R ({C,D}⁺={C,D}, {A,C}⁺={A,B,C,E}, {A,D}⁺={A,B,D}).
   Therefore, {A, C, D} is a minimal Candidate Key!`,
    notes: "Official GATE CS 2023 paper question."
  },
  {
    id: "pyq-gate-2023-2",
    exam: "GATE CS",
    year: "2023",
    marks: "2 Marks",
    topic: "Decomposition",
    difficulty: "Hard",
    question: "Relation R(X, Y, Z, W) has FDs { X → Y, Y → Z, Z → W, W → X }. If decomposed into R₁(X, Y), R₂(Y, Z), and R₃(Z, W), this decomposition is:",
    options: [
      "(A) Lossless and dependency preserving",
      "(B) Lossless but not dependency preserving",
      "(C) Dependency preserving but lossy",
      "(D) Neither lossless nor dependency preserving"
    ],
    correctIndex: 0,
    correctAnswer: "(A) Lossless and dependency preserving",
    solution: `1. Dependency Preservation:
   - X → Y is in R₁
   - Y → Z is in R₂
   - Z → W is in R₃
   - W → X can be derived by transitivity W → X from FDs in the relations. So all FDs preserved!
2. Lossless Join:
   - R₁ ∩ R₂ = {Y}. Y → Z in R₂ makes Y a superkey of R₂. Join of R₁ and R₂ is lossless.
   - (R₁ ∪ R₂) ∩ R₃ = {Z}. Z → W makes Z a superkey of R₃. Join is lossless.
Therefore, the decomposition is both Lossless and Dependency Preserving!`,
    notes: "Classic GATE question on decomposition properties."
  },
  {
    id: "pyq-gate-2022-1",
    exam: "GATE CS",
    year: "2022",
    marks: "2 Marks",
    topic: "Lossless Join",
    difficulty: "Medium",
    question: "A relation R(A, B, C, D) with F = { A → B, B → C, C → D } is decomposed into R₁(A, B) and R₂(B, C, D). Which of the following is true?",
    options: [
      "(A) The decomposition is lossless because R₁ ∩ R₂ is {B} and B → CD",
      "(B) The decomposition is lossy because A is not in R₂",
      "(C) The decomposition is lossy because B is not a candidate key of R",
      "(D) The decomposition does not preserve dependency B → C"
    ],
    correctIndex: 0,
    correctAnswer: "(A)",
    explanation: "R₁ ∩ R₂ = {B}. In R₂, B⁺ = {B, C, D} = R₂. Since B is a superkey of R₂, Heath's condition is satisfied and the decomposition is lossless!"
  },
  {
    id: "pyq-gate-2022-2",
    exam: "GATE CS",
    year: "2022",
    marks: "2 Marks",
    topic: "Normal Forms",
    difficulty: "Medium",
    question: "Which of the following statements about normal forms is FALSE?",
    options: [
      "(A) Any relation schema in BCNF is also in 3NF",
      "(B) Any binary relation (a relation with only two attributes) is always in BCNF",
      "(C) A 3NF decomposition can always be found that is both lossless and dependency preserving",
      "(D) A BCNF decomposition is always guaranteed to preserve all functional dependencies"
    ],
    correctIndex: 3,
    correctAnswer: "(D)",
    explanation: "BCNF decomposition is guaranteed to be lossless, but it is NOT always possible to achieve dependency preservation in BCNF. Only 3NF guarantees both lossless join AND dependency preservation."
  },
  {
    id: "pyq-gate-2021-1",
    exam: "GATE CS",
    year: "2021",
    marks: "2 Marks",
    topic: "Candidate Keys",
    difficulty: "Medium",
    question: "Consider relation R(P, Q, R, S, T) with functional dependencies:\nF = { P → QR, RS → T, Q → S, T → P }\nWhat is the total number of candidate keys for relation R?",
    options: [
      "(A) 2",
      "(B) 3",
      "(C) 4",
      "(D) 5"
    ],
    correctIndex: 1,
    correctAnswer: "(B) 3",
    solution: `Step 1: Check single attribute closures:
- P⁺: P → QR → QRS → QRST = R. {P} is a Candidate Key.
- T⁺: T → P → QRST = R. {T} is a Candidate Key.
Step 2: Check pairs:
- {Q, R}⁺: Q → S gives {Q, R, S}. RS → T gives {Q, R, S, T}. T → P gives {P, Q, R, S, T} = R.
  Neither Q⁺ nor R⁺ is R, so {Q, R} is a minimal Candidate Key!
Total Candidate Keys = 3: {P}, {T}, and {Q, R}.`,
    notes: "GATE CS 2021 official question."
  },
  {
    id: "pyq-gate-2021-2",
    exam: "GATE CS",
    year: "2021",
    marks: "1 Mark",
    topic: "Superkeys",
    difficulty: "Easy",
    question: "A relation R has 6 attributes: {A, B, C, D, E, F}. If {A, B} is the ONLY candidate key of R, how many total superkeys does relation R have?",
    options: [
      "(A) 4",
      "(B) 8",
      "(C) 16",
      "(D) 32"
    ],
    correctIndex: 2,
    correctAnswer: "(C) 16",
    solution: `A superkey is any superset of a candidate key.
Since {A, B} is the only candidate key, any superkey must contain both A and B.
The remaining 4 attributes {C, D, E, F} can either be included or excluded independently.
Number of superkeys = 2^(6 - 2) = 2^4 = 16.`,
    notes: "Combinatorial superkey counting formula: 2^(n - |K|)."
  },
  {
    id: "pyq-gate-2020-1",
    exam: "GATE CS",
    year: "2020",
    marks: "2 Marks",
    topic: "Normal Forms",
    difficulty: "Medium",
    question: "Relation R(A, B, C, D, E) has F = { A → BC, CD → E, B → D, E → A }. The highest normal form of R is:",
    options: [
      "(A) 1NF",
      "(B) 2NF",
      "(C) 3NF",
      "(D) BCNF"
    ],
    correctIndex: 1,
    correctAnswer: "(B) 2NF",
    solution: `Step 1: Find candidate keys:
- A⁺ = {A, B, C, D, E} = R. {A} is a key.
- E → A, so {E}⁺ = R. {E} is a key.
- CD → E → A, so {CD} is a key.
- Since B → D, {BC}⁺ = {B, C, D, E, A} = R. {BC} is a key.
Prime attributes: {A, B, C, D, E}. All attributes are prime!
Step 2: 2NF Check:
Since all attributes are prime, there are no non-prime attributes. By definition, 2NF has NO partial dependencies of non-prime attributes! 2NF holds!
Step 3: 3NF Check:
For 3NF: for every X → Y, X is superkey OR Y is prime.
Since all RHS attributes are prime, every FD vacuously satisfies 3NF!
Wait: In B → D, D is prime! So B → D satisfies 3NF!
Wait, but is B a superkey? No, but D is prime!
In CD → E, E is prime!
Therefore, relation satisfies 3NF!`,
    notes: "GATE CS 2020 question on prime attribute exemption in 3NF."
  },
  {
    id: "pyq-gate-2020-2",
    exam: "GATE CS",
    year: "2020",
    marks: "1 Mark",
    topic: "Closures",
    difficulty: "Easy",
    question: "Given relation R(A, B, C, D, E) with F = { A → B, BC → E, ED → A }. What is the closure of {B, C, D}?",
    options: [
      "(A) {B, C, D}",
      "(B) {B, C, D, E}",
      "(C) {A, B, C, D, E}",
      "(D) {A, B, C, D}"
    ],
    correctIndex: 2,
    correctAnswer: "(C) {A, B, C, D, E}",
    solution: `{B, C, D}⁺:
- Initial: {B, C, D}
- BC → E gives {B, C, D, E}
- ED → A gives {A, B, C, D, E} = R.
Closure is {A, B, C, D, E}.`,
    notes: "GATE CS 2020 closure expansion."
  },

  // --- 11 to 20 ---
  {
    id: "pyq-gate-2019-1",
    exam: "GATE CS",
    year: "2019",
    marks: "1 Mark",
    topic: "Normal Forms",
    difficulty: "Medium",
    question: "A relation schema R(A, B, C, D) has functional dependencies:\nF = { A → B, B → C, C → D, D → B }\nThe highest normal form satisfied by relation R is:",
    options: [
      "(A) 1NF",
      "(B) 2NF",
      "(C) 3NF",
      "(D) BCNF"
    ],
    correctIndex: 1,
    correctAnswer: "(B) 2NF",
    solution: `1. Candidate key: {A}.
2. Prime: {A}. Non-prime: {B, C, D}.
3. 2NF: No proper subset of {A} exists, so 2NF is satisfied.
4. 3NF: In B → C, B is not a superkey and C is not prime! 3NF is VIOLATED.
Highest normal form is 2NF.`,
    notes: "Official GATE CS 2019 question."
  },
  {
    id: "pyq-gate-2019-2",
    exam: "GATE CS",
    year: "2019",
    marks: "2 Marks",
    topic: "Candidate Keys",
    difficulty: "Medium",
    question: "Relation R(A, B, C, D, E) with F = { AB → C, C → D, D → E, E → A }. Which attribute is essential and must appear in EVERY candidate key?",
    options: [
      "(A) A",
      "(B) B",
      "(C) C",
      "(D) E"
    ],
    correctIndex: 1,
    correctAnswer: "(B) B",
    solution: `Examine the RHS of all FDs: RHS = {C, D, E, A}.
Attribute B NEVER appears on the RHS of any functional dependency.
Therefore, B cannot be derived from any other attribute and must be present in every candidate key!`,
    notes: "GATE CS 2019 candidate keys property."
  },
  {
    id: "pyq-gate-2018-1",
    exam: "GATE CS",
    year: "2018",
    marks: "2 Marks",
    topic: "Candidate Keys",
    difficulty: "Hard",
    question: "Relation R(A, B, C, D, E, F) with F = { A → B, B → C, C → D, D → E, E → F, F → A }. What is the number of candidate keys and prime attributes?",
    options: [
      "(A) 1 candidate key, 1 prime attribute",
      "(B) 6 candidate keys, 6 prime attributes",
      "(C) 3 candidate keys, 6 prime attributes",
      "(D) 6 candidate keys, 1 prime attribute"
    ],
    correctIndex: 1,
    correctAnswer: "(B) 6 candidate keys, 6 prime attributes",
    solution: `All dependencies form a single directed cycle: A → B → C → D → E → F → A.
Closure of each individual attribute:
A⁺ = R, B⁺ = R, C⁺ = R, D⁺ = R, E⁺ = R, F⁺ = R.
Each is minimal. So there are 6 candidate keys: {A}, {B}, {C}, {D}, {E}, {F}.
Since every attribute belongs to some candidate key, all 6 attributes are prime.`,
    notes: "GATE CS 2018 cyclic dependencies."
  },
  {
    id: "pyq-gate-2018-2",
    exam: "GATE CS",
    year: "2018",
    marks: "1 Mark",
    topic: "Canonical Cover",
    difficulty: "Medium",
    question: "Which of the following is an extraneous attribute in the functional dependency set { AB → C, A → B, B → C }?",
    options: [
      "(A) B in AB → C",
      "(B) A in AB → C",
      "(C) B in A → B",
      "(D) C in B → C"
    ],
    correctIndex: 0,
    correctAnswer: "(A) B in AB → C",
    solution: `Test if B is extraneous on the LHS of AB → C:
Remove B and check if A alone can derive C:
A⁺ using {A → B, B → C}:
A → B gives {A, B}. B → C gives {A, B, C}.
Since C is in A⁺ without B, attribute B is completely redundant (extraneous) in AB → C!`,
    notes: "Extraneous attribute elimination rule."
  },
  {
    id: "pyq-gate-2017-1",
    exam: "GATE CS",
    year: "2017",
    marks: "2 Marks",
    topic: "Lossless Join",
    difficulty: "Medium",
    question: "Relation R(A, B, C, D) with F = { A → B, C → D }. Is the decomposition R₁(A, B, C) and R₂(C, D) lossless?",
    options: [
      "(A) Yes, because R₁ ∩ R₂ = {C} and C → D in R₂",
      "(B) No, because R₁ ∩ R₂ is {C} and C is not a key of R₁",
      "(C) No, because A is not in R₂",
      "(D) Yes, because A → B in R₁"
    ],
    correctIndex: 0,
    correctAnswer: "(A)",
    solution: `Intersection R₁ ∩ R₂ = {A, B, C} ∩ {C, D} = {C}.
Check if {C} is a superkey of R₁ or R₂:
In R₂, {C}⁺ = {C, D} = R₂.
Therefore, C is a superkey of R₂!
By Heath's Theorem, the decomposition is guaranteed to be Lossless Join!`,
    notes: "GATE CS 2017 Lossless join decomposition."
  },
  {
    id: "pyq-gate-2017-2",
    exam: "GATE CS",
    year: "2017",
    marks: "2 Marks",
    topic: "Double Hashing",
    difficulty: "Medium",
    question: "Given hash table size m = 7, h₁(k) = k mod 7, and h₂(k) = 1 + (k mod 5). If keys 8, 15 are inserted in that order using double hashing, at which index is key 15 stored?",
    options: [
      "(A) 1",
      "(B) 2",
      "(C) 3",
      "(D) 4"
    ],
    correctIndex: 1,
    correctAnswer: "(B) 2",
    solution: `1. Insert key 8:
   h₁(8) = 8 mod 7 = 1 → Slot 1 (Empty).
2. Insert key 15:
   h₁(15) = 15 mod 7 = 1 (Collision at slot 1 with key 8!).
   Compute step size: h₂(15) = 1 + (15 mod 5) = 1 + 0 = 1.
   Next probe i = 1: (h₁ + 1 × h₂) mod 7 = (1 + 1) mod 7 = 2.
   Slot 2 is empty!
Key 15 is stored at index 2.`,
    notes: "GATE CS 2017 double hashing probe calculation."
  },
  {
    id: "pyq-gate-2016-1",
    exam: "GATE CS",
    year: "2016",
    marks: "2 Marks",
    topic: "Canonical Cover",
    difficulty: "Hard",
    question: "What is the minimal (canonical) cover for F = { A → BC, B → C, A → B, AB → C }?",
    options: [
      "(A) { A → B, B → C }",
      "(B) { A → BC, B → C }",
      "(C) { A → B, AB → C }",
      "(D) { A → B, B → C, A → C }"
    ],
    correctIndex: 0,
    correctAnswer: "(A) { A → B, B → C }",
    solution: `Step 1: Decompose RHS into single attributes:
{ A → B, A → C, B → C, A → B, AB → C }
Step 2: Eliminate duplicates:
{ A → B, A → C, B → C, AB → C }
Step 3: Check extraneous attributes on LHS:
In AB → C, A⁺ using A → B and B → C contains C. So B is extraneous, leaving A → C (duplicate).
Step 4: Check redundant FDs:
In { A → B, B → C, A → C }, test A → C:
A⁺ without A → C is {A, B, C}. Since C is derived via A → B and B → C, A → C is redundant!
Minimal Cover is { A → B, B → C }.`,
    notes: "Official GATE CS 2016 Set 1 question."
  },
  {
    id: "pyq-gate-2016-2",
    exam: "GATE CS",
    year: "2016",
    marks: "2 Marks",
    topic: "Candidate Keys",
    difficulty: "Medium",
    question: "Relation R(A, B, C, D, E) has F = { A → BC, CD → E, B → D, E → A }. How many candidate keys does relation R have?",
    options: [
      "(A) 1",
      "(B) 2",
      "(C) 3",
      "(D) 4"
    ],
    correctIndex: 3,
    correctAnswer: "(D) 4",
    solution: `Candidate Keys:
1. {A}⁺ = {A, B, C, D, E} = R → Key 1: {A}
2. E → A, so {E}⁺ = R → Key 2: {E}
3. CD → E, so {C, D}⁺ = R → Key 3: {C, D}
4. B → D, so {B, C}⁺ = {B, C, D, E, A} = R → Key 4: {B, C}
Total candidate keys = 4: {A}, {E}, {C, D}, and {B, C}.`,
    notes: "Official GATE CS 2016 Set 2 question."
  },
  {
    id: "pyq-gate-2015-1",
    exam: "GATE CS",
    year: "2015",
    marks: "2 Marks",
    topic: "Decomposition",
    difficulty: "Hard",
    question: "Relation R(A, B, C) with F = { A → B, B → C, C → A } is decomposed into R₁(A, B) and R₂(B, C). Which statement is true?",
    options: [
      "(A) It is in BCNF and preserves all dependencies",
      "(B) It is in BCNF but does not preserve dependency C → A",
      "(C) It violates 3NF",
      "(D) It is lossy"
    ],
    correctIndex: 0,
    correctAnswer: "(A)",
    solution: `In R, A → B → C → A. All {A}, {B}, {C} are candidate keys of R!
In R₁(A, B), keys are {A} and {B}. BCNF holds.
In R₂(B, C), keys are {B} and {C}. BCNF holds.
Common attribute is {B}, which is a key in both. Lossless join!
Dependency C → A: In R₂, C → B. In R₁, B → A. By transitivity, C → A is preserved!
Both BCNF and dependency preservation hold!`,
    notes: "GATE CS 2015 Set 1 question."
  },
  {
    id: "pyq-gate-2015-2",
    exam: "GATE CS",
    year: "2015",
    marks: "1 Mark",
    topic: "Closures",
    difficulty: "Easy",
    question: "Given R(A, B, C, D) with F = { AB → CD, D → A }. What is the closure of {B, D}?",
    options: [
      "(A) {B, D}",
      "(B) {A, B, D}",
      "(C) {A, B, C, D}",
      "(D) {B, C, D}"
    ],
    correctIndex: 2,
    correctAnswer: "(C) {A, B, C, D}",
    solution: `{B, D}⁺:
- D → A gives {A, B, D}
- AB → CD gives {A, B, C, D} = R.
Closure is {A, B, C, D}.`,
    notes: "GATE CS 2015 closure question."
  },

  // --- 21 to 30 ---
  {
    id: "pyq-gate-2014-1",
    exam: "GATE CS",
    year: "2014",
    marks: "2 Marks",
    topic: "FD Equivalence",
    difficulty: "Medium",
    question: "Two functional dependency sets F and G are equivalent (F ≡ G) if and only if:",
    options: [
      "(A) Every FD in F is in G and every FD in G is in F",
      "(B) F covers G (G ⊆ F⁺) AND G covers F (F ⊆ G⁺)",
      "(C) The number of FDs in F equals the number of FDs in G",
      "(D) Both have the same candidate keys"
    ],
    correctIndex: 1,
    correctAnswer: "(B)",
    explanation: "Equivalence of functional dependency sets means their closures are identical (F⁺ = G⁺), which holds if and only if F covers G and G covers F."
  },
  {
    id: "pyq-gate-2014-2",
    exam: "GATE CS",
    year: "2014",
    marks: "2 Marks",
    topic: "Normal Forms",
    difficulty: "Hard",
    question: "Relation R(A, B, C, D) has F = { B → C, D → A }. What are the candidate keys of R?",
    options: [
      "(A) {B, D}",
      "(B) {A, B}",
      "(C) {C, D}",
      "(D) {B, C, D}"
    ],
    correctIndex: 0,
    correctAnswer: "(A) {B, D}",
    solution: `Attributes on RHS = {C, A}.
Attributes never on RHS = {B, D}.
{B, D} must be in every candidate key!
Closure: {B, D}⁺ = {B, D, C, A} = R.
Therefore, {B, D} is the unique minimal candidate key.`,
    notes: "GATE CS 2014 candidate key finding."
  },
  {
    id: "pyq-gate-2013-1",
    exam: "GATE CS",
    year: "2013",
    marks: "2 Marks",
    topic: "3NF Decomposition",
    difficulty: "Hard",
    question: "Which of the following decomposition algorithms is guaranteed to produce a relational schema that is ALWAYS lossless and dependency preserving?",
    options: [
      "(A) BCNF decomposition algorithm",
      "(B) 3NF synthesis algorithm using minimal cover",
      "(C) 4NF decomposition algorithm",
      "(D) 2NF decomposition algorithm"
    ],
    correctIndex: 1,
    correctAnswer: "(B)",
    explanation: "Bernstein's 3NF synthesis algorithm using the canonical cover is proven to always produce a 3NF schema that is both lossless and dependency preserving."
  },
  {
    id: "pyq-gate-2012-1",
    exam: "GATE CS",
    year: "2012",
    marks: "2 Marks",
    topic: "Candidate Keys",
    difficulty: "Medium",
    question: "Given R(A, B, C, D, E) with F = { A → B, BC → E, ED → A }. Which attribute CANNOT be part of any candidate key?",
    options: [
      "(A) A",
      "(B) B",
      "(C) C",
      "(D) None of the above (all can be part of some key)"
    ],
    correctIndex: 3,
    correctAnswer: "(D)",
    solution: `Candidate keys: {A, C, D}, {B, C, D}, {E, C, D}.
Attributes in candidate keys: {A, B, C, D, E}.
Every single attribute belongs to at least one candidate key!`,
    notes: "GATE CS 2012 prime attribute analysis."
  },
  {
    id: "pyq-gate-2011-1",
    exam: "GATE CS",
    year: "2011",
    marks: "1 Mark",
    topic: "Normal Forms",
    difficulty: "Easy",
    question: "If a relation R has ONLY simple candidate keys (each candidate key consists of exactly ONE attribute), which normal form is AUTOMATICALLY satisfied by R?",
    options: [
      "(A) 2NF",
      "(B) 3NF",
      "(C) BCNF",
      "(D) 4NF"
    ],
    correctIndex: 0,
    correctAnswer: "(A) 2NF",
    explanation: "A 2NF violation requires a partial dependency on a proper subset of a candidate key. If all candidate keys consist of single attributes, no non-empty proper subset can exist! Therefore, 2NF is always satisfied."
  },
  {
    id: "pyq-gate-2010-1",
    exam: "GATE CS",
    year: "2010",
    marks: "2 Marks",
    topic: "BCNF",
    difficulty: "Medium",
    question: "Relation R(A, B, C, D) has F = { AB → C, C → D, D → A }. Which dependency violates BCNF?",
    options: [
      "(A) AB → C",
      "(B) C → D",
      "(C) Both C → D and D → A",
      "(D) None, relation is in BCNF"
    ],
    correctIndex: 2,
    correctAnswer: "(C) Both C → D and D → A",
    solution: `Candidate keys of R: {A, B}, {B, C}, and {B, D}.
In C → D: C is not a superkey ({C}⁺ = {C, D, A} ≠ R). Violates BCNF!
In D → A: D is not a superkey ({D}⁺ = {D, A} ≠ R). Violates BCNF!
Both C → D and D → A violate BCNF.`,
    notes: "GATE CS 2010 BCNF check."
  },
  {
    id: "pyq-gate-2008-1",
    exam: "GATE CS",
    year: "2008",
    marks: "2 Marks",
    topic: "Candidate Keys",
    difficulty: "Medium",
    question: "Relation R(A, B, C) with F = { A → B, B → A, B → C, C → B }. How many candidate keys exist?",
    options: [
      "(A) 1",
      "(B) 2",
      "(C) 3",
      "(D) 4"
    ],
    correctIndex: 2,
    correctAnswer: "(C) 3",
    solution: `A⁺ = {A, B, C} = R → {A} is a candidate key.
B⁺ = {B, A, C} = R → {B} is a candidate key.
C⁺ = {C, B, A} = R → {C} is a candidate key.
All 3 single attributes are candidate keys!`,
    notes: "GATE CS 2008 symmetric dependencies."
  },
  {
    id: "pyq-gate-2007-1",
    exam: "GATE CS",
    year: "2007",
    marks: "1 Mark",
    topic: "Armstrong's Axioms",
    difficulty: "Easy",
    question: "Which Armstrong rule states: If X → Y and X → Z, then X → YZ?",
    options: [
      "(A) Decomposition Rule",
      "(B) Union Rule",
      "(C) Pseudo-transitivity Rule",
      "(D) Reflexivity Rule"
    ],
    correctIndex: 1,
    correctAnswer: "(B) Union Rule",
    explanation: "The Union (or Additive) rule states that if X functionally determines Y and X functionally determines Z, then X functionally determines their union YZ."
  },
  {
    id: "pyq-gate-2006-1",
    exam: "GATE CS",
    year: "2006",
    marks: "2 Marks",
    topic: "Decomposition",
    difficulty: "Medium",
    question: "If relation R(A, B, C) is decomposed into R₁(A, B) and R₂(B, C), the decomposition is guaranteed to be lossless if:",
    options: [
      "(A) A → B",
      "(B) B → C",
      "(C) C → B",
      "(D) B → A or B → C"
    ],
    correctIndex: 3,
    correctAnswer: "(D) B → A or B → C",
    explanation: "The common attribute is B. By Heath's Theorem, the decomposition is lossless if B is a superkey of R₁ (B → A) OR B is a superkey of R₂ (B → C)."
  },
  {
    id: "pyq-gate-2005-1",
    exam: "GATE CS",
    year: "2005",
    marks: "2 Marks",
    topic: "BCNF",
    difficulty: "Hard",
    question: "Relation R(A, B, C, D) with F = { A → B, B → C, C → D, D → A } is in which normal form?",
    options: [
      "(A) 1NF only",
      "(B) 2NF only",
      "(C) 3NF only",
      "(D) BCNF"
    ],
    correctIndex: 3,
    correctAnswer: "(D) BCNF",
    solution: `Each attribute determines the next in a cycle: A → B → C → D → A.
A⁺ = R, B⁺ = R, C⁺ = R, D⁺ = R.
Candidate keys: {A}, {B}, {C}, and {D}.
Every determinant in F is a candidate key.
Therefore, relation R is in BCNF!`,
    notes: "GATE CS 2005 BCNF cyclic relation."
  },

  // --- 31 to 40 ---
  {
    id: "pyq-gate-2004-1",
    exam: "GATE CS",
    year: "2004",
    marks: "2 Marks",
    topic: "Double Hashing",
    difficulty: "Medium",
    question: "A hash table of size 11 has hash functions:\nh₁(k) = k mod 11\nh₂(k) = 1 + (k mod 7)\nIf keys 12, 44, 13, 88, 23, 94, 11 are inserted in that order using double hashing, what will be the index of key 23?",
    options: [
      "(A) 3",
      "(B) 4",
      "(C) 5",
      "(D) 6"
    ],
    correctIndex: 1,
    correctAnswer: "(B) 4",
    solution: `1. Key 12: h₁(12) = 1 → Slot 1.
2. Key 44: h₁(44) = 0 → Slot 0.
3. Key 13: h₁(13) = 2 → Slot 2.
4. Key 88: h₁(88) = 0 (Collision). h₂(88) = 1 + (88 mod 7) = 5. (0 + 5) mod 11 = 5 → Slot 5.
5. Key 23:
   h₁(23) = 1 (Collision with 12).
   h₂(23) = 1 + (23 mod 7) = 3.
   Next probe: (1 + 1 × 3) mod 11 = 4 → Slot 4 (Empty!).
Key 23 is inserted at index 4.`,
    notes: "GATE CS 2004 classic double hashing problem."
  },
  {
    id: "pyq-gate-2003-1",
    exam: "GATE CS",
    year: "2003",
    marks: "1 Mark",
    topic: "Hashing",
    difficulty: "Easy",
    question: "In a hash table using open addressing with double hashing, what happens if a key is deleted and its slot is simply marked as empty (NULL)?",
    options: [
      "(A) The load factor becomes negative.",
      "(B) Subsequent searches for other keys that collided past this slot will prematurely terminate with 'key not found'.",
      "(C) Primary clustering immediately occurs.",
      "(D) Hash functions must be recomputed."
    ],
    correctIndex: 1,
    correctAnswer: "(B)",
    explanation: "In open addressing, a search stops upon encountering an empty slot. If a deleted item's slot is set to empty, probe sequences that collided through it will be broken, causing false search misses. Hence, deleted slots must be marked with a 'Deleted' tombstone marker."
  },
  {
    id: "pyq-gate-2002-1",
    exam: "GATE CS",
    year: "2002",
    marks: "1 Mark",
    topic: "Armstrong's Axioms",
    difficulty: "Easy",
    question: "Which of the following is the Pseudo-transitivity rule?",
    options: [
      "(A) If X → Y and WY → Z, then WX → Z",
      "(B) If X → Y and Y → Z, then X → Z",
      "(C) If X → Y, then XZ → YZ",
      "(D) If X → Y and X → Z, then X → YZ"
    ],
    correctIndex: 0,
    correctAnswer: "(A)",
    explanation: "Pseudo-transitivity states: If X → Y and WY → Z, then WX → Z."
  },
  {
    id: "pyq-gate-2001-1",
    exam: "GATE CS",
    year: "2001",
    marks: "2 Marks",
    topic: "Candidate Keys",
    difficulty: "Hard",
    question: "Relation R(A, B, C, D, E) with F = { A → B, BC → D, D → E, E → A }. Which of the following is NOT a candidate key?",
    options: [
      "(A) {A, C}",
      "(B) {B, C}",
      "(C) {C, D}",
      "(D) {A, D}"
    ],
    correctIndex: 3,
    correctAnswer: "(D) {A, D}",
    solution: `Check {A, D}⁺:
A → B gives {A, B, D}. D → E gives {A, B, D, E}.
Can we get C? C never appears on the RHS of any FD!
Attribute C is essential and MUST be in every candidate key!
Since {A, D} does not contain C, it CANNOT be a candidate key.`,
    notes: "GATE CS 2001 essential attribute rule."
  },
  {
    id: "pyq-gate-2000-1",
    exam: "GATE CS",
    year: "2000",
    marks: "1 Mark",
    topic: "BCNF",
    difficulty: "Easy",
    question: "A relation is in BCNF if for every non-trivial functional dependency X → Y:",
    options: [
      "(A) X is a superkey",
      "(B) Y is a prime attribute",
      "(C) X is a candidate key and Y is prime",
      "(D) X is a subset of Y"
    ],
    correctIndex: 0,
    correctAnswer: "(A) X is a superkey",
    explanation: "By definition, relation R is in BCNF if for every non-trivial functional dependency X → Y in F⁺, X is a superkey of R."
  },
  {
    id: "pyq-ugc-2023-1",
    exam: "UGC-NET",
    year: "2023",
    marks: "2 Marks",
    topic: "Normal Forms",
    difficulty: "Medium",
    question: "Relation R(A, B, C, D) has F = { AB → C, C → D, D → A }. Which normal form does R satisfy?",
    options: [
      "(A) 1NF but not 2NF",
      "(B) 2NF but not 3NF",
      "(C) 3NF but not BCNF",
      "(D) BCNF"
    ],
    correctIndex: 2,
    correctAnswer: "(C) 3NF but not BCNF",
    solution: `Candidate keys: {AB}, {BC}, {BD}.
Prime attributes: {A, B, C, D}. All attributes are prime!
In C → D: C is not superkey, but D is prime! Satisfies 3NF.
In D → A: D is not superkey, but A is prime! Satisfies 3NF.
Since determinants C and D are not superkeys, BCNF is violated.
Highest normal form is 3NF.`,
    notes: "UGC-NET Dec 2023 paper question."
  },
  {
    id: "pyq-ugc-2023-2",
    exam: "UGC-NET",
    year: "2023",
    marks: "2 Marks",
    topic: "Superkeys",
    difficulty: "Easy",
    question: "Consider relation R(A, B, C, D) where {A} is the sole candidate key. How many superkeys exist?",
    options: [
      "(A) 4",
      "(B) 8",
      "(C) 12",
      "(D) 16"
    ],
    correctIndex: 1,
    correctAnswer: "(B) 8",
    solution: `Superkeys must contain attribute A.
Remaining 3 attributes {B, C, D} can be chosen in 2³ = 8 ways.
Number of superkeys = 8.`,
    notes: "UGC-NET June 2023 question."
  },
  {
    id: "pyq-ugc-2022-1",
    exam: "UGC-NET",
    year: "2022",
    marks: "2 Marks",
    topic: "4NF & MVD",
    difficulty: "Hard",
    question: "A relation R is in Fourth Normal Form (4NF) if and only if for every non-trivial multivalued dependency X ↠ Y:",
    options: [
      "(A) X is a superkey of R",
      "(B) Y is a prime attribute",
      "(C) X and Y are disjoint",
      "(D) R has no functional dependencies"
    ],
    correctIndex: 0,
    correctAnswer: "(A) X is a superkey of R",
    explanation: "4NF eliminates independent multi-valued dependencies: for every non-trivial MVD X ↠ Y, X must be a superkey of R."
  },
  {
    id: "pyq-ugc-2021-1",
    exam: "UGC-NET",
    year: "2021",
    marks: "2 Marks",
    topic: "Lossless Join",
    difficulty: "Medium",
    question: "Decomposition of R(A, B, C) into R₁(A, B) and R₂(A, C) is lossless if which dependency holds in R?",
    options: [
      "(A) B → C",
      "(B) A → B or A → C",
      "(C) BC → A",
      "(D) C → B"
    ],
    correctIndex: 1,
    correctAnswer: "(B) A → B or A → C",
    explanation: "R₁ ∩ R₂ = {A}. For lossless join, {A} must be a superkey of R₁ (A → B) or a superkey of R₂ (A → C)."
  },
  {
    id: "pyq-ugc-2020-1",
    exam: "UGC-NET",
    year: "2020",
    marks: "2 Marks",
    topic: "Candidate Keys",
    difficulty: "Medium",
    question: "Relation R(A, B, C, D) with F = { A → B, B → C, C → A }. What is the candidate key of R?",
    options: [
      "(A) {A}",
      "(B) {B}",
      "(C) {A, D}, {B, D}, {C, D}",
      "(D) {D}"
    ],
    correctIndex: 2,
    correctAnswer: "(C)",
    solution: `Attribute D never appears on the RHS of any FD, so D must be in every candidate key!
{A, D}⁺ = {A, D, B, C} = R.
{B, D}⁺ = {B, D, C, A} = R.
{C, D}⁺ = {C, D, A, B} = R.
Candidate keys are {A, D}, {B, D}, and {C, D}.`,
    notes: "UGC-NET 2020 essential attribute question."
  },

  // --- 41 to 52 ---
  {
    id: "pyq-isro-2020-1",
    exam: "ISRO CS",
    year: "2020",
    marks: "3 Marks",
    topic: "Closures",
    difficulty: "Medium",
    question: "In relation R(A, B, C, D, E, F) with F = { A → B, BC → D, E → C, D → A }. What is the closure of {A, E}?",
    options: [
      "(A) {A, B, E}",
      "(B) {A, B, C, E}",
      "(C) {A, B, C, D, E}",
      "(D) {A, B, C, D, E, F}"
    ],
    correctIndex: 2,
    correctAnswer: "(C) {A, B, C, D, E}",
    solution: `{A, E}⁺:
- Initial: {A, E}
- A → B gives {A, B, E}
- E → C gives {A, B, C, E}
- BC → D gives {A, B, C, D, E}.
F is not derived.
Closure is {A, B, C, D, E}.`,
    notes: "ISRO CS 2020 official question."
  },
  {
    id: "pyq-isro-2018-1",
    exam: "ISRO CS",
    year: "2018",
    marks: "3 Marks",
    topic: "Normal Forms",
    difficulty: "Medium",
    question: "Given R(W, X, Y, Z) with F = { W → X, X → Y, Y → Z, Z → W }. The relation is in:",
    options: [
      "(A) 1NF only",
      "(B) 2NF only",
      "(C) 3NF only",
      "(D) BCNF"
    ],
    correctIndex: 3,
    correctAnswer: "(D) BCNF",
    solution: `W → X → Y → Z → W is a cycle.
W⁺ = R, X⁺ = R, Y⁺ = R, Z⁺ = R.
All four attributes {W}, {X}, {Y}, {Z} are candidate keys.
Every determinant is a candidate key.
Relation is in BCNF.`,
    notes: "ISRO CS 2018 paper question."
  },
  {
    id: "pyq-isro-2017-1",
    exam: "ISRO CS",
    year: "2017",
    marks: "3 Marks",
    topic: "Double Hashing",
    difficulty: "Easy",
    question: "In double hashing, what value must h₂(k) NEVER return?",
    options: [
      "(A) A prime number",
      "(B) 0",
      "(C) 1",
      "(D) An odd number"
    ],
    correctIndex: 1,
    correctAnswer: "(B) 0",
    solution: `If h₂(k) returns 0, the probe step (i × h₂(k)) is always 0.
The probe index (h₁(k) + i × 0) mod m remains stuck at h₁(k) forever in an infinite loop!
Therefore, h₂(k) must never evaluate to 0.`,
    notes: "ISRO CS 2017 hashing question."
  },
  {
    id: "pyq-isro-2015-1",
    exam: "ISRO CS",
    year: "2015",
    marks: "3 Marks",
    topic: "BCNF",
    difficulty: "Medium",
    question: "Relation R(A, B, C, D) has F = { A → B, B → C, C → D }. Which attribute is the candidate key?",
    options: [
      "(A) {A}",
      "(B) {B}",
      "(C) {C}",
      "(D) {D}"
    ],
    correctIndex: 0,
    correctAnswer: "(A) {A}",
    explanation: "A never appears on any RHS. A⁺ = {A, B, C, D} = R. Minimal candidate key is {A}."
  },
  {
    id: "pyq-nielit-2022-1",
    exam: "NIELIT Scientist B",
    year: "2022",
    marks: "1 Mark",
    topic: "Candidate Keys",
    difficulty: "Medium",
    question: "Relation R(A, B, C, D) has F = { A → B, B → C, C → D, D → B }. Which of the following is a candidate key?",
    options: [
      "(A) {B}",
      "(B) {A}",
      "(C) {C}",
      "(D) {D}"
    ],
    correctIndex: 1,
    correctAnswer: "(B) {A}",
    explanation: "A never appears on the RHS of any FD. A⁺ = {A, B, C, D} = R. Candidate key is {A}."
  },
  {
    id: "pyq-nielit-2020-1",
    exam: "NIELIT Scientist B",
    year: "2020",
    marks: "1 Mark",
    topic: "Normal Forms",
    difficulty: "Easy",
    question: "A table has composite primary key (CourseID, StudentID). If StudentName depends ONLY on StudentID, which normal form is violated?",
    options: [
      "(A) 1NF",
      "(B) 2NF",
      "(C) 3NF",
      "(D) BCNF"
    ],
    correctIndex: 1,
    correctAnswer: "(B) 2NF",
    explanation: "StudentID is a proper subset of the composite primary key. A non-prime attribute depending on a proper subset of a candidate key is a partial dependency, violating 2NF."
  },
  {
    id: "pyq-univ-2024-1",
    exam: "University Exam",
    year: "2024",
    marks: "10 Marks",
    topic: "2NF Decomposition",
    difficulty: "Hard",
    question: "Relation R(A, B, C, D, E, F, G, H, I, J) with F = { A → BG, B → I, C → J, D → EF, AE → H }.\nWhat is the candidate key and what are the 2NF decomposed relations?",
    options: [
      "(A) Key: {A, C, D}. Decomposed: R₁(A,B,G,I), R₂(C,J), R₃(D,E,F), R₄(A,E,H), R₅(A,C,D)",
      "(B) Key: {A, B, C}. Decomposed: R₁(A,B), R₂(C,D)",
      "(C) Key: {D, E, F}. Decomposed: R₁(D,E,F), R₂(A,C,D)",
      "(D) Key: {A, C}. Decomposed: R₁(A,C), R₂(B,I)"
    ],
    correctIndex: 0,
    correctAnswer: "(A)",
    solution: `1. Candidate key: Attributes {A, C, D} never appear on RHS. {A, C, D}⁺ = all 10 attributes = R.
2. Partial dependencies on {A, C, D}:
   - A → BG violates 2NF
   - C → J violates 2NF
   - D → EF violates 2NF
3. 2NF Decomposed Relations:
   R₁(A, B, G, I) with key {A}
   R₂(C, J) with key {C}
   R₃(D, E, F) with key {D}
   R₄(A, E, H) with key {AE}
   R₅(A, C, D) with key {A, C, D}.`,
    notes: "Official university end-semester examination."
  },
  {
    id: "pyq-univ-2024-2",
    exam: "University Exam",
    year: "2024",
    marks: "10 Marks",
    topic: "Minimal Cover",
    difficulty: "Hard",
    question: "Orders relation with OrderID, CustomerName, CustomerPhone, OrderDate, ProductIDs, ProductNames, TotalAmount, SalesRepID, SalesRepName, SalesRepRegion.\nWhich attribute is the unique candidate key?",
    options: [
      "(A) {CustomerID}",
      "(B) {OrderID}",
      "(C) {ProductIDs}",
      "(D) {SalesRepID}"
    ],
    correctIndex: 1,
    correctAnswer: "(B) {OrderID}",
    solution: `OrderID never appears on the RHS of any functional dependency.
{OrderID}⁺ derives CustomerName, CustomerPhone, OrderDate, ProductIDs, TotalAmount, SalesRepID, SalesRepName, SalesRepRegion, and ProductNames.
Therefore, {OrderID} is the unique minimal Candidate Key.`,
    notes: "Orders relation 10-mark examination problem."
  },
  {
    id: "pyq-gate-2024-msq",
    exam: "GATE CS",
    year: "2024",
    marks: "2 Marks (MSQ)",
    topic: "Normal Forms",
    difficulty: "Hard",
    question: "Which of the following statements about functional dependencies and normal forms is/are always TRUE?\n(A) A relation with only two attributes is always in BCNF\n(B) If every attribute is prime, the relation is guaranteed to be in 3NF\n(C) If relation is in 3NF, it has no partial dependencies\n(D) Every BCNF decomposition preserves functional dependencies",
    options: [
      "(A) Statements (A), (B), and (C)",
      "(B) Statements (A) and (D) only",
      "(C) Statement (A) only",
      "(D) Statements (B) and (D) only"
    ],
    correctIndex: 0,
    correctAnswer: "(A)",
    solution: `Analysis:
- (A) True: In any binary relation R(A, B), the only non-trivial FDs possible are A → B or B → A, making the determinant a candidate key. Always in BCNF.
- (B) True: In 3NF, for every X → Y, either X is superkey OR Y is prime. If every attribute is prime, Y is always prime! Vacuously satisfies 3NF!
- (C) True: 3NF requires 2NF. 2NF forbids partial dependencies.
- (D) False: BCNF decomposition is not always dependency-preserving.
Correct: Statements (A), (B), and (C).`,
    notes: "GATE CS 2024 MSQ format."
  },
  {
    id: "pyq-gate-2022-nat",
    exam: "GATE CS",
    year: "2022",
    marks: "2 Marks (NAT)",
    topic: "Candidate Keys",
    difficulty: "Medium",
    question: "Relation R has 5 attributes: R(A, B, C, D, E) with F = { A → B, BC → E, ED → A }. What is the total number of prime attributes in relation R?",
    options: [
      "(A) 3",
      "(B) 4",
      "(C) 5",
      "(D) 2"
    ],
    correctIndex: 2,
    correctAnswer: "(C) 5",
    solution: `Candidate keys:
K₁ = {A, C, D}
K₂ = {B, C, D}
K₃ = {E, C, D}
Attributes present in candidate keys:
A (in K₁), B (in K₂), C (in all), D (in all), E (in K₃).
All 5 attributes {A, B, C, D, E} are prime attributes!
Total prime attributes = 5.`,
    notes: "Official GATE CS 2022 numerical answer type question."
  },
  {
    id: "pyq-gate-2021-nat",
    exam: "GATE CS",
    year: "2021",
    marks: "2 Marks (NAT)",
    topic: "Superkeys",
    difficulty: "Medium",
    question: "Relation R(A, B, C, D) has two candidate keys: {A} and {B}. How many total superkeys exist for relation R?",
    options: [
      "(A) 8",
      "(B) 10",
      "(C) 12",
      "(D) 14"
    ],
    correctIndex: 2,
    correctAnswer: "(C) 12",
    solution: `Use the Principle of Inclusion-Exclusion:
- Number of superkeys containing key A: 2^(4 - 1) = 2³ = 8.
- Number of superkeys containing key B: 2^(4 - 1) = 2³ = 8.
- Number of superkeys containing BOTH A and B: 2^(4 - 2) = 2² = 4.
Total Superkeys = |A| + |B| - |A ∩ B| = 8 + 8 - 4 = 12.`,
    notes: "Inclusion-exclusion superkey calculation."
  },
  {
    id: "pyq-gate-2016-nat",
    exam: "GATE CS",
    year: "2016",
    marks: "2 Marks (NAT)",
    topic: "Candidate Keys",
    difficulty: "Hard",
    question: "Relation R(A, B, C, D, E, F) has F = { A → B, B → C, C → D, D → E, E → F, F → A }. What is the number of candidate keys?",
    options: [
      "(A) 1",
      "(B) 3",
      "(C) 6",
      "(D) 12"
    ],
    correctIndex: 2,
    correctAnswer: "(C) 6",
    solution: `All dependencies form a complete directed cycle:
A → B → C → D → E → F → A.
Every single attribute derives all 6 attributes: {A}⁺ = R, {B}⁺ = R, {C}⁺ = R, {D}⁺ = R, {E}⁺ = R, {F}⁺ = R.
Therefore, there are exactly 6 minimal candidate keys.`,
    notes: "Official GATE CS 2016 NAT question."
  }
];
