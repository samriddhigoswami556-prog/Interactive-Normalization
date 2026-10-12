/**
 * DBMS Normalization & FD Analyzer Core Math Engine
 */

/**
 * Parses attributes string (e.g. "A, B, C, D" or "A B C D") into an array of clean attribute names.
 * @param {string} input 
 * @returns {string[]}
 */
export function parseAttributes(input) {
  if (!input) return [];
  return input
    .replace(/[,;]/g, ' ')
    .split(/\s+/)
    .map(attr => attr.trim().toUpperCase())
    .filter(attr => attr.length > 0 && /^[A-Z0-9]+$/i.test(attr));
}

/**
 * Parses functional dependencies string (e.g. "A -> B\n B,C -> D") into structured objects.
 * @param {string} input 
 * @returns {Array<{ id: string, lhs: string[], rhs: string[], text: string }>}
 */
export function parseFDs(input) {
  if (!input) return [];
  const lines = input.split('\n');
  const parsed = [];
  
  lines.forEach((line, index) => {
    const cleanLine = line.trim();
    if (!cleanLine) return;
    
    // Support various arrow symbols: ->, -->, =>, ->
    const parts = cleanLine.split(/-->|->|=>|→/);
    if (parts.length !== 2) return;
    
    const lhs = parseAttributes(parts[0]);
    const rhs = parseAttributes(parts[1]);
    
    if (lhs.length > 0 && rhs.length > 0) {
      // Sort to normalize representation
      const sortedLhs = [...lhs].sort();
      const sortedRhs = [...rhs].sort();
      
      parsed.push({
        id: `fd-${index}-${Date.now()}`,
        lhs: sortedLhs,
        rhs: sortedRhs,
        text: `${sortedLhs.join(', ')} → ${sortedRhs.join(', ')}`
      });
    }
  });
  
  return parsed;
}

/**
 * Computes the closure of a set of attributes under a set of FDs.
 * Also returns a detailed step-by-step log of the calculation.
 * @param {string[]} attributes - Subset of attributes to find closure for
 * @param {Array<{ lhs: string[], rhs: string[], text: string }>} fds 
 * @returns {{ closure: string[], steps: Array<{ step: number, current: string[], fdApplied: string, explanation: string }> }}
 */
export function computeClosure(attributes, fds) {
  const currentClosure = new Set(attributes.map(a => a.toUpperCase()));
  const steps = [];
  let stepNum = 1;
  
  // Record initial state
  steps.push({
    step: 0,
    current: Array.from(currentClosure).sort(),
    fdApplied: 'Initial State',
    explanation: `Start with the input attributes: {${Array.from(currentClosure).sort().join(', ')}}`
  });
  
  let added = true;
  while (added) {
    added = false;
    
    for (const fd of fds) {
      // Check if LHS of FD is subset of current closure
      const lhsIsSubset = fd.lhs.every(attr => currentClosure.has(attr));
      
      if (lhsIsSubset) {
        // Find which RHS attributes are not yet in the closure
        const newRhsAttrs = fd.rhs.filter(attr => !currentClosure.has(attr));
        
        if (newRhsAttrs.length > 0) {
          newRhsAttrs.forEach(attr => currentClosure.add(attr));
          added = true;
          
          steps.push({
            step: stepNum++,
            current: Array.from(currentClosure).sort(),
            fdApplied: fd.text,
            explanation: `Apply ${fd.text}: Since LHS {${fd.lhs.join(', ')}} is a subset of our current closure, add RHS {${newRhsAttrs.join(', ')}} to get {${Array.from(currentClosure).sort().join(', ')}}`
          });
        }
      }
    }
  }
  
  // Final state step if no steps were added
  if (stepNum === 1) {
    steps.push({
      step: 1,
      current: Array.from(currentClosure).sort(),
      fdApplied: 'None',
      explanation: 'No further functional dependencies can be applied. The closure is complete.'
    });
  } else {
    steps.push({
      step: stepNum,
      current: Array.from(currentClosure).sort(),
      fdApplied: 'None',
      explanation: 'No more functional dependencies can expand the closure. Algorithm terminates.'
    });
  }
  
  return {
    closure: Array.from(currentClosure).sort(),
    steps
  };
}

