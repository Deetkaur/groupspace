import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Spinner from '../components/Spinner'
import { useTheme } from '../context/ThemeContext'

export default function Dashboard() {
  const [groups, setGroups] = useState([])
  const [groupName, setGroupName] = useState('')
  const [groupDesc, setGroupDesc] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [groupColor, setGroupColor] = useState('#4f46e5')
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  const { colors, darkMode, toggleDarkMode } = useTheme()

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/groups/mygroups', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setGroups(res.data)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const createGroup = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/groups/create',
        { name: groupName, description: groupDesc, color: groupColor },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setGroupName('')
      setGroupDesc('')
      setGroupColor('#4f46e5')
      toast.success('Group created! 🎉')
      fetchGroups()
    } catch (err) {
      toast.error('Failed to create group')
    }
  }

  const joinGroup = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/groups/join',
        { inviteCode },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setInviteCode('')
      toast.success('Joined group! 🎉')
      fetchGroups()
    } catch (err) {
      toast.error('Invalid invite code')
    }
  }

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div style={{ ...styles.container, background: colors.bg }}>

      {/* Header */}
      <div style={{ ...styles.header, background: colors.header }}>
        <h1 style={styles.logo}>🏠 GroupSpace</h1>
        <div style={styles.headerRight}>
          <button onClick={toggleDarkMode} style={styles.darkToggle}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <div style={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span style={styles.username}>{user?.name}</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>

        {/* Left Panel */}
        <div style={styles.leftPanel}>

          {/* Create Group */}
          <div style={{ ...styles.card, background: colors.card }}>
            <h3 style={styles.cardTitle}>➕ Create Group</h3>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={createGroup}>
              <input
                style={styles.input}
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                required
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Description (optional)"
                value={groupDesc}
                onChange={e => setGroupDesc(e.target.value)}
              />
              <div style={styles.colorRow}>
                <label style={styles.colorLabel}>Group Color:</label>
                <div style={styles.colorOptions}>
                  {['#4f46e5', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(c => (
                    <div
                      key={c}
                      onClick={() => setGroupColor(c)}
                      style={{
                        ...styles.colorDot,
                        background: c,
                        border: groupColor === c ? '3px solid #333' : '3px solid transparent'
                      }}
                    />
                  ))}
                </div>
              </div>
              <button style={styles.button} type="submit">Create</button>
            </form>
          </div>

          {/* Join Group */}
          <div style={{ ...styles.card, background: colors.card }}>
            <h3 style={styles.cardTitle}>🔗 Join Group</h3>
            <form onSubmit={joinGroup}>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter Invite Code"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value)}
                required
              />
              <button style={styles.button} type="submit">Join</button>
            </form>
          </div>

        </div>

        {/* Right Panel */}
        <div style={styles.rightPanel}>
          <h2 style={styles.sectionTitle}>Your Groups</h2>
          {loading ? (
            <Spinner />
          ) : groups.length === 0 ? (
            <p style={styles.empty}>No groups yet. Create or join one!</p>
          ) : (
            groups.map(group => (
              <div
                key={group._id}
                className="card-hover fade-in"
                style={{
                  ...styles.groupCard,
                  background: colors.card,
                  borderLeft: `4px solid ${group.color || '#4f46e5'}`
                }}
                onClick={() => navigate(`/group/${group._id}`)}
              >
                <h3 style={{ ...styles.groupName, color: group.color || '#4f46e5' }}>{group.name}</h3>
                <p style={styles.groupDesc}>{group.description}</p>
                <p style={styles.inviteCode}>Invite Code: <strong>{group.inviteCode}</strong></p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f0f2f5' },
  header: {
    background: '#4f46e5',
    color: 'white',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: { fontSize: '22px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  username: { fontSize: '14px' },
  logoutBtn: {
    background: 'white',
    color: '#4f46e5',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  body: {
    display: 'flex',
    gap: '24px',
    padding: '32px',
    maxWidth: '1100px',
    margin: '0 auto'
  },
  leftPanel: { width: '320px', flexShrink: 0 },
  rightPanel: { flex: 1 },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  cardTitle: { marginBottom: '16px', fontSize: '16px' },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    display: 'block',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '10px',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  sectionTitle: { marginBottom: '16px', fontSize: '20px' },
  empty: { color: '#888', fontSize: '14px' },
  groupCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'white',
    color: '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  colorRow: {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px'
  },
  colorLabel: { fontSize: '13px', color: '#555' },
  colorOptions: { display: 'flex', gap: '8px' },
  colorDot: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    cursor: 'pointer'
  },
  darkToggle: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '16px',
    color: 'white'
  },
  groupName: { fontSize: '18px', marginBottom: '4px' },
  groupDesc: { color: '#888', fontSize: '14px', marginBottom: '8px' },
  inviteCode: { fontSize: '12px', color: '#4f46e5' },
  error: { color: 'red', fontSize: '14px', marginBottom: '12px' }
}