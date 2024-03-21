if(window.location.pathname === '/expense') {
  window.addEventListener('DOMContentLoaded', async() => {
    console.log('Onit');
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/expense/expenseData', { headers: { 'Authorization': token }});
    console.log(response);
    document.getElementById('expenseData').innerHTML = response.data;
  });
}

async function getLogin() {
  event.preventDefault();
  try{
   
    const userDetail = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value
    }
    console.log(userDetail);
    const loginMode = document.getElementById('loginMode').value;
    let url = 'http://localhost:3000/api/login';
    if(loginMode == 'signup') {
      url = 'http://localhost:3000/api/signup';
    }
    const response = await axios.post(url, userDetail); 
    // const data = await response.json();
    if(response.data.error) {
      document.getElementById('loginError').innerHTML = response.data.error.message;
      return;
    }
    localStorage.setItem('token',response.data.token); 
    // window.location.href = 'http://localhost:3000/expense';
      
    const response2 = await axios.post('http://localhost:3000/expense',{}, { headers: {'Authorization': response.data.token}}); 
    console.log(response2);
  } catch(err) {
    console.log(err);
  }
  return false;
}

async function addExpense() {
  event.preventDefault();
  try{
   
    const expense = {
      amount: event.target.amount.value,
      description: event.target.description.value,
      category: event.target.category.value
    }
    console.log(expense);
    // const loginMode = document.getElementById('loginMode').value;
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:3000/expense/addExpense', expense, { headers: { 'Authorization': token }}); 
    
    if(response.data.error) {
      document.getElementById('loginError').innerHTML = response.data.error.message;
      return;
    }
    if(response.data) {
      const tb = document.getElementById('addNewExpense');
      tb.innerHTML = tb.innerHTML+response.data;
      return;
    }
    console.log(response);
  } catch(err) {
    console.log(err);
  }
  return false;
}

async function deleteExpense() {
  event.preventDefault();
  try{
   
    const expenseId =  event.target.expenseId.value;
    console.log(expenseId);
    // const loginMode = document.getElementById('loginMode').value;
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/expense/deleteExpense/'+expenseId, { headers: { 'Authorization': token }}); 
    if(response.data.success) {
      document.getElementById('expense-'+expenseId).remove();
      return;
    }
    if(response.data.error) {
      document.getElementById('expenseError').innerHTML = response.data.error.message;
      return;
    }
    console.log(response);
  } catch(err) {
    console.log(err);
  }
  return false;
}


const buyPremium = () => {
  
}