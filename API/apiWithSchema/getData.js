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

async function fetchWithTimeout(url, options, timeout = 5000) {
    const controller = new AbortController();
    const timtOutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url,
            {...options},
            signal: controller.signal
        )
    } catch () {
        
    }
}
async function getData() {

    try {
    } catch (error) {
        
    }
}

getData()