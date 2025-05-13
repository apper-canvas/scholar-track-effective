import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { getStudentById, updateStudent, deleteStudent } from '../services/studentService';
import StudentForm from './StudentForm';

function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Icons
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const UserIcon = getIcon('User');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const CalendarIcon = getIcon('Calendar');
  const BookOpenIcon = getIcon('BookOpen');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  
  // State
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Fetch student data
  useEffect(() => {
    if (id) {
      loadStudent();
    }
  }, [id]);
  
  // Load student data
  const loadStudent = async () => {
    setLoading(true);
    try {
      const response = await getStudentById(id);
      if (response.success && response.data) {
        setStudent(response.data);
      } else {
        toast.error("Failed to load student details");
        navigate('/students');
      }
    } catch (error) {
      console.error("Error loading student details:", error);
      toast.error("An error occurred while loading student details");
      navigate('/students');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      try {
        const response = await deleteStudent(id);
        if (response.success) {
          toast.success("Student deleted successfully");
          navigate('/students');
        } else {
          toast.error(response.error || "Failed to delete student");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("An error occurred while deleting student");
      }
    }
  };
  
  // Handle update
  const handleFormSubmit = async (formData) => {
    try {
      const response = await updateStudent(formData);
      if (response.success) {
        toast.success("Student updated successfully");
        setIsFormOpen(false);
        loadStudent();
      } else {
        toast.error(response.error || "Failed to update student");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("An error occurred while updating student");
    }
  };
  
  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format age helper
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header with back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/students')}
          className="inline-flex items-center text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-1" />
          <span>Back to Students</span>
        </button>
        
        {!loading && student && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn btn-outline flex items-center gap-2"
            >
              <EditIcon className="w-5 h-5" />
              <span>Edit</span>
            </button>
            
            <button
              onClick={handleDelete}
              className="btn btn-danger flex items-center gap-2"
            >
              <TrashIcon className="w-5 h-5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="card flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : student ? (
        <div className="card">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Student avatar and basic info */}
            <div className="flex flex-col items-center md:items-start">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-semibold">
                {student.firstName?.[0] || ''}
                {student.lastName?.[0] || ''}
              </div>
              
              <div className="mt-4 text-center md:text-left">
                <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100">
                  {student.firstName} {student.lastName}
                </h1>
                <p className="text-surface-600 dark:text-surface-400">
                  {student.program || 'No Program'} • {student.year || 'N/A'}
                </p>
                <span className={`inline-block mt-2 text-sm px-3 py-1 rounded-full ${
                  student.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {student.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            {/* Student details */}
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-lg font-semibold border-b border-surface-200 dark:border-surface-700 pb-2 mb-4">
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
                      <MailIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Email</p>
                      <p className="text-surface-800 dark:text-surface-200">{student.email || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
                      <PhoneIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Phone</p>
                      <p className="text-surface-800 dark:text-surface-200">{student.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold border-b border-surface-200 dark:border-surface-700 pb-2 mb-4">
                  Academic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
                      <BookOpenIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Program</p>
                      <p className="text-surface-800 dark:text-surface-200">{student.program || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Enrollment Date</p>
                      <p className="text-surface-800 dark:text-surface-200">{formatDate(student.enrollmentDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold border-b border-surface-200 dark:border-surface-700 pb-2 mb-4">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Date of Birth</p>
                      <p className="text-surface-800 dark:text-surface-200">{formatDate(student.dob)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Age</p>
                      <p className="text-surface-800 dark:text-surface-200">{calculateAge(student.dob)} years</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Student Not Found</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            The student you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/students')}
            className="btn btn-primary"
          >
            Return to Student List
          </button>
        </div>
      )}
      
      {/* Edit form modal */}
      <StudentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        student={student}
      />
    </motion.div>
  );
}

export default StudentDetail;