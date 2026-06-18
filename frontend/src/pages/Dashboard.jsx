import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Spinner from '../components/Spinner'
import Sidebar from '../components/Sidebar'

const PRIMARY = '#3D280D'
const PRIMARY_PALE = '#F5EDE4'
const BORDER = '#E8D5C4'
const SUBTEXT = '#8B6F5E'
const TEXT = '#1A0F00'

export default function Dashboard() {
  const [groups, setGroups] = useState([])
  const [groupName, setGroupName] = useState('')
  const [groupDesc, setGroupDesc] = useState('')
  const [groupColor, setGroupColor] = useState(PRIMARY)
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')

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
      setGroupColor(PRIMARY)
      setShowCreateModal(false)
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
      setShowJoinModal(false)
      toast.success('Joined group! 🎉')
      fetchGroups()
    } catch (err) {
      toast.error('Invalid invite code')
    }
  }

  return (
    <div style={styles.page}>
      <Sidebar isGroupPage={false} />

      <div style={styles.main}>

        {/* Top bar */}
        <div style={styles.topbar}>
          <input style={styles.search} placeholder="🔍 Search..." />
          <button style={styles.newBtn} onClick={() => setShowCreateModal(true)}>+ New Group</button>
        </div>

        <div style={styles.content}>
          <h1 style={styles.greeting}>Good day, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={styles.subGreeting}>Here's what's happening across your groups</p>

          {/* Stats Row */}
          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <p style={styles.statIcon}>👥</p>
              <p style={styles.statNumber}>{groups.length}</p>
              <p style={styles.statLabel}>Your Groups</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statIcon}>✅</p>
              <p style={styles.statNumber}>—</p>
              <p style={styles.statLabel}>Open Tasks</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statIcon}>📢</p>
              <p style={styles.statNumber}>—</p>
              <p style={styles.statLabel}>Announcements</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={styles.quickActions}>
            <button style={styles.actionBtn} onClick={() => setShowCreateModal(true)}>+ New Group</button>
            <button style={styles.actionBtnSecondary} onClick={() => setShowJoinModal(true)}>🔗 Join Group</button>
          </div>

          {/* Groups Grid */}
          <h2 style={styles.sectionTitle}>Your Groups</h2>
          {loading ? (
            <Spinner />
          ) : groups.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyIcon}>📭</p>
              <p style={styles.emptyText}>No groups yet. Create or join one to get started!</p>
            </div>
          ) : (
            <div style={styles.groupsGrid}>
              {groups.map(group => (
                <div
                  key={group._id}
                  className="card-hover fade-in"
                  style={{ ...styles.groupCard, borderTop: `3px solid ${group.color || PRIMARY}` }}
                  onClick={() => navigate(`/group/${group._id}`)}
                >
                  <div style={{ ...styles.groupCardAvatar, background: group.color || PRIMARY }}>
                    {group.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 style={styles.groupCardName}>{group.name}</h3>
                  <p style={styles.groupCardDesc}>{group.description || 'No description'}</p>
                  <p style={styles.groupCardInvite}>Code: <strong>{group.inviteCode}</strong></p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div style={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Create a new group</h3>
            <form onSubmit={createGroup}>
              <input
                style={styles.modalInput}
                type="text"
                placeholder="Group name"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                required
              />
              <input
                style={styles.modalInput}
                type="text"
                placeholder="Description (optional)"
                value={groupDesc}
                onChange={e => setGroupDesc(e.target.value)}
              />
              <div style={styles.colorRow}>
                {['#3D280D', '#ef4444', '#10b981', '#f59e0b', '#6366f1', '#ec4899'].map(c => (
                  <div
                    key={c}
                    onClick={() => setGroupColor(c)}
                    style={{
                      ...styles.colorDot,
                      background: c,
                      border: groupColor === c ? '3px solid #1A0F00' : '3px solid transparent'
                    }}
                  />
                ))}
              </div>
              <button style={styles.modalButton} type="submit">Create Group</button>
            </form>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {showJoinModal && (
        <div style={styles.modalOverlay} onClick={() => setShowJoinModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Join a group</h3>
            <form onSubmit={joinGroup}>
              <input
                style={styles.modalInput}
                type="text"
                placeholder="Enter invite code"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value)}
                required
              />
              <button style={styles.modalButton} type="submit">Join Group</button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#FFFFFF', fontFamily: "'Inter', sans-serif" },
  main: { flex: 1, display: 'flex', flexDirection: 'column' },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    borderBottom: `1px solid ${BORDER}`
  },
  search: {
    flex: 1,
    maxWidth: '320px',
    padding: '8px 14px',
    borderRadius: '8px',
    border: `1px solid ${BORDER}`,
    fontSize: '13px',
    outline: 'none'
  },
  newBtn: {
    background: PRIMARY,
    color: 'white',
    border: 'none',
    padding: '9px 18px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  content: { padding: '32px', maxWidth: '1000px' },
  greeting: { fontSize: '28px', fontWeight: '800', color: TEXT, marginBottom: '4px' },
  subGreeting: { fontSize: '14px', color: SUBTEXT, marginBottom: '28px' },
  statsRow: { display: 'flex', gap: '16px', marginBottom: '28px' },
  statCard: {
    flex: 1,
    background: PRIMARY_PALE,
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center'
  },
  statIcon: { fontSize: '20px', marginBottom: '6px' },
  statNumber: { fontSize: '24px', fontWeight: '800', color: TEXT },
  statLabel: { fontSize: '12px', color: SUBTEXT, marginTop: '2px' },
  quickActions: { display: 'flex', gap: '12px', marginBottom: '32px' },
  actionBtn: {
    background: PRIMARY,
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  actionBtnSecondary: {
    background: 'white',
    color: TEXT,
    border: `1px solid ${BORDER}`,
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer'
  },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: TEXT, marginBottom: '16px' },
  emptyState: { textAlign: 'center', padding: '60px 0' },
  emptyIcon: { fontSize: '32px', marginBottom: '12px' },
  emptyText: { fontSize: '13px', color: SUBTEXT },
  groupsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px'
  },
  groupCard: {
    background: 'white',
    border: `1px solid ${BORDER}`,
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer'
  },
  groupCardAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '15px',
    marginBottom: '12px'
  },
  groupCardName: { fontSize: '15px', fontWeight: '700', color: TEXT, marginBottom: '4px' },
  groupCardDesc: { fontSize: '12px', color: SUBTEXT, marginBottom: '10px' },
  groupCardInvite: { fontSize: '11px', color: PRIMARY },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(26, 15, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    padding: '28px',
    width: '90%',
    maxWidth: '380px'
  },
  modalTitle: { fontSize: '17px', fontWeight: '700', color: TEXT, marginBottom: '18px' },
  modalInput: {
    width: '100%',
    padding: '11px',
    marginBottom: '12px',
    borderRadius: '8px',
    border: `1px solid ${BORDER}`,
    fontSize: '13px',
    boxSizing: 'border-box',
    outline: 'none'
  },
  colorRow: { display: 'flex', gap: '8px', marginBottom: '16px' },
  colorDot: { width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer' },
  modalButton: {
    width: '100%',
    padding: '11px',
    background: PRIMARY,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer'
  }
}