import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for programmatic navigation within the app
 * This marks navigation as intentional and prevents refresh redirects
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = (path, options = {}) => {
    // Mark this as programmatic navigation
    sessionStorage.setItem('app-navigated', 'true');
    sessionStorage.setItem('last-navigation', Date.now().toString());
    
    // Perform the navigation
    navigate(path, options);
  };

  return { navigateTo };
};