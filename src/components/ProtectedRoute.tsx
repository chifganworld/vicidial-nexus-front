
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    // You can show a loading spinner here if desired
    return <div className="min-h-screen flex items-center justify-center"><p>Loading authentication status...</p></div>;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />; // Render child routes if authenticated
};

export default ProtectedRoute;
