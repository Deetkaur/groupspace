import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🪵</span>
            <span style={styles.logoText}>GroupSpace</span>
          </div>
        </div>
        <div style={styles.navCenter}>
          <a style={styles.navLink} href="#features">Features</a>
          <a style={styles.navLink} href="#testimonials">Testimonials</a>
        </div>
        <div style={styles.navRight}>
          <button style={styles.loginBtn} onClick={() => navigate('/login')}>Log in</button>
          <button style={styles.getStartedBtn} onClick={() => navigate('/register')}>Get Started →</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>
          <span style={styles.heroBadgeDot}>●</span>
          New — Real-time collaboration, now in beta
        </div>
        <h1 style={styles.heroTitle}>
          Organize your group<br />life, all in one place
        </h1>
        <p style={styles.heroSubtitle}>
          One beautifully simple workspace for families, friends, and teams.<br />
          Shared tasks, notes, announcements, and schedules — all together.
        </p>
        <div style={styles.heroButtons}>
          <button style={styles.heroBtn} onClick={() => navigate('/register')}>
            Get Started Free →
          </button>
          <button style={styles.heroSecondaryBtn}>
            ▷ Watch demo
          </button>
        </div>
        <p style={styles.heroNote}>Free forever for up to 5 members. No credit card required.</p>

        {/* App Preview */}
        <div style={styles.previewContainer}>
          <div style={styles.previewBar}>
            <div style={styles.previewDots}>
              <span style={{ ...styles.dot, background: '#ff5f57' }}></span>
              <span style={{ ...styles.dot, background: '#febc2e' }}></span>
              <span style={{ ...styles.dot, background: '#28c840' }}></span>
            </div>
            <span style={styles.previewUrl}>groupspace.app/family-dashboard</span>
          </div>
          <div style={styles.previewContent}>
            <div style={styles.previewSidebar}>
              <div style={styles.previewSidebarItem}>🏠 Dashboard</div>
              <div style={styles.previewSidebarItem}>✅ Tasks</div>
              <div style={styles.previewSidebarItem}>📢 Announcements</div>
            </div>
            <div style={styles.previewMain}>
              <div style={styles.previewKanban}>
                {['TODO', 'IN PROGRESS', 'COMPLETED'].map(col => (
                  <div key={col} style={styles.previewColumn}>
                    <p style={styles.previewColTitle}>{col}</p>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={styles.previewCard}>
                        <div style={styles.previewCardLine}></div>
                        <div style={styles.previewCardLineShort}></div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <div style={styles.trustedSection}>
        <p style={styles.trustedText}>TRUSTED BY TEAMS EVERYWHERE</p>
        <div style={styles.trustedLogos}>
          {['Google', 'Spotify', 'Slack', 'Netflix', 'Airbnb', 'Stripe'].map(name => (
            <span key={name} style={styles.trustedLogo}>{name}</span>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section id="features" style={styles.featuresSection}>
        <p style={styles.featuresEyebrow}>Everything in one place</p>
        <h2 style={styles.featuresTitle}>A workspace that<br />bends to your group</h2>
        <p style={styles.featuresSubtitle}>
          Tasks, notes, announcements, and schedules —<br />designed to feel effortless together.
        </p>

        <div style={styles.featuresGrid}>
          {[
            { icon: '✅', title: 'Shared task boards', desc: 'Trello-style Kanban with drag and drop, priorities, due dates, and assignees.' },
            { icon: '📝', title: 'Collaborative notes', desc: 'Rich, nested pages with a clean writing experience inspired by Notion.' },
            { icon: '📢', title: 'Announcements', desc: 'Pin important updates so nobody misses what matters in the group.' },
            { icon: '📅', title: 'Shared calendar', desc: 'Plan events, reminders and deadlines together in one elegant view.' },
            { icon: '👥', title: 'Multi-tenant workspaces', desc: 'Spin up unlimited groups — family, friends, teams — and switch instantly.' },
            { icon: '⚡', title: 'Real-time everything', desc: 'Updates appear instantly. No refresh, no friction, just flow.' },
          ].map(feature => (
            <div key={feature.title} style={styles.featureCard}>
              <span style={styles.featureIcon}>{feature.icon}</span>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        {[
          { icon: '🔒', text: 'End-to-end encrypted' },
          { icon: '🌍', text: 'Available worldwide' },
          { icon: '⚡', text: 'Real-time sync' },
          { icon: '⏱️', text: '99.99% uptime' },
        ].map(stat => (
          <div key={stat.text} style={styles.statItem}>
            <span>{stat.icon}</span>
            <span style={styles.statText}>{stat.text}</span>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <section id="testimonials" style={styles.testimonialsSection}>
        <p style={styles.featuresEyebrow}>Loved by groups everywhere</p>
        <h2 style={styles.featuresTitle}>Built for the way<br />you actually live</h2>

        <div style={styles.testimonialsGrid}>
          {[
            { text: '"Finally, one place where mom\'s reminders, the trip plan, and the grocery list don\'t get lost in 6 group chats."', name: 'Maya & Family', sub: 'Brooklyn, NY' },
            { text: '"Replaced 3 tools for our small team. The notes + kanban combo is exactly what we needed."', name: 'Alex Rivera', sub: 'Design Lead, Northstar' },
            { text: '"Planned an entire trip without a single confused text. The shared calendar alone is worth it."', name: 'The Tokyo Crew', sub: 'Friend group of 4' },
          ].map(t => (
            <div key={t.name} style={styles.testimonialCard}>
              <div style={styles.stars}>★★★★★</div>
              <p style={styles.testimonialText}>{t.text}</p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.testimonialAvatar}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p style={styles.testimonialName}>{t.name}</p>
                  <p style={styles.testimonialSub}>{t.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to bring your<br />group together?</h2>
        <p style={styles.ctaSubtitle}>
          Set up your first shared workspace in under a minute.<br />
          Invite the crew, drop a task, watch the magic.
        </p>
        <button style={styles.ctaBtn} onClick={() => navigate('/register')}>
          Create your workspace →
        </button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerLeft}>
          <span style={styles.logoIcon}>🪵</span>
          <span style={styles.footerLogo}>GroupSpace © 2026</span>
        </div>
        <div style={styles.footerRight}>
          <a style={styles.footerLink} href="#">Privacy</a>
          <a style={styles.footerLink} href="#">Terms</a>
          <a style={styles.footerLink} href="#">Contact</a>
        </div>
      </footer>

    </div>
  )
}

const PRIMARY = '#3D280D'
const PRIMARY_LIGHT = '#6B4423'
const PRIMARY_PALE = '#F5EDE4'
const BORDER = '#E8D5C4'
const TEXT = '#1A0F00'
const SUBTEXT = '#8B6F5E'
const ACCENT = '#C4864A'

const styles = {
  container: {
    fontFamily: "'Inter', sans-serif",
    background: '#FFFFFF',
    color: TEXT,
    overflowX: 'hidden'
  },

  // Navbar
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 48px',
    borderBottom: `1px solid ${BORDER}`,
    position: 'sticky',
    top: 0,
    background: 'white',
    zIndex: 100
  },
  navLeft: { display: 'flex', alignItems: 'center' },
  logo: { display: 'flex', alignItems: 'center', gap: '8px' },
  logoIcon: { fontSize: '20px' },
  logoText: { fontWeight: '700', fontSize: '16px', color: TEXT },
  navCenter: { display: 'flex', gap: '32px' },
  navLink: {
    color: SUBTEXT,
    textDecoration: 'none',
    fontSize: '14px',
    cursor: 'pointer'
  },
  navRight: { display: 'flex', gap: '12px', alignItems: 'center' },
  loginBtn: {
    background: 'none',
    border: 'none',
    color: TEXT,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  getStartedBtn: {
    background: PRIMARY,
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },

  // Hero
  hero: {
    textAlign: 'center',
    padding: '80px 48px 60px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: PRIMARY_PALE,
    border: `1px solid ${BORDER}`,
    borderRadius: '20px',
    padding: '6px 16px',
    fontSize: '13px',
    color: PRIMARY,
    marginBottom: '32px'
  },
  heroBadgeDot: { color: '#22c55e', fontSize: '10px' },
  heroTitle: {
    fontSize: '56px',
    fontWeight: '800',
    lineHeight: '1.1',
    marginBottom: '20px',
    color: TEXT
  },
  heroSubtitle: {
    fontSize: '18px',
    color: SUBTEXT,
    lineHeight: '1.6',
    marginBottom: '32px'
  },
  heroButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  heroBtn: {
    background: PRIMARY,
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600'
  },
  heroSecondaryBtn: {
    background: 'white',
    color: TEXT,
    border: `1px solid ${BORDER}`,
    padding: '14px 28px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px'
  },
  heroNote: { fontSize: '13px', color: SUBTEXT, marginBottom: '48px' },

  // Preview
  previewContainer: {
    background: 'white',
    border: `1px solid ${BORDER}`,
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(61, 40, 13, 0.15)',
    overflow: 'hidden',
    maxWidth: '700px',
    margin: '0 auto'
  },
  previewBar: {
    background: '#f5f5f5',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: `1px solid ${BORDER}`
  },
  previewDots: { display: 'flex', gap: '6px' },
  dot: { width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' },
  previewUrl: { fontSize: '12px', color: SUBTEXT },
  previewContent: { display: 'flex', height: '200px' },
  previewSidebar: {
    width: '140px',
    background: PRIMARY_PALE,
    padding: '16px 12px',
    borderRight: `1px solid ${BORDER}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  previewSidebarItem: { fontSize: '11px', color: PRIMARY, padding: '4px 8px' },
  previewMain: { flex: 1, padding: '16px' },
  previewKanban: { display: 'flex', gap: '8px', height: '100%' },
  previewColumn: { flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' },
  previewColTitle: { fontSize: '9px', fontWeight: '700', color: SUBTEXT, marginBottom: '4px' },
  previewCard: {
    background: PRIMARY_PALE,
    borderRadius: '4px',
    padding: '6px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  previewCardLine: { height: '6px', background: BORDER, borderRadius: '3px', width: '80%' },
  previewCardLineShort: { height: '4px', background: BORDER, borderRadius: '3px', width: '50%' },

  // Trusted
  trustedSection: {
    textAlign: 'center',
    padding: '48px',
    borderTop: `1px solid ${BORDER}`,
    borderBottom: `1px solid ${BORDER}`
  },
  trustedText: { fontSize: '12px', color: SUBTEXT, letterSpacing: '1px', marginBottom: '20px' },
  trustedLogos: { display: 'flex', justifyContent: 'center', gap: '48px' },
  trustedLogo: { fontSize: '14px', color: SUBTEXT, fontWeight: '500' },

  // Features
  featuresSection: {
    textAlign: 'center',
    padding: '80px 48px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  featuresEyebrow: { fontSize: '13px', color: ACCENT, fontWeight: '600', marginBottom: '12px' },
  featuresTitle: { fontSize: '40px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' },
  featuresSubtitle: { fontSize: '16px', color: SUBTEXT, marginBottom: '48px', lineHeight: '1.6' },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    textAlign: 'left'
  },
  featureCard: {
    border: `1px solid ${BORDER}`,
    borderRadius: '12px',
    padding: '24px',
    background: 'white'
  },
  featureIcon: { fontSize: '24px', display: 'block', marginBottom: '12px' },
  featureTitle: { fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: TEXT },
  featureDesc: { fontSize: '13px', color: SUBTEXT, lineHeight: '1.6' },

  // Stats
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '48px',
    padding: '24px 48px',
    background: PRIMARY_PALE,
    borderTop: `1px solid ${BORDER}`,
    borderBottom: `1px solid ${BORDER}`
  },
  statItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  statText: { fontSize: '13px', color: PRIMARY, fontWeight: '500' },

  // Testimonials
  testimonialsSection: {
    textAlign: 'center',
    padding: '80px 48px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    textAlign: 'left',
    marginTop: '48px'
  },
  testimonialCard: {
    border: `1px solid ${BORDER}`,
    borderRadius: '12px',
    padding: '24px',
    background: 'white'
  },
  stars: { color: ACCENT, marginBottom: '12px', fontSize: '16px' },
  testimonialText: { fontSize: '13px', color: SUBTEXT, lineHeight: '1.7', marginBottom: '16px' },
  testimonialAuthor: { display: 'flex', alignItems: 'center', gap: '10px' },
  testimonialAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: PRIMARY,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
    flexShrink: 0
  },
  testimonialName: { fontSize: '13px', fontWeight: '700', color: TEXT },
  testimonialSub: { fontSize: '12px', color: SUBTEXT },

  // CTA
  ctaSection: {
    background: PRIMARY,
    color: 'white',
    textAlign: 'center',
    padding: '80px 48px',
    margin: '0 48px 48px',
    borderRadius: '16px'
  },
  ctaTitle: { fontSize: '40px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' },
  ctaSubtitle: { fontSize: '16px', opacity: 0.8, marginBottom: '32px', lineHeight: '1.6' },
  ctaBtn: {
    background: 'white',
    color: PRIMARY,
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700'
  },

  // Footer
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 48px',
    borderTop: `1px solid ${BORDER}`
  },
  footerLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  footerLogo: { fontSize: '13px', color: SUBTEXT },
  footerRight: { display: 'flex', gap: '24px' },
  footerLink: { fontSize: '13px', color: SUBTEXT, textDecoration: 'none' }
}