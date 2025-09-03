import React from 'react';
import Link from 'next/link';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen: boolean, setIsSidebarOpen: (isOpen: boolean) => void }) => {
  return (
    <div
      className={`
        flex flex-col bg-gray-800 text-white
        fixed inset-y-0 left-0 z-50
        w-64
        transform transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
        <span>Fire Sentinel</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        <Link href="/">
          <span
            className="flex items-center px-3 py-3 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700 transition-colors duration-200"
            onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click
          >
            <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </span>
        </Link>
        <Link href="/setup">
          <span
            className="flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click
          >
            <svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Agregar Nueva Bomba
          </span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
