"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Inline SVGs for icons (keeping them as they might be useful for other parts of the app, but not used in this specific login form anymore)
const UserIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
);

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isClicked, setIsClicked] = useState(false); // New state for animation

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsClicked(true); // Start animation

    // Simulate a delay for the animation to be visible
    await new Promise(resolve => setTimeout(resolve, 200)); // Match CSS transition duration

    const USERS: Record<string, { password: string }> = {
      'admin': { password: 'admin123' },
      'basic_user': { password: 'basic123' },
      'advanced_user': { password: 'advanced123' },
    };

    if (USERS[username] && USERS[username].password === password) {
      login();
    } else {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    }
    setIsClicked(false); // End animation
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="relative w-full max-w-md bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-8 space-y-6 text-white border border-gray-700 border-opacity-30">
        
        {/* App Name */}
        <div className="flex justify-center mb-6">
          <h1 className="text-4xl font-bold text-center">Fire Sentinel</h1>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2">Bienvenido de Nuevo</h2>
        <p className="text-center text-gray-300 mb-6">Inicia sesión en tu cuenta</p>

        {error && (
          <div className="p-3 text-sm text-center text-red-300 bg-red-800 bg-opacity-50 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500 text-white"
              placeholder="Usuario"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500 text-white"
              placeholder="Contraseña"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-gray-600 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-gray-300">
                Recordarme
              </label>
            </div>
            <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${isClicked ? 'scale-90' : ''}`}
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
