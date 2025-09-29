import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Custom hook to redirect to index page on browser refresh only
 * This detects manual browser refreshes and redirects to home page
 * while allowing normal programmatic navigation
 */
export const useRefreshRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only check on component mount (initial load)
    const checkIfRefresh = () => {
      // Check navigation timing API for reload type
      const navigationEntries = performance.getEntriesByType('navigation');
      let isRefresh = false;

      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0];
        isRefresh = navEntry.type === 'reload';
      } else {
        // Fallback for older browsers
        isRefresh = performance.navigation && performance.navigation.type === 1;
      }

      // Additional check: if sessionStorage doesn't have our navigation flag
      // and we're not on the index page, it might be a refresh
      const hasNavigationFlag = sessionStorage.getItem('app-navigated');
      
      if (isRefresh && location.pathname !== '/') {
        console.log('Browser refresh detected, redirecting to index...');
        navigate('/', { replace: true });
      } else if (!hasNavigationFlag && location.pathname !== '/') {
        // This covers edge cases where performance API might not detect refresh
        console.log('Direct navigation to non-index route detected, redirecting...');
        navigate('/', { replace: true });
      }

      // Set flag to indicate the app has been navigated
      sessionStorage.setItem('app-navigated', 'true');
    };

    checkIfRefresh();
  }, []); // Empty dependency array - only run on mount

  // Set navigation flag whenever location changes (programmatic navigation)
  useEffect(() => {
    sessionStorage.setItem('app-navigated', 'true');
  }, [location.pathname]);
};