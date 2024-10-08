import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';
import './index.css';
import ErrorPage from './pages/ErrorPage';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import FindUsers from './pages/FindUsers';
import Messages from './pages/Messages';
import { Toaster } from 'react-hot-toast';


const verifyToken = async (token: string) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};


const getToken = () => {
  return localStorage.getItem('token') || '';
};

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const token = getToken(); 

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await verifyToken(token);
      setIsAuthenticated(valid);
    };

    checkAuth();
  }, [token]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: '/',
          element: isAuthenticated ? <Navigate to="/dashboard" /> : <App />,
          errorElement: <ErrorPage />
        },
        {
          path: '/login',
          element: isAuthenticated ? <Navigate to="/dashboard" /> : <Login />,
        },
        {
          path: '/signup',
          element: isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />,
        },
        {
          path: '/dashboard',
          element: isAuthenticated ? <Dashboard /> : <Navigate to="/login" />,
        },
        {
          path: '/find-users',
          element: isAuthenticated ? <FindUsers/> : <Navigate to="/login" />,
        },
        {
          path: '/messages',
          element: isAuthenticated ? <Messages/> : <Navigate to="/login" />,
        },
      ])}
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <React.StrictMode>
    <Toaster></Toaster>
    <AppRouter />
  </React.StrictMode>
);
