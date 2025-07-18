import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requirePartner?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requirePartner = false 
}: ProtectedRouteProps) {
  const { user, userRole, loading, isAdmin, isPartner } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requirePartner && !isPartner) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}