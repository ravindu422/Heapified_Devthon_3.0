import { ChevronDown, Search, ShieldUser, UserRound } from 'lucide-react';
import React, { useState } from 'react'

const AdminHeader = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className='border-b border-gray-200 sticky top-0 z-20'>
            <div className='flex items-center justify-between px-4 sm:px-6 lg:px-8 py-5 ml-10'>
                <div className='flex items-center max-w-xs w-full'>
                    <div className='relative w-full'>
                        <input 
                            type="text"
                            placeholder='Search...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full px-4 py-2 pr-10 text-sm text-gray-700 bg-gray-50 border border-gray-300 
                                rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                        />
                        <Search className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4'/>
                    </div>
                </div>

                <div className='flex items-center gap-2 mr-11'>
                    <div className='flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 sm:px-3 py-2 transition-colors duration-200'>
                        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-teal-600/75 rounded-full flex items-center justify-center text-white font-semibold'>
                            <UserRound className='w-5 h-5 ' strokeWidth={3}/>
                        </div>

                        <div className='hidden sm:block'>
                            <p className='text-sm font-medium text-gray-900'>User</p>
                        </div>
                        <ChevronDown className='w-4 h-4 text-gray-500 hidden sm:block'/>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default AdminHeader