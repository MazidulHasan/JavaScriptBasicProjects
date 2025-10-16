const localStorageInputData = document.querySelector("#localStorageInputData");
const setlocalStorageData = document.querySelector("#setLocal");
const clearlocalStorageData = document.querySelector("#clearLocal");
const showDataFromlocalStorage = document.querySelector("#localStorage");


const userData = {
  name: "Test Name",
  role: "QA Automation Engineer",
  skills: ["Java", "Playwright", "API"],
  detail: ""
};

// sessionStorage.setItem("step1Data", JSON.stringify({ name: "Mazidul" }));


document.addEventListener("DOMContentLoaded", function(){
     //only set if not already present
    if (!localStorage.getItem("userData")) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }

    //show current data on load
    const retrievedData = JSON.parse(localStorage.getItem("userData"));
    showDataFromlocalStorage.textContent = JSON.stringify(retrievedData, null, 2);
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



//working on the session storage, need to separate the loading status for 
// different loading condition , here at first it loads teh LocalStorage 
// data but need to separate the data for session sotrage at the time of 
// fist load.