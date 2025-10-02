import { useState } from 'react'
import { useSelector } from 'react-redux'
import './App.css'
import ExpenseTracker from './pages/page'
import { LoginForm } from './components/auth/login-form'

function App() {
  const [count, setCount] = useState(0)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return (
    <>
      <ExpenseTracker />
    </>
  )
}

export default App
