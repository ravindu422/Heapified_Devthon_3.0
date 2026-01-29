import React from 'react'
import Sidebar from '../../components/dashboard/Sidebar'
import DashboardLayout from '../../components/dashboard/DashboardLayout'

const AlertManage = () => {
  return (
    <DashboardLayout activePage="alert">
        <div className='space-y-6'>
            <h1 className='text-xl font-semibold text-gray-900 ml-11'>Publish Emergency Alert</h1>
        </div>
    </DashboardLayout>
  )
}

export default AlertManage