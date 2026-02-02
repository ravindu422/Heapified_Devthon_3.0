import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import PublishAlert from './pages/admin/PublishAlert'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/alert-manage' element={<PublishAlert/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;