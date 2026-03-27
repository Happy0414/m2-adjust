import './App.css'
import Make from './components/make.tsx'
import Code from './components/code.tsx'
import Home from './components/home.tsx'
import { useState } from 'react'


function App() {
  const [page, setPage] = useState<'home' | 'make' | 'code'>('home')

  let screen

  if (page === 'home'){
    screen = <Home />
  }else if(page === 'code'){
    screen = <Code />
  }else if(page === 'make'){
    screen = <Make />
  }

  return (
    <>
    
      <div className="topBtns">
        <button onClick={() => setPage('home')}>🏠</button>
        <button onClick={() => setPage('make')}>日程調整へ</button>
        <button onClick={() => setPage('code')}>テストページへ</button>
      </div>

      <div className="mainContent">
        {screen}
      </div>
      
    
    </>
  )
}

export default App