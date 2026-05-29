import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const COLUMNS = [
  { id: 'todo', label: '📋 To Do', color: '#6366f1' },
  { id: 'inprogress', label: '🔄 In Progress', color: '#f59e0b' },
  { id: 'done', label: '✅ Done', color: '#10b981' }
]

const PRIORITIES = {
  high: { label: 'High', color: '#ef4444', bg: '#fee2e2' },
  medium: { label: 'Medium', color: '#f59e0b', bg: '#fef3c7' },
  low: { label: 'Low', color: '#10b981', bg: '#d1fae5' }
}

export default function GroupPage() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [tasks, setTasks] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskPriority, setTaskPriority] = useState('medium')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [annTitle, setAnnTitle] = useState('')
  const [annContent, setAnnContent] = useState('')
  const [activeTab, setActiveTab] = useState('tasks')

  useEffect(() => {
    fetchTasks()
    fetchAnnouncements()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTasks(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/announcements/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAnnouncements(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const createTask = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`http://localhost:5000/api/tasks/${groupId}`,
        { title: taskTitle, description: taskDesc, priority: taskPriority, dueDate: taskDueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTaskTitle('')
      setTaskDesc('')
      setTaskPriority('medium')
      setTaskDueDate('')
      toast.success('Task added! ✅')
      fetchTasks()
    } catch (err) {
      toast.error('Failed to add task')
    }
  }

  const moveTask = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${groupId}/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchTasks()
    } catch (err) {
      toast.error('Failed to move task')
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${groupId}/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Task deleted!')
      fetchTasks()
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  const createAnnouncement = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`http://localhost:5000/api/announcements/${groupId}`,
        { title: annTitle, content: annContent },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setAnnTitle('')
      setAnnContent('')
      toast.success('Announcement posted! 📢')
      fetchAnnouncements()
    } catch (err) {
      toast.error('Failed to post announcement')
    }
  }

  const deleteAnnouncement = async (annId) => {
    try {
      await axios.delete(`http://localhost:5000/api/announcements/${groupId}/${annId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Announcement deleted!')
      fetchAnnouncements()
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
        <h1 style={styles.logo}>🏠 GroupSpace</h1>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'tasks' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('tasks')}
        >✅ Tasks</button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'announcements' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('announcements')}
        >📢 Announcements</button>
      </div>

      {/* TASKS TAB */}
      {activeTab === 'tasks' && (
        <div style={styles.body}>

          {/* Add Task Form */}
          <div style={styles.formCard}>
            <h3 style={styles.cardTitle}>➕ Add Task</h3>
            <form onSubmit={createTask}>
              <input
                style={styles.input}
                type="text"
                placeholder="Task Title"
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                required
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Description (optional)"
                value={taskDesc}
                onChange={e => setTaskDesc(e.target.value)}
              />
              <div style={styles.formRow}>
                <select
                  style={styles.select}
                  value={taskPriority}
                  onChange={e => setTaskPriority(e.target.value)}
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
                <input
                  style={styles.dateInput}
                  type="date"
                  value={taskDueDate}
                  onChange={e => setTaskDueDate(e.target.value)}
                />
              </div>
              <button style={styles.button} type="submit">Add Task</button>
            </form>
          </div>

          {/* Kanban Board */}
          <div style={styles.kanban}>
            {COLUMNS.map(col => (
              <div key={col.id} style={styles.column}>

                {/* Column Header */}
                <div style={{ ...styles.columnHeader, borderTop: `3px solid ${col.color}` }}>
                  <span style={styles.columnTitle}>{col.label}</span>
                  <span style={{ ...styles.columnCount, background: col.color }}>
                    {tasks.filter(t => t.status === col.id).length}
                  </span>
                </div>

                {/* Tasks in Column */}
                {tasks
                  .filter(task => task.status === col.id)
                  .map(task => (
                    <div key={task._id} style={styles.taskCard}>

                      {/* Priority Badge */}
                      <div style={styles.taskTop}>
                        <span style={{
                          ...styles.priorityBadge,
                          color: PRIORITIES[task.priority].color,
                          background: PRIORITIES[task.priority].bg
                        }}>
                          {PRIORITIES[task.priority].label}
                        </span>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => deleteTask(task._id)}
                        >🗑️</button>
                      </div>

                      {/* Task Title */}
                      <p style={styles.taskTitle}>{task.title}</p>
                      {task.description && (
                        <p style={styles.taskDesc}>{task.description}</p>
                      )}

                      {/* Due Date */}
                      {task.dueDate && (
                        <p style={{
                          ...styles.dueDate,
                          color: isOverdue(task.dueDate) ? '#ef4444' : '#888'
                        }}>
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                          {isOverdue(task.dueDate) && ' ⚠️ Overdue'}
                        </p>
                      )}

                      {/* Move Buttons */}
                      <div style={styles.moveButtons}>
                        {col.id !== 'todo' && (
                          <button
                            style={styles.moveBtn}
                            onClick={() => moveTask(task._id, col.id === 'inprogress' ? 'todo' : 'inprogress')}
                          >← Back</button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            style={{ ...styles.moveBtn, ...styles.moveBtnForward }}
                            onClick={() => moveTask(task._id, col.id === 'todo' ? 'inprogress' : 'done')}
                          >Forward →</button>
                        )}
                      </div>

                    </div>
                  ))}

                {/* Empty Column */}
                {tasks.filter(t => t.status === col.id).length === 0 && (
                  <p style={styles.emptyCol}>No tasks here</p>
                )}

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ANNOUNCEMENTS TAB */}
      {activeTab === 'announcements' && (
        <div style={styles.annBody}>
          <div style={styles.formCard}>
            <h3 style={styles.cardTitle}>📢 New Announcement</h3>
            <form onSubmit={createAnnouncement}>
              <input
                style={styles.input}
                type="text"
                placeholder="Title"
                value={annTitle}
                onChange={e => setAnnTitle(e.target.value)}
                required
              />
              <textarea
                style={{ ...styles.input, height: '80px', resize: 'vertical' }}
                placeholder="Content"
                value={annContent}
                onChange={e => setAnnContent(e.target.value)}
                required
              />
              <button style={styles.button} type="submit">Post</button>
            </form>
          </div>

          {announcements.length === 0 ? (
            <p style={styles.empty}>No announcements yet.</p>
          ) : (
            announcements.map(ann => (
              <div key={ann._id} style={styles.annCard}>
                <div>
                  <h3 style={styles.annTitle}>{ann.title}</h3>
                  <p style={styles.annContent}>{ann.content}</p>
                  <p style={styles.annMeta}>
                    Posted by {ann.createdBy?.name} · {new Date(ann.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button style={styles.deleteBtn} onClick={() => deleteAnnouncement(ann._id)}>🗑️</button>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f7f7f5' },
  header: {
    background: '#4f46e5',
    color: 'white',
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  logo: { fontSize: '20px' },
  backBtn: {
    background: 'white',
    color: '#4f46e5',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  tabs: {
    display: 'flex',
    background: 'white',
    borderBottom: '2px solid #eee',
    padding: '0 32px'
  },
  tab: {
    padding: '16px 24px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#888'
  },
  activeTab: {
    color: '#4f46e5',
    borderBottom: '2px solid #4f46e5',
    fontWeight: 'bold'
  },
  body: { padding: '24px 32px' },
  annBody: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '32px'
  },
  formCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  cardTitle: { marginBottom: '16px', fontSize: '16px', fontWeight: '600' },
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
  formRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px'
  },
  select: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    background: 'white'
  },
  dateInput: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px'
  },
  button: {
    width: '100%',
    padding: '10px',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  kanban: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start'
  },
  column: {
    flex: 1,
    background: '#f1f1ef',
    borderRadius: '12px',
    padding: '16px',
    minHeight: '300px'
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    padding: '12px',
    background: 'white',
    borderRadius: '8px'
  },
  columnTitle: { fontWeight: '600', fontSize: '14px' },
  columnCount: {
    color: 'white',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  taskCard: {
    background: 'white',
    borderRadius: '10px',
    padding: '14px',
    marginBottom: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
  },
  taskTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  priorityBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '12px'
  },
  taskTitle: { fontSize: '14px', fontWeight: '500', marginBottom: '4px' },
  taskDesc: { fontSize: '12px', color: '#888', marginBottom: '8px' },
  dueDate: { fontSize: '12px', marginBottom: '8px' },
  moveButtons: { display: 'flex', gap: '8px', marginTop: '8px' },
  moveBtn: {
    flex: 1,
    padding: '6px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#555'
  },
  moveBtnForward: {
    background: '#4f46e5',
    color: 'white',
    border: 'none'
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  },
  emptyCol: {
    color: '#bbb',
    fontSize: '13px',
    textAlign: 'center',
    marginTop: '20px'
  },
  annCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  annTitle: { fontSize: '16px', marginBottom: '6px', fontWeight: '600' },
  annContent: { fontSize: '14px', color: '#555', marginBottom: '8px' },
  annMeta: { fontSize: '12px', color: '#aaa' },
  empty: { color: '#888', fontSize: '14px', textAlign: 'center', marginTop: '40px' }
}