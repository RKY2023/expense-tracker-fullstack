if(window.location.pathname === '/expense') {
  window.addEventListener('DOMContentLoaded', async() => {
    console.log('Onit');
    const token = localStorage.getItem('token');
    const response = await axios.post('http://'+window.location.host+'/expense/expenseData',{}, { headers: { 'Authorization': token }});
    console.log(response);
    document.getElementById('expenseData').innerHTML = response.data;
  });
  const token2 = localStorage.getItem('token');
  const decodedToken = parseJwt(token2);
  if(decodedToken.isPremium === true) {
    document.getElementById('isPremium').removeAttribute('hidden');
    document.getElementById('isPremiumDownload').removeAttribute('hidden');
    document.getElementById('buyPremium').setAttribute('hidden','hidden');
  }
}

const getExpensepage = async () => {
  const token = localStorage.getItem('token');
  const page = document.getElementById('page').value;
  const pages = document.getElementById('page').dataset.pages;
  const response = await axios.post('http://'+window.location.host+'/expense/expenseData', { page, pages } , { headers: { 'Authorization': token }});
  console.log(response);
  document.getElementById('expenseData').innerHTML = response.data;
}

async function getLogin() {
  event.preventDefault();
  try{
    let userDetail;
    const loginMode = document.getElementById('loginMode').value;
    let url = 'http://'+window.location.host+'/api/login';
    if(loginMode == 'signup') {
      url = 'http://'+window.location.host+'/api/signup';
      userDetail = {
        name: event.target.name.value,
        email: event.target.email.value,
        password: event.target.password.value
      }
    } else if(loginMode == 'forgotpassword') {
      url = 'http://'+window.location.host+'/password/sendmail';
      userDetail = {
        email: event.target.email.value,
      }
    } else if(loginMode == 'resetpassword') {
      url = 'http://'+window.location.host+'/password/updatepassword';
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
      window.location.href = 'http://'+window.location.host+'/expense';
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
    const response = await axios.post('http://'+window.location.host+'/expense/addExpense', expense, { headers: { 'Authorization': token }}); 
    
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
    const response = await axios.get('http://'+window.location.host+'/expense/deleteExpense/'+expenseId, { headers: { 'Authorization': token }}); 
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
    const response = await axios.get('http://'+window.location.host+'/purchase/premium', { headers: { 'Authorization': token }}); 
    console.log(response);
    var options = {
      "key": response.data.key_id, 
      "order_id": response.data.order.id,
      "handler": async function (response) {
        const resp = await axios.post('http://'+window.location.host+'/purchase/updateTransaction',{
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        }, { headers: { 'Authorization': token }})
        alert('Payment successful');
        document.getElementById('isPremium').removeAttribute('hidden');
        document.getElementById('isPremiumDownload').removeAttribute('hidden');
        document.getElementById('buyPremium').setAttribute('hidden','hidden');
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
    const response = await axios.get('http://'+window.location.host+'/premium/leaderboard'); 
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
  const response = await axios.get('http://'+window.location.host+'/expense/download', { headers: { 'Authorization': token }})
  if(response.status === 200) {
    var a = document.createElement('a');
    a.href = response.data.fileUrl;
    a.download = 'expense.csv';
    a.click();
  } else {
    throw new Error(response.data.message);
  }
}

const uploadCSV = async () => {
  const files = document.getElementById('csvFile').files;
  if(files.length==0){
  alert("Please choose any file...");
  return;
  }
  const filename = files[0].name;
  const extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
  if (extension == '.CSV') {
      //Here calling another method to read CSV file into json
      // csvFileToJSON(files[0]);
      console.log(files[0]);
      try {
        let reader = new FileReader();
        reader.readAsBinaryString(files[0]);
        // reader.onload = function(e) {
        //   let csv = e.target.result;
        //   CSVtoJSON(csv);
        // }
        reader.onload = (function(f) {
          event.preventDefault();
          return function(e) {
              // Here you can use `e.target.result` or `this.result`
              let csv = e.target.result;
              const str = CSVtoJSON(csv);
              sendJsonCsv(str);
              // and `f.name`.
          };
        })(files[0]);
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
  }else{
      alert("Please select a valid csv file.");
  }
}

const CSVtoJSON = (csv) => {
  // let lines=csv.split("\n");
  // let result = [];
  // let headers=lines[0].split(",");
  // for(let i=1;i<lines.length;i++){
  //     let obj = {};
  //     let currentline=lines[i].split(",");
  //     for(let j=0;j<headers.length;j++){
  //         obj[headers[j]] = currentline[j];
  //     }
  //     result.push(obj);
  // }
  let result = [];
  let headers = [];
  let rows = csv.split("\r\n");               
  for (let i = 0; i < rows.length; i++) {
      if(rows[i].length == 0)
        continue;
      let cells = rows[i].split(",");
      let rowData = {};
      for(let j=0;j<cells.length;j++){
          if(i==0){
              let headerName = cells[j].trim();
              headers.push(headerName);
          }else{
              let key = headers[j];
              if(key){
                  rowData[key] = cells[j].trim();
              }
          }
      }
      //skip the first row (header) data
      if(i!=0){
          result.push(rowData);
      }
  }
  return JSON.stringify(result);
}

const sendJsonCsv = async (str) => {
  const token = localStorage.getItem('token');
  const response = await axios.post('http://'+window.location.host+'/expense/csvUpload',{ data: str }, { headers: { 'Authorization': token }})
  if(response.status === 200) {
    alert('CSV uploaded Successfully');
  }
}