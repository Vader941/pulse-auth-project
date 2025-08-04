// USER REGISTRATION COMPONENT
// This component allows new users to create an account

// Import React and useState hook for managing component state
import React, { useState } from "react";

// SIGNUP COMPONENT - Form for creating new user accounts
const Signup = () => {
  // STATE VARIABLES - Store form data and UI state
  
  // User input fields
  const [email, setEmail] = useState(""); // User's email address
  const [password, setPassword] = useState(""); // User's chosen password
  
  // UI feedback - success/error messages to show user
  const [message, setMessage] = useState(null); // null = no message, object = {type, text}

  // FORM SUBMISSION HANDLER - Runs when user clicks "Sign Up" button
  const handleSignup = async (e) => {
    // Prevent form from refreshing the page (default HTML form behavior)
    e.preventDefault();
    
    // Clear any previous messages
    setMessage(null);

    // TRY-CATCH - Handle potential errors gracefully
    try {
      // MAKE API REQUEST - Send user data to our backend server
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST", // HTTP method for creating new data
        headers: { "Content-Type": "application/json" }, // Tell server we're sending JSON
        body: JSON.stringify({ email, password }), // Convert JavaScript object to JSON string
      });

      // CHECK IF REQUEST FAILED
      if (!response.ok) {
        // Get error details from server response
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      // SUCCESS - Account created successfully
      setMessage({ type: "success", text: "Account created! You can now log in." });
      
      // Clear the form fields for better user experience
      setEmail("");
      setPassword("");
    } catch (err) {
      // ERROR HANDLING - Something went wrong
      console.error(err); // Log error for debugging
      setMessage({ type: "error", text: err.message || "Something went wrong." });
    }
  };

  // RETURN JSX - The visual form for user registration
  return (
    // FORM CONTAINER - Centered, styled container for signup form
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow bg-white">
      
      {/* FORM TITLE */}
      <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
      
      {/* SIGNUP FORM - Calls handleSignup when submitted */}
      <form onSubmit={handleSignup} className="space-y-4">
        
        {/* EMAIL INPUT FIELD */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email" // HTML5 email validation
            className="w-full px-3 py-2 border rounded"
            value={email} // Controlled input - value comes from state
            onChange={(e) => setEmail(e.target.value)} // Update state when user types
            required // HTML5 required field validation
          />
        </div>
        
        {/* PASSWORD INPUT FIELD */}
        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password" // Hides password characters
            className="w-full px-3 py-2 border rounded"
            value={password} // Controlled input
            onChange={(e) => setPassword(e.target.value)} // Update state when user types
            required // HTML5 required field validation
          />
        </div>
        
        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>

      {/* FEEDBACK MESSAGE - Shows success or error messages */}
      {message && (
        <div
          className={`mt-4 text-center text-sm ${
            // Conditional styling - green for success, red for errors
            message.type === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {message.text} {/* Display the actual message */}
        </div>
      )}
    </div>
  );
};

// EXPORT - Makes this component available to other files
export default Signup;
