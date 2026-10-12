import { 
  parseAttributes, 
  parseFDs, 
  computeClosure, 
  findCandidateKeys, 
  determineNormalForm, 
  PRESETS 
} from './src/utils/normalization.js';
import { generateTextReport, generateMarkdownReport } from './src/utils/reportGenerator.js';

console.log(`=== RUNNING FULL SUITE ACROSS ALL ${PRESETS.length} PRESETS ===\n`);

PRESETS.forEach((preset, idx) => {
  console.log(`[TEST ${idx + 1}] ${preset.name}`);
  console.log(`Relation: R(${preset.attributes})`);
  console.log(`FDs: ${preset.fds || '(None)'}`);

  const attrs = parseAttributes(preset.attributes);
  const fds = parseFDs(preset.fds);

  const keysObj = findCandidateKeys(attrs, fds);
  const candidateKeysStr = keysObj.candidateKeys.map(k => '{' + k.join('') + '}').join(', ');
  console.log(`  -> Discovered Keys: ${candidateKeysStr || 'None'}`);
  console.log(`  -> Prime Attributes: {${keysObj.primeAttributes.join(', ')}}`);
  console.log(`  -> Non-Prime Attributes: {${keysObj.nonPrimeAttributes.join(', ')}}`);

  const closureTarget = attrs.length > 0 ? [attrs[0]] : [];
  const closureObj = computeClosure(closureTarget, fds);
  console.log(`  -> Closure {${closureTarget.join(', ')}}⁺ = {${closureObj.closure.join(', ')}} (${closureObj.steps.length} steps)`);

  const nfObj = determineNormalForm(attrs, fds, keysObj.candidateKeys, keysObj.primeAttributes, keysObj.nonPrimeAttributes);
  console.log(`  -> Evaluated Highest NF: ${nfObj.highestNF}`);
  console.log(`  -> Derivation Steps (${nfObj.steps.length}):`);
  nfObj.steps.forEach(st => {
    console.log(`     * [${st.status}] ${st.level}: ${st.badge}`);
  });

  // Verify Report Generation
  const reportData = {
    attributes: attrs,
    fds,
    candidateKeysObj: keysObj,
    normalFormObj: nfObj,
    closureTarget,
    closureResult: closureObj
  };
  const textReport = generateTextReport(reportData);
  const mdReport = generateMarkdownReport(reportData);

  if (!textReport.includes('DBMS NORMALIZATION') || !textReport.includes(nfObj.highestNF)) {
    throw new Error(`Text report validation failed for preset ${preset.name}`);
  }
  if (!mdReport.includes('DBMS Normalization') || !mdReport.includes(nfObj.highestNF)) {
    throw new Error(`Markdown report validation failed for preset ${preset.name}`);
  }

  console.log(`  -> Reports (Text & MD) validated successfully.\n`);
});

console.log("=== ALL PRESETS AND REPORT GENERATORS PASSED WITH ZERO ERRORS ===");
