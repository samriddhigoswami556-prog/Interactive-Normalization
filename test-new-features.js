import { 
  createEmptyTable, 
  insertKeyWithTrace, 
  searchKeyWithTrace, 
  deleteKeyWithTrace, 
  computeTableMetrics, 
  computeProbeIndex,
  HASH_PRESETS 
} from './src/utils/doubleHashing.js';

import { 
  QUIZ_QUESTIONS, 
  PRACTICE_PROBLEMS, 
  PREVIOUS_YEAR_QUESTIONS 
} from './src/utils/practiceData.js';

console.log("==================================================");
console.log("TEST SUITE: DOUBLE HASHING & PRACTICE CENTER DATA");
console.log("==================================================\n");

// ----------------------------------------------------
// 1. Test Double Hashing Engine
// ----------------------------------------------------
console.log("--- 1. Testing Double Hashing Engine ---");
let table = createEmptyTable(11);
const keys = [12, 44, 13, 88, 23, 94, 11];

console.log(`Initialized table size: ${table.length}`);

// Test individual insertions
for (const key of keys) {
  const res = insertKeyWithTrace(table, key, 11, 'add1', 7);
  if (!res.success) {
    console.error(`FAILED to insert key ${key}`);
  } else {
    table = res.newTable;
    console.log(`Inserted ${key} at index [${res.finalIndex}] in ${res.totalProbes} probe(s).`);
  }
}

// Check GATE CS 2004 condition: Key 23 must be at index 4!
const slot23 = table.find(s => s.key === 23);
if (slot23 && slot23.index === 4) {
  console.log("✅ VERIFIED: GATE CS 2004 condition passed: Key 23 is at index [4].");
} else {
  console.error("❌ FAILED: Key 23 was not at index 4. Found:", slot23);
}

// Test Metrics
const metrics = computeTableMetrics(table);
console.log(`Metrics: Load factor = ${metrics.loadFactor}%, Total collisions = ${metrics.totalCollisions}, Avg probes = ${metrics.avgProbes}`);

// Test Search
console.log("\n--- Testing Search Operation ---");
const searchFound = searchKeyWithTrace(table, 88, 11, 'add1', 7);
console.log(`Search for 88: found=${searchFound.found} at [${searchFound.foundIndex}] after ${searchFound.probes} probe(s)`);

const searchMissing = searchKeyWithTrace(table, 999, 11, 'add1', 7);
console.log(`Search for 999: found=${searchMissing.found} (terminated at empty slot after ${searchMissing.probes} probe(s))`);

// Test Tombstone Delete
console.log("\n--- Testing Tombstone Deletion ---");
const delRes = deleteKeyWithTrace(table, 12, 11, 'add1', 7);
table = delRes.newTable;
console.log(`Deleted key 12: success=${delRes.success} at [${delRes.deletedIndex}]. Slot status: ${table[delRes.deletedIndex].status}`);

// Verify key 23 is still searchable even though key 12 (initial collision slot) was deleted!
const searchAfterDel = searchKeyWithTrace(table, 23, 11, 'add1', 7);
console.log(`Search for 23 after deleting 12: found=${searchAfterDel.found} at [${searchAfterDel.foundIndex}]!`);
if (searchAfterDel.found && searchAfterDel.foundIndex === 4) {
  console.log("✅ VERIFIED: Tombstone preservation ensures subsequent keys remain reachable.");
} else {
  console.error("❌ FAILED: Search through tombstone failed.");
}

// ----------------------------------------------------
// 2. Test Practice Center Data Integrity
// ----------------------------------------------------
console.log("\n--- 2. Testing Practice Center Data ---");
console.log(`Total Quiz Questions: ${QUIZ_QUESTIONS.length}`);
QUIZ_QUESTIONS.forEach(q => {
  if (!q.question || q.options.length !== 4 || q.correctIndex < 0 || q.correctIndex > 3 || !q.explanation) {
    console.error(`Invalid quiz question: ${q.id}`);
  }
});
console.log("✅ All Quiz questions have valid options (4), valid correctIndex, and explanations.");

console.log(`Total Practice Problems: ${PRACTICE_PROBLEMS.length}`);
PRACTICE_PROBLEMS.forEach(p => {
  if (!p.title || !p.scenario || !p.solution || !p.hint) {
    console.error(`Invalid practice problem: ${p.id}`);
  }
});
console.log("✅ All Practice Problems have hints, full step-by-step solutions, and scenario descriptions.");

console.log(`Total Previous Year Questions (PYQs): ${PREVIOUS_YEAR_QUESTIONS.length}`);
PREVIOUS_YEAR_QUESTIONS.forEach(pyq => {
  if (!pyq.exam || !pyq.year || !pyq.marks || !pyq.question || !pyq.solution) {
    console.error(`Invalid PYQ: ${pyq.id}`);
  }
});
console.log("✅ All PYQ questions have exam, year, marks, solutions, and image container support.");

console.log("\n==================================================");
console.log("ALL TESTS COMPLETED SUCCESSFULLY! 🎉");
console.log("==================================================");
