import React from 'react'
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';

const DashboardLayout = ({ children, activePage }) => {
    return (
        <div className='flex h-screen overflow-hidden'>
            <Sidebar activePage={activePage}/>

            <div className='flex-1 flex flex-col overflow-hidden'>
                <AdminHeader />

                <main className='flex-1 overflow-y-auto bg-white'>
                    <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout