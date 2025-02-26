import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DeepDefender from './components/Deepdefender'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-container">
    <DeepDefender />
  </div>
  )
}

export default App
