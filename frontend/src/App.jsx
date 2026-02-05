import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import PublishAlert from './pages/admin/PublishAlert'
import AlertManage from './pages/admin/AlertManage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/publish-alert' element={<PublishAlert/>}/>
        <Route path='/manage-alert' element={<AlertManage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;