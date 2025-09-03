
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // This logic remains the same.
    const USERS: Record<string, { password: string }> = {
      'admin': { password: 'admin123' },
      'basic_user': { password: 'basic123' },
      'advanced_user': { password: 'advanced123' },
    };

    if (USERS[username] && USERS[username].password === password) {
      sessionStorage.setItem('isLoggedIn', 'true');
      router.push('/');
    } else {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  const TabButton = ({ label, tabName }: { label: string, tabName: string }) => (
    <button
      type="button"
      onClick={() => setActiveTab(tabName)}
      className={`w-1/2 pb-3 text-center text-sm font-medium transition-colors
        ${activeTab === tabName
          ? 'text-indigo-600 border-b-2 border-indigo-600'
          : 'text-gray-500 hover:text-gray-700'
        }`}
    >
      {label}
    </button>
  );

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        
        {/* Tabs */}
        <div className="flex border-b">
          <TabButton label="Login" tabName="login" />
          <TabButton label="Register" tabName="register" />
        </div>

        {/* Login Form */}
        <div style={{ display: activeTab === 'login' ? 'block' : 'none' }}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-3 text-sm text-center text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
                placeholder="Username"
              />
              <label
                htmlFor="username"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all 
                           peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                           peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Usuario
              </label>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
                placeholder="Password"
              />
              <label
                htmlFor="password"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all 
                           peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                           peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Contraseña
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                Login
              </button>
            </div>
          </form>
        </div>

        {/* Register Form (Placeholder) */}
        <div style={{ display: activeTab === 'register' ? 'block' : 'none' }}>
            <div className="text-center text-gray-500">
                <p>La funcionalidad de registro no está disponible actualmente.</p>
            </div>
        </div>

      </div>
    </main>
  );
}
