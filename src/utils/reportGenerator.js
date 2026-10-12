/**
 * Report Generator for DBMS Normalization & FD Analyzer
 * Generates formatted Text, Markdown, and triggers printable PDF reports.
 */
import { computeClosure } from './normalization.js';

export function generateTextReport(data) {
  const { attributes, fds, candidateKeysObj, normalFormObj } = data;
  let { closureTarget, closureResult } = data;
  const now = new Date().toLocaleString();

  // If closure target wasn't explicitly selected, default to first attribute or candidate key
  if ((!closureTarget || closureTarget.length === 0) && attributes.length > 0) {
    closureTarget = candidateKeysObj.candidateKeys.length > 0 ? candidateKeysObj.candidateKeys[0] : [attributes[0]];
    closureResult = computeClosure(closureTarget, fds);
  }

  let report = `================================================================================\n`;
  report += `     DBMS NORMALIZATION & FUNCTIONAL DEPENDENCY ANALYSIS REPORT\n`;
  report += `================================================================================\n`;
  report += `Generated On : ${now}\n`;
  report += `Course       : Database Management Systems (DA1 Evaluation)\n`;
  report += `Guided By    : Dr. Swaminathan A, Assistant Professor\n\n`;

  report += `1. RELATION SCHEMA & INPUTS\n`;
  report += `--------------------------------------------------------------------------------\n`;
  report += `Relation     : R(${attributes.join(', ')})\n`;
  report += `Total Attrs  : ${attributes.length}\n`;
  report += `Dependencies : ${fds.length > 0 ? fds.map(f => f.text).join(' | ') : 'None (Vacuously in BCNF)'}\n`;
  report += `Overall NF   : ${normalFormObj.highestNF}\n\n`;

  report += `2. ATTRIBUTE CLOSURE DERIVATION\n`;
  report += `--------------------------------------------------------------------------------\n`;
  report += `Target Attributes : {${(closureTarget || []).join(', ')}}\n`;
  report += `Calculated Closure: {${(closureResult?.closure || []).join(', ')}}\n\n`;
  report += `Step-by-Step Derivation Path:\n`;
  if (closureResult?.steps && closureResult.steps.length > 0) {
    closureResult.steps.forEach(step => {
      report += `  [Step ${step.step}] ${step.fdApplied === 'Initial State' ? 'Initialize' : 'Apply ' + step.fdApplied} -> Current: {${step.current.join(', ')}}\n`;
      report += `           ${step.explanation}\n`;
    });
  } else {
    report += `  No functional dependencies applied.\n`;
  }
  report += `\n`;

  report += `3. CANDIDATE KEYS & ATTRIBUTE CLASSIFICATION\n`;
  report += `--------------------------------------------------------------------------------\n`;
  report += `Candidate Keys   : ${candidateKeysObj.candidateKeys.map(k => '{' + k.join('') + '}').join(', ') || 'None'}\n`;
  report += `Prime Attributes : {${candidateKeysObj.primeAttributes.join(', ')}}\n`;
  report += `Non-Prime Attrs  : {${candidateKeysObj.nonPrimeAttributes.join(', ')}}\n`;
  report += `Essential Attrs  : {${candidateKeysObj.essentialAttributes.join(', ')}}\n`;
  report += `RHS-Only Attrs   : {${candidateKeysObj.rhsOnlyAttributes.join(', ')}}\n\n`;

  report += `Candidate Key Derivation Steps:\n`;
  candidateKeysObj.steps.forEach(step => {
    report += `  ${step}\n`;
  });
  report += `\n`;

  report += `4. STEP-BY-STEP NORMAL FORM DERIVATION (1NF -> 2NF -> 3NF -> 3.5NF -> 4NF)\n`;
  report += `--------------------------------------------------------------------------------\n`;
  report += `Highest Satisfied Normal Form : [ ${normalFormObj.highestNF} ]\n\n`;
  if (normalFormObj.steps && normalFormObj.steps.length > 0) {
    normalFormObj.steps.forEach((step, idx) => {
      report += `  [Step ${idx + 1}] ${step.title}\n`;
      report += `       Status : [ ${step.status} ] - ${step.badge}\n`;
      report += `       Proof  : ${step.explanation}\n\n`;
    });
  }

  report += `5. PER-FUNCTIONAL DEPENDENCY DIAGNOSTIC AUDIT\n`;
  report += `--------------------------------------------------------------------------------\n`;
  if (normalFormObj.fdReports && normalFormObj.fdReports.length > 0) {
    normalFormObj.fdReports.forEach((rep, idx) => {
      report += `  [FD ${idx + 1}] ${rep.fd.text}\n`;
      report += `       Status : 2NF=${rep.is2NF ? 'PASS' : 'FAIL'} | 3NF=${rep.is3NF ? 'PASS' : 'FAIL'} | BCNF=${rep.isBCNF ? 'PASS' : 'FAIL'}\n`;
      report += `       Reasons:\n`;
      rep.reasons.forEach(r => {
        report += `         - ${r}\n`;
      });
    });
  } else {
    report += `  No functional dependencies provided.\n`;
  }

  report += `\n================================================================================\n`;
  report += `END OF ANALYSIS REPORT - Guided by Dr. Swaminathan A, Assistant Professor\n`;
  report += `================================================================================\n`;

  return report;
}

