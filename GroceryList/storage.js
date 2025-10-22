const localStorageInputData = document.querySelector("#localStorageInputData");
const setlocalStorageData = document.querySelector("#setLocal");
const clearlocalStorageData = document.querySelector("#clearLocal");
const showDataFromlocalStorage = document.querySelector("#localStorage");



// session storage datas
const sessionStorageInputData = document.querySelector("#sessionStorageInputData");
const setSessionStorageData = document.querySelector("#setSession");
const clearSessionStorageData = document.querySelector("#clearSession");
const showDataFromSessionStorage = document.querySelector("#sessionStorage");


const userData = {
  name: "Test Name",
  role: "QA Automation Engineer",
  skills: ["Java", "Playwright", "API"],
  detail: ""
};

const userSessionData = {
  name: "Test Name 2",
  role: "QA Automation Engineer 2",
  skills: ["Java 2", "Playwright 2", "API 2"],
  detail: ""
};

// local Storage

document.addEventListener("DOMContentLoaded", function(){
  
     //only set if not already present
    if (!localStorage.getItem("userData")) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }

    if (!sessionStorage.getItem("userSessionData")) {
      sessionStorage.setItem("userSessionData", JSON.stringify(userSessionData));
    }

    //show current data on load
    const retrievedData = JSON.parse(localStorage.getItem("userData"));
    showDataFromlocalStorage.textContent = JSON.stringify(retrievedData, null, 2);
    
    const retrieveSessiondData = JSON.parse(sessionStorage.getItem("userSessionData"));
    showDataFromSessionStorage.textContent = JSON.stringify(retrieveSessiondData, null, 2);
})

setlocalStorageData.addEventListener("click", function(){
    let retrievedData = JSON.parse(localStorage.getItem("userData"));
    const inputValue = localStorageInputData.value;
    retrievedData.detail = inputValue;
    
    // Show the data nicely
    showDataFromlocalStorage.textContent = JSON.stringify(retrievedData, null, 2);

    // Save updated data
    localStorage.setItem("userData", JSON.stringify(retrievedData));
})


clearlocalStorageData.addEventListener("click", function(){
    localStorage.clear("userData");
    showDataFromlocalStorage.textContent = ""
})




// session storage
setSessionStorageData.addEventListener("click", function(){
  let retrieveSessionData = JSON.parse(sessionStorage.getItem("userSessionData"));
  const sessionInputValue = sessionStorageInputData.value;
  retrieveSessionData.detail = sessionInputValue;
})

setSessionStorageData.addEventListener("click", function(){
    let retrievedData = JSON.parse(sessionStorage.getItem("userSessionData"));
    const inputValue = sessionStorageInputData.value;
    retrievedData.detail = inputValue;
    showDataFromSessionStorage.textContent = JSON.stringify(retrievedData, null, 2);
    sessionStorage.setItem("userSessionData", JSON.stringify(retrievedData));
})

clearSessionStorageData.addEventListener("click", function(){
    sessionStorage.clear("userSessionData");
    showDataFromlocalStorage.textContent = ""
})