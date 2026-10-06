import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bell, HelpCircle, Menu, UserCheck, Search } from 'lucide-react';
import { CURRENT_USER } from '../data/mockData';
import { useAuth } from './AuthContext';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { authorityLevel, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Hawala Node Alert: Tariq Merchant',
      desc: 'Cell tower CDR burst detected connecting Dockyard Terminal Tower B to burner handset.',
      time: '12m ago',
      urgency: 'HIGH',
      caseId: 'CASE-2026-0891',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Inbound Request Approved',
      desc: 'Directorate of Revenue Intelligence approved container manifest disclosure #DRI-2026-401.',
      time: '1h ago',
      urgency: 'MEDIUM',
      caseId: 'CASE-2026-0891',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Audit Signature Verified',
      desc: 'Evidence chain of custody hash verified by Central Forensics Malkhana safe safe #2.',
      time: '3h ago',
      urgency: 'ROUTINE',
      caseId: 'CASE-2026-0612',
      unread: true,
    },
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cases?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        zIndex: 50,
        position: 'sticky',
        top: 0,
      }}
      role="banner"
    >
      {/* Left: Branding & Mobile Menu Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        {onToggleSidebar && (
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            style={{
              minHeight: '38px',
              width: '38px',
              padding: 0,
              display: 'none',
              color: 'var(--primary)',
            }}
          >
            <Menu size={22} />
          </button>
        )}

        <div
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
          tabIndex={0}
          role="link"
          aria-label="TRACE-X Dashboard Home"
          onKeyDown={e => {
            if (e.key === 'Enter') navigate('/dashboard');
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: 'var(--primary)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
            aria-hidden="true"
          >
            <Shield size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              TRACE-X
            </span>
            <span
              style={{
                fontSize: '14px',
                color: 'var(--text-muted)',
                lineHeight: 1.2,
              }}
            >
              Criminal Network Analysis
            </span>
          </div>
        </div>
      </div>

      {/* Center: Global Search (max 560px) */}
      <form
        onSubmit={handleSearchSubmit}
        style={{
          flex: 1,
          maxWidth: '560px',
          position: 'relative',
        }}
        role="search"
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <Search size={18} />
        </div>
        <input
          type="search"
          aria-label="Search case, person, vehicle, phone or location"
          placeholder="Search case, person, vehicle, phone or location"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            minHeight: '44px',
            paddingLeft: '40px',
            paddingRight: '14px',
            fontSize: '14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-page)',
            color: 'var(--text)',
          }}
        />
      </form>

      {/* Right: Actions & User Authority Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0, position: 'relative' }}>
        {/* Notifications Button */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            aria-label={`Notifications: ${notificationCount} unread`}
            onClick={() => {
              setShowNotifications(prev => !prev);
              setShowProfileModal(false);
            }}
            style={{
              position: 'relative',
              minHeight: '40px',
              width: '40px',
              padding: 0,
              color: showNotifications ? 'var(--primary)' : 'var(--text)',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${showNotifications ? 'var(--primary)' : 'var(--border)'}`,
              backgroundColor: showNotifications ? 'var(--primary-subtle)' : 'var(--bg-surface)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            title="Notifications"
          >
            <Bell size={18} aria-hidden="true" />
            {notificationCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--status-danger)',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                  border: '2px solid var(--bg-surface)',
                }}
              >
                {notificationCount}
                <span className="sr-only">unread notifications</span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '380px',
                maxWidth: '90vw',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                zIndex: 1000,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-page)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={16} color="var(--primary)" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                    Priority Investigation Alerts
                  </span>
                </div>
                {notificationCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                      setNotificationCount(0);
                    }}
                    style={{
                      border: 'none',
                      background: 'none',
                      fontSize: '12px',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      padding: 0,
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                {notifications.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.caseId) {
                        navigate(`/cases/${item.caseId}`);
                        setShowNotifications(false);
                      }
                    }}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border)',
                      backgroundColor: item.unread ? '#F8F9FC' : 'var(--bg-surface)',
                      cursor: item.caseId ? 'pointer' : 'default',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor:
                            item.urgency === 'HIGH' ? '#FEF3F2' : '#EFF8FF',
                          color:
                            item.urgency === 'HIGH' ? '#B42318' : '#175CD3',
                          border: `1px solid ${item.urgency === 'HIGH' ? '#FDA29B' : '#84CAFF'}`,
                        }}
                      >
                        {item.urgency}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.time}</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--bg-page)',
                  textAlign: 'center',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    navigate('/data-requests');
                    setShowNotifications(false);
                  }}
                  style={{
                    border: 'none',
                    background: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    cursor: 'pointer',
                  }}
                >
                  View All Requests &amp; Dispatches →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help Button */}
        <button
          type="button"
          aria-label="System Help & Documentation"
          onClick={() => navigate('/audit')}
          style={{
            minHeight: '40px',
            width: '40px',
            padding: 0,
            color: 'var(--text)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-surface)',
            cursor: 'pointer',
          }}
          title="Audit Log & Standard Operating Procedures"
        >
          <HelpCircle size={18} aria-hidden="true" />
        </button>

        {/* User Authority Profile (Clickable Button) */}
        <button
          type="button"
          onClick={() => {
            setShowProfileModal(true);
            setShowNotifications(false);
          }}
          aria-label={`Officer profile: ${CURRENT_USER.name}, ${authorityLevel || 'LOCAL AUTHORITY'}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: showProfileModal ? 'var(--primary-subtle)' : 'var(--bg-page)',
            border: `1px solid ${showProfileModal ? 'var(--primary)' : 'var(--border)'}`,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease',
          }}
          title="Click to view officer credentials and session controls"
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-subtle)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <UserCheck size={18} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                }}
              >
                {authorityLevel || 'LOCAL AUTHORITY'}
              </span>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-success)',
                }}
                title="Authorized Active Session"
              />
            </div>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text)',
              }}
            >
              {CURRENT_USER.name}
            </span>
          </div>
        </button>

        {/* Officer Profile Modal */}
        <Modal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          title="Officer Dossier & Active Session"
          maxWidth="560px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowProfileModal(false);
                  navigate('/audit');
                }}
              >
                View My Audit Trails
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  setShowProfileModal(false);
                  await logout();
                  navigate('/select-authority');
                }}
              >
                Log Out
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header Identity Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                backgroundColor: 'var(--bg-page)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <UserCheck size={28} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
                  {CURRENT_USER.name}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>
                  {CURRENT_USER.role}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Badge #{CURRENT_USER.badgeNumber} · {CURRENT_USER.station}
                </span>
              </div>
            </div>

            {/* Officer Details Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Jurisdiction Tier:</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  {authorityLevel || 'LOCAL AUTHORITY (LEVEL 2)'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Official Police Station:</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{CURRENT_USER.station}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cryptographic Officer Key:</span>
                <span style={{ fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  ED25519-POL-4412-SIGN-VALID
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Session Security:</span>
                <span style={{ fontWeight: 600, color: '#1E7B4F', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1E7B4F' }} />
                  Encrypted In-Memory Token
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Active Cases:</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>7 Active Investigations</span>
              </div>
            </div>
          </div>
        </Modal>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .mobile-menu-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
};
