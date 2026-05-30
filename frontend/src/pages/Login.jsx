import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTheme } from '../context/ThemeContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const { colors, darkMode, toggleDarkMode } = useTheme()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      toast.success('Welcome back! 👋')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Invalid email or password')
    }
  }

  return (
    <div style={{ ...styles.container, background: colors.bg }}>
      <button
        onClick={toggleDarkMode}
        style={styles.darkToggle}
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
      <div style={{ ...styles.card, background: colors.card }}>
        <h2 style={{ ...styles.title, color: colors.text }}>Welcome Back 👋</h2>
        <p style={{ ...styles.subtitle, color: colors.subtext }}>Login to GroupSpace</p>

        <form onSubmit={handleSubmit}>
          <input
            style={{ ...styles.input, background: colors.input, borderColor: colors.inputBorder, color: colors.text }}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            style={{ ...styles.input, background: colors.input, borderColor: colors.inputBorder, color: colors.text }}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button style={styles.button} type="submit">Login</button>
        </form>

        <p style={{ ...styles.link, color: colors.subtext }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    position: 'relative'
  },
  darkToggle: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  card: {
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    animation: 'fadeIn 0.4s ease'
  },
  title: { fontSize: '24px', marginBottom: '8px', fontWeight: '700' },
  subtitle: { marginBottom: '24px', fontSize: '14px' },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '14px',
    display: 'block',
    boxSizing: 'border-box',
    transition: 'border 0.2s'
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '8px',
    transition: 'opacity 0.2s'
  },
  link: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '14px'
  }
}