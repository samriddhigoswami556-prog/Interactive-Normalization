import React from 'react';
import { X, Users, Award } from 'lucide-react';

// =========================================================================
// TEAM MEMBERS LIST - EDIT YOUR DETAILS HERE DIRECTLY IN CODE
// =========================================================================
const TEAM_MEMBERS = [
  {
    name: "Jahnavi Bhalla",
    regNo: "25BCE1350",
    role: "Frontend & UI Design",
    photo: "jahnavi.jpeg"
  },
  {
    name: "Vibhuti Math",
    regNo: "25BCE1477",
    role: "Normalization Math Engine",
    photo: "vibhuti.jpeg"
  },
  {
    name: "Samriddhi Goswami",
    regNo: "25BCE1494",
    role: "Testing & Documentation",
    photo: "sample.jpeg"
  }
];

export default function DevelopedByModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '850px' }} onClick={e => e.stopPropagation()}>

        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="modal-icon-badge">
              <Users size={22} className="text-violet-400" />
            </div>
            <div>
              <h2 className="modal-title">Project Credits & Team Details</h2>
              <p className="modal-subtitle">DBMS DA1 Project Development Team</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>

          {/* FACULTY GUIDE SECTION - HIGHLIGHTED PROMINENTLY */}
          <div className="guide-card">
            <div className="guide-badge">
              <Award size={18} className="text-amber-400" />
              <span>PROJECT SUPERVISOR & MENTOR</span>
            </div>
            <div className="guide-info">
              <div className="guide-avatar">
                <Award size={32} className="text-amber-400" />
              </div>
              <div>
                <div className="guide-title-label">Guided By</div>
                <h3 className="guide-name">Dr. Swaminathan A</h3>
                <p className="guide-designation">Assistant Professor</p>
              </div>
            </div>
          </div>

          {/* STUDENT TEAM MEMBERS SECTION */}
          <div style={{ margin: '1.5rem 0 1rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Development Team Members ({TEAM_MEMBERS.length})
            </h4>
          </div>

          <div className="team-grid">
            {TEAM_MEMBERS.map((member, idx) => (
              <div className="team-card" key={idx}>
                <div className="team-card-header">
                  <div className="team-avatar-container">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="team-avatar-img"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80";
                      }}
                    />
                  </div>
                </div>

                <div className="team-card-body">
                  <h5 className="team-member-name">{member.name}</h5>
                  <div className="team-reg-badge">{member.regNo}</div>
                  <div className="team-role">{member.role}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
