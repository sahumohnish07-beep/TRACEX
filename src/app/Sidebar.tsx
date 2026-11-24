import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  FolderPlus,
  Network,
  Users,
  SendHorizontal,
  Inbox,
  Eye,
  ShieldAlert,
  Activity,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from './AuthContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    if (onCloseMobile) onCloseMobile();
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/cases', label: 'Cases', icon: <FolderKanban size={20} /> },
    { to: '/cases/new', label: 'New Case', icon: <FolderPlus size={20} /> },
    { to: '/cases/CASE-2026-0891/network', label: 'Network Analysis', icon: <Network size={20} /> },
    { to: '/persons', label: 'Criminal Records', icon: <Users size={20} /> },
    { to: '/requests', label: 'Data Requests', icon: <SendHorizontal size={20} /> },
    { to: '/received', label: 'Received Data', icon: <Inbox size={20} /> },
    { to: '/views/VIEW-891-A', label: 'My Investigation Views', icon: <Eye size={20} /> },
    { to: '/audit', label: 'Audit Log', icon: <ShieldAlert size={20} /> },
  ];

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        height: 'calc(100vh - var(--header-height))',
        position: 'sticky',
        top: 'var(--header-height)',
        overflowY: 'auto',
      }}
      aria-label="Platform Main Navigation"
    >
      <div style={{ padding: '16px 0' }}>
        <nav aria-label="Main sections">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navItems.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onCloseMobile}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 20px',
                    fontSize: '16px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--primary)' : 'var(--text)',
                    backgroundColor: isActive ? 'var(--primary-subtle)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                    textDecoration: 'none',
                    transition: 'background-color 120ms ease, color 120ms ease',
                    minHeight: '48px',
                  })}
                >
                  <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom Section with Divider */}
      <div style={{ padding: '16px 0', borderTop: '1px solid var(--border)' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <li>
            <button
              type="button"
              onClick={() => alert('Station Systems Status: All clusters operating normally. Node connectivity: 100% (36 nodes active).')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                fontSize: '16px',
                fontWeight: 500,
                color: 'var(--text-muted)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                justifyContent: 'flex-start',
                minHeight: '44px',
              }}
            >
              <Activity size={20} aria-hidden="true" />
              <span>System Status</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={() => alert('TRACE-X SOP Guide: Refer to Local Police Station Standard Operating Procedures manual v2.4.')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                fontSize: '16px',
                fontWeight: 500,
                color: 'var(--text-muted)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                justifyContent: 'flex-start',
                minHeight: '44px',
              }}
            >
              <HelpCircle size={20} aria-hidden="true" />
              <span>Help &amp; SOP</span>
            </button>
          </li>

          <li>
            <button
              id="sidebar-logout-btn"
              type="button"
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--status-danger)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                justifyContent: 'flex-start',
                minHeight: '44px',
              }}
            >
              <LogOut size={20} aria-hidden="true" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};
