if(window.location.pathname === '/expense') {
  window.addEventListener('DOMContentLoaded', async() => {
    console.log('Onit');
    const token = localStorage.getItem('token');
    const response = await axios.get('http://16.170.117.21:3000/expense/expenseData', { headers: { 'Authorization': token }});
    console.log(response);
    document.getElementById('expenseData').innerHTML = response.data;
  });
  const token2 = localStorage.getItem('token');
  const decodedToken = parseJwt(token2);
  if(decodedToken.isPremium === true) {
    document.getElementById('isPremium').removeAttribute('hidden');
  }
}

async function getLogin() {
  event.preventDefault();
  try{
    let userDetail;
    const loginMode = document.getElementById('loginMode').value;
    let url = 'http://16.170.117.21:3000/api/login';
    if(loginMode == 'signup') {
      url = 'http://16.170.117.21:3000/api/signup';
      userDetail = {
        name: event.target.name.value,
        email: event.target.email.value,
        password: event.target.password.value
      }
    } else if(loginMode == 'forgotpassword') {
      url = 'http://16.170.117.21:3000/password/sendmail';
      userDetail = {
        email: event.target.email.value,
      }
    } else if(loginMode == 'resetpassword') {
      url = 'http://16.170.117.21:3000/password/updatepassword';
      userDetail = {
        resetId: window.location.pathname.replaceAll('/password/resetpassword/',''),
        password: event.target.password.value
      }
    } else {
      userDetail = {
        email: event.target.email.value,
        password: event.target.password.value
      }
    }
    console.log(userDetail);
    let response;
    if(loginMode == 'forgotpassword') {
      const token = localStorage.getItem('token');
      response = await axios.post(url, userDetail, { headers: { 'Authorization': token }}); 
    } else {
      response = await axios.post(url, userDetail); 
    }
    // const data = await response.json();
    if(response.data.success && loginMode == 'resetpassword') {
      document.getElementById('loginError').innerHTML = response.data.success.message;
      return;
    }
    if(response.data.error) {
      document.getElementById('loginError').innerHTML = response.data.error.message;
      return;
    }
    if (loginMode == 'login' || loginMode == 'signup') {
      localStorage.setItem('token',response.data.token); 
      window.location.href = 'http://16.170.117.21:3000/expense';
    }
 
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
    const response = await axios.post('http://16.170.117.21:3000/expense/addExpense', expense, { headers: { 'Authorization': token }}); 
    
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
    const response = await axios.get('http://16.170.117.21:3000/expense/deleteExpense/'+expenseId, { headers: { 'Authorization': token }}); 
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


const buyPremium = async () => {
  try{
    const token = localStorage.getItem('token');
    const response = await axios.get('http://16.170.117.21:3000/purchase/premium', { headers: { 'Authorization': token }}); 
    console.log(response);
    var options = {
      "key": response.data.key_id, 
      "order_id": response.data.order.id,
      "handler": async function (response) {
        const resp = await axios.post('http://16.170.117.21:3000/purchase/updateTransaction',{
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        }, { headers: { 'Authorization': token }})
        alert('Payment successful');
        document.getElementById('isPremium').removeAttribute('hidden');
        localStorage.setItem('token', resp.data.token);
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function(response){
      console.log(response);
      alert('Payment failed');
    });
  } catch(err) {
    console.log(err);
  }
}

async function showLeaderboard() {
  try{
    const response = await axios.get('http://16.170.117.21:3000/premium/leaderboard'); 
    if(response.data) {
      document.getElementById('leadersboardData').innerHTML = response.data;
    }
    console.log(response);
  } catch(err) {
    console.log(err);
  }
  return false;
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

async function download () {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://16.170.117.21:3000/expense/download', { headers: { 'Authorization': token }})
  if(response.status === 200) {
    var a = document.createElement('a');
    a.href = response.data.fileUrl;
    a.download = 'expense.csv';
    a.click();
  } else {
    throw new Error(response.data.message);
  }
}