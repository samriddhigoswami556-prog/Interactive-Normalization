/**
 * Double Hashing Collision Resolution Engine
 * 
 * In double hashing, open addressing uses two hash functions:
 *   h(k, i) = (h1(k) + i * h2(k)) mod m
 * where:
 *   k = key
 *   i = probe number (0, 1, 2, ..., m - 1)
 *   m = hash table size
 *   h1(k) = primary hash function (e.g. k mod m)
 *   h2(k) = secondary hash function (must be non-zero and relatively prime to m)
 */

export const HASH_PRESETS = [
  {
    name: "Classic GATE CS Example",
    tableSize: 11,
    h2Type: "clrs", // h2(k) = 7 - (k % 7) or 1 + (k % 7)
    h2Param: 7,
    keys: [12, 44, 13, 88, 23, 94, 11],
    description: "m = 11, h1(k) = k mod 11, h2(k) = 1 + (k mod 7)"
  },
  {
    name: "Textbook Step-Offset (m=7)",
    tableSize: 7,
    h2Type: "clrs",
    h2Param: 5,
    keys: [10, 8, 24, 15, 17],
    description: "m = 7, h1(k) = k mod 7, h2(k) = 1 + (k mod 5)"
  },
  {
    name: "Heavy Collision Challenge (m=13)",
    tableSize: 13,
    h2Type: "subtraction",
    h2Param: 11,
    keys: [26, 39, 52, 65, 78, 14, 27],
    description: "Multiple keys share the same h1(k)=0 to demonstrate probe chaining."
  }
];

export const H2_FORMULAS = [
  {
    id: "add1",
    label: "1 + (k mod m')",
    formula: (k, mPrime) => 1 + (k % mPrime),
    text: (k, mPrime) => `1 + (${k} mod ${mPrime})`
  },
  {
    id: "subtraction",
    label: "m' - (k mod m')",
    formula: (k, mPrime) => mPrime - (k % mPrime),
    text: (k, mPrime) => `${mPrime} - (${k} mod ${mPrime})`
  },
  {
    id: "oddStep",
    label: "2 * (k mod m') + 1",
    formula: (k, mPrime) => 2 * (k % mPrime) + 1,
    text: (k, mPrime) => `2 * (${k} mod ${mPrime}) + 1`
  }
];

/**
 * Calculates primary hash h1(k) = k mod m
 */
export function computeH1(k, m) {
  return ((k % m) + m) % m;
}

/**
 * Calculates secondary hash h2(k) using chosen formula
 */
export function computeH2(k, h2TypeId, mPrime) {
  const formulaObj = H2_FORMULAS.find(f => f.id === h2TypeId) || H2_FORMULAS[0];
  const val = formulaObj.formula(k, mPrime);
  // Guarantee non-zero offset
  return val === 0 ? 1 : Math.abs(val);
}

/**
 * Computes probe index for given probe count i:
 * h(k, i) = (h1(k) + i * h2(k)) mod m
 */
export function computeProbeIndex(k, i, m, h2TypeId, mPrime) {
  const h1 = computeH1(k, m);
  const h2 = computeH2(k, h2TypeId, mPrime);
  return ((h1 + i * h2) % m + m) % m;
}

/**
 * Creates an empty hash table of size m
 */
export function createEmptyTable(m) {
  return Array.from({ length: m }, (_, i) => ({
    index: i,
    status: 'EMPTY', // 'EMPTY' | 'OCCUPIED' | 'DELETED'
    key: null,
    probesNeeded: 0,
    insertedAtStep: null
  }));
}

/**
 * Simulates inserting a single key into the table with step-by-step probe trail
 * @param {Array} currentTable 
 * @param {number} key 
 * @param {number} m 
 * @param {string} h2TypeId 
 * @param {number} mPrime 
 * @returns {Object} { newTable, success, steps, totalProbes, finalIndex }
 */
