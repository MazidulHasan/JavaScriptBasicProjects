async function testUserAPI() {
  const apiUrl = 'https://jsonplaceholder.typicode.com/users';
  
  try {
    // Step 1: Fetch the data
    const response = await fetch(apiUrl);

    // Step 2a: Validate response status is 200
    if (response.status == 200) {
      console.log("Status Matched");
    }
    else{
      console.log("status did not matched");
    }
    
    // validate each user object and email format
    const users = await response.json();
    console.log(`Total user lenght is : ${users.length}`);
    
    const validUser = [];
    const invalidUser = [];

    users.forEach((user, index) => {
      const hasId = user.hasOwnProperty('id');
      const hasName = user.hasOwnProperty('name');
      const hasUserNmae = user.hasOwnProperty('username');
      const hasEmail = user.hasOwnProperty('email');

      if (!hasId || !hasName || !hasUserNmae || !hasEmail) {
        invalidUser.push({
          index: index +1,
          user,
          Reason: "Missing any of these fields id/name/username/email"
        })
      }
    });

    if (invalidUser.length > 0) {
      invalidUser.forEach(ele => {
        console.log(`The data is ${ele.user} and the reason is ${ele.Reason}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error occurred during API testing:');
    console.error(`   ${error.message}`);
    
    // Additional error details
    if (error.cause) {
      console.error(`   Cause: ${error.cause}`);
    }
  }
}


testUserAPI();
