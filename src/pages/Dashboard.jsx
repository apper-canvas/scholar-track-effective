import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { fetchStudents } from '../services/studentService';

function Dashboard() {
  const GraduationCapIcon = getIcon('GraduationCap');
  const UsersIcon = getIcon('Users');
  const BookOpenIcon = getIcon('BookOpen');
  const CalendarIcon = getIcon('Calendar');
  const ArrowRightIcon = getIcon('ArrowRight');
  
  const [stats, setStats] = useState({
    students: 0,
    active: 0,
    inactive: 0,
    upcoming: 8,
  });
  
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch student data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch recent students
      const response = await fetchStudents({
        limit: 3,
        sortField: 'enrollmentDate',
        sortDirection: 'desc'
      });

      if (response.success) {
        setRecentStudents(response.data);
        
        // Get stats from API data
        const activeStudents = response.data.filter(s => s.status === 'active').length;
        
        // Get full count in a separate query for statistics
        const fullResponse = await fetchStudents({ limit: 1000 });
        if (fullResponse.success) {
          const totalStudents = fullResponse.data.length;
          const activeTotal = fullResponse.data.filter(s => s.status === 'active').length;
          
          setStats({
            students: totalStudents,
            active: activeTotal,
            inactive: totalStudents - activeTotal,
            upcoming: 8 // Hardcoded for now, could come from events API
          });
        }
      } else {
        toast.error("Failed to load student data");
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("An error occurred while loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStats = () => {
    loadDashboardData();
    toast.success("Dashboard data refreshed!");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-800 dark:text-surface-100">
            Student Management Dashboard
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Manage student records, track attendance, and monitor academic performance
          </p>
        </div>
        
        <button 
          onClick={handleRefreshStats}
          className="btn btn-outline"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <motion.div variants={itemVariants} className="card bg-gradient-to-br from-primary-light to-primary transform hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white text-sm font-medium">Total Students</p>
              <h3 className="text-white text-2xl font-bold">{stats.students}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-white/80 text-xs">
              Manage all your student records
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-gradient-to-br from-green-500 to-green-600 transform hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white text-sm font-medium">Active Students</p>
              <h3 className="text-white text-2xl font-bold">{stats.active}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-white/80 text-xs">
              Currently enrolled students
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-gradient-to-br from-yellow-500 to-yellow-600 transform hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white text-sm font-medium">Inactive Students</p>
              <h3 className="text-white text-2xl font-bold">{stats.inactive}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-white/80 text-xs">
              On leave or withdrawn students
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-gradient-to-br from-[#4cc9f0] to-[#4895ef] transform hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white text-sm font-medium">Upcoming Events</p>
              <h3 className="text-white text-2xl font-bold">{stats.upcoming}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-white/80 text-xs">
              Next: Parent-Teacher Conference
            </p>
          </div>
        </motion.div>
      </motion.div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recently Added Students</h3>
          <Link to="/students" className="flex items-center text-sm text-primary hover:text-primary-dark">
            View All Students <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentStudents.length > 0 ? (
              recentStudents.map(student => (
                <motion.div 
                  key={student.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-3 rounded-lg border border-surface-200 dark:border-surface-700 hover:border-primary dark:hover:border-primary-light transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
                        {student.firstName?.[0] || ''}
                        {student.lastName?.[0] || ''}
                      </div>
                      <div>
                        <p className="font-medium text-surface-800 dark:text-surface-200">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-surface-500">
                          {student.program} • {student.year || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      student.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {student.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-surface-600 dark:text-surface-400">No students found</p>
                <Link 
                  to="/students" 
                  className="btn btn-primary mt-4 inline-flex items-center"
                >
                  <UsersIcon className="w-4 h-4 mr-2" />
                  Manage Students
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;