export function insertKeyWithTrace(currentTable, key, m, h2TypeId, mPrime) {
  const table = currentTable.map(slot => ({ ...slot }));
  const h1 = computeH1(key, m);
  const h2 = computeH2(key, h2TypeId, mPrime);
  const formulaObj = H2_FORMULAS.find(f => f.id === h2TypeId) || H2_FORMULAS[0];

  const steps = [];
  let inserted = false;
  let finalIndex = -1;
  let totalProbes = 0;

  // First check if key already exists
  for (let i = 0; i < m; i++) {
    const idx = ((h1 + i * h2) % m + m) % m;
    if (table[idx].status === 'OCCUPIED' && table[idx].key === key) {
      steps.push({
        probe: i,
        index: idx,
        status: 'DUPLICATE',
        h1,
        h2,
        formulaText: `h(${key}, ${i}) = (${h1} + ${i} × ${h2}) mod ${m} = ${idx}`,
        message: `Key ${key} is already present at index ${idx}. Duplicates are not allowed.`
      });
      return { newTable: table, success: false, duplicate: true, steps, totalProbes: i + 1, finalIndex: idx };
    }
    if (table[idx].status === 'EMPTY') {
      break; // Key definitely does not exist
    }
  }

  // Insert into first available slot (EMPTY or DELETED)
  for (let i = 0; i < m; i++) {
    const idx = ((h1 + i * h2) % m + m) % m;
    totalProbes = i + 1;
    const currentSlot = table[idx];

    if (currentSlot.status === 'EMPTY' || currentSlot.status === 'DELETED') {
      const prevStatus = currentSlot.status;
      table[idx] = {
        index: idx,
        status: 'OCCUPIED',
        key: key,
        probesNeeded: totalProbes,
        insertedAtStep: steps.length + 1
      };
      steps.push({
        probe: i,
        index: idx,
        status: 'PLACED',
        h1,
        h2,
        formulaText: `h(${key}, ${i}) = (${h1} + ${i} × ${h2}) mod ${m} = ${idx}`,
        message: prevStatus === 'DELETED' 
          ? `Probe ${i}: Slot ${idx} was previously DELETED (tombstone). Key ${key} placed successfully after ${totalProbes} probe(s).`
          : `Probe ${i}: Slot ${idx} is EMPTY. Key ${key} placed successfully after ${totalProbes} probe(s).`
      });
      inserted = true;
      finalIndex = idx;
      break;
    } else {
      // Collision occurred
      steps.push({
        probe: i,
        index: idx,
        status: 'COLLISION',
        collidedWith: currentSlot.key,
        h1,
        h2,
        formulaText: `h(${key}, ${i}) = (${h1} + ${i} × ${h2}) mod ${m} = ${idx}`,
        message: `Probe ${i}: Slot ${idx} is OCCUPIED by key ${currentSlot.key} (COLLISION!). Step by h₂(k) = ${h2}.`
      });
    }
  }

  if (!inserted) {
    steps.push({
      probe: m,
      index: -1,
      status: 'TABLE_FULL',
      h1,
      h2,
      formulaText: `All ${m} slots probed`,
      message: `Table Overflow! Could not insert key ${key} after probing all ${m} slots.`
    });
  }

  return {
    newTable: table,
    success: inserted,
    duplicate: false,
    steps,
    totalProbes,
    finalIndex,
    h1,
    h2,
    h2FormulaDescription: formulaObj.text(key, mPrime)
  };
}

/**
 * Searches for a key in the hash table with full probe trace
 */
export function searchKeyWithTrace(table, key, m, h2TypeId, mPrime) {
  const h1 = computeH1(key, m);
  const h2 = computeH2(key, h2TypeId, mPrime);
  const steps = [];
  let found = false;
  let foundIndex = -1;

  for (let i = 0; i < m; i++) {
    const idx = ((h1 + i * h2) % m + m) % m;
    const slot = table[idx];

    if (slot.status === 'EMPTY') {
      steps.push({
        probe: i,
        index: idx,
        status: 'EMPTY_STOP',
        message: `Probe ${i}: Slot ${idx} is EMPTY. Search stops; key ${key} is NOT present in table.`
      });
      break;
    } else if (slot.status === 'OCCUPIED' && slot.key === key) {
      steps.push({
        probe: i,
        index: idx,
        status: 'FOUND',
        message: `Probe ${i}: Slot ${idx} contains key ${key}. KEY FOUND in ${i + 1} probe(s)!`
      });
      found = true;
      foundIndex = idx;
      break;
    } else if (slot.status === 'DELETED') {
      steps.push({
        probe: i,
        index: idx,
        status: 'TOMBSTONE_SKIP',
        message: `Probe ${i}: Slot ${idx} is DELETED (tombstone). Continuing search sequence...`
      });
    } else {
      steps.push({
        probe: i,
        index: idx,
        status: 'COLLISION_SKIP',
        message: `Probe ${i}: Slot ${idx} contains ${slot.key} ≠ ${key}. Continuing probe sequence...`
      });
    }
  }

  return {
    found,
    foundIndex,
    probes: steps.length,
    steps
  };
}

/**
 * Deletes a key by placing a tombstone marker (DELETED)
 */
export function deleteKeyWithTrace(currentTable, key, m, h2TypeId, mPrime) {
  const table = currentTable.map(slot => ({ ...slot }));
  const searchRes = searchKeyWithTrace(table, key, m, h2TypeId, mPrime);

  if (!searchRes.found) {
    return {
      newTable: table,
      success: false,
      message: `Key ${key} was not found in the hash table. Cannot delete.`,
      steps: searchRes.steps
    };
  }

  const idx = searchRes.foundIndex;
  table[idx] = {
    index: idx,
    status: 'DELETED',
    key: null,
    probesNeeded: 0,
    insertedAtStep: null
  };

  return {
    newTable: table,
    success: true,
    deletedIndex: idx,
    message: `Key ${key} at slot ${idx} marked as DELETED (tombstone preserved for future search paths).`,
    steps: searchRes.steps
  };
}

/**
 * Computes table metrics: load factor, total collisions, avg probes
 */
export function computeTableMetrics(table) {
  const totalSlots = table.length;
  const occupiedSlots = table.filter(s => s.status === 'OCCUPIED');
  const deletedSlots = table.filter(s => s.status === 'DELETED');
  const emptySlots = table.filter(s => s.status === 'EMPTY');
  
  const occupiedCount = occupiedSlots.length;
  const loadFactor = totalSlots > 0 ? (occupiedCount / totalSlots) : 0;
  
  const totalProbes = occupiedSlots.reduce((acc, s) => acc + (s.probesNeeded || 1), 0);
  const totalCollisions = occupiedSlots.reduce((acc, s) => acc + Math.max(0, (s.probesNeeded || 1) - 1), 0);
  const avgProbes = occupiedCount > 0 ? (totalProbes / occupiedCount).toFixed(2) : '0.00';

  return {
    totalSlots,
    occupiedCount,
    deletedCount: deletedSlots.length,
    emptyCount: emptySlots.length,
    loadFactor: (loadFactor * 100).toFixed(1),
    loadFactorDecimal: loadFactor.toFixed(3),
    totalCollisions,
    avgProbes
  };
}