/**
 * Finds all candidate keys for the relation based on attributes and FDs.
 * Returns candidate keys, prime/non-prime attributes, and the explanation log.
 * @param {string[]} allAttributes 
 * @param {Array<{ lhs: string[], rhs: string[], text: string }>} fds 
 * @returns {{
 *   candidateKeys: string[][],
 *   primeAttributes: string[],
 *   nonPrimeAttributes: string[],
 *   essentialAttributes: string[],
 *   rhsOnlyAttributes: string[],
 *   middleAttributes: string[],
 *   steps: string[]
 * }}
 */
export function findCandidateKeys(allAttributes, fds) {
  const steps = [];
  const uAttr = allAttributes.map(a => a.toUpperCase());
  
  if (uAttr.length === 0) {
    return {
      candidateKeys: [],
      primeAttributes: [],
      nonPrimeAttributes: [],
      essentialAttributes: [],
      rhsOnlyAttributes: [],
      middleAttributes: [],
      steps: ['No attributes defined.']
    };
  }

  // 1. Classify attributes based on appearances in FDs
  const lhsAttrs = new Set();
  const rhsAttrs = new Set();
  
  fds.forEach(fd => {
    fd.lhs.forEach(a => lhsAttrs.add(a));
    fd.rhs.forEach(a => rhsAttrs.add(a));
  });
  
  // Essential attributes: Appear on LHS but never on RHS, or don't appear in FDs at all
  const essential = uAttr.filter(a => !rhsAttrs.has(a));
  
  // RHS-only attributes: Appear on RHS but never on LHS
  const rhsOnly = uAttr.filter(a => rhsAttrs.has(a) && !lhsAttrs.has(a));
  
  // Middle attributes: Appear on both LHS and RHS
  const middle = uAttr.filter(a => lhsAttrs.has(a) && rhsAttrs.has(a));
  
  steps.push(`Classifying attributes based on functional dependencies:`);
  steps.push(`• Must-have (essential) attributes: {${essential.join(', ')}} (Never appear on the RHS of any FD. Must be in every candidate key)`);
  steps.push(`• RHS-only attributes: {${rhsOnly.join(', ')}} (Appear only on the RHS. Can never be part of a minimal candidate key)`);
  steps.push(`• Middle attributes: {${middle.join(', ')}} (Appear on both sides. May or may not be in candidate keys)`);

  // Calculate closure of essential attributes
  const essentialClosureObj = computeClosure(essential, fds);
  const essentialClosure = essentialClosureObj.closure;
  
  steps.push(`Calculating closure of essential attributes: {${essential.join(', ')}}⁺ = {${essentialClosure.join(', ')}}`);

  let candidateKeys = [];
  
  // If essential attributes closure contains all attributes, then essential attributes are the unique candidate key
  if (essentialClosure.length === uAttr.length) {
    candidateKeys.push(essential.sort());
    steps.push(`Since {${essential.join(', ')}}⁺ contains all attributes, it is the unique candidate key.`);
  } else {
    steps.push(`Since essential attributes closure {${essentialClosure.join(', ')}} is incomplete, we must test combinations with middle attributes: {${middle.join(', ')}}`);
    
    // We search for subsets of middle attributes to add to essential attributes
    // Sort middle attributes to ensure deterministic combo generation
    const sortedMiddle = [...middle].sort();
    const superkeys = [];
    
    // Generate all subsets of middle attributes, ordered by size
    // Using simple binary representation for subsets
    const numSubsets = 1 << sortedMiddle.length;
    const subsets = [];
    for (let i = 0; i < numSubsets; i++) {
      const subset = [];
      for (let j = 0; j < sortedMiddle.length; j++) {
        if ((i & (1 << j)) !== 0) {
          subset.push(sortedMiddle[j]);
        }
      }
      subsets.push(subset);
    }
    
    // Sort subsets by length so we check smaller keys first (ensuring minimality check works)
    subsets.sort((a, b) => a.length - b.length);
    
    subsets.forEach(sub => {
      const candidate = [...essential, ...sub].sort();
      
      // Check if candidate is a superkey
      const closureObj = computeClosure(candidate, fds);
      const closure = closureObj.closure;
      
      if (closure.length === uAttr.length) {
        // Check for minimality: Is any subset of this candidate already a candidate key?
        const isMinimal = !candidateKeys.some(key => 
          key.every(attr => candidate.includes(attr))
        );
        
        if (isMinimal) {
          candidateKeys.push(candidate);
          steps.push(`• Testing combination {${candidate.join(', ')}}: closure is {${closure.join(', ')}}, which contains all attributes. It is a candidate key!`);
        } else {
          steps.push(`• Testing combination {${candidate.join(', ')}}: closure is {${closure.join(', ')}}, but it is not minimal (contains key {${candidateKeys.find(key => key.every(attr => candidate.includes(attr))).join(', ')}}).`);
        }
      } else {
        // Log testing for smaller sets
        if (sub.length <= 2) {
          steps.push(`• Testing combination {${candidate.join(', ')}}: closure is {${closure.join(', ')}}, not a superkey.`);
        }
      }
    });
  }
  
  // Sort candidate keys by size and then alphabetically
  candidateKeys.sort((a, b) => {
    if (a.length !== b.length) return a.length - b.length;
    return a.join('').localeCompare(b.join(''));
  });
  
  // Classify Prime and Non-Prime attributes
  const primeSet = new Set();
  candidateKeys.forEach(key => {
    key.forEach(attr => primeSet.add(attr));
  });
  
  const prime = uAttr.filter(a => primeSet.has(a)).sort();
  const nonPrime = uAttr.filter(a => !primeSet.has(a)).sort();
  
  steps.push(`Summarizing Candidate Keys:`);
  candidateKeys.forEach(key => {
    steps.push(`  → Candidate Key: {${key.join(', ')}}`);
  });
  steps.push(`Prime attributes (part of some candidate key): {${prime.join(', ')}}`);
  steps.push(`Non-prime attributes (not in any candidate key): {${nonPrime.join(', ')}}`);

  return {
    candidateKeys,
    primeAttributes: prime,
    nonPrimeAttributes: nonPrime,
    essentialAttributes: essential,
    rhsOnlyAttributes: rhsOnly,
    middleAttributes: middle,
    steps
  };
}

