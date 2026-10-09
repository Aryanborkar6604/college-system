import './DashboardPages.css';
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, LayoutDashboard, FileText, CreditCard, CalendarDays, BookOpen, Compass, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudentHome = () => {
  const { user } = useAuth();
  const firstName = user?.name?.trim().split(/\s+/)[0] || 'there';
  const shortcuts = [
    { title: 'Academic overview', detail: 'A clear view of your college journey.', label: 'Open dashboard', to: '/student/dashboard', icon: <LayoutDashboard />, tone: 'sage' },
    { title: 'Grades & scorecard', detail: 'Review marks and track your progress.', label: 'View scorecard', to: '/student/scorecard', icon: <FileText />, tone: 'sand' },
    { title: 'Fees & finances', detail: 'Keep important finance details close.', label: 'View finances', to: '/student/finance', icon: <CreditCard />, tone: 'blue' },
  ];
  return <div className="ns-student-home">
    <section className="ns-student-hero"><div className="ns-student-hero-orb" /><div className="ns-student-hero-content"><div className="ns-student-overline"><Sparkles size={14} /> YOUR NORTHSTAR</div><h2>Good to see you,<br /><em>{firstName}.</em></h2><p>Your college life, gathered in one place. Pick up where you left off and keep moving toward what’s next.</p><Link to="/student/dashboard" className="ns-hero-link">Explore your dashboard <ArrowRight size={15} /></Link></div><div className="ns-hero-illustration"><div className="ns-orbit ns-orbit-one" /><div className="ns-orbit ns-orbit-two" /><div className="ns-hero-icon"><Compass size={37} strokeWidth={1.4} /></div><div className="ns-hero-chip ns-chip-top"><BookOpen size={14} /> Keep learning</div><div className="ns-hero-chip ns-chip-bottom"><Sparkles size={14} /> Find your path</div></div></section>
    <div className="ns-student-section-title"><div><span className="ns-section-kicker">A GOOD PLACE TO START</span><h3>Your campus essentials</h3></div><span>Choose a space to continue</span></div>
    <section className="ns-student-shortcuts">{shortcuts.map(item => <Link to={item.to} className="ns-shortcut-card" key={item.title}><span className={'ns-shortcut-icon ' + item.tone}>{item.icon}</span><span className="ns-shortcut-title">{item.title}</span><span className="ns-shortcut-detail">{item.detail}</span><span className="ns-shortcut-link">{item.label}<ArrowUpRight size={15} /></span></Link>)}</section>
    <section className="ns-student-bottom"><div className="ns-student-message"><span className="ns-message-icon"><CalendarDays size={19} /></span><div><small>MAKE SPACE FOR WHAT MATTERS</small><h3>Your next step starts here.</h3><p>Check your exam timetable, stay close to your academic progress, and keep the practical details in view.</p></div></div><Link to="/student/exams" className="ns-outline-link">View exam timetable <ArrowRight size={14} /></Link></section>
  </div>;
};

const StudentPlaceholder = ({ title, description }) => <section className="ns-placeholder"><span className="ns-placeholder-icon"><BookOpen size={22} /></span><span className="ns-section-kicker">YOUR NORTHSTAR</span><h2>{title}</h2><p>{description}</p><Link to="/student" className="ns-outline-link">Back to home <ArrowRight size={14} /></Link></section>;

const StudentDashboard = () => <Routes>
  <Route path="/" element={<StudentHome />} />
  <Route path="/dashboard" element={<StudentPlaceholder title="Your academic overview" description="A fuller view of your classes, attendance, and academic progress will be available here." />} />
  <Route path="/scorecard" element={<StudentPlaceholder title="Grades & scorecard" description="Your marks and academic results will be available here when they’re published." />} />
  <Route path="/exams" element={<StudentPlaceholder title="Exam timetable" description="Your upcoming exams and related details will be gathered here." />} />
  <Route path="/finance" element={<StudentPlaceholder title="Fees & finances" description="Your fee information and payment details will be available here." />} />
</Routes>;

export default StudentDashboard;
