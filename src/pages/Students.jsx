import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import StudentList from '../components/StudentList';
import StudentForm from '../components/StudentForm';
import { fetchStudents, createStudent, updateStudent, deleteStudent } from '../services/studentService';

function Students() {
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');

  // State for student management
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    limit: 10
  });
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    year: '',
    sortField: 'lastName',
    sortDirection: 'asc'
  });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  // Load students on initial render and when filters/pagination change
  useEffect(() => {
    loadStudents();
  }, [filters, pagination.currentPage, pagination.limit]);

  // Load students from API
  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await fetchStudents({
        ...filters,
        limit: pagination.limit,
        offset: (pagination.currentPage - 1) * pagination.limit
      });

      if (response.success) {
        setStudents(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.total
        }));
      } else {
        toast.error("Failed to load students");
      }
    } catch (error) {
      console.error("Error loading students:", error);
      toast.error("An error occurred while loading students");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (create/update)
  const handleFormSubmit = async (formData, isEditing) => {
    try {
      let response;
      
      if (isEditing) {
        response = await updateStudent(formData);
        if (response.success) {
          toast.success("Student updated successfully!");
          loadStudents();
        } else {
          toast.error(response.error || "Failed to update student");
        }
      } else {
        response = await createStudent(formData);
        if (response.success) {
          toast.success("Student added successfully!");
          loadStudents();
        } else {
          toast.error(response.error || "Failed to add student");
        }
      }
      
      setIsFormOpen(false);
      setCurrentStudent(null);
    } catch (error) {
      console.error("Error saving student:", error);
      toast.error("An error occurred while saving student");
    }
  };

  // Handle delete student
  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await deleteStudent(studentId);
        if (response.success) {
          toast.success("Student deleted successfully!");
          loadStudents();
        } else {
          toast.error(response.error || "Failed to delete student");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("An error occurred while deleting student");
      }
    }
  };

  // Open edit form
  const handleEditStudent = (student) => {
    setCurrentStudent(student);
    setIsFormOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-800 dark:text-surface-100">
            Student Management
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Add, edit, and manage student information
          </p>
        </div>
        
        <button
          onClick={() => {
            setCurrentStudent(null);
            setIsFormOpen(true);
          }}
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-surface-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search students..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
          />
        </div>

        <select
          className="input max-w-[200px]"
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          className="input max-w-[200px]"
          value={filters.year}
          onChange={(e) => setFilters({...filters, year: e.target.value})}
        >
          <option value="">All Years</option>
          <option value="Freshman">Freshman</option>
          <option value="Sophomore">Sophomore</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
        </select>
      </div>

      {/* Student list component */}
      <StudentList
        students={students}
        loading={loading}
        pagination={pagination}
        setPagination={setPagination}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
        filters={filters}
        setFilters={setFilters}
      />

      {/* Student form modal */}
      <StudentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        student={currentStudent}
      />
    </motion.div>
  );
}

export default Students;