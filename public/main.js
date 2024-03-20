async function getLogin() {
  event.preventDefault();
  try{
   
    const userDetail = {
      // name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value
    }
    console.log(userDetail);
    const response = await axios.post('http://localhost:3000/api/login', userDetail); 
    const data = await response.json();
    console.log(data);
  //   try{
  //     const response = await fetch('http://localhost:3000/api/login',
  //      {
  //          method:'POST',
  //          headers:{
  //              'Content-Type':'application/json'
  //          },
  //          body:JSON.stringify(userDetail)
  //      });
  //          const responseData = await response.json();
  //          console.log(responseData);
  //  }
  //  catch(err){
  //      console.log(err);
  //  } 

    
  } catch(err) {
    console.log(err);
    throw new Error(err.message);
  }
  return false;
}