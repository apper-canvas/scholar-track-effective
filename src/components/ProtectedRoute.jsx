import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * A wrapper component that protects routes from unauthenticated access
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render if authenticated
 * @returns {React.ReactNode} - Protected route content or redirect
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login with current path as redirect parameter
      navigate(`/login?redirect=${location.pathname}${location.search}`);
    }
  }, [isAuthenticated, navigate, location.pathname, location.search]);

  // Show nothing while checking authentication or redirecting
  if (!isAuthenticated) {
    return null;
  }
  
  // Return the protected content if authenticated
  return children;
};

export default ProtectedRoute;