/**
 * Checks normal form (2NF, 3NF, BCNF) for the relation and FDs.
 * Returns diagnostics for each FD and the overall highest normal form.
 * @param {string[]} allAttributes 
 * @param {Array<{ lhs: string[], rhs: string[], text: string }>} fds 
 * @param {string[][]} candidateKeys 
 * @param {string[]} primeAttributes 
 * @param {string[]} nonPrimeAttributes 
 * @returns {{
 *   highestNF: 'BCNF' | '3NF' | '2NF' | '1NF',
 *   fdReports: Array<{
 *     fd: { lhs: string[], rhs: string[], text: string },
 *     isTrivial: boolean,
 *     is2NF: boolean,
 *     is3NF: boolean,
 *     isBCNF: boolean,
 *     reasons: string[]
 *   }>
 * }}
 */
export function determineNormalForm(allAttributes, fds, candidateKeys, primeAttributes, nonPrimeAttributes) {
  const primeSet = new Set(primeAttributes);
  
  const fdReports = fds.map(fd => {
    const lhsSet = new Set(fd.lhs);
    
    // Check Triviality: RHS is subset of LHS
    const isTrivial = fd.rhs.every(attr => lhsSet.has(attr));
    
    if (isTrivial) {
      return {
        fd,
        isTrivial: true,
        is2NF: true,
        is3NF: true,
        isBCNF: true,
        reasons: ['Trivial functional dependency (RHS ⊆ LHS). Automatically satisfies BCNF, 3NF, and 2NF.']
      };
    }
    
    const reasons = [];
    let isBCNF = false;
    let is3NF = false;
    let is2NF = true; // Assume true until proven false
    
    // Helper: Compute closure of LHS
    const lhsClosure = computeClosure(fd.lhs, fds).closure;
    const isLhsSuperkey = allAttributes.every(attr => lhsClosure.includes(attr));
    
    // Check BCNF: LHS must be a superkey
    if (isLhsSuperkey) {
      isBCNF = true;
      is3NF = true;
      is2NF = true;
      reasons.push('LHS is a superkey. Satisfies BCNF, 3NF, and 2NF.');
    } else {
      reasons.push('LHS is NOT a superkey (BCNF violated).');
      
      // Check 3NF: LHS is superkey OR RHS consists entirely of prime attributes
      // Formally: for every attribute A in RHS \ LHS, A is prime.
      const rhsMinusLhs = fd.rhs.filter(attr => !lhsSet.has(attr));
      const allRhsPrime = rhsMinusLhs.every(attr => primeSet.has(attr));
      
      if (allRhsPrime) {
        is3NF = true;
        reasons.push(`RHS attributes not in LHS {${rhsMinusLhs.join(', ')}} are all prime attributes. Satisfies 3NF.`);
      } else {
        const nonPrimeRhs = rhsMinusLhs.filter(attr => !primeSet.has(attr));
        reasons.push(`RHS contains non-prime attributes: {${nonPrimeRhs.join(', ')}} (3NF violated).`);
      }
      
      // Check 2NF: No partial dependency.
      // Partial dependency occurs if LHS is a PROPER subset of some candidate key, 
      // AND RHS contains at least one non-prime attribute (not in LHS).
      const nonPrimeRhs = fd.rhs.filter(attr => !lhsSet.has(attr) && !primeSet.has(attr));
      
      if (nonPrimeRhs.length > 0) {
        // Check if LHS is a proper subset of ANY candidate key
        let isProperSubsetOfKey = false;
        let violatedKey = null;
        
        for (const key of candidateKeys) {
          const keySet = new Set(key);
          const lhsIsSubsetOfKey = fd.lhs.every(attr => keySet.has(attr));
          const lhsIsProperSubset = lhsIsSubsetOfKey && fd.lhs.length < key.length;
          
          if (lhsIsProperSubset) {
            isProperSubsetOfKey = true;
            violatedKey = key;
            break;
          }
        }
        
        if (isProperSubsetOfKey) {
          is2NF = false;
          reasons.push(`Partial Dependency: LHS {${fd.lhs.join(', ')}} is a proper subset of candidate key {${violatedKey.join(', ')}} and determines non-prime attribute(s) {${nonPrimeRhs.join(', ')}} (2NF violated).`);
        }
      }
      
      if (is2NF && !is3NF) {
        reasons.push('No partial dependencies found. Satisfies 2NF.');
      }
    }
    
    return {
      fd,
      isTrivial: false,
      is2NF,
      is3NF,
      isBCNF,
      reasons
    };
  });
  
  // Determine overall normal form
  let highestNF = 'BCNF (3.5NF)';
  
  if (fds.length > 0) {
    const has2NFViolation = fdReports.some(r => !r.is2NF);
    const has3NFViolation = fdReports.some(r => !r.is3NF);
    const hasBCNFViolation = fdReports.some(r => !r.isBCNF);
    
    if (has2NFViolation) {
      highestNF = '1NF';
    } else if (has3NFViolation) {
      highestNF = '2NF';
    } else if (hasBCNFViolation) {
      highestNF = '3NF';
    } else {
      highestNF = 'BCNF (3.5NF)';
    }
  }

  // Generate Step-by-Step Hierarchical Derivation
  const steps = [];

  // Step 1: 1NF Evaluation
  steps.push({
    level: "1NF",
    title: "1. First Normal Form (1NF) - Attribute Atomicity",
    status: "PASS",
    badge: "1NF Satisfied",
    explanation: "All attributes are atomic and indivisible (single-valued domains with no repeating groups or nested arrays). The relation fundamentally satisfies 1NF."
  });

  // Step 2: 2NF Evaluation
  const partialViolations = fdReports.filter(r => !r.is2NF);
  if (partialViolations.length > 0) {
    steps.push({
      level: "2NF",
      title: "2. Second Normal Form (2NF) - Partial Dependency Check",
      status: "FAIL",
      badge: "2NF Violated",
      explanation: `Relation fails 2NF because ${partialViolations.length} dependency/dependencies have a proper subset of a candidate key determining non-prime attribute(s): ${partialViolations.map(p => p.fd.text).join(', ')}. Must decompose into separate relations to eliminate partial keys.`
    });
  } else {
    steps.push({
      level: "2NF",
      title: "2. Second Normal Form (2NF) - Partial Dependency Check",
      status: "PASS",
      badge: "2NF Satisfied",
      explanation: "No non-prime attribute depends on a proper subset of any candidate key. There are zero partial dependencies."
    });
  }

  // Step 3: 3NF Evaluation
  const transitiveViolations = fdReports.filter(r => !r.is3NF);
  if (partialViolations.length > 0) {
    steps.push({
      level: "3NF",
      title: "3. Third Normal Form (3NF) - Transitive Dependency Check",
      status: "SKIPPED",
      badge: "3NF Not Reached",
      explanation: "Since 2NF is violated due to partial dependencies, the relation cannot achieve 3NF. Transitive checks are blocked by lower-level anomalies."
    });
  } else if (transitiveViolations.length > 0) {
    steps.push({
      level: "3NF",
      title: "3. Third Normal Form (3NF) - Transitive Dependency Check",
      status: "FAIL",
      badge: "3NF Violated",
      explanation: `Relation fails 3NF because ${transitiveViolations.length} dependency/dependencies exhibit transitive dependencies where LHS is not a superkey AND RHS contains non-prime attribute(s): ${transitiveViolations.map(t => t.fd.text).join(', ')}.`
    });
  } else {
    steps.push({
      level: "3NF",
      title: "3. Third Normal Form (3NF) - Transitive Dependency Check",
      status: "PASS",
      badge: "3NF Satisfied",
      explanation: "For every non-trivial FD X → Y, either X is a superkey OR every attribute in Y is prime. All transitive dependencies are eliminated."
    });
  }

  // Step 4: 3.5NF / BCNF Evaluation
  const bcnfViolations = fdReports.filter(r => !r.isBCNF);
  if (partialViolations.length > 0 || transitiveViolations.length > 0) {
    steps.push({
      level: "3.5NF (BCNF)",
      title: "4. Boyce-Codd Normal Form (3.5NF / BCNF) - Superkey Determinant Rule",
      status: "SKIPPED",
      badge: "3.5NF Not Reached",
      explanation: "Relation violates 2NF or 3NF; therefore, it cannot satisfy BCNF (3.5NF)."
    });
  } else if (bcnfViolations.length > 0) {
    steps.push({
      level: "3.5NF (BCNF)",
      title: "4. Boyce-Codd Normal Form (3.5NF / BCNF) - Superkey Determinant Rule",
      status: "FAIL",
      badge: "3.5NF Violated",
      explanation: `Relation satisfies 3NF but fails BCNF (3.5NF) because ${bcnfViolations.length} dependency/dependencies have a determinant (LHS) that is NOT a superkey: ${bcnfViolations.map(b => b.fd.text).join(', ')}. While their RHS attributes are prime (passing 3NF), 3.5NF strictly mandates that every determinant must be a superkey.`
    });
  } else {
    steps.push({
      level: "3.5NF (BCNF)",
      title: "4. Boyce-Codd Normal Form (3.5NF / BCNF) - Superkey Determinant Rule",
      status: "PASS",
      badge: "3.5NF (BCNF) Satisfied",
      explanation: "Every non-trivial functional dependency X → Y has a determinant X that is a superkey (X⁺ = R). All functional dependency-based redundancy is completely eliminated."
    });
  }

  // Step 5: 4NF Evaluation
  if (highestNF.includes('BCNF') || highestNF.includes('3.5NF')) {
    steps.push({
      level: "4NF",
      title: "5. Fourth Normal Form (4NF) - Multivalued Dependency (MVD) Check",
      status: "PASS",
      badge: "4NF Candidate (BCNF Satisfied)",
      explanation: "Since all functional dependencies satisfy BCNF (3.5NF), the schema satisfies 4NF provided no independent Multivalued Dependencies (MVDs: X ↠ Y | Z) exist. If two independent multivalued facts are combined into one relation, decompose into 4NF binary projections."
    });
  } else {
    steps.push({
      level: "4NF",
      title: "5. Fourth Normal Form (4NF) - Multivalued Dependency (MVD) Check",
      status: "SKIPPED",
      badge: "4NF Not Reached",
      explanation: "4NF strictly requires a schema to already satisfy BCNF (3.5NF). Lower-level functional dependency anomalies must be normalized first."
    });
  }
  
  return {
    highestNF,
    fdReports,
    steps
  };
}