export function generateMarkdownReport(data) {
  const { attributes, fds, candidateKeysObj, normalFormObj } = data;
  let { closureTarget, closureResult } = data;
  const now = new Date().toLocaleString();

  // If closure target wasn't explicitly selected, default to first attribute or candidate key
  if ((!closureTarget || closureTarget.length === 0) && attributes.length > 0) {
    closureTarget = candidateKeysObj.candidateKeys.length > 0 ? candidateKeysObj.candidateKeys[0] : [attributes[0]];
    closureResult = computeClosure(closureTarget, fds);
  }

  let md = `# DBMS Normalization & FD Analysis Comprehensive Report\n\n`;
  md += `**Generated On:** ${now}  \n`;
  md += `**Course:** Database Management Systems (DA1 Evaluation)  \n`;
  md += `**Guided By:** Dr. Swaminathan A, Assistant Professor  \n`;
  md += `**Evaluated Normal Form:** **${normalFormObj.highestNF}**  \n\n`;
  md += `---\n\n`;

  md += `## 1. Schema & Functional Dependencies\n\n`;
  md += `- **Relation:** \`R(${attributes.join(', ')})\`\n`;
  md += `- **Total Attributes:** ${attributes.length}\n`;
  md += `- **Functional Dependencies:**\n`;
  if (fds.length > 0) {
    fds.forEach(f => {
      md += `  - \`${f.text}\`\n`;
    });
  } else {
    md += `  - *None provided (Relation is vacuously in BCNF)*\n`;
  }
  md += `\n`;

  md += `## 2. Attribute Closure Calculation\n\n`;
  md += `Target: **{${(closureTarget || []).join(', ')}}⁺** = **{${(closureResult?.closure || []).join(', ')}}**\n\n`;
  md += `| Step | Applied Dependency | Resulting Set | Explanation |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  if (closureResult?.steps && closureResult.steps.length > 0) {
    closureResult.steps.forEach(step => {
      md += `| ${step.step} | \`${step.fdApplied}\` | \`{${step.current.join(', ')}}\` | ${step.explanation} |\n`;
    });
  } else {
    md += `| 1 | None | \`{${(closureTarget || []).join(', ')}}\` | Initial attribute set with no applicable FDs |\n`;
  }
  md += `\n`;

  md += `## 3. Candidate Keys & Attributes\n\n`;
  md += `- **Discovered Candidate Keys:** ${candidateKeysObj.candidateKeys.map(k => `**{${k.join('')}}**`).join(', ') || '*None*'}\n`;
  md += `- **Prime Attributes:** \`{${candidateKeysObj.primeAttributes.join(', ')}}\`\n`;
  md += `- **Non-Prime Attributes:** \`{${candidateKeysObj.nonPrimeAttributes.join(', ')}}\`\n`;
  md += `- **Must-have (Essential) Attributes:** \`{${candidateKeysObj.essentialAttributes.join(', ')}}\`\n`;
  md += `- **RHS-only Attributes:** \`{${candidateKeysObj.rhsOnlyAttributes.join(', ')}}\`\n\n`;

  md += `### Candidate Key Derivation Path\n\n`;
  candidateKeysObj.steps.forEach(s => {
    md += `- ${s}\n`;
  });
  md += `\n`;

  md += `## 4. Step-by-Step Normal Form Derivation\n\n`;
  md += `### Overall Normal Form: **${normalFormObj.highestNF}**\n\n`;
  if (normalFormObj.steps && normalFormObj.steps.length > 0) {
    normalFormObj.steps.forEach((step, idx) => {
      const icon = step.status === 'PASS' ? '✅' : step.status === 'FAIL' ? '❌' : '⚠️';
      md += `### Step ${idx + 1}: ${step.title}\n\n`;
      md += `- **Status:** ${icon} **${step.status}** (${step.badge})\n`;
      md += `- **Proof / Explanation:** ${step.explanation}\n\n`;
    });
  }

  md += `## 5. Per-Functional Dependency Diagnostic Audit Table\n\n`;
  md += `| Functional Dependency | 2NF | 3NF | BCNF | Reasonings / Violations |\n`;
  md += `| :--- | :---: | :---: | :---: | :--- |\n`;
  if (normalFormObj.fdReports && normalFormObj.fdReports.length > 0) {
    normalFormObj.fdReports.forEach(r => {
      md += `| \`${r.fd.text}\` | ${r.is2NF ? '✅ PASS' : '❌ FAIL'} | ${r.is3NF ? '✅ PASS' : '❌ FAIL'} | ${r.isBCNF ? '✅ PASS' : '❌ FAIL'} | ${r.reasons.join('<br>')} |\n`;
    });
  } else {
    md += `| *None* | ✅ PASS | ✅ PASS | ✅ PASS | Empty FD set satisfies all normal forms |\n`;
  }
  md += `\n---\n`;
  md += `*Interactive Normalization & FD Analyzer — Guided by Dr. Swaminathan A, Assistant Professor*\n`;

  return md;
}

export function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
