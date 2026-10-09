import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, LogOut, Home, FileText, CheckSquare, GraduationCap, LayoutDashboard, CreditCard, Link as LinkIcon, UserCheck, X, ChevronRight } from 'lucide-react';
import './Dashboard.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = user?.role === 'admin';
  const links = isAdmin ? [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard /> },
    { name: 'Applications', path: '/admin/applications', icon: <CheckSquare /> },
    { name: 'Marks management', path: '/admin/marks', icon: <FileText /> },
    { name: 'Attendance', path: '/admin/attendance', icon: <UserCheck /> },
    { name: 'Exam links', path: '/admin/exams', icon: <LinkIcon /> },
  ] : [
    { name: 'Home', path: '/student', icon: <Home /> },
    { name: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard /> },
    { name: 'Scorecard', path: '/student/scorecard', icon: <FileText /> },
    { name: 'Exams', path: '/student/exams', icon: <CheckSquare /> },
    { name: 'Finances', path: '/student/finance', icon: <CreditCard /> },
  ];
  const activePage = links.find(link => link.path === location.pathname)?.name || 'Dashboard';
  const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="ns-app-shell">
      <aside className={'ns-sidebar ' + (sidebarOpen ? 'ns-sidebar-open' : '')}>
        <Link className="ns-app-brand" to={isAdmin ? '/admin' : '/student'} onClick={() => setSidebarOpen(false)}><span className="ns-app-brand-icon"><GraduationCap size={20} /></span><span>Northstar<small>UNIVERSITY PORTAL</small></span><button className="ns-mobile-close" onClick={e => { e.preventDefault(); setSidebarOpen(false); }} aria-label="Close menu"><X size={18} /></button></Link>
        <div className="ns-nav-label">WORKSPACE</div>
        <nav className="ns-side-nav">{links.map(link => {
          const active = location.pathname === link.path;
          return <Link key={link.path} to={link.path} onClick={() => setSidebarOpen(false)} className={'ns-side-link ' + (active ? 'active' : '')}>{React.cloneElement(link.icon, { size: 18, strokeWidth: active ? 2.2 : 1.8 })}<span>{link.name}</span>{active && <ChevronRight className="ns-side-chevron" size={15} />}</Link>;
        })}</nav>
        <div className="ns-sidebar-bottom"><div className="ns-profile"><img src={user?.photoUrl || 'https://placehold.co/96x96/e2ebe5/315c52?text=N'} alt="" /><div><strong>{user?.name || 'Campus member'}</strong><small>{isAdmin ? 'Administrator' : 'Student'}</small></div><span className="ns-online-dot" /></div><button className="ns-signout" onClick={handleLogout}><LogOut size={16} /> Sign out</button></div>
      </aside>
      {sidebarOpen && <button className="ns-app-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
      <div className="ns-app-main"><header className="ns-topbar"><div className="ns-topbar-left"><button className="ns-menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div><div className="ns-breadcrumb">Northstar <ChevronRight size={12} /> <strong>{activePage}</strong></div><h1>{activePage}</h1></div></div><div className="ns-topbar-right"><div className="ns-date"><span>{today}</span><small>Welcome back, {user?.name?.split(' ')[0] || 'there'}</small></div><div className="ns-top-avatar">{user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'N'}</div></div></header><main className="ns-app-content"><div className="ns-content-inner">{children}</div><footer className="ns-app-footer"><span>Northstar University</span><span>Learn with purpose. Go with confidence.</span></footer></main></div>
    </div>
  );
};

export default Layout;
