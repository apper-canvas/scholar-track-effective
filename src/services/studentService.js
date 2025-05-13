import { initializeApperClient } from '../utils/apperConfig';

const STUDENT_TABLE = 'student';

/**
 * Fetch students with optional filtering, sorting and pagination
 * @param {Object} options - Options for filtering and pagination
 * @param {string} options.searchTerm - Search term for filtering
 * @param {string} options.status - Filter by status (active, inactive)
 * @param {string} options.year - Filter by year (Freshman, Sophomore, etc)
 * @param {number} options.limit - Number of records per page
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.sortField - Field to sort by
 * @param {string} options.sortDirection - Sort direction (asc, desc)
 * @returns {Promise<Object>} - Promise resolving to student data
 */
export const fetchStudents = async (options = {}) => {
  try {
    const client = initializeApperClient();
    if (!client) throw new Error('Failed to initialize Apper client');

    const {
      searchTerm = '',
      status = '',
      year = '',
      limit = 10,
      offset = 0,
      sortField = 'lastName',
      sortDirection = 'asc'
    } = options;

    // Build where conditions
    const whereConditions = [];
    
    // Add search term if provided
    if (searchTerm) {
      whereConditions.push({
        fieldName: 'firstName',
        operator: 'Contains',
        values: [searchTerm]
      });
      whereConditions.push({
        fieldName: 'lastName',
        operator: 'Contains',
        values: [searchTerm]
      });
      whereConditions.push({
        fieldName: 'email',
        operator: 'Contains',
        values: [searchTerm]
      });
      whereConditions.push({
        fieldName: 'program',
        operator: 'Contains',
        values: [searchTerm]
      });
    }

    // Add status filter if provided
    if (status) {
      whereConditions.push({
        fieldName: 'status',
        operator: 'ExactMatch',
        values: [status]
      });
    }

    // Add year filter if provided
    if (year) {
      whereConditions.push({
        fieldName: 'year',
        operator: 'ExactMatch',
        values: [year]
      });
    }
    
    // Build params object
    const params = {
      fields: [
        { field: { name: 'Id' } },
        { field: { name: 'firstName' } },
        { field: { name: 'lastName' } },
        { field: { name: 'email' } },
        { field: { name: 'phone' } },
        { field: { name: 'dob' } },
        { field: { name: 'program' } },
        { field: { name: 'enrollmentDate' } },
        { field: { name: 'status' } },
        { field: { name: 'year' } }
      ],
      orderBy: [
        {
          field: sortField,
          direction: sortDirection
        }
      ],
      pagingInfo: {
        limit,
        offset
      }
    };

    // Add where conditions if we have any
    if (whereConditions.length > 0) {
      // If we have search term conditions, we need to group them with OR
      if (searchTerm) {
        params.whereGroups = [{
          operator: 'OR',
          conditions: whereConditions.filter(cond => 
            cond.fieldName === 'firstName' || 
            cond.fieldName === 'lastName' || 
            cond.fieldName === 'email' || 
            cond.fieldName === 'program'
          )
        }];

        // Add other filters with AND
        params.where = whereConditions.filter(cond => 
          cond.fieldName !== 'firstName' && 
          cond.fieldName !== 'lastName' && 
          cond.fieldName !== 'email' && 
          cond.fieldName !== 'program'
        );
      } else {
        params.where = whereConditions;
      }
    }

    const response = await client.fetchRecords(STUDENT_TABLE, params);
    
    return {
      data: response.data || [],
      total: response.total || 0,
      success: true
    };
  } catch (error) {
    console.error('Error fetching students:', error);
    return {
      data: [],
      total: 0,
      success: false,
      error: error.message || 'Failed to fetch students'
    };
  }
};

/**
 * Get a single student by ID
 * @param {number} id - Student ID
 * @returns {Promise<Object>} - Promise resolving to student data
 */
export const getStudentById = async (id) => {
  try {
    const client = initializeApperClient();
    if (!client) throw new Error('Failed to initialize Apper client');

    const response = await client.getRecordById(STUDENT_TABLE, id);
    return {
      data: response.data || null,
      success: true
    };
  } catch (error) {
    console.error(`Error fetching student with ID ${id}:`, error);
    return {
      data: null,
      success: false,
      error: error.message || 'Failed to fetch student'
    };
  }
};

/**
 * Create a new student record
 * @param {Object} studentData - Student data to create
 * @returns {Promise<Object>} - Promise resolving to creation result
 */
export const createStudent = async (studentData) => {
  try {
    const client = initializeApperClient();
    if (!client) throw new Error('Failed to initialize Apper client');

    const params = {
      records: [studentData]
    };

    const response = await client.createRecord(STUDENT_TABLE, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return {
        data: response.results[0].data,
        success: true
      };
    }
    
    throw new Error(response.message || 'Failed to create student record');
  } catch (error) {
    console.error('Error creating student record:', error);
    return {
      data: null,
      success: false,
      error: error.message || 'Failed to create student record'
    };
  }
};

/**
 * Update an existing student record
 * @param {Object} studentData - Student data to update (must include Id)
 * @returns {Promise<Object>} - Promise resolving to update result
 */
export const updateStudent = async (studentData) => {
  try {
    if (!studentData.Id) {
      throw new Error('Student ID is required for updates');
    }

    const client = initializeApperClient();
    if (!client) throw new Error('Failed to initialize Apper client');

    const params = {
      records: [studentData]
    };

    const response = await client.updateRecord(STUDENT_TABLE, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return {
        data: response.results[0].data,
        success: true
      };
    }
    
    throw new Error(response.message || 'Failed to update student record');
  } catch (error) {
    console.error('Error updating student record:', error);
    return {
      data: null,
      success: false,
      error: error.message || 'Failed to update student record'
    };
  }
};

/**
 * Delete a student record
 * @param {number} id - Student ID to delete
 * @returns {Promise<Object>} - Promise resolving to deletion result
 */
export const deleteStudent = async (id) => {
  try {
    const client = initializeApperClient();
    if (!client) throw new Error('Failed to initialize Apper client');

    const params = {
      recordIds: [id]
    };

    const response = await client.deleteRecord(STUDENT_TABLE, params);
    
    if (response && response.success) {
      return {
        success: true
      };
    }
    
    throw new Error(response.message || 'Failed to delete student record');
  } catch (error) {
    console.error('Error deleting student record:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete student record'
    };
  }
};