export default function Spinner() {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px'
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '4px solid #e5e5e5',
    borderTop: '4px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  }
}