import './style.css';

async function checkLogin() {
  const user = { id: localStorage.getItem('user') };
  if (user.id) {
    fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          renderLogin(false);
        }
      })
      .then((data) => renderLogin(true, data.name));
  } else {
    renderLogin(false);
  }
}

function renderLogin(userLoggedIn, username) {
  const logInElm = document.querySelector('#user-login');
  if (userLoggedIn) {
    logInElm.innerHTML = `
    <h3>You are logged in, ${username}!</h3>
    <button id="logout">Logga ut</button>
    `;
    document.querySelector('#logout').addEventListener('click', logout);
  } else {
    logInElm.innerHTML = `
    <h3>Logga in:</h3>
    <div id="login-message"></div>
    <input id="login-email" type="text" placeholder="E-mail"><br>
    <input id="login-password" type="text" placeholder="Lösenord"><br>
    <button id="login-btn">Logga in</button>
    <h3>Skapa användare:</h3>
    <div id="create-user-message"></div>
    <input id="create-username" type="text" placeholder="Användarnamn"><br>
    <input id="create-email" type="text" placeholder="E-mail"><br>
    <input id="create-password" type="text" placeholder="Lösenord"><br>
    <button id="create-btn">Logga in</button>
    `;
    addEventListeners();
  }
}

async function login() {
  const email = document.querySelector('#login-email').value;
  const password = document.querySelector('#login-password').value;
  const loginMessage = document.querySelector('#login-message');

  if (email && password) {
    loginMessage.innerHTML = '';

    const user = { email, password };

    fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw "Email and password don't match.";
        }
      })
      .then((data) => {
        console.log(data._id);
        localStorage.setItem('user', data._id);
        checkLogin();
      })
      .catch((err) => {
        console.error(err);
        loginMessage.innerHTML = err;
      });
  } else {
    loginMessage.innerHTML = 'Type in username and password';
  }
}

function logout() {
  localStorage.removeItem('user');
  checkLogin();
}

async function createUser() {
  const name = document.querySelector('#create-username').value;
  const email = document.querySelector('#create-email').value;
  const password = document.querySelector('#create-password').value;

  if (name && email && password) {
    const user = { name, email, password };

    fetch('http://localhost:3000/api/users/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }
}

function addEventListeners() {
  const loginBtn = document.querySelector('#login-btn');
  loginBtn.addEventListener('click', login);
  const createUserBtn = document.querySelector('#create-btn');
  createUserBtn.addEventListener('click', createUser);
}

checkLogin();
