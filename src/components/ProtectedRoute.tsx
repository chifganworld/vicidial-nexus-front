
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Optional for now, until role system is fully integrated
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { session, loading, user } = useAuth();
  const location = useLocation();

  // TODO: Fetch user role from user_roles table using user.id and compare with allowedRoles
  // For now, this component only checks for authentication.
  // const userRole = useUserRole(user?.id); // Placeholder for fetching role
  // const canAccess = allowedRoles ? userRole && allowedRoles.includes(userRole) : true;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading authentication status...</p></div>;
  }

  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // if (!canAccess && session) { // Future role check
  //   return <Navigate to="/unauthorized" replace />; // Or some other page
  // }

  return <Outlet />; // Render child routes if authenticated (and role check passes in future)
};

export default ProtectedRoute;
