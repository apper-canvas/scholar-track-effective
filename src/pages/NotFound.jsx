import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function NotFound() {
  const HomeIcon = getIcon('Home');
  const ArrowLeftIcon = getIcon('ArrowLeft');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
    >
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <div className="relative w-48 h-48 mx-auto">
            <div className="absolute inset-0 bg-primary/10 dark:bg-primary/5 rounded-full"></div>
            <div className="absolute inset-4 bg-primary/20 dark:bg-primary/10 rounded-full"></div>
            <div className="absolute inset-8 bg-primary/30 dark:bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-7xl font-bold text-primary dark:text-primary-light">404</span>
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-4 text-surface-800 dark:text-surface-100"
        >
          Page Not Found
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-surface-600 dark:text-surface-400 mb-8 text-lg"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link 
            to="/" 
            className="btn btn-primary flex items-center justify-center gap-2"
          >
            <HomeIcon className="w-5 h-5" />
            Return Home
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline flex items-center justify-center gap-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default NotFound;