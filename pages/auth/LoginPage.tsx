
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { Role, User } from '../../types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = (e: React.FormEvent, role: Role) => {
    e.preventDefault();
    if (email && password) {
      // Mock login logic
      const mockUser: User = {
        id: 'user-' + Math.random(),
        name: email.split('@')[0],
        email: email,
        role: role,
      };
      login(mockUser);
      
      switch(role) {
        case Role.Parent: navigate('/parent/dashboard'); break;
        case Role.Tutor: navigate('/tutor/dashboard'); break;
        case Role.Admin: navigate('/admin/dashboard'); break;
        default: navigate('/');
      }
    } else {
      setError('Please enter email and password.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="text-center text-4xl font-extrabold text-primary">Hytor</Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Or{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary-light">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-light">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                onClick={(e) => handleLogin(e, Role.Parent)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Sign in as Parent
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                onClick={(e) => handleLogin(e, Role.Tutor)}
                className="w-full flex justify-center py-2 px-4 border border-primary text-primary rounded-md shadow-sm text-sm font-medium hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Tutor
              </button>
               <button
                type="submit"
                onClick={(e) => handleLogin(e, Role.Admin)}
                className="w-full flex justify-center py-2 px-4 border border-neutral-600 text-neutral-600 rounded-md shadow-sm text-sm font-medium hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
              >
                Admin
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                // onClick logic for Google Sign-In would go here
                className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56,12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26,1.37-1.04,2.53-2.21,3.31v2.77h3.57c2.08-1.92,3.28-4.74,3.28-8.09Z" fill="#4285F4"/><path d="M12,23c2.97,0,5.46-.98,7.28-2.66l-3.57-2.77c-.98.66-2.23,1.06-3.71,1.06-2.84,0-5.25-1.92-6.1-4.49H2.26v2.77C4.09,20.53,7.74,23,12,23Z" fill="#34A853"/><path d="M5.9,14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.14H2.26C1.46,8.71,1,10.3,1,12s.46,3.29,1.26,4.86Z" fill="#FBBC05"/><path d="M12,5.38c1.62,0,3.06.56,4.21,1.64l3.15-3.15C17.46,1.99,14.97,1,12,1,7.74,1,4.09,3.47,2.26,6.86L5.9,9.64c.85-2.57,3.26-4.26,6.1-4.26Z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
