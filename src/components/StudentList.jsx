import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import getIcon from '../utils/iconUtils';

function StudentList({
  students,
  loading,
  pagination,
  setPagination,
  onEdit,
  onDelete,
  filters,
  setFilters
}) {
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const EyeIcon = getIcon('Eye');
  const ChevronUpIcon = getIcon('ChevronUp');
  const ChevronDownIcon = getIcon('ChevronDown');
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const ChevronRightIcon = getIcon('ChevronRight');
  const UserIcon = getIcon('User');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const CalendarIcon = getIcon('Calendar');
  const BookOpenIcon = getIcon('BookOpen');

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle sorting
  const handleSort = (field) => {
    setFilters({
      ...filters,
      sortField: field,
      sortDirection: 
        filters.sortField === field 
          ? filters.sortDirection === 'asc' ? 'desc' : 'asc'
          : 'asc'
    });
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (filters.sortField !== field) return null;
    return filters.sortDirection === 'asc' 
      ? <ChevronUpIcon className="w-4 h-4" />
      : <ChevronDownIcon className="w-4 h-4" />;
  };

  // Calculate pagination info
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const showingFrom = pagination.total === 0 
    ? 0 
    : (pagination.currentPage - 1) * pagination.limit + 1;
  const showingTo = Math.min(showingFrom + pagination.limit - 1, pagination.total);

  // Change page
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setPagination({...pagination, currentPage: page});
  };

  return (
    <div className="card">
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          {students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300">
                  <tr>
                    <th className="p-3 font-medium text-sm rounded-tl-lg">
                      <button 
                        onClick={() => handleSort('lastName')}
                        className="flex items-center space-x-1 focus:outline-none"
                      >
                        <span>Name</span>
                        {getSortIcon('lastName')}
                      </button>
                    </th>
                    <th className="p-3 font-medium text-sm">
                      <button 
                        onClick={() => handleSort('email')}
                        className="flex items-center space-x-1 focus:outline-none"
                      >
                        <span>Email</span>
                        {getSortIcon('email')}
                      </button>
                    </th>
                    <th className="p-3 font-medium text-sm">
                      <button 
                        onClick={() => handleSort('program')}
                        className="flex items-center space-x-1 focus:outline-none"
                      >
                        <span>Program</span>
                        {getSortIcon('program')}
                      </button>
                    </th>
                    <th className="p-3 font-medium text-sm hidden lg:table-cell">
                      <button 
                        onClick={() => handleSort('enrollmentDate')}
                        className="flex items-center space-x-1 focus:outline-none"
                      >
                        <span>Enrolled</span>
                        {getSortIcon('enrollmentDate')}
                      </button>
                    </th>
                    <th className="p-3 font-medium text-sm">
                      <button 
                        onClick={() => handleSort('status')}
                        className="flex items-center space-x-1 focus:outline-none"
                      >
                        <span>Status</span>
                        {getSortIcon('status')}
                      </button>
                    </th>
                    <th className="p-3 font-medium text-sm rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                  <AnimatePresence>
                    {students.map(student => (
                      <motion.tr 
                        key={student.Id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-surface-50 dark:hover:bg-surface-700"
                      >
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
                              {student.firstName?.[0] || ''}
                              {student.lastName?.[0] || ''}
                            </div>
                            <div>
                              <div className="font-medium text-surface-900 dark:text-surface-100">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-xs text-surface-500 dark:text-surface-400">
                                {student.year || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <MailIcon className="w-4 h-4 text-surface-400" />
                            <span className="truncate max-w-[200px]">{student.email || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <BookOpenIcon className="w-4 h-4 text-surface-400" />
                            <span>{student.program || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="p-3 hidden lg:table-cell">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-4 h-4 text-surface-400" />
                            <span>{formatDate(student.enrollmentDate)}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            student.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {student.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/students/${student.Id}`}
                              className="p-1.5 rounded-full text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light hover:bg-surface-100 dark:hover:bg-surface-700"
                              aria-label="View student details"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => onEdit(student)}
                              className="p-1.5 rounded-full text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light hover:bg-surface-100 dark:hover:bg-surface-700"
                              aria-label="Edit student"
                            >
                              <EditIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => onDelete(student.Id)}
                              className="p-1.5 rounded-full text-surface-600 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400 hover:bg-surface-100 dark:hover:bg-surface-700"
                              aria-label="Delete student"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              
              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <div className="text-sm text-surface-600 dark:text-surface-400">
                  Showing {showingFrom} to {showingTo} of {pagination.total} students
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => changePage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  
                  {/* Page numbers */}
                  <div className="flex items-center space-x-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => changePage(i + 1)}
                        className={`w-8 h-8 rounded-lg text-sm ${
                          pagination.currentPage === i + 1
                            ? 'bg-primary text-white'
                            : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => changePage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === totalPages}
                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center">
                  <UserIcon className="w-10 h-10 text-surface-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mb-2">
                No Students Found
              </h3>
              <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto mb-6">
                {filters.searchTerm || filters.status || filters.year 
                  ? "No students match your search criteria. Try adjusting your filters."
                  : "You haven't added any students yet. Create your first student record to get started."}
              </p>
              {(filters.searchTerm || filters.status || filters.year) && (
                <button
                  onClick={() => setFilters({
                    searchTerm: '',
                    status: '',
                    year: '',
                    sortField: 'lastName',
                    sortDirection: 'asc'
                  })}
                  className="btn btn-outline"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default StudentList;