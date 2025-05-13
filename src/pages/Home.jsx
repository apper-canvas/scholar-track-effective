import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

function Home() {
  const GraduationCapIcon = getIcon('GraduationCap');
  const UsersIcon = getIcon('Users');
  const BookOpenIcon = getIcon('BookOpen');
  const CalendarIcon = getIcon('Calendar');
  
  const [stats, setStats] = useState({
    students: 147,
    attendance: 92,
    courses: 24,
    upcoming: 8,
  });
  
  // Sample student data
  const [recentStudents] = useState([
    { id: 1, name: "Emma Johnson", program: "Computer Science", year: "Sophomore", status: "Active" },
    { id: 2, name: "Carlos Rodriguez", program: "Mechanical Engineering", year: "Senior", status: "Active" },
    { id: 3, name: "Aisha Patel", program: "Biology", year: "Junior", status: "Active" }
  ]);

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

  const handleRefreshStats = () => {
    // Simulating data refresh
    setStats({
      students: Math.floor(Math.random() * 50) + 140,
      attendance: Math.floor(Math.random() * 10) + 88,
      courses: Math.floor(Math.random() * 10) + 20,
      upcoming: Math.floor(Math.random() * 10) + 5,
    });
    
    toast.success("Dashboard data refreshed!");
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
        >
          Refresh Data
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
              +12 new students this month
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-gradient-to-br from-secondary-light to-secondary transform hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white text-sm font-medium">Attendance Rate</p>
              <h3 className="text-white text-2xl font-bold">{stats.attendance}%</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-white/80 text-xs">
              +2% increase from last week
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-gradient-to-br from-[#f72585] to-[#b5179e] transform hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white text-sm font-medium">Active Courses</p>
              <h3 className="text-white text-2xl font-bold">{stats.courses}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <BookOpenIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-white/80 text-xs">
              3 courses added this semester
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
              <GraduationCapIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-white/80 text-xs">
              Next: Parent-Teacher Conference
            </p>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MainFeature />
        </div>
        
        <div className="lg:col-span-1">
          <div className="card h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Students</h3>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                View All
              </span>
            </div>
            
            <div className="space-y-4">
              {recentStudents.map(student => (
                <motion.div 
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-3 rounded-lg border border-surface-200 dark:border-surface-700 hover:border-primary dark:hover:border-primary-light transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-surface-800 dark:text-surface-200">{student.name}</p>
                        <p className="text-xs text-surface-500">{student.program} • {student.year}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      student.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {student.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;