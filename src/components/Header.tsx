"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter

export default function Header() {
  const pathname = usePathname();
  const router = useRouter(); // Initialize useRouter
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu visibility

  // No mostrar el header en la página de login
  if (pathname === '/login') {
    return null;
  }

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn'); // Clear login flag
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              Dashboard de Bombas
            </Link>
          </div>
          <div className="flex items-center"> {/* Wrap desktop links and user info */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                  Ver Bombas
                </Link>
                <Link href="/setup" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/setup' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                  Añadir Bomba
                </Link>
              </div>
            </div>
            {/* User Info and Logout Button (Desktop) */}
            <div className="hidden md:flex items-center ml-6">
              <span className="text-gray-700 text-sm font-medium">
                Bienvenido, <strong className="text-indigo-600">admin</strong> (Rol: admin)
              </span>
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu, show/hide based on menu state. */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
              Ver Bombas
            </Link>
            <Link href="/setup" className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/setup' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
              Añadir Bomba
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
