import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DevLore from './components/DevLore'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DevLore/>
    </>
  )
}

export default App
