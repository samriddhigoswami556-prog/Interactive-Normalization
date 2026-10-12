import React, { useState } from 'react';
import { X, Download, FileText, Printer, FileCode, CheckCircle2 } from 'lucide-react';
import { generateTextReport, generateMarkdownReport, downloadFile } from '../utils/reportGenerator';

export default function DownloadModal({ 
  isOpen, 
  onClose, 
  reportData 
}) {
  const [downloadedFormat, setDownloadedFormat] = useState(null);

  if (!isOpen) return null;

  const handleDownloadText = () => {
    const textContent = generateTextReport(reportData);
    const fileName = `DBMS_Normalization_Report_${Date.now()}.txt`;
    downloadFile(textContent, fileName, 'text/plain');
    setDownloadedFormat('Text (.txt)');
  };

  const handleDownloadMarkdown = () => {
    const mdContent = generateMarkdownReport(reportData);
    const fileName = `DBMS_Normalization_Report_${Date.now()}.md`;
    downloadFile(mdContent, fileName, 'text/markdown');
    setDownloadedFormat('Document (.md)');
  };

  const handlePrintPDF = () => {
    // Open print dialog with media print styles for high-res PDF saving
    setDownloadedFormat('PDF (Print / Save as PDF)');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="modal-icon-badge">
              <Download size={22} className="text-violet-400" />
            </div>
            <div>
              <h2 className="modal-title">Download Analysis Report</h2>
              <p className="modal-subtitle">Export execution steps, intermediate derivations, and final normal form diagnostics.</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: '1.75rem' }}>
          
          <div className="report-summary-box">
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Report Contents Included</div>
            <ul className="report-contents-list">
              <li>✔ User inputs: Relation attributes <code>R({reportData.attributes.join(', ')})</code> & {reportData.fds.length} Functional Dependencies</li>
              <li>✔ Attribute closure derivation steps and intermediate expansion results</li>
              <li>✔ Discovered candidate keys, prime/non-prime classifications, and derivation steps</li>
              <li>✔ Detailed Diagnostic Audit Table: 2NF, 3NF, and BCNF compliance per FD</li>
              <li>✔ Faculty attribution: Guided by Dr. Swaminathan A, Assistant Professor</li>
            </ul>
          </div>

          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '1.25rem 0 0.75rem' }}>
            Select Download Format:
          </h4>

          <div className="download-formats-grid">
            
            {/* Format 1: PDF */}
            <div className="format-card" onClick={handlePrintPDF}>
              <div className="format-icon-box text-red-400">
                <Printer size={28} />
              </div>
              <div className="format-info">
                <div className="format-name">PDF Document</div>
                <div className="format-desc">Official formatted layout. Opens browser print dialog configured to "Save as PDF" with headers and tables.</div>
              </div>
              <button className="format-action-btn">
                <span>Export PDF</span>
              </button>
            </div>

            {/* Format 2: Text (.txt) */}
            <div className="format-card" onClick={handleDownloadText}>
              <div className="format-icon-box text-emerald-400">
                <FileText size={28} />
              </div>
              <div className="format-info">
                <div className="format-name">Plain Text Report (.txt)</div>
                <div className="format-desc">Structured ASCII report suitable for command-line submission and text editors.</div>
              </div>
              <button className="format-action-btn">
                <span>Download .txt</span>
              </button>
            </div>

            {/* Format 3: Document / Markdown (.md) */}
            <div className="format-card" onClick={handleDownloadMarkdown}>
              <div className="format-icon-box text-violet-400">
                <FileCode size={28} />
              </div>
              <div className="format-info">
                <div className="format-name">Document / Markdown (.md)</div>
                <div className="format-desc">Formatted GitHub Markdown report compatible with Microsoft Word and documentation systems.</div>
              </div>
              <button className="format-action-btn">
                <span>Download .md</span>
              </button>
            </div>

          </div>

          {downloadedFormat && (
            <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--emerald)' }}>
              <CheckCircle2 size={16} />
              <span>Successfully triggered download for <strong>{downloadedFormat}</strong>!</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
