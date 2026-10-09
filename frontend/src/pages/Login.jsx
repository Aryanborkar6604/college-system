import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, User, Lock, Mail, Compass, BookOpen, UsersRound, ArrowUpRight, ShieldCheck } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = isLogin ? await login(email, password) : await register({ name, email, password, role });
    if (result.success) navigate('/');
    else setError(result.message);
  };

  const openRegister = () => {
    setIsLogin(false);
    document.getElementById('portal-access')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="northstar-page" id="top">
      <header className="ns-header">
        <a className="ns-brand" href="#top"><span className="ns-brand-icon"><GraduationCap size={19} /></span><span>Northstar <i>University</i></span></a>
        <nav className="ns-nav"><a href="#experience">Experience</a><a href="#student-life">Student life</a><a href="#outcomes">Outcomes</a></nav>
        <a className="ns-nav-cta" href="#portal-access">Portal sign in <ArrowRight size={14} /></a>
      </header>

      <main>
        <section className="ns-hero">
          <div className="ns-hero-copy">
            <div className="ns-eyebrow"><span /> A place to find your direction</div>
            <h1>Make room for<br /><em>what’s next.</em></h1>
            <p>A university experience built around your ambition. Find your people, discover your strengths, and turn what inspires you into what’s possible.</p>
            <div className="ns-hero-actions"><button className="ns-button" onClick={openRegister}>Start your journey <ArrowRight size={15} /></button><a href="#experience">Discover Northstar <ArrowRight size={14} /></a></div>
            <div className="ns-proof"><div className="ns-avatars"><span>J</span><span>M</span><span>A</span><span>+</span></div><div><strong>A community that moves you forward</strong><small>Learn together. Go further.</small></div></div>
          </div>
          <div className="ns-hero-image"><img src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1500&q=85" alt="A university campus framed by trees" /><div className="ns-image-gradient" /><div className="ns-image-caption"><span>YOUR NEXT CHAPTER STARTS HERE</span><strong>Curiosity has a home.</strong></div><div className="ns-image-note"><span>✦</span><div><b>Room to become</b><small>Built around your potential</small></div></div></div>
        </section>

        <section className="ns-access" id="portal-access">
          <div className="ns-access-copy"><div className="ns-eyebrow"><span /> Your campus, connected</div><h2>Everything you need<br />to <em>move forward.</em></h2><p>Keep your academic life in sync—from your first application to every milestone after.</p><ul><li><ShieldCheck size={16} /> One home for your college life</li><li><ShieldCheck size={16} /> Stay on top of every next step</li></ul></div>
          <div className="ns-login-card">
            <div className="ns-login-heading"><span><ArrowRight size={18} /></span><div><small>NORTHSTAR STUDENT &amp; STAFF PORTAL</small><h2>{isLogin ? 'Welcome in.' : 'Join Northstar.'}</h2></div></div>
            <p className="ns-login-subtitle">{isLogin ? 'Sign in to pick up where you left off.' : 'Create your campus account to get started.'}</p>
            <form onSubmit={handleSubmit} className="ns-form">
              {!isLogin && <div className="ns-field"><label>Full name</label><div className="ns-input"><User size={16} /><input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="name" /></div></div>}
              <div className="ns-field"><label>Email address</label><div className="ns-input"><Mail size={16} /><input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.edu" autoComplete="email" /></div></div>
              <div className="ns-field"><label>Password</label><div className="ns-input"><Lock size={16} /><input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoComplete={isLogin ? 'current-password' : 'new-password'} /></div></div>
              {!isLogin && <div className="ns-field"><label>I’m joining as</label><select value={role} onChange={e => setRole(e.target.value)}><option value="student">Student</option><option value="admin">Administrator</option></select></div>}
              {error && <div className="ns-error" role="alert">{error}</div>}
              <button type="submit" className="ns-submit">{isLogin ? 'Continue to your portal' : 'Create your account'} <ArrowRight size={16} /></button>
              <button type="button" className="ns-switch" onClick={() => { setIsLogin(!isLogin); setError(''); }}>{isLogin ? 'New to Northstar? Create an account' : 'Already have an account? Sign in'}</button>
            </form>
            <div className="ns-card-foot"><ShieldCheck size={14} /> Your campus, all in one place</div>
          </div>
        </section>

        <section className="ns-experience" id="experience"><div className="ns-section-heading"><div><div className="ns-eyebrow"><span /> Designed around you</div><h2>More than a campus.<br /><em>A launchpad.</em></h2></div><p>Find the tools, support, and opportunities to make your time here count.</p></div><div className="ns-feature-grid"><article className="ns-feature ns-feature-blue"><span className="ns-feature-icon"><Compass size={19} /></span><small>01 / FIND YOUR WAY</small><h3>Your goals,<br />in clear view.</h3><p>Keep classes, attendance, exams, and important dates together in one helpful space.</p><a href="#portal-access" aria-label="Access your student dashboard"><ArrowUpRight size={17} /></a></article><article className="ns-feature ns-feature-sand"><span className="ns-feature-icon"><BookOpen size={19} /></span><small>02 / KEEP GROWING</small><h3>Progress you<br />can feel.</h3><p>See your academic progress and take the next step with a clearer picture.</p><a href="#portal-access" aria-label="Access your academic progress"><ArrowUpRight size={17} /></a></article><article className="ns-feature ns-feature-green"><span className="ns-feature-icon"><UsersRound size={19} /></span><small>03 / STAY IN THE LOOP</small><h3>Campus life,<br />in sync.</h3><p>Get notices, application updates, and details that keep college life moving.</p><a href="#portal-access" aria-label="Access campus updates"><ArrowUpRight size={17} /></a></article></div></section>

        <section className="ns-community" id="student-life"><div className="ns-community-image"><img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1300&q=85" alt="Students learning and collaborating together" loading="lazy" /></div><div className="ns-community-copy"><div className="ns-eyebrow"><span /> The Northstar difference</div><h2>Big ideas grow<br /><em>better together.</em></h2><p>Learning reaches beyond the lecture hall. Find a community that challenges you, backs you, and celebrates the person you’re becoming.</p><a className="ns-dark-button" href="#portal-access">Find your place <ArrowRight size={15} /></a></div></section>

        <section className="ns-outcomes" id="outcomes"><div><b>01</b><strong>Purposeful learning</strong><small>Make every class count.</small></div><div><b>02</b><strong>People who get you</strong><small>Belong from day one.</small></div><div><b>03</b><strong>A future in focus</strong><small>Build what comes next.</small></div></section>
      </main>
      <footer className="ns-footer"><a className="ns-brand" href="#top"><span className="ns-brand-icon"><GraduationCap size={18} /></span><span>Northstar <i>University</i></span></a><span>Learn with purpose. Go with confidence.</span><a href="#portal-access">Campus portal <ArrowRight size={13} /></a></footer>
    </div>
  );
};

export default Login;
