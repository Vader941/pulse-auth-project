// AUTHENTICATION GUARD COMPONENT
// This component protects routes that should only be accessible to logged-in users
// If user is not authenticated, it redirects them to login page

// Import necessary React hooks and router components
import { useContext } from "react"; // Hook to access React context data
import { AuthContext } from "../../context/AuthContext"; // Our custom authentication context
import { Navigate, useLocation } from "react-router-dom"; // Router components for navigation

// REQUIRE AUTH COMPONENT - Wrapper that checks if user is logged in
const RequireAuth = ({ children }) => {
  // GET AUTHENTICATION STATE - Check if user is currently logged in
  const { isAuthenticated } = useContext(AuthContext);
  
  // GET CURRENT LOCATION - So we can redirect back here after login
  const location = useLocation();

  // CHECK AUTHENTICATION STATUS
  if (!isAuthenticated) {
    // USER IS NOT LOGGED IN
    // Redirect to login page and save where they were trying to go
    // The "state" prop preserves their intended destination for after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // USER IS LOGGED IN
  // Show the protected content (whatever was passed as children)
  return children;
};

// EXPORT - Makes this component available to other files
export default RequireAuth;
