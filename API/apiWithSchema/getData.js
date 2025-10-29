const CONFIG = {
    apiURL: 'https://jsonplaceholder.typicode.com/posts',
    timeOut: 5000, //5 seconds
    retries: 3
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
    console.log("Inside validateTypes");
    

    for (const [field, expectedType] of object.entries(schema)) {
        const actualType = typeof data[field];
        log("actualType",actualType)
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
        userId: 1,
        id: 1,
        title: "QA Automation Engineer",
        body: "Learning advanced Javascript"
    };

    try {
        console.log("Sending post request");
        
        const makeRequest = async () => {            
            const response = await fetchWithTimeout(
                CONFIG.apiURL,
                {
                    method: 'POST',
                    Headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                },
                CONFIG.timeOut
            );
            console.log('Actual response is',response);
            return response;
        }
        
        const response = await retryRequest(makeRequest, CONFIG.retries);
        console.log("Retry response is: ", response);
        
        const responseData = await response.json();
        
        console.log(`Response Data is : ${JSON.stringify(responseData, null, 2)}`);
        
        // Now need to check the validations
        const validations = [];
        if (response.status !== 201) {
            console.log("Response is not 201");
        }
        if (!responseData.id) {
            throw new Error ('No id in response')
        }
        
        // requred field validation
        const requiredField = ['id'];
        if (!hasRequiredFiends(responseData, requiredField)) {
            const missing = requiredField.filter(field => !(field in responseData));
            console.log(`Missing required fields: ${missing.join(',')}`);
        }

        const expectedTypes = {
            id: 'number'
        };

        const typeCheck = validateTypes(responseData,expectedTypes);
        console.log(`Expected type is: ${typeCheck}`);
        


        
    } catch (error) {
        
    }
}

createUserPost()