import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
import Sidebar from '../components/Sidebar'

const PRIMARY = '#3D280D'
const PRIMARY_PALE = '#F5EDE4'
const BORDER = '#E8D5C4'
const SUBTEXT = '#8B6F5E'
const TEXT = '#1A0F00'
const ACCENT = '#C4864A'

const PRIORITIES = {
  high: { label: 'High', color: '#ef4444', bg: '#fee2e2' },
  medium: { label: 'Medium', color: '#f59e0b', bg: '#fef3c7' },
  low: { label: 'Low', color: '#10b981', bg: '#d1fae5' }
}

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: '#6366f1' },
  { id: 'inprogress', label: 'In Progress', color: '#f59e0b' },
  { id: 'done', label: 'Done', color: '#10b981' }
]

export default function GroupPage() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [tasks, setTasks] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [group, setGroup] = useState(null)
  const [activeTab, setActiveTab] = useState('tasks')
  const [search, setSearch] = useState('')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showAnnForm, setShowAnnForm] = useState(false)

  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskPriority, setTaskPriority] = useState('medium')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [annTitle, setAnnTitle] = useState('')
  const [annContent, setAnnContent] = useState('')

  useEffect(() => {
    fetchTasks()
    fetchAnnouncements()
    fetchGroup()

    const socket = io('http://localhost:5000')
    socket.emit('join_group', groupId)

    socket.on('task_added', (task) => {
      setTasks(prev => [...prev, task])
    })
    socket.on('task_updated', (updatedTask) => {
      setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t))
    })
    socket.on('task_deleted', (taskId) => {
      setTasks(prev => prev.filter(t => t._id !== taskId))
    })
    socket.on('announcement_added', (announcement) => {
      setAnnouncements(prev => [announcement, ...prev])
    })

    return () => {
      socket.emit('leave_group', groupId)
      socket.disconnect()
    }
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTasks(res.data)
    } catch (err) { console.error(err) }
  }

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/announcements/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAnnouncements(res.data)
    } catch (err) { console.error(err) }
  }

  const fetchGroup = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setGroup(res.data)
    } catch (err) { console.error(err) }
  }

  const createTask = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`http://localhost:5000/api/tasks/${groupId}`,
        { title: taskTitle, description: taskDesc, priority: taskPriority, dueDate: taskDueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTaskTitle(''); setTaskDesc(''); setTaskPriority('medium'); setTaskDueDate('')
      setShowTaskForm(false)
      toast.success('Task added! ✅')
      fetchTasks()
    } catch (err) { toast.error('Failed to add task') }
  }

  const moveTask = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${groupId}/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchTasks()
    } catch (err) { toast.error('Failed to move task') }
  }

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${groupId}/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Task deleted!')
      fetchTasks()
    } catch (err) { toast.error('Failed to delete task') }
  }

  const createAnnouncement = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`http://localhost:5000/api/announcements/${groupId}`,
        { title: annTitle, content: annContent },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setAnnTitle(''); setAnnContent('')
      setShowAnnForm(false)
      toast.success('Announcement posted! 📢')
      fetchAnnouncements()
    } catch (err) { toast.error('Failed to post announcement') }
  }

  const deleteAnnouncement = async (annId) => {
    try {
      await axios.delete(`http://localhost:5000/api/announcements/${groupId}/${annId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Deleted!')
      fetchAnnouncements()
    } catch (err) { toast.error('Failed to delete') }
  }

  const isOverdue = (dueDate) => dueDate && new Date(dueDate) < new Date()

  return (
    <div style={styles.page}>
      <Sidebar
        group={group}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isGroupPage={true}
      />

      <div style={styles.main}>

        {/* Topbar */}
        <div style={styles.topbar}>
          <input
            style={styles.search}
            placeholder="🔍 Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            style={styles.newBtn}
            onClick={() => activeTab === 'tasks' ? setShowTaskForm(true) : setShowAnnForm(true)}
          >
            + New
          </button>
        </div>

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div style={styles.content}>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Tasks</h1>
              <p style={styles.pageSubtitle}>Drag cards across columns to update status.</p>
            </div>

            {/* Kanban */}
            <div style={styles.kanban}>
              {COLUMNS.map(col => (
                <div key={col.id} style={styles.column}>
                  <div style={styles.columnHeader}>
                    <div style={styles.columnHeaderLeft}>
                      <span style={{ ...styles.columnDot, background: col.color }}></span>
                      <span style={styles.columnTitle}>{col.label}</span>
                      <span style={styles.columnCount}>
                        {tasks.filter(t => t.status === col.id).length}
                      </span>
                    </div>
                    <button
                      style={styles.addColBtn}
                      onClick={() => setShowTaskForm(true)}
                    >+</button>
                  </div>

                  {tasks
                    .filter(t => t.status === col.id)
                    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
                    .map(task => (
                      <div key={task._id} style={styles.taskCard}>
                        <div style={styles.taskCardTop}>
                          <span style={{
                            ...styles.priorityBadge,
                            color: PRIORITIES[task.priority]?.color,
                            background: PRIORITIES[task.priority]?.bg
                          }}>
                            {PRIORITIES[task.priority]?.label}
                          </span>
                          <button style={styles.deleteBtn} onClick={() => deleteTask(task._id)}>🗑️</button>
                        </div>

                        <p style={styles.taskTitle}>{task.title}</p>
                        {task.description && <p style={styles.taskDesc}>{task.description}</p>}

                        {task.dueDate && (
                          <p style={{ ...styles.dueDate, color: isOverdue(task.dueDate) ? '#ef4444' : SUBTEXT }}>
                            📅 {new Date(task.dueDate).toLocaleDateString()}
                            {isOverdue(task.dueDate) && ' ⚠️'}
                          </p>
                        )}

                        <div style={styles.taskFooter}>
                          {col.id !== 'todo' && (
                            <button style={styles.moveBtn} onClick={() => moveTask(task._id, col.id === 'inprogress' ? 'todo' : 'inprogress')}>
                              ← Back
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button style={{ ...styles.moveBtn, ...styles.moveBtnForward }} onClick={() => moveTask(task._id, col.id === 'todo' ? 'inprogress' : 'done')}>
                              Forward →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                  {tasks.filter(t => t.status === col.id).length === 0 && (
                    <div style={styles.emptyCol}>
                      <p style={styles.emptyColText}>No tasks</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS TAB */}
        {activeTab === 'announcements' && (
          <div style={styles.content}>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Announcements</h1>
              <p style={styles.pageSubtitle}>Share what matters with the whole group.</p>
            </div>

            {announcements.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyIcon}>📢</p>
                <p style={styles.emptyText}>No announcements yet.</p>
              </div>
            ) : (
              announcements.map(ann => (
                <div key={ann._id} style={styles.annCard}>
                  <div style={styles.annCardLeft}>
                    <div style={styles.annAvatar}>
                      {ann.createdBy?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={styles.annMeta}>
                        <span style={styles.annAuthor}>{ann.createdBy?.name}</span>
                        <span style={styles.annTime}>{new Date(ann.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 style={styles.annTitle}>{ann.title}</h3>
                      <p style={styles.annContent}>{ann.content}</p>
                    </div>
                  </div>
                  <button style={styles.deleteBtn} onClick={() => deleteAnnouncement(ann._id)}>🗑️</button>
                </div>
              ))
            )}
          </div>
        )}

        {/* MEMBERS TAB */}
        {activeTab === 'members' && (
          <div style={styles.content}>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Members</h1>
              <p style={styles.pageSubtitle}>{group?.members?.length || 0} members in this group.</p>
            </div>

            {/* Activity Feed */}
            <h2 style={styles.sectionTitle}>Activity Feed</h2>
            <div style={styles.activityCard}>
              {[...(group?.activity || [])].reverse().map((act, i) => (
                <div key={i} style={styles.activityItem}>
                  <span style={styles.activityDot}>●</span>
                  <div>
                    <p style={styles.activityText}>{act.text}</p>
                    <p style={styles.activityTime}>{new Date(act.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Members List */}
            <h2 style={{ ...styles.sectionTitle, marginTop: '24px' }}>Members</h2>
            <div style={styles.membersCard}>
              {group?.members?.map(member => (
                <div key={member._id} style={styles.memberItem}>
                  <div style={styles.memberAvatar}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={styles.memberInfo}>
                    <p style={styles.memberName}>{member.name}</p>
                    <p style={styles.memberEmail}>{member.email}</p>
                  </div>
                  {member._id === group?.admin?._id && (
                    <span style={styles.adminBadge}>Owner</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === '/dashboard' && navigate('/dashboard')}

      </div>

      {/* New Task Modal */}
      {showTaskForm && (
        <div style={styles.modalOverlay} onClick={() => setShowTaskForm(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>New Task</h3>
            <form onSubmit={createTask}>
              <input style={styles.modalInput} type="text" placeholder="Task title" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required />
              <input style={styles.modalInput} type="text" placeholder="Description (optional)" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} />
              <select style={styles.modalInput} value={taskPriority} onChange={e => setTaskPriority(e.target.value)}>
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
              <input style={styles.modalInput} type="date" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} />
              <button style={styles.modalButton} type="submit">Add Task</button>
            </form>
          </div>
        </div>
      )}

      {/* New Announcement Modal */}
      {showAnnForm && (
        <div style={styles.modalOverlay} onClick={() => setShowAnnForm(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>New Announcement</h3>
            <form onSubmit={createAnnouncement}>
              <input style={styles.modalInput} type="text" placeholder="Title" value={annTitle} onChange={e => setAnnTitle(e.target.value)} required />
              <textarea style={{ ...styles.modalInput, height: '100px', resize: 'vertical' }} placeholder="Content" value={annContent} onChange={e => setAnnContent(e.target.value)} required />
              <button style={styles.modalButton} type="submit">Post</button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#FFFFFF', fontFamily: "'Inter', sans-serif" },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 32px',
    borderBottom: `1px solid ${BORDER}`,
    position: 'sticky',
    top: 0,
    background: 'white',
    zIndex: 10
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
    padding: '9px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  content: { padding: '28px 32px', flex: 1 },
  pageHeader: { marginBottom: '24px' },
  pageTitle: { fontSize: '26px', fontWeight: '800', color: TEXT, marginBottom: '4px' },
  pageSubtitle: { fontSize: '13px', color: SUBTEXT },
  kanban: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  column: {
    flex: 1,
    background: '#FAFAF8',
    borderRadius: '12px',
    padding: '16px',
    minHeight: '400px',
    border: `1px solid ${BORDER}`
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  columnHeaderLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  columnDot: { width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' },
  columnTitle: { fontSize: '13px', fontWeight: '700', color: TEXT },
  columnCount: {
    background: BORDER,
    color: SUBTEXT,
    borderRadius: '10px',
    padding: '1px 7px',
    fontSize: '11px',
    fontWeight: '600'
  },
  addColBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: SUBTEXT,
    lineHeight: 1
  },
  taskCard: {
    background: 'white',
    border: `1px solid ${BORDER}`,
    borderRadius: '10px',
    padding: '14px',
    marginBottom: '10px',
    boxShadow: '0 1px 3px rgba(61,40,13,0.06)'
  },
  taskCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  priorityBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '12px'
  },
  taskTitle: { fontSize: '13px', fontWeight: '600', color: TEXT, marginBottom: '4px' },
  taskDesc: { fontSize: '12px', color: SUBTEXT, marginBottom: '6px' },
  dueDate: { fontSize: '11px', marginBottom: '8px' },
  taskFooter: { display: 'flex', gap: '6px', marginTop: '8px' },
  moveBtn: {
    flex: 1,
    padding: '5px',
    border: `1px solid ${BORDER}`,
    borderRadius: '6px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '11px',
    color: SUBTEXT
  },
  moveBtnForward: { background: PRIMARY, color: 'white', border: 'none' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' },
  emptyCol: { textAlign: 'center', padding: '32px 0' },
  emptyColText: { fontSize: '12px', color: SUBTEXT },
  emptyState: { textAlign: 'center', padding: '60px 0' },
  emptyIcon: { fontSize: '32px', marginBottom: '12px' },
  emptyText: { fontSize: '13px', color: SUBTEXT },
  annCard: {
    background: 'white',
    border: `1px solid ${BORDER}`,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  annCardLeft: { display: 'flex', gap: '12px', flex: 1 },
  annAvatar: {
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
  annMeta: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' },
  annAuthor: { fontSize: '13px', fontWeight: '700', color: TEXT },
  annTime: { fontSize: '11px', color: SUBTEXT },
  annTitle: { fontSize: '15px', fontWeight: '700', color: TEXT, marginBottom: '4px' },
  annContent: { fontSize: '13px', color: SUBTEXT, lineHeight: '1.6' },
  sectionTitle: { fontSize: '14px', fontWeight: '700', color: TEXT, marginBottom: '12px' },
  activityCard: {
    background: 'white',
    border: `1px solid ${BORDER}`,
    borderRadius: '12px',
    padding: '16px'
  },
  activityItem: {
    display: 'flex',
    gap: '12px',
    padding: '10px 0',
    borderBottom: `1px solid ${BORDER}`
  },
  activityDot: { color: ACCENT, fontSize: '10px', marginTop: '4px' },
  activityText: { fontSize: '13px', color: TEXT },
  activityTime: { fontSize: '11px', color: SUBTEXT, marginTop: '2px' },
  membersCard: {
    background: 'white',
    border: `1px solid ${BORDER}`,
    borderRadius: '12px',
    padding: '8px 16px'
  },
  memberItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: `1px solid ${BORDER}`
  },
  memberAvatar: {
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
  memberInfo: { flex: 1 },
  memberName: { fontSize: '13px', fontWeight: '600', color: TEXT },
  memberEmail: { fontSize: '11px', color: SUBTEXT },
  adminBadge: {
    background: PRIMARY_PALE,
    color: PRIMARY,
    fontSize: '11px',
    padding: '3px 10px',
    borderRadius: '12px',
    fontWeight: '600'
  },
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
    outline: 'none',
    fontFamily: "'Inter', sans-serif"
  },
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