import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function MainFeature() {
  const PlusIcon = getIcon('Plus');
  const UserIcon = getIcon('User');
  const SearchIcon = getIcon('Search');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const CalendarIcon = getIcon('Calendar');
  const BookOpenIcon = getIcon('BookOpen');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  
  // State for managing student data
  const [students, setStudents] = useState([
    { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Davis', 
      email: 'john.davis@example.com',
      phone: '(555) 123-4567',
      dob: '1998-05-12',
      program: 'Computer Science',
      enrollmentDate: '2021-09-01',
      status: 'active'
    },
    { 
      id: 2, 
      firstName: 'Sophia', 
      lastName: 'Martinez', 
      email: 'sophia.m@example.com',
      phone: '(555) 987-6543',
      dob: '1999-08-23',
      program: 'Business Administration',
      enrollmentDate: '2022-01-15',
      status: 'active'
    },
    { 
      id: 3, 
      firstName: 'Miguel', 
      lastName: 'Chen', 
      email: 'miguel.c@example.com',
      phone: '(555) 456-7890',
      dob: '2000-11-05',
      program: 'Psychology',
      enrollmentDate: '2021-09-01',
      status: 'inactive'
    }
  ]);
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    program: '',
    enrollmentDate: '',
    status: 'active'
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [errors, setErrors] = useState({});
  
  // Filter students based on search and tab
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.program.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && student.status === activeTab;
  });
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.program.trim()) newErrors.program = "Program is required";
    if (!formData.enrollmentDate) newErrors.enrollmentDate = "Enrollment date is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Add or update student
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    if (isEditing) {
      // Update existing student
      const updatedStudents = students.map(student => 
        student.id === currentStudentId ? { ...formData, id: currentStudentId } : student
      );
      setStudents(updatedStudents);
      toast.success("Student updated successfully!");
    } else {
      // Add new student
      const newStudent = {
        ...formData,
        id: Math.max(0, ...students.map(s => s.id)) + 1
      };
      setStudents([...students, newStudent]);
      toast.success("Student added successfully!");
    }
    
    // Reset form
    setIsFormOpen(false);
    setIsEditing(false);
    setCurrentStudentId(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      program: '',
      enrollmentDate: '',
      status: 'active'
    });
  };
  
  // Edit student
  const handleEdit = (studentId) => {
    const studentToEdit = students.find(student => student.id === studentId);
    if (studentToEdit) {
      setFormData(studentToEdit);
      setCurrentStudentId(studentId);
      setIsEditing(true);
      setIsFormOpen(true);
    }
  };
  
  // Delete student
  const handleDelete = (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter(student => student.id !== studentId));
      toast.success("Student deleted successfully!");
    }
  };
  
  // Get tab class
  const getTabClass = (tabName) => {
    return `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      activeTab === tabName 
        ? 'bg-primary text-white' 
        : 'text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
    }`;
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="card h-full relative">
      <h2 className="text-xl font-bold mb-6">Student Management</h2>
      
      {/* Search and Add Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-surface-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button
          onClick={() => {
            setIsFormOpen(true);
            setIsEditing(false);
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              dob: '',
              program: '',
              enrollmentDate: '',
              status: 'active'
            });
          }}
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Student</span>
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          className={getTabClass('all')}
          onClick={() => setActiveTab('all')}
        >
          All Students
        </button>
        <button 
          className={getTabClass('active')}
          onClick={() => setActiveTab('active')}
        >
          Active
        </button>
        <button 
          className={getTabClass('inactive')}
          onClick={() => setActiveTab('inactive')}
        >
          Inactive
        </button>
      </div>
      
      {/* Student List */}
      <div className="space-y-4">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border border-surface-200 dark:border-surface-700 rounded-lg p-4 hover:border-primary dark:hover:border-primary-light transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-bold text-lg">
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-800 dark:text-surface-100">
                      {student.firstName} {student.lastName}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 gap-x-4 text-sm text-surface-600 dark:text-surface-400">
                      <div className="flex items-center gap-1">
                        <BookOpenIcon className="w-4 h-4" />
                        <span>{student.program}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Enrolled: {formatDate(student.enrollmentDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-auto">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    student.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {student.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                  
                  <button
                    onClick={() => handleEdit(student.id)}
                    className="p-2 text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    aria-label="Edit student"
                  >
                    <EditIcon className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="p-2 text-surface-600 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    aria-label="Delete student"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4 text-sm">
                <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                  <MailIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                  <PhoneIcon className="w-4 h-4 flex-shrink-0" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                  <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                  <span>DOB: {formatDate(student.dob)}</span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-surface-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No students found</h3>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              {searchTerm 
                ? "No students match your search criteria" 
                : "Add your first student to get started"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')} 
                className="btn btn-outline"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Student Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="border-b border-surface-200 dark:border-surface-700 px-6 py-4 flex justify-between items-center sticky top-0 bg-white dark:bg-surface-800 z-10">
                <h3 className="font-semibold text-xl">
                  {isEditing ? "Edit Student" : "Add New Student"}
                </h3>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="label">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`input ${errors.firstName ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="label">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`input ${errors.lastName ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`input ${errors.email ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="label">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`input ${errors.phone ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date of Birth */}
                  <div>
                    <label htmlFor="dob" className="label">Date of Birth</label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className={`input ${errors.dob ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                    )}
                  </div>
                  
                  {/* Program */}
                  <div>
                    <label htmlFor="program" className="label">Program/Major</label>
                    <input
                      type="text"
                      id="program"
                      name="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      className={`input ${errors.program ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {errors.program && (
                      <p className="text-red-500 text-xs mt-1">{errors.program}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Enrollment Date */}
                  <div>
                    <label htmlFor="enrollmentDate" className="label">Enrollment Date</label>
                    <input
                      type="date"
                      id="enrollmentDate"
                      name="enrollmentDate"
                      value={formData.enrollmentDate}
                      onChange={handleInputChange}
                      className={`input ${errors.enrollmentDate ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {errors.enrollmentDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.enrollmentDate}</p>
                    )}
                  </div>
                  
                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="label">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="btn bg-surface-200 hover:bg-surface-300 text-surface-800 dark:bg-surface-700 dark:hover:bg-surface-600 dark:text-surface-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {isEditing ? (
                      <>
                        <CheckIcon className="w-5 h-5" />
                        <span>Update Student</span>
                      </>
                    ) : (
                      <>
                        <PlusIcon className="w-5 h-5" />
                        <span>Add Student</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MainFeature;