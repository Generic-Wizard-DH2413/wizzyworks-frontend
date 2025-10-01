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
    // Add a small delay to ensure the component has fully mounted
    const timeoutId = setTimeout(() => {
      const checkIfRefresh = () => {
        // Check navigation timing API for reload type
        const navigationEntries = performance.getEntriesByType('navigation');
        let isRefresh = false;

        if (navigationEntries.length > 0) {
          const navEntry = navigationEntries[0];
          isRefresh = navEntry.type === 'reload';
        } else {
          // Fallback for older browsers (deprecated but still used in some environments)
          isRefresh = performance.navigation && performance.navigation.type === 1;
        }

        // Additional check: if sessionStorage doesn't have our navigation flag
        // and we're not on the index page, it might be a refresh or direct navigation
        const hasNavigationFlag = sessionStorage.getItem('app-navigated');
        const lastNavigationTime = sessionStorage.getItem('last-navigation');
        const currentTime = Date.now();
        
        // Check if this is a fresh page load (no navigation flag or old timestamp)
        const isFreshLoad = !hasNavigationFlag || 
          (lastNavigationTime && (currentTime - parseInt(lastNavigationTime)) > 30000); // 30 seconds threshold
        
        if ((isRefresh || isFreshLoad) && location.pathname !== '/') {
          console.log('Browser refresh or direct navigation detected, redirecting to index...');
          console.log(`Current path: ${location.pathname}, isRefresh: ${isRefresh}, isFreshLoad: ${isFreshLoad}`);
          console.log('Navigation entries:', navigationEntries);
          console.log('Performance navigation:', performance.navigation);
          navigate('/', { replace: true });
        } else {
          console.log('Normal navigation detected, staying on current path:', location.pathname);
        }

        // Set flag to indicate the app has been navigated
        sessionStorage.setItem('app-navigated', 'true');
        sessionStorage.setItem('last-navigation', currentTime.toString());
      };

      checkIfRefresh();
    }, 100); // Small delay to ensure proper initialization

    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array - only run on mount

  // Set navigation flag whenever location changes (programmatic navigation)
  useEffect(() => {
    sessionStorage.setItem('app-navigated', 'true');
    sessionStorage.setItem('last-navigation', Date.now().toString());
  }, [location.pathname]);
};