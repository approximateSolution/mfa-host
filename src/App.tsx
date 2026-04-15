import { HashRouter, Routes, Route, NavLink } from 'react-router';
import { useEffect } from 'react';
import { RemoteWrapper } from './components/RemoteWrapper';
import { useMfaStore } from './shared/mfa-store';

const loadUsersApp = () => import('remoteUsers/UsersApp');
const loadDashboardApp = () => import('remoteDashboard/DashboardApp');
const loadSettingsApp = () => import('remoteSettings/SettingsApp');

function applyTheme(dark: boolean) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}

function HomePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1
        style={{
          fontSize: '2rem',
          marginBottom: '0.5rem',
          color: 'var(--text-primary)',
        }}
      >
        Micro Frontend Demo
      </h1>
      <p
        style={{
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
        }}
      >
        Host application demonstrating Module Federation with React, Vue, and
        Angular microfrontends.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
        }}
      >
        <Card
          icon="⚛️"
          title="Users"
          description="React microfrontend — user list with search & filter"
          link="/users"
          color="#61dafb"
        />
        <Card
          icon="💚"
          title="Dashboard"
          description="Vue microfrontend — animated stats & activity feed"
          link="/dashboard"
          color="#42b883"
        />
        <Card
          icon="🅰️"
          title="Settings"
          description="Angular microfrontend — interactive settings form"
          link="/settings"
          color="#dd0031"
        />
      </div>
    </div>
  );
}

function Card({
  icon,
  title,
  description,
  link,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  link: string;
  color: string;
}) {
  return (
    <NavLink
      to={link}
      style={{
        display: 'block',
        padding: '1.5rem',
        border: '1px solid var(--border-primary)',
        borderRadius: '12px',
        background: 'var(--bg-card)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
      <h3
        style={{
          marginBottom: '0.5rem',
          color: 'var(--text-primary)',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
        }}
      >
        {description}
      </p>
      <span
        style={{
          display: 'inline-block',
          marginTop: '1rem',
          color,
          fontWeight: 600,
        }}
      >
        Open →
      </span>
    </NavLink>
  );
}

export default function App() {
  const isDark = useMfaStore((s) => s.settings.darkMode);
  const updateSetting = useMfaStore((s) => s.updateSetting);

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  const toggleDarkMode = () => {
    updateSetting('darkMode', !isDark);
  };

  return (
    <HashRouter>
      <nav
        style={{
          display: 'flex',
          gap: '1.5rem',
          padding: '1rem 2rem',
          borderBottom: '1px solid var(--nav-border)',
          background: 'var(--nav-bg)',
          alignItems: 'center',
        }}
      >
        <NavLink
          to="/"
          style={({ isActive }) => ({
            fontWeight: isActive ? 700 : 400,
            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            textDecoration: 'none',
          })}
        >
          Home
        </NavLink>
        <NavLink
          to="/users"
          style={({ isActive }) => ({
            fontWeight: isActive ? 700 : 400,
            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            textDecoration: 'none',
          })}
        >
          Users (React)
        </NavLink>
        <NavLink
          to="/dashboard"
          style={({ isActive }) => ({
            fontWeight: isActive ? 700 : 400,
            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            textDecoration: 'none',
          })}
        >
          Dashboard (Vue)
        </NavLink>
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            fontWeight: isActive ? 700 : 400,
            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            textDecoration: 'none',
          })}
        >
          Settings (Angular)
        </NavLink>
        <button
          onClick={toggleDarkMode}
          style={{
            marginLeft: 'auto',
            padding: '0.4rem 0.8rem',
            border: '1px solid var(--border-secondary)',
            borderRadius: '8px',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/users"
            element={<RemoteWrapper loader={loadUsersApp} />}
          />
          <Route
            path="/dashboard"
            element={<RemoteWrapper loader={loadDashboardApp} />}
          />
          <Route
            path="/settings"
            element={<RemoteWrapper loader={loadSettingsApp} />}
          />
        </Routes>
      </main>
    </HashRouter>
  );
}
