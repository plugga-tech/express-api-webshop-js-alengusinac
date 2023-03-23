import './style.scss';

let cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log(cart);

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
    addLoginEventListeners();
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

function addLoginEventListeners() {
  const loginBtn = document.querySelector('#login-btn');
  loginBtn.addEventListener('click', login);

  const createUserBtn = document.querySelector('#create-btn');
  createUserBtn.addEventListener('click', createUser);
}

async function renderCategories() {
  const categoriesContainer = document.querySelector('#categories');
  const categories = await getCategories();

  categoriesContainer.innerHTML =
    '<button id="show-all-products">Alla produkter</button>';

  categories.map((category) => {
    categoriesContainer.innerHTML += `
    <button class="category" id="${category._id}">${category.name}</button>
    `;
  });
  addCategoryEventListeners();
}

async function getCategories() {
  const categories = await fetch('http://localhost:3000/api/categories')
    .then((response) => response.json())
    .catch((err) => console.error(err));

  return categories;
}

function addCategoryEventListeners() {
  const showAll = document.querySelector('#show-all-products');
  showAll.addEventListener('click', () => {
    renderProducts();
  });

  const buttons = document.querySelectorAll('.category');
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const id = e.currentTarget.id;
      const endpoint = `/category/${id}`;
      renderProducts(endpoint);
    });
  });
}

async function renderProducts(category = '') {
  const productsContainer = document.querySelector('#products');
  const products = await getProducts(category);

  productsContainer.innerHTML = '';

  products.map((product) => {
    productsContainer.innerHTML += `
    <div class="product" id="${product._id}">
      <img src="/img/product.webp">
      <h4>${product.name}</h4>
      <p>${product.price}</p>
      <button class="add-to-cart">+</button>
    </div>
    `;
  });
  const buttons = document.querySelectorAll('.add-to-cart');
  buttons.forEach((button) => {
    button.addEventListener('click', addToCart);
  });
}

async function getProducts(category = '') {
  const products = await fetch('http://localhost:3000/api/products' + category)
    .then((response) => response.json())
    .catch((err) => console.error(err));

  return products;
}

function addToCart(e) {
  console.log(e.currentTarget.parentElement.querySelector('h4').innerHTML);
  const product = e.currentTarget.parentElement;
  const cartItem = {
    id: product.id,
    name: product.querySelector('h4').innerHTML,
    price: product.querySelector('p').innerHTML,
    amount: 1,
  };
  cart.push(cartItem);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const cartContainer = document.querySelector('#cart');
  if (cart.length > 0) {
    cartContainer.innerHTML = '';
    cart.forEach((item) => {
      cartContainer.innerHTML += `
      <h4>${item.name}</h4>
      <p>Pris: ${item.price}kr</p>
      <p>Antal: ${item.amount}</p>
      `;
    });
  } else {
    cartContainer.innerHTML = 'Kundvagnen är tom.';
  }
}

checkLogin();
renderCart();
renderCategories();
renderProducts();
