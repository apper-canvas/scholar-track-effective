/**
 * Central configuration for Apper SDK integration
 * Provides consistent configuration across the application
 */

// Initialize Apper client with environment variables
export const initializeApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  
  if (!import.meta.env.VITE_APPER_PROJECT_ID || !import.meta.env.VITE_APPER_PUBLIC_KEY) {
    console.error('Apper credentials are missing. Please check your environment variables.');
    return null;
  }
  
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};