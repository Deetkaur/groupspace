import { useNavigate, useLocation } from 'react-router-dom'

const PRIMARY = '#3D280D'
const PRIMARY_PALE = '#F5EDE4'
const BORDER = '#E8D5C4'
const SUBTEXT = '#8B6F5E'
const TEXT = '#1A0F00'

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard', path: '/dashboard' },
  { icon: '✅', label: 'Tasks', path: 'tasks' },
  { icon: '📝', label: 'Notes', path: 'notes' },
  { icon: '📢', label: 'Announcements', path: 'announcements' },
  { icon: '👥', label: 'Members', path: 'members' },
]

export default function Sidebar({ group, activeTab, setActiveTab, isGroupPage }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleNavClick = (item) => {
    if (item.path === '/dashboard') {
      navigate('/dashboard')
    } else if (isGroupPage) {
      setActiveTab(item.path)
    }
  }

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div style={styles.sidebar}>

      {/* Logo */}
      <div style={styles.logoRow} onClick={() => navigate('/dashboard')}>
        <span style={styles.logoIcon}>🪵</span>
        <span style={styles.logoText}>GroupSpace</span>
      </div>

      {/* Current Group */}
      {group && (
        <div style={styles.groupCard}>
          <div style={{ ...styles.groupAvatar, background: group.color || PRIMARY }}>
            {group.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={styles.groupName}>{group.name}</p>
            <p style={styles.groupMembers}>{group.members?.length || 0} members</p>
          </div>
        </div>
      )}

      {/* Nav Items */}
      {isGroupPage && (
        <div style={styles.navList}>
          {NAV_ITEMS.map(item => {
            const isActive = item.path === '/dashboard' ? false : activeTab === item.path
            return (
              <div
                key={item.label}
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {})
                }}
                onClick={() => handleNavClick(item)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Bottom - User */}
      <div style={styles.bottomSection}>
        <div style={styles.userRow}>
          <div style={styles.userAvatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={styles.userInfo}>
            <p style={styles.userName}>{user?.name}</p>
            <p style={styles.userEmail}>{user?.email}</p>
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={logout}>
          🚪 Logout
        </button>
      </div>

    </div>
  )
}

const styles = {
  sidebar: {
    width: '240px',
    height: '100vh',
    background: '#FAFAF8',
    borderRight: `1px solid ${BORDER}`,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    position: 'sticky',
    top: 0
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '20px 20px 16px',
    cursor: 'pointer'
  },
  logoIcon: { fontSize: '18px' },
  logoText: { fontWeight: '700', fontSize: '15px', color: TEXT },
  groupCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '0 12px 16px',
    padding: '10px 12px',
    background: PRIMARY_PALE,
    borderRadius: '10px'
  },
  groupAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
    flexShrink: 0
  },
  groupName: { fontSize: '13px', fontWeight: '600', color: TEXT },
  groupMembers: { fontSize: '11px', color: SUBTEXT },
  navList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '0 12px',
    flex: 1
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    color: SUBTEXT,
    cursor: 'pointer'
  },
  navItemActive: {
    background: PRIMARY_PALE,
    color: PRIMARY,
    fontWeight: '600'
  },
  bottomSection: {
    borderTop: `1px solid ${BORDER}`,
    padding: '16px 20px'
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px'
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: PRIMARY,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '13px',
    flexShrink: 0
  },
  userInfo: { overflow: 'hidden' },
  userName: { fontSize: '13px', fontWeight: '600', color: TEXT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userEmail: { fontSize: '11px', color: SUBTEXT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  logoutBtn: {
    width: '100%',
    padding: '8px',
    background: 'white',
    border: `1px solid ${BORDER}`,
    borderRadius: '8px',
    fontSize: '12px',
    color: SUBTEXT,
    cursor: 'pointer'
  }
}