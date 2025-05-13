import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AuthContext } from '../App';
import getIcon from '../utils/iconUtils';

function Navbar() {
  const { darkMode, toggleDarkMode, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get user from Redux store
  const { user } = useSelector(state => state.user);
  
  // Icons
  const HomeIcon = getIcon('Home');
  const UsersIcon = getIcon('Users');
  const BarChartIcon = getIcon('BarChart');
  const LogOutIcon = getIcon('LogOut');
  const MenuIcon = getIcon('Menu');
  const XIcon = getIcon('X');
  
  // Nav items
  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/students', icon: UsersIcon, label: 'Students' },
  ];
  
  // Get active nav class
  const getNavClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      isActive 
        ? 'bg-primary text-white'
        : 'text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
    }`;
  };

  return (
    <nav className="sticky top-0 z-10 bg-white dark:bg-surface-800 shadow-sm border-b border-surface-200 dark:border-surface-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <Link to="/" className="text-primary font-bold text-xl mr-10">ScholarTrack</Link>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map(item => (
                <Link key={item.path} to={item.path} className={getNavClass(item.path)}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* User menu and dark mode toggle */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-800 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <motion.div
                  initial={{ rotate: -30, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ rotate: 30, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                </motion.div>
              )}
            </button>
            
            {/* User profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline text-surface-800 dark:text-surface-200">
                  {user?.firstName || 'User'}
                </span>
              </button>
              
              {/* Profile dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 py-1">
                  <button 
                    onClick={() => { setIsProfileOpen(false); logout(); }}
                    className="flex items-center w-full px-4 py-2 text-left text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <LogOutIcon className="w-4 h-4 mr-2" /> Sign Out
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-surface-200 dark:border-surface-700">
            <div className="space-y-1">
              {navItems.map(item => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={getNavClass(item.path)}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <button 
                onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                className="flex items-center w-full px-3 py-2 text-left text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg mt-2"
              >
                <LogOutIcon className="w-5 h-5 mr-2" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;