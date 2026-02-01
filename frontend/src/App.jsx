import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import AlertManage from './pages/admin/AlertManage'
import TaskManage from './pages/admin/TaskManage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/alert-manage' element={<AlertManage/>}/>
        <Route path='/task-manage' element={<TaskManage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;