import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const PRIMARY = '#3D280D'
const BORDER = '#E8D5C4'
const SUBTEXT = '#8B6F5E'
const TEXT = '#1A0F00'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      toast.success('Account created! 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Registration failed. Try again.')
    }
  }

  return (
    <div style={styles.container}>

      {/* Logo */}
      <div style={styles.logoRow} onClick={() => navigate('/')}>
        <span style={styles.logoIcon}>🪵</span>
        <span style={styles.logoText}>GroupSpace</span>
      </div>

      {/* Card */}
      <div style={styles.card}>
        <h2 style={styles.title}>Create your account</h2>
        <p style={styles.subtitle}>Start collaborating in seconds</p>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>continue with email</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>👤</span>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>✉️</span>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>🔒</span>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button style={styles.button} type="submit">
            Create account →
          </button>
        </form>

        <p style={styles.link}>
          Already have an account?{' '}
          <Link to="/login" style={styles.linkText}>Log in</Link>
        </p>
      </div>

    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#FAFAF8',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', sans-serif"
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
    cursor: 'pointer'
  },
  logoIcon: { fontSize: '24px' },
  logoText: { fontWeight: '700', fontSize: '18px', color: TEXT },
  card: {
    background: 'white',
    border: `1px solid ${BORDER}`,
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 4px 24px rgba(61, 40, 13, 0.08)'
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: TEXT,
    marginBottom: '6px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '14px',
    color: SUBTEXT,
    textAlign: 'center',
    marginBottom: '24px'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: BORDER
  },
  dividerText: {
    fontSize: '12px',
    color: SUBTEXT,
    whiteSpace: 'nowrap'
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${BORDER}`,
    borderRadius: '8px',
    marginBottom: '12px',
    padding: '0 12px',
    background: 'white'
  },
  inputIcon: { fontSize: '14px', marginRight: '8px' },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    padding: '12px 0',
    fontSize: '14px',
    color: TEXT,
    background: 'transparent',
    fontFamily: "'Inter', sans-serif"
  },
  button: {
    width: '100%',
    padding: '13px',
    background: PRIMARY,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    marginBottom: '20px'
  },
  link: {
    textAlign: 'center',
    fontSize: '13px',
    color: SUBTEXT
  },
  linkText: {
    color: PRIMARY,
    fontWeight: '600',
    textDecoration: 'none'
  }
}