// src/utils/getGravatarUrl.js
import md5 from "blueimp-md5";

/**
 * Get a Gravatar image URL for a given email
 * @param {string} email - User's email address
 * @param {number} size - Image size in pixels (default is 80)
 * @returns {string} Gravatar image URL
 */
export function getGravatarUrl(email, size = 80) {
  if (!email) return "";
  const trimmedEmail = email.trim().toLowerCase();
  const hash = md5(trimmedEmail);
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}
