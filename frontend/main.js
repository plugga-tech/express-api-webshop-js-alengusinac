import './style.css';

let userLoggedIn = false;

function checkLogin() {}

function renderLogin() {
  const logInElm = document.querySelector('#user-login');
  if (userLoggedIn) {
    logInElm.innerHTML = `<h3>You are logged in!</h3>`;
  } else {
    logInElm.innerHTML = `
    <h3>Logga in:</h3>
    <div id="login-message"></div>
    <input id="login-email" type="text" placeholder="E-mail"><br>
    <input id="login-password" type="text" placeholder="Lösenord"><br>
    <button id="login-btn">Logga in</button>
    <h3>Skapa användare:</h3>
    <input id="create-username" type="text" placeholder="Användarnamn"><br>
    <input id="create-email" type="text" placeholder="E-mail"><br>
    <input id="create-password" type="text" placeholder="Lösenord"><br>
    <button id="create-btn">Logga in</button>
    `;
  }
}

async function login() {
  const email = document.querySelector('#login-email').value;
  const password = document.querySelector('#login-password').value;
  const loginMessage = document.querySelector('#login-message');

  if (email && password) {
    loginMessage.innerHTML = '';

    const user = {
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    } catch (err) {
      console.error(err);
    }
  } else {
    loginMessage.innerHTML = 'Type in username and password';
  }
}

function addEventListeners() {
  const loginButton = document.querySelector('#login-btn');
  loginButton.addEventListener('click', login);
}

renderLogin();
addEventListeners();
