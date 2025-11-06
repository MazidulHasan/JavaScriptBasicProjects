// ============================================
// STUDENT GRADE MANAGEMENT SYSTEM
// Complete with validation, error handling, 
// undo/redo, and export functionality
// ============================================

class StudentGradeSystem {
  constructor() {
    this.students = [];
    this.history = [];
    this.redoStack = [];
    this.maxHistorySize = 50;
  }

  // ============================================
  // VALIDATION UTILITIES
  // ============================================

  /**
   * Validates student name
   * @param {string} name - Student name
   * @returns {Object} - {isValid: boolean, error: string}
   */
  validateName(name) {
    if (!name || typeof name !== 'string') {
      return { isValid: false, error: 'Name is required and must be a string' };
    }
    
    const trimmedName = name.trim();
    
    if (trimmedName.length < 2) {
      return { isValid: false, error: 'Name must be at least 2 characters long' };
    }
    
    if (trimmedName.length > 50) {
      return { isValid: false, error: 'Name must not exceed 50 characters' };
    }
    
    if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
      return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }
    
    return { isValid: true, error: null };
  }

  /**
   * Validates scores array
   * @param {Array} scores - Array of scores
   * @returns {Object} - {isValid: boolean, error: string}
   */
  validateScores(scores) {
    if (!Array.isArray(scores)) {
      return { isValid: false, error: 'Scores must be an array' };
    }
    
    if (scores.length === 0) {
      return { isValid: false, error: 'At least one score is required' };
    }
    
    if (scores.length > 20) {
      return { isValid: false, error: 'Maximum 20 scores allowed' };
    }
    
    for (let i = 0; i < scores.length; i++) {
      const score = scores[i];
      
      if (typeof score !== 'number' || isNaN(score)) {
        return { isValid: false, error: `Score at position ${i + 1} must be a valid number` };
      }
      
      if (score < 0 || score > 100) {
        return { isValid: false, error: `Score at position ${i + 1} must be between 0 and 100` };
      }
    }
    
    return { isValid: true, error: null };
  }

  /**
   * Checks if student name already exists
   * @param {string} name - Student name
   * @returns {boolean}
   */
  studentExists(name) {
    const normalizedName = name.trim().toLowerCase();
    return this.students.some(student => 
      student.name.toLowerCase() === normalizedName
    );
  }

  // ============================================
  // HISTORY MANAGEMENT (UNDO/REDO)
  // ============================================

  /**
   * Saves current state to history
   * @param {string} action - Action description
   */
  saveToHistory(action) {
    // Deep clone the current state
    const snapshot = {
      action: action,
      timestamp: new Date().toISOString(),
      students: JSON.parse(JSON.stringify(this.students))
    };
    
    this.history.push(snapshot);
    
    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
    
    // Clear redo stack when new action is performed
    this.redoStack = [];
  }

  /**
   * Undo last action
   * @returns {Object} - {success: boolean, message: string}
   */
  undo() {
    if (this.history.length === 0) {
      return { success: false, message: 'Nothing to undo' };
    }
    
    // Save current state to redo stack
    const currentState = {
      action: 'Current state',
      timestamp: new Date().toISOString(),
      students: JSON.parse(JSON.stringify(this.students))
    };
    this.redoStack.push(currentState);
    
    // Restore previous state
    const previousState = this.history.pop();
    this.students = previousState.students;
    
    return { 
      success: true, 
      message: `Undone: ${previousState.action}` 
    };
  }

  /**
   * Redo last undone action
   * @returns {Object} - {success: boolean, message: string}
   */
  redo() {
    if (this.redoStack.length === 0) {
      return { success: false, message: 'Nothing to redo' };
    }
    
    // Save current state to history
    this.saveToHistory('Before redo');
    this.history.pop(); // Remove the "Before redo" entry
    
    // Restore next state
    const nextState = this.redoStack.pop();
    this.students = nextState.students;
    
    return { 
      success: true, 
      message: 'Action redone successfully' 
    };
  }

  // ============================================
  // CORE FUNCTIONALITY
  // ============================================

  /**
   * Adds a new student with validation
   * @param {string} name - Student name
   * @param {Array} scores - Array of scores
   * @returns {Object} - {success: boolean, message: string, data: Object}
   */
  addStudent(name, scores) {
    try {
      // Validate name
      const nameValidation = this.validateName(name);
      if (!nameValidation.isValid) {
        return { success: false, message: nameValidation.error, data: null };
      }
      
      // Check for duplicate
      if (this.studentExists(name)) {
        return { 
          success: false, 
          message: `Student "${name}" already exists`, 
          data: null 
        };
      }
      
      // Validate scores
      const scoresValidation = this.validateScores(scores);
      if (!scoresValidation.isValid) {
        return { success: false, message: scoresValidation.error, data: null };
      }
      
      // Save to history before making changes
      this.saveToHistory(`Added student: ${name}`);
      
      // Create student object
      const student = {
        id: this.generateId(),
        name: name.trim(),
        scores: [...scores],
        addedAt: new Date().toISOString()
      };
      
      this.students.push(student);
      
      return { 
        success: true, 
        message: `Student "${student.name}" added successfully`, 
        data: student 
      };
      
    } catch (error) {
      return { 
        success: false, 
        message: `Error adding student: ${error.message}`, 
        data: null 
      };
    }
  }

  /**
   * Removes a student by name
   * @param {string} name - Student name
   * @returns {Object} - {success: boolean, message: string}
   */
  removeStudent(name) {
    try {
      if (!name || typeof name !== 'string') {
        return { success: false, message: 'Valid student name is required' };
      }
      
      const normalizedName = name.trim().toLowerCase();
      const index = this.students.findIndex(student => 
        student.name.toLowerCase() === normalizedName
      );
      
      if (index === -1) {
        return { success: false, message: `Student "${name}" not found` };
      }
      
      this.saveToHistory(`Removed student: ${this.students[index].name}`);
      
      const removedStudent = this.students.splice(index, 1)[0];
      
      return { 
        success: true, 
        message: `Student "${removedStudent.name}" removed successfully` 
      };
      
    } catch (error) {
      return { 
        success: false, 
        message: `Error removing student: ${error.message}` 
      };
    }
  }

  /**
   * Generates unique ID
   * @returns {string}
   */
  generateId() {
    return `STU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calculates average score for a student
   * @param {Array} scores - Array of scores
   * @returns {number}
   */
  calculateAverage(scores) {
    if (!scores || scores.length === 0) return 0;
    const sum = scores.reduce((acc, score) => acc + score, 0);
    return Math.round((sum / scores.length) * 100) / 100; // Round to 2 decimals
  }

  /**
   * Assigns letter grade based on average
   * @param {number} average - Average score
   * @returns {string}
   */
  getLetterGrade(average) {
    if (average >= 90) return 'A';
    if (average >= 80) return 'B';
    if (average >= 70) return 'C';
    if (average >= 60) return 'D';
    return 'F';
  }

  /**
   * Gets all students with calculated grades
   * @returns {Array}
   */
  getAllStudentsWithGrades() {
    return this.students.map(student => {
      const average = this.calculateAverage(student.scores);
      const grade = this.getLetterGrade(average);
      
      return {
        id: student.id,
        name: student.name,
        scores: student.scores,
        average: average,
        grade: grade,
        status: grade === 'F' ? 'Failing' : 'Passing'
      };
    });
  }

  /**
   * Gets failing students (grade < 60)
   * @returns {Array}
   */
  getFailingStudents() {
    return this.getAllStudentsWithGrades().filter(student => 
      student.average < 60
    );
  }

  /**
   * Gets top performer
   * @returns {Object|null}
   */
  getTopPerformer() {
    if (this.students.length === 0) return null;
    
    const studentsWithGrades = this.getAllStudentsWithGrades();
    
    return studentsWithGrades.reduce((top, current) => 
      current.average > top.average ? current : top
    );
  }

  /**
   * Searches students by name (partial match)
   * @param {string} query - Search query
   * @returns {Array}
   */
  searchStudents(query) {
    if (!query || typeof query !== 'string') return [];
    
    const normalizedQuery = query.trim().toLowerCase();
    
    return this.getAllStudentsWithGrades().filter(student =>
      student.name.toLowerCase().includes(normalizedQuery)
    );
  }

  /**
   * Gets students by grade
   * @param {string} grade - Letter grade (A, B, C, D, F)
   * @returns {Array}
   */
  getStudentsByGrade(grade) {
    if (!grade || typeof grade !== 'string') return [];
    
    const normalizedGrade = grade.trim().toUpperCase();
    
    if (!['A', 'B', 'C', 'D', 'F'].includes(normalizedGrade)) {
      return [];
    }
    
    return this.getAllStudentsWithGrades().filter(student =>
      student.grade === normalizedGrade
    );
  }

  /**
   * Gets class statistics
   * @returns {Object}
   */
  getClassStatistics() {
    if (this.students.length === 0) {
      return {
        totalStudents: 0,
        classAverage: 0,
        highestAverage: 0,
        lowestAverage: 0,
        passingRate: 0,
        gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 }
      };
    }
    
    const studentsWithGrades = this.getAllStudentsWithGrades();
    const averages = studentsWithGrades.map(s => s.average);
    
    const classAverage = Math.round(
      (averages.reduce((sum, avg) => sum + avg, 0) / averages.length) * 100
    ) / 100;
    
    const passingStudents = studentsWithGrades.filter(s => s.average >= 60).length;
    const passingRate = Math.round((passingStudents / this.students.length) * 100);
    
    const gradeDistribution = studentsWithGrades.reduce((dist, student) => {
      dist[student.grade] = (dist[student.grade] || 0) + 1;
      return dist;
    }, { A: 0, B: 0, C: 0, D: 0, F: 0 });
    
    return {
      totalStudents: this.students.length,
      classAverage: classAverage,
      highestAverage: Math.max(...averages),
      lowestAverage: Math.min(...averages),
      passingRate: passingRate,
      gradeDistribution: gradeDistribution
    };
  }

  // ============================================
  // EXPORT FUNCTIONALITY
  // ============================================

  /**
   * Exports data as CSV format
   * @returns {string}
   */
  exportAsCSV() {
    if (this.students.length === 0) {
      return 'No data to export';
    }
    
    const studentsWithGrades = this.getAllStudentsWithGrades();
    
    // CSV Header
    let csv = 'ID,Name,Scores,Average,Grade,Status\n';
    
    // CSV Rows
    studentsWithGrades.forEach(student => {
      const scoresStr = `"${student.scores.join(', ')}"`;
      csv += `${student.id},${student.name},${scoresStr},${student.average},${student.grade},${student.status}\n`;
    });
    
    return csv;
  }

  /**
   * Exports data as formatted report
   * @returns {string}
   */
  exportAsReport() {
    if (this.students.length === 0) {
      return 'No data to export';
    }
    
    const stats = this.getClassStatistics();
    const studentsWithGrades = this.getAllStudentsWithGrades();
    const topPerformer = this.getTopPerformer();
    
    let report = '========================================\n';
    report += '   STUDENT GRADE MANAGEMENT REPORT\n';
    report += '========================================\n\n';
    
    // Class Statistics
    report += 'CLASS STATISTICS:\n';
    report += '----------------------------------------\n';
    report += `Total Students: ${stats.totalStudents}\n`;
    report += `Class Average: ${stats.classAverage}\n`;
    report += `Highest Average: ${stats.highestAverage}\n`;
    report += `Lowest Average: ${stats.lowestAverage}\n`;
    report += `Passing Rate: ${stats.passingRate}%\n\n`;
    
    // Grade Distribution
    report += 'GRADE DISTRIBUTION:\n';
    report += '----------------------------------------\n';
    report += `A: ${stats.gradeDistribution.A} students\n`;
    report += `B: ${stats.gradeDistribution.B} students\n`;
    report += `C: ${stats.gradeDistribution.C} students\n`;
    report += `D: ${stats.gradeDistribution.D} students\n`;
    report += `F: ${stats.gradeDistribution.F} students\n\n`;
    
    // Top Performer
    if (topPerformer) {
      report += 'TOP PERFORMER:\n';
      report += '----------------------------------------\n';
      report += `Name: ${topPerformer.name}\n`;
      report += `Average: ${topPerformer.average}\n`;
      report += `Grade: ${topPerformer.grade}\n\n`;
    }
    
    // Individual Student Details
    report += 'INDIVIDUAL STUDENT DETAILS:\n';
    report += '========================================\n\n';
    
    studentsWithGrades.forEach((student, index) => {
      report += `${index + 1}. ${student.name}\n`;
      report += `   ID: ${student.id}\n`;
      report += `   Scores: ${student.scores.join(', ')}\n`;
      report += `   Average: ${student.average}\n`;
      report += `   Grade: ${student.grade}\n`;
      report += `   Status: ${student.status}\n`;
      report += '----------------------------------------\n';
    });
    
    report += `\nReport generated: ${new Date().toLocaleString()}\n`;
    
    return report;
  }

  /**
   * Exports data as JSON
   * @returns {string}
   */
  exportAsJSON() {
    const data = {
      exportDate: new Date().toISOString(),
      statistics: this.getClassStatistics(),
      students: this.getAllStudentsWithGrades()
    };
    
    return JSON.stringify(data, null, 2);
  }
}

// ============================================
// DEMO USAGE
// ============================================

console.log('========================================');
console.log('STUDENT GRADE MANAGEMENT SYSTEM - DEMO');
console.log('========================================\n');

// Initialize system
const system = new StudentGradeSystem();

// Add students
console.log('--- ADDING STUDENTS ---');
console.log(system.addStudent('John Smith', [85, 92, 78, 88, 90]));
console.log(system.addStudent('Emma Wilson', [95, 98, 92, 96, 94]));
console.log(system.addStudent('Michael Brown', [72, 68, 75, 70, 73]));
console.log(system.addStudent('Sarah Davis', [55, 48, 62, 58, 52]));
console.log(system.addStudent('David Lee', [88, 85, 90, 87, 91]));

// Test validation errors
console.log('\n--- TESTING VALIDATION ---');
console.log(system.addStudent('', [90])); // Empty name
console.log(system.addStudent('John Smith', [85])); // Duplicate
console.log(system.addStudent('Test User', [105])); // Invalid score

// Display all students with grades
console.log('\n--- ALL STUDENTS WITH GRADES ---');
console.log(system.getAllStudentsWithGrades());

// Get failing students
console.log('\n--- FAILING STUDENTS ---');
console.log(system.getFailingStudents());

// Get top performer
console.log('\n--- TOP PERFORMER ---');
console.log(system.getTopPerformer());

// Search functionality
console.log('\n--- SEARCH: "Smith" ---');
console.log(system.searchStudents('Smith'));

// Get students by grade
console.log('\n--- STUDENTS WITH GRADE A ---');
console.log(system.getStudentsByGrade('A'));

// Class statistics
console.log('\n--- CLASS STATISTICS ---');
console.log(system.getClassStatistics());

// Test undo/redo
console.log('\n--- TESTING UNDO/REDO ---');
console.log(system.removeStudent('David Lee'));
console.log('After removal:', system.students.map(s => s.name));
console.log(system.undo());
console.log('After undo:', system.students.map(s => s.name));
console.log(system.redo());
console.log('After redo:', system.students.map(s => s.name));

// Export as CSV
console.log('\n--- EXPORT AS CSV ---');
console.log(system.exportAsCSV());

// Export as Report
console.log('\n--- EXPORT AS REPORT ---');
console.log(system.exportAsReport());

// Export as JSON
console.log('\n--- EXPORT AS JSON ---');
console.log(system.exportAsJSON());

console.log('\n========================================');
console.log('DEMO COMPLETED');
console.log('========================================');