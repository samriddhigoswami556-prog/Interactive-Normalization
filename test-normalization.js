import { 
  parseAttributes, 
  parseFDs, 
  computeClosure, 
  findCandidateKeys, 
  determineNormalForm 
} from './src/utils/normalization.js';

console.log("=== STARTING NORMALIZATION ENGINE TESTS ===\n");

// Test Case 1: Classic Transitive Dependency (2NF, not 3NF)
// R(A, B, C, D) with A -> B, B -> C, C -> D
const attrs1 = parseAttributes("A, B, C, D");
const fds1 = parseFDs("A -> B\nB -> C\nC -> D");
console.log("TEST CASE 1:");
console.log("Attributes:", attrs1);
console.log("FDs:", fds1.map(f => f.text));

const keysObj1 = findCandidateKeys(attrs1, fds1);
console.log("Candidate Keys:", keysObj1.candidateKeys.map(k => k.join('')));
console.log("Prime:", keysObj1.primeAttributes);
console.log("Non-prime:", keysObj1.nonPrimeAttributes);

const nfObj1 = determineNormalForm(attrs1, fds1, keysObj1.candidateKeys, keysObj1.primeAttributes, keysObj1.nonPrimeAttributes);
console.log("Highest Normal Form:", nfObj1.highestNF);
console.log("FD Diagnostic Report:");
nfObj1.fdReports.forEach(r => {
  console.log(`- ${r.fd.text}: 2NF=${r.is2NF}, 3NF=${r.is3NF}, BCNF=${r.isBCNF}`);
  console.log(`  Reasons:`, r.reasons);
});
console.log("\n------------------------------------------\n");

// Test Case 2: Partial Dependency (1NF, not 2NF)
// R(A, B, C, D) with A, B -> C, A -> D
const attrs2 = parseAttributes("A, B, C, D");
const fds2 = parseFDs("A, B -> C\nA -> D");
console.log("TEST CASE 2:");
console.log("Attributes:", attrs2);
console.log("FDs:", fds2.map(f => f.text));

const keysObj2 = findCandidateKeys(attrs2, fds2);
console.log("Candidate Keys:", keysObj2.candidateKeys.map(k => k.join('')));

const nfObj2 = determineNormalForm(attrs2, fds2, keysObj2.candidateKeys, keysObj2.primeAttributes, keysObj2.nonPrimeAttributes);
console.log("Highest Normal Form:", nfObj2.highestNF);
console.log("\n------------------------------------------\n");

// Test Case 3: 3NF but not BCNF
// R(A, B, C) with A, B -> C, C -> A
const attrs3 = parseAttributes("A, B, C");
const fds3 = parseFDs("A, B -> C\nC -> A");
console.log("TEST CASE 3:");
console.log("Attributes:", attrs3);
console.log("FDs:", fds3.map(f => f.text));

const keysObj3 = findCandidateKeys(attrs3, fds3);
console.log("Candidate Keys:", keysObj3.candidateKeys.map(k => k.join('')));
console.log("Prime Attributes:", keysObj3.primeAttributes);
console.log("Non-prime Attributes:", keysObj3.nonPrimeAttributes);

const nfObj3 = determineNormalForm(attrs3, fds3, keysObj3.candidateKeys, keysObj3.primeAttributes, keysObj3.nonPrimeAttributes);
console.log("Highest Normal Form:", nfObj3.highestNF);
console.log("FD Diagnostic Report:");
nfObj3.fdReports.forEach(r => {
  console.log(`- ${r.fd.text}: 2NF=${r.is2NF}, 3NF=${r.is3NF}, BCNF=${r.isBCNF}`);
  console.log(`  Reasons:`, r.reasons);
});
console.log("\n=== TESTS COMPLETED SUCCESSFULLY ===");
