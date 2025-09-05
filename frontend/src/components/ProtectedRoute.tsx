import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isAllowed: boolean;
  children: React.ReactNode;
}

// So users do not bypass EULA page without accepting
export default function ProtectedRoute({
  isAllowed,
  children,
}: ProtectedRouteProps) {
  if (!isAllowed) {
    return <Navigate to="/eula" replace />;
  }
  return <>{children}</>;
}
