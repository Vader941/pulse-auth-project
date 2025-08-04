// USER LOGIN COMPONENT
// This component provides a form for existing users to log into their accounts

// Import necessary React hooks and external libraries
import React, { useState } from "react"; // React and state management
import axios from "axios"; // HTTP client for making API requests
import { useNavigate } from "react-router-dom"; // For redirecting after successful login
import { useAuth } from "../../context/AuthContext"; // Our custom authentication context

// LOGIN COMPONENT - Form for user authentication
const Login = () => {
  // STATE VARIABLES - Store form data and UI state
  const [email, setEmail] = useState(""); // User's email input
  const [password, setPassword] = useState(""); // User's password input
  const [error, setError] = useState(""); // Error messages to display

  // CONTEXT AND NAVIGATION HOOKS
  const { login } = useAuth(); // Get login function from authentication context
  const navigate = useNavigate(); // Function to programmatically navigate to different pages

  // FORM SUBMISSION HANDLER - Runs when user clicks "Login" button
  const handleSubmit = async (e) => {
    // Prevent form from refreshing the page (default HTML form behavior)
    e.preventDefault();
    
    // Clear any previous error messages
    setError("");

    // TRY-CATCH - Handle potential errors gracefully
    try {
      // MAKE API REQUEST - Send login credentials to backend server
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,    // User's email address
        password, // User's password
      });

      // EXTRACT RESPONSE DATA - Backend sends back token and user info
      const { token, user } = response.data;

      // UPDATE AUTHENTICATION STATE - Call login function from context
      // This will update the app-wide authentication state
      login(token, user);

      // REDIRECT USER - Navigate to main app area after successful login
      navigate("/home");

    } catch (err) {
      // ERROR HANDLING - Login failed for some reason
      console.error("Login error:", err); // Log error for debugging
      setError("Invalid email or password."); // Show user-friendly error message
    }
  };

  // RETURN JSX - The visual login form
  return (
    // FORM CONTAINER - Centered, styled container for login form
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      
      {/* FORM TITLE */}
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      
      {/* LOGIN FORM - Calls handleSubmit when submitted */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* EMAIL INPUT FIELD */}
        <input
          type="email" // HTML5 email validation
          placeholder="Email" // Gray placeholder text
          className="w-full border p-2 rounded"
          value={email} // Controlled input - value comes from state
          onChange={(e) => setEmail(e.target.value)} // Update state when user types
        />
        
        {/* PASSWORD INPUT FIELD */}
        <input
          type="password" // Hides password characters
          placeholder="Password" // Gray placeholder text
          className="w-full border p-2 rounded"
          value={password} // Controlled input
          onChange={(e) => setPassword(e.target.value)} // Update state when user types
        />
        
        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>

      {/* ERROR MESSAGE - Only shows if there's an error */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

// EXPORT - Makes this component available to other files
export default Login;
