import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Custom hook to prevent browser back button navigation
 * This pushes a dummy state to history and intercepts back navigation
 * 
 * @param {boolean} isEnabled - Whether back button prevention is active
 * @param {function} onBackAttempt - Optional callback when back is attempted
 * @param {boolean} showConfirmation - Whether to show confirmation dialog
 * @param {string} redirectPath - Path to redirect to if user confirms leaving (default: '/')
 */
export const usePreventBackButton = (
  isEnabled = true, 
  onBackAttempt = null, 
  showConfirmation = false,
  redirectPath = '/'
) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackAttempt = useCallback(() => {
    if (showConfirmation) {
      const shouldLeave = window.confirm(
        'Are you sure you want to leave this page? Your progress may be lost.'
      );
      
      if (shouldLeave) {
        // Remove the event listener temporarily to allow navigation
        window.removeEventListener('popstate', handlePopState);
        navigate(redirectPath, { replace: true });
        return;
      }
    }
    
    // Call the callback if provided
    if (onBackAttempt) {
      onBackAttempt();
    }
    
    console.log('Back button pressed - navigation prevented');
  }, [showConfirmation, onBackAttempt, navigate, redirectPath]);

  const handlePopState = useCallback((event) => {
    // Prevent the default back behavior
    event.preventDefault();
    
    // Push the current state back to prevent going back
    window.history.pushState(null, '', window.location.pathname);
    
    handleBackAttempt();
  }, [handleBackAttempt]);

  useEffect(() => {
    if (!isEnabled) return;

    // Push a dummy state to history to create a "buffer"
    window.history.pushState(null, '', window.location.pathname);

    // Add the event listener
    window.addEventListener('popstate', handlePopState);

    // Cleanup function
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isEnabled, handlePopState, location.pathname]);

  const handleKeyDown = useCallback((event) => {
    // Prevent Alt+Left Arrow (back) and Alt+Right Arrow (forward)
    if (event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      console.log('Browser navigation shortcut prevented');
      
      handleBackAttempt();
    }
    
    // Prevent Backspace navigation (when not in input fields)
    if (event.key === 'Backspace' && 
        !['input', 'textarea'].includes(event.target.tagName.toLowerCase()) &&
        !event.target.isContentEditable) {
      event.preventDefault();
      console.log('Backspace navigation prevented');
      
      handleBackAttempt();
    }
  }, [handleBackAttempt]);

  // Also prevent browser navigation via keyboard shortcuts
  useEffect(() => {
    if (!isEnabled) return;

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEnabled, handleKeyDown]);

  // Return a function to manually disable the hook if needed
  return {
    disable: useCallback(() => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('keydown', handleKeyDown);
    }, [handlePopState, handleKeyDown])
  };
};