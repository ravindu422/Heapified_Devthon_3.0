import { Box, ClipboardList, LogOut, ShieldUser, Siren } from 'lucide-react';
import React, { useState } from 'react'

const Sidebar = ({ children, activePage }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                    aria-label="Open sidebar"
                >
                    <svg
                        className="w-6 h-6 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            )}

            {
                isSidebarOpen && (
                    <div onClick={() => setIsSidebarOpen(false)}
                        className='lg:hidden fixed inset-0 ' 
                    />
                )
            }

            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-40 
                    w-64 sm:w-72 bg-gray-100
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    flex flex-col h-screen
                `}
            >
                {isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden absolute top-4 -right-10 p-2 rounded-tr-lg rounded-br-lg bg-gray-100 hover:bg-gray-300 transition-colors duration-200 z-50"
                        aria-label="Close sidebar"
                    >
                        <svg
                            className="w-6 h-6 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
                <div className='flex items-center gap-5 px-6 py-8 mt-1 ml-3'>
                    <ShieldUser className='w-7 h-7 text-gray-600'/>
                    <h1 className='text-2xl sm:text-3xl font-bold text-center text-gray-800'>SafeLanka</h1>
                </div>

                <div className='px-6 flex-1 overflow-y-auto mt-8'>
                    <h2 className='text-sm font-medium text-gray-500'>Menu</h2>
                    <div className='border-t border-gray-300 mb-6 mt-4'></div>
                    <nav className='space-y-4'>
                        <a href="/resource-manage"
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-all duration-200
                                ${
                                    activePage == 'resource' ? 'bg-teal-200/45 text-teal-700' : 'text-gray-600 hover:bg-teal-400/10 hover:text-teal-700'
                                }
                            `}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <Box className='w-5 h-5 shrink-0'/>
                            <span className='text-base font-medium'>Resource Manage</span>
                        </a>

                        <a href="/publish-alert"
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-all duration-200
                                ${
                                    activePage == 'alert' ? 'bg-teal-200/45 text-teal-700' : 'text-gray-600 hover:bg-teal-400/10 hover:text-teal-700'
                                }
                            `}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <Siren className='w-5 h-5 shrink-0'/>
                            <span className='text-base font-medium'>Alert Manage</span>
                        </a>

                        <a href="/task-manage"
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-all duration-200
                                ${
                                    activePage == 'task' ? 'bg-teal-200/45 text-teal-700' : 'text-gray-600 hover:bg-teal-400/10 hover:text-teal-700'
                                }
                            `}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <ClipboardList className='w-5 h-5 shrink-0'/>
                            <span className='text-base font-medium'>Task Management</span>
                        </a>
                    </nav>
                </div>

                <div className='px-6 pb-14'>
                    <h2 className='text-sm font-medium text-gray-600 mb-4 mt-6'>Others</h2>
                    <div className='border-t border-gray-300 mb-6'></div>
                    <button className='w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left text-gray-600 hover:bg-teal-400/10 hover:text-teal-700 transition-all duration-200 cursor-pointer'>
                        <LogOut className='w-5 h-5 shrink-0'/>
                        <span className='text-base font-medium'>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    )
}

export default Sidebar