/**
 * DBMS Presets for testing (Including 2NF, 3NF, 3.5NF / BCNF, and 4NF)
 */
export const PRESETS = [
  {
    name: "1. Partial Dependency (2NF Violation)",
    description: "R(A, B, C, D) with AB -> C, A -> D. Proper subset {A} of key {AB} determines non-prime D (Violates 2NF).",
    attributes: "A, B, C, D",
    fds: "A, B -> C\nA -> D"
  },
  {
    name: "2. Transitive Dependency Chain (3NF Violation)",
    description: "R(A, B, C, D) with A -> B, B -> C, C -> D. Non-prime C determines non-prime D (Violates 3NF).",
    attributes: "A, B, C, D",
    fds: "A -> B\nB -> C\nC -> D"
  },
  {
    name: "3. 3NF but not BCNF (3.5NF Violation)",
    description: "R(A, B, C) with AB -> C, C -> B. Candidate keys {AB}, {AC}. Determinant C is not a superkey, but B is prime.",
    attributes: "A, B, C",
    fds: "A, B -> C\nC -> B"
  },
  {
    name: "4. Classic Boyce-Codd 3.5NF Violation",
    description: "R(A, B, C) with AB -> C, C -> A. Keys {AB}, {BC}. C -> A satisfies 3NF (A is prime), but violates BCNF/3.5NF.",
    attributes: "A, B, C",
    fds: "A, B -> C\nC -> A"
  },
  {
    name: "5. Multiple Overlapping Composite Keys",
    description: "R(A, B, C, D, E) with AB -> C, C -> D, D -> B, D -> E. Multiple overlapping candidate keys: {AB}, {AC}, {AD}.",
    attributes: "A, B, C, D, E",
    fds: "A, B -> C\nC -> D\nD -> B\nD -> E"
  },
  {
    name: "6. Cascading Multi-Attribute BCNF Violation",
    description: "R(A, B, C, D, E) with AB -> C, CD -> E, E -> A. Complex multi-attribute determinants causing 3.5NF violation.",
    attributes: "A, B, C, D, E",
    fds: "A, B -> C\nC, D -> E\nE -> A"
  },
  {
    name: "7. Pure BCNF / 3.5NF Satisfied",
    description: "R(A, B, C, D) with AB -> CD, CD -> AB. Both determinants {AB} and {CD} are superkeys. Zero FD redundancy.",
    attributes: "A, B, C, D",
    fds: "A, B -> C, D\nC, D -> A, B"
  },
  {
    name: "8. 4NF Conceptual & MVD Case",
    description: "R(Course, Teacher, Book) all-key schema. In BCNF under FDs, but illustrates 4NF MVD anomalies.",
    attributes: "Course, Teacher, Book",
    fds: ""
  }
];
