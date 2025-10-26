// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
  apiUrl: 'https://jsonplaceholder.typicode.com/posts',
  timeout: 5000, // 5 seconds
  retries: 3
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Schema validation: checks if all required fields exist in response
 * @param {Object} responseBody - The response object to validate
 * @param {Array<string>} fieldsArray - Array of required field names
 * @returns {boolean} - True if all fields exist
 */
function hasRequiredFields(responseBody, fieldsArray) {
  if (!responseBody || typeof responseBody !== 'object') {
    return false;
  }
  return fieldsArray.every(field => field in responseBody);
}

/**
 * Generate random userId within range
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number} - Random integer
 */
function generateRandomUserId(min = 1, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Fetch with timeout capability
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, options, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Retry logic for failed requests
 * @param {Function} fn - Async function to retry
 * @param {number} retries - Number of retry attempts
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise<any>}
 */
async function retryRequest(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`⚠️  Retry attempt ${i + 1}/${retries}...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Type validation for response fields
 * @param {Object} data - Response data
 * @param {Object} schema - Expected schema with types
 * @returns {Object} - Validation result
 */
function validateTypes(data, schema) {
  const errors = [];
  
  for (const [field, expectedType] of Object.entries(schema)) {
    const actualType = typeof data[field];
    if (actualType !== expectedType) {
      errors.push(`Field "${field}" should be ${expectedType}, got ${actualType}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Performance metrics logger
 */
class PerformanceTracker {
  constructor() {
    this.startTime = null;
    this.endTime = null;
  }
  
  start() {
    this.startTime = Date.now();
  }
  
  stop() {
    this.endTime = Date.now();
  }
  
  getDuration() {
    return this.endTime - this.startTime;
  }
  
  log() {
    console.log(`⏱️  Response Time: ${this.getDuration()}ms`);
  }
}

// ========================================
// MAIN FUNCTION: Create User Post
// ========================================
async function createUserPost() {
  const tracker = new PerformanceTracker();
  
  // Generate random userId
  const randomUserId = generateRandomUserId();
  
  // Prepare request body
  const requestBody = {
    title: "QA Automation Engineer",
    body: "Learning advanced JavaScript",
    userId: randomUserId
  };
  
  try {
    console.log('📤 Sending POST request...');
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));
    console.log('---');
    
    // Start performance tracking
    tracker.start();
    
    // Send POST request with retry logic
    const makeRequest = async () => {
      const response = await fetchWithTimeout(
        CONFIG.apiUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody)
        },
        CONFIG.timeout
      );
      return response;
    };
    
    const response = await retryRequest(makeRequest, CONFIG.retries);
    
    // Stop performance tracking
    tracker.stop();
    
    // Parse response
    const responseData = await response.json();
    
    // ========================================
    // VALIDATIONS
    // ========================================
    const validations = [];
    
    // 1. Status Code Validation
    if (response.status !== 201) {
      throw new Error(`Expected status 201, but got ${response.status}`);
    }
    validations.push('✅ Status Code: 201');
    
    // 2. ID Field Validation
    if (!responseData.id) {
      throw new Error('Response does not contain "id" field');
    }
    validations.push('✅ ID Field: Present');
    
    // 3. Required Fields Validation
    const requiredFields = ['id', 'title', 'body', 'userId'];
    if (!hasRequiredFields(responseData, requiredFields)) {
      const missing = requiredFields.filter(field => !(field in responseData));
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    validations.push('✅ Required Fields: Complete');
    
    // 4. Type Validation (Bonus)
    const expectedTypes = {
      id: 'number',
      title: 'string',
      body: 'string',
      userId: 'number'
    };
    const typeCheck = validateTypes(responseData, expectedTypes);
    if (!typeCheck.isValid) {
      throw new Error(`Type validation failed: ${typeCheck.errors.join(', ')}`);
    }
    validations.push('✅ Field Types: Valid');
    
    // 5. Data Integrity Validation
    const integrityChecks = [
      { field: 'title', expected: requestBody.title, actual: responseData.title },
      { field: 'body', expected: requestBody.body, actual: responseData.body },
      { field: 'userId', expected: requestBody.userId, actual: responseData.userId }
    ];
    
    for (const check of integrityChecks) {
      if (check.actual !== check.expected) {
        throw new Error(
          `${check.field} mismatch: expected "${check.expected}", got "${check.actual}"`
        );
      }
    }
    validations.push('✅ Data Integrity: Verified');
    
    // ========================================
    // SUCCESS OUTPUT
    // ========================================
    console.log('\n🎉 TEST PASSED - User created successfully!\n');
    console.log('📊 VALIDATION RESULTS:');
    validations.forEach(v => console.log(v));
    
    console.log('\n📄 RESPONSE DETAILS:');
    console.log(`ID: ${responseData.id}`);
    console.log(`UserID: ${responseData.userId}`);
    console.log(`Title: ${responseData.title}`);
    
    console.log('\n⚡ PERFORMANCE:');
    tracker.log();
    
    return {
      success: true,
      data: responseData,
      performance: tracker.getDuration()
    };
    
  } catch (error) {
    // ========================================
    // ERROR HANDLING
    // ========================================
    console.error('\n❌ TEST FAILED\n');
    
    // Categorize errors
    if (error.message.includes('timeout')) {
      console.error('⏱️  Error Type: Timeout');
      console.error('The server took too long to respond');
    } else if (error.message.includes('fetch') || error.message.includes('network')) {
      console.error('🌐 Error Type: Network');
      console.error('Could not reach the server - check your internet connection');
    } else if (error.name === 'SyntaxError') {
      console.error('📝 Error Type: Invalid JSON');
      console.error('Server returned malformed data');
    } else if (error.message.includes('status')) {
      console.error('🔢 Error Type: Status Code');
    } else if (error.message.includes('Type validation')) {
      console.error('🏷️  Error Type: Data Type Mismatch');
    } else {
      console.error('⚠️  Error Type: Validation');
    }
    
    console.error(`\nDetails: ${error.message}`);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// ========================================
// TEST SUITE RUNNER (Bonus)
// ========================================
async function runTestSuite() {
  console.log('🚀 Starting API Test Suite...\n');
  console.log('='.repeat(50));
  
  const results = await createUserPost();
  
  console.log('='.repeat(50));
  
  if (results.success) {
    console.log('\n✅ ALL TESTS PASSED');
    process.exit(0);
  } else {
    console.log('\n❌ TESTS FAILED');
    process.exit(1);
  }
}

// ========================================
// EXECUTE
// ========================================
runTestSuite();