import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import AlertManage from './pages/admin/AlertManage'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Admin Routes */}
        <Route path='/alert-manage' element={<AlertManage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;
