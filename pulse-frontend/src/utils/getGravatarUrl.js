// GRAVATAR UTILITY FUNCTION
// This file provides a function to generate avatar images for users based on their email
// Gravatar is a service that provides profile pictures linked to email addresses

// Import MD5 hashing library - needed for Gravatar API
import md5 from "blueimp-md5";

/**
 * GENERATE GRAVATAR IMAGE URL
 * 
 * Gravatar (Globally Recognized Avatar) is a service that provides profile pictures
 * linked to email addresses. This function creates a URL to fetch a user's avatar image.
 * 
 * HOW IT WORKS:
 * 1. Takes user's email address
 * 2. Converts it to lowercase and trims whitespace (Gravatar requirement)
 * 3. Creates MD5 hash of the email (Gravatar uses this for privacy)
 * 4. Builds URL to Gravatar service with the hash
 * 
 * @param {string} email - User's email address
 * @param {number} size - Image size in pixels (default is 80x80)
 * @returns {string} Complete URL to user's Gravatar image
 */
export function getGravatarUrl(email, size = 80) {
  // VALIDATION - Return empty string if no email provided
  if (!email) return "";
  
  // EMAIL PREPARATION - Gravatar requires lowercase, trimmed email
  const trimmedEmail = email.trim().toLowerCase();
  
  // CREATE MD5 HASH - Gravatar uses this instead of actual email for privacy
  const hash = md5(trimmedEmail);
  
  // BUILD GRAVATAR URL
  // s=${size} - Image size in pixels
  // d=identicon - Default image type if user has no Gravatar (geometric pattern)
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

/*
GRAVATAR URL PARAMETERS EXPLAINED:

- s=80 - Size of image (80x80 pixels)
- d=identicon - Default image if user has no Gravatar
  Other options: 
  - 'mp' (mystery person silhouette)
  - 'robohash' (robot image)
  - 'retro' (8-bit style)
  - '404' (return 404 error if no image)

EXAMPLE USAGE:
const avatarUrl = getGravatarUrl("john@example.com", 100);
// Returns: "https://www.gravatar.com/avatar/abcd1234...?s=100&d=identicon"

<img src={getGravatarUrl(user.email)} alt="User Avatar" />
*/
