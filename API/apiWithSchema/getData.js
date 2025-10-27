const config = {
    apiURL: 'https://jsonplaceholder.typicode.com/posts',
    timeOut: 5000, //5 seconds
    retrues: 3
}


// fieldsArrya will receive an array of required datas
function hasRequiredFiends(responseBody, fieldsArray) {
    if (!responseBody || typeof responseBody !== Object) {
        return false;
    }
    return fieldsArray.every(field => field in responseBody)
}

// Time out request after few seconds
async function fetchWithTimeout(url, options, timeout = 5000) {
    const controller = new AbortController();
    const timeOutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeOutId);
        return response;
    } catch (error) {
        clearTimeout(timeOutId);
        throw new Error(`Error request time out after ${timeout} ms`);
    }
}

// retry logic for failed request
async function name(fn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) {
                throw error;
                console.log(`Retry attempts ${i+1}/${retries}`);
                await new Promise(resolve => {
                    setTimeout(resolve, delay);
                })
            }
        }
    }
}

function validateTypes(data, schema) {
    const errors = [];

    for (const [field, expectedType] of object.entries(schema)) {
        const actualType = typeof data[field];
        if (actualType !== expectedType) {
            errors.push(`Field ${field} should be ${expectedType}, got ${actualType}`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

// Retry logic for failed request
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

async function createUserPost() {
    const randomUserId = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    
    // prepare requestBody
    const requestBody = {
        title: "QA Automation Engineer",
        body: "Learning advanced Javascript",
        userId: randomUserId
    };

    try {
        console.log("Sending post request");
        const makeRequest = async () => {
            await fetchWithTimeout(
                CONFIG.apiUrl,
                {
                    method: 'POST',
                    Headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                },
                CONFIG.timeout
            );
            return response;
        }
        
        const response = await retryRequest(makeRequest, CONFIG.retries);
        const responseData = await response.json();

        // Now need to check the validations
        const validations = [];
        if (response.responseData !== 201) {
            throw new Error (`Expected status 201, but got ${response.status}`)
        }
        
    } catch (error) {
        
    }
}

getData()