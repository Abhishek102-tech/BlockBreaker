import { useState } from 'react'
import './App.css'

function App() {
  

  return (
    <>
      <div className="settings"><span class="material-symbols-outlined">
menu
</span></div><header className='heading'>Block Busters</header>
      <div className="game-container">
        <div className="game">
            <div className="blocks">
            <div className="block"></div>
            <div className="block"></div>
            <div className="block"></div>
            <div className="block"></div>
            <div className="block"></div>
          </div>
          <div className="paddle"></div>
          <div className="ball"></div>
        </div>
      </div>
    </>
  )
}

export default App
