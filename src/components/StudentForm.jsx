import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function StudentForm({ isOpen, onClose, onSubmit, student }) {
  const XIcon = getIcon('X');
  const CheckIcon = getIcon('Check');
  const PlusIcon = getIcon('Plus');

  // Determine if we're in edit mode
  const isEditing = !!student;

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    program: '',
    enrollmentDate: '',
    status: 'active',
    year: 'Freshman'
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Reset form data when student changes
  useEffect(() => {
    if (student) {
      // When editing, populate form with student data
      setFormData({
        Id: student.Id,
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        phone: student.phone || '',
        dob: student.dob || '',
        program: student.program || '',
        enrollmentDate: student.enrollmentDate || '',
        status: student.status || 'active',
        year: student.year || 'Freshman'
      });
    } else {
      // When adding new student, reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        program: '',
        enrollmentDate: '',
        status: 'active',
        year: 'Freshman'
      });
    }
    // Reset errors
    setErrors({});
  }, [student, isOpen]);

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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData, isEditing);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
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
                onClick={onClose}
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                aria-label="Close"
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
              
              {/* Year */}
              <div>
                <label htmlFor="year" className="label">Year</label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
                <button
                  type="button"
                  onClick={onClose}
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
  );
}

export default StudentForm;