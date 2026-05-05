import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

export default function GroupPage() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [tasks, setTasks] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [annTitle, setAnnTitle] = useState('')
  const [annContent, setAnnContent] = useState('')
  const [groupName, setGroupName] = useState('')
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
        { title: taskTitle, description: taskDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTaskTitle('')
      setTaskDesc('')
      fetchTasks()
    } catch (err) {
      console.error(err)
    }
  }

  const toggleTask = async (taskId) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${groupId}/${taskId}`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchTasks()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${groupId}/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchTasks()
    } catch (err) {
      console.error(err)
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
      fetchAnnouncements()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteAnnouncement = async (annId) => {
    try {
      await axios.delete(`http://localhost:5000/api/announcements/${groupId}/${annId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchAnnouncements()
    } catch (err) {
      console.error(err)
    }
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
        >
          ✅ Tasks
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'announcements' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('announcements')}
        >
          📢 Announcements
        </button>
      </div>

      <div style={styles.body}>

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div>
            {/* Add Task Form */}
            <div style={styles.card}>
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
                <button style={styles.button} type="submit">Add Task</button>
              </form>
            </div>

            {/* Tasks List */}
            {tasks.length === 0 ? (
              <p style={styles.empty}>No tasks yet. Add one!</p>
            ) : (
              tasks.map(task => (
                <div key={task._id} style={styles.taskCard}>
                  <div style={styles.taskLeft}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task._id)}
                      style={styles.checkbox}
                    />
                    <div>
                      <p style={{
                        ...styles.taskTitle,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? '#888' : '#333'
                      }}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p style={styles.taskDesc}>{task.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteTask(task._id)}
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ANNOUNCEMENTS TAB */}
        {activeTab === 'announcements' && (
          <div>
            {/* Add Announcement Form */}
            <div style={styles.card}>
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

            {/* Announcements List */}
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
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteAnnouncement(ann._id)}
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        )}

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
    gap: '0',
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
  body: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '32px'
  },
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
  taskCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  taskLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer' },
  taskTitle: { fontSize: '15px', fontWeight: '500' },
  taskDesc: { fontSize: '13px', color: '#888', marginTop: '2px' },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px'
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
  annTitle: { fontSize: '16px', marginBottom: '6px' },
  annContent: { fontSize: '14px', color: '#555', marginBottom: '8px' },
  annMeta: { fontSize: '12px', color: '#aaa' },
  empty: { color: '#888', fontSize: '14px', textAlign: 'center', marginTop: '40px' }
}