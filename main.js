const getLogin = (e) => {
    console.log(e)
    e.preventDefault();

    axios
      .get('http://localhost:3000/api/login?name=a&email=a%40a.com&password=1&mode=login&loginSubmit=')
      .then(res => showOutput(res))
      .catch(err => console.error(err));
    // console.log('GET Request');
  }
  