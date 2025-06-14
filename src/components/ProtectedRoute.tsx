
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { session, loading: authLoading, user } = useAuth();
  const location = useLocation();
  const { data: userRoles, isLoading: rolesLoading } = useUserRoles(user?.id);

  const loading = authLoading || (allowedRoles && rolesLoading);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = userRoles?.some(role => allowedRoles.includes(role)) ?? false;
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
