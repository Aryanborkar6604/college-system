import './DashboardPages.css';
import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import api from '../services/api';
import { Users, FileText, CheckSquare, ArrowRight, Activity, ClipboardCheck, BookOpen, ArrowUpRight, GraduationCap } from 'lucide-react';

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    let active = true;
    api.get('/admin/dashboard').then(({ data }) => { if (active) setStats(data); }).catch(err => { console.error(err); if (active) setLoadError(true); });
    return () => { active = false; };
  }, []);

  if (!stats && !loadError) return <div className="ns-admin-loading"><div className="ns-loading-mark"><Activity size={20} /></div><strong>Preparing your overview</strong><span>Loading the latest campus figures…</span><div className="ns-loading-line" /></div>;
  if (loadError) return <section className="ns-admin-error"><span className="ns-placeholder-icon"><Activity size={21} /></span><h2>We couldn’t load the overview.</h2><p>Check your connection and reload the page to try again.</p><button onClick={() => window.location.reload()}>Reload overview <ArrowRight size={14} /></button></section>;

  const metrics = [
    { label: 'Applications received', value: stats.totalApplications ?? 0, note: 'Across all submissions', icon: <FileText />, tone: 'teal' },
    { label: 'Enrolled students', value: stats.totalStudents ?? 0, note: 'Currently in the system', icon: <Users />, tone: 'gold' },
    { label: 'Awaiting review', value: stats.pendingApplications ?? 0, note: 'Applications needing attention', icon: <CheckSquare />, tone: 'rose' },
  ];
  return <div className="ns-admin-home">
    <section className="ns-admin-welcome"><div><span className="ns-admin-overline"><Activity size={13} /> CAMPUS AT A GLANCE</span><h2>A clearer view<br />of <em>what’s moving.</em></h2><p>Keep an eye on applications and student activity from one calm, connected workspace.</p></div><div className="ns-admin-welcome-mark"><div className="ns-mark-ring ring-one" /><div className="ns-mark-ring ring-two" /><div className="ns-mark-center"><GraduationCap size={28} /></div><span className="ns-mark-spark">✦</span></div></section>
    <div className="ns-admin-section-head"><div><span className="ns-section-kicker">THE ESSENTIALS</span><h3>Institution overview</h3></div><span>Current records</span></div>
    <section className="ns-admin-metrics">{metrics.map(item => <article className="ns-metric-card" key={item.label}><div className="ns-metric-top"><span>{item.label}</span><span className={'ns-metric-icon ' + item.tone}>{item.icon}</span></div><strong>{item.value}</strong><small>{item.note}</small><div className={'ns-metric-rule ' + item.tone} /></article>)}</section>
    <div className="ns-admin-lower"><section className="ns-admin-activity"><div className="ns-panel-heading"><div><span className="ns-section-kicker">LIVE FROM CAMPUS</span><h3>Recent activity</h3></div><span className="ns-live-indicator"><i /> Live</span></div><div className="ns-empty-activity"><span><Activity size={19} /></span><div><strong>No recent activity yet</strong><p>New submissions and updates will appear here as they come in.</p></div></div></section>
      <section className="ns-admin-quick"><span className="ns-section-kicker">QUICK ACCESS</span><h3>What would you like to do?</h3><Link to="/admin/applications"><span className="ns-quick-icon"><ClipboardCheck size={17} /></span><span><strong>Review applications</strong><small>Check incoming student submissions</small></span><ArrowUpRight size={15} /></Link><Link to="/admin/marks"><span className="ns-quick-icon gold"><BookOpen size={17} /></span><span><strong>Manage academics</strong><small>Open the marks management space</small></span><ArrowUpRight size={15} /></Link></section></div>
  </div>;
};

const AdminPlaceholder = ({ title, description }) => <section className="ns-placeholder"><span className="ns-placeholder-icon"><FileText size={22} /></span><span className="ns-section-kicker">ADMIN WORKSPACE</span><h2>{title}</h2><p>{description}</p><Link to="/admin" className="ns-outline-link">Back to overview <ArrowRight size={14} /></Link></section>;

const AdminDashboard = () => <Routes>
  <Route path="/" element={<AdminHome />} />
  <Route path="/marks" element={<AdminPlaceholder title="Marks management" description="Manage student marks and academic records from this workspace." />} />
  <Route path="/attendance" element={<AdminPlaceholder title="Attendance management" description="Review and manage student attendance records from this workspace." />} />
  <Route path="/exams" element={<AdminPlaceholder title="Exam links" description="Keep exam resources and question links organized for students." />} />
  <Route path="/applications" element={<AdminPlaceholder title="Applications" description="Review student applications and follow each submission through the process." />} />
</Routes>;

export default AdminDashboard;
