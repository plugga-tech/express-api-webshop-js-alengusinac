import './style.scss';

const getOrdersBtn = document.querySelector('#get-orders-btn');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
    <button id="create-btn">Skapa</button>
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
          throw 'E-mail och lösenord matchar inte.';
        }
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem('user', data._id);
        checkLogin();
      })
      .catch((err) => {
        console.error(err);
        loginMessage.innerHTML = err;
      });
  } else {
    loginMessage.innerHTML = 'Fyll i alla fält.';
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
  const messageContainer = document.querySelector('#create-user-message');

  if (name && email && password) {
    const user = { name, email, password };

    fetch('http://localhost:3000/api/users/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw 'Email adressen används redan.';
        }
      })
      .then(() => {
        messageContainer.innerHTML = 'Användaren har skapats.';
      })
      .catch((err) => {
        messageContainer.innerHTML = err;
      });
  } else {
    messageContainer.innerHTML = 'Fyll i alla fält.';
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
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw 'Det fanns inga kategorier.';
      }
    })
    .catch((err) => {
      console.error(err);
      return [];
    });

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

  if (products.length > 0) {
    products.map((product) => {
      productsContainer.innerHTML += `
      <div class="product" id="${product._id}">
        <img src="/img/product.webp">
        <h4>${product.name}</h4>
        <p>${product.price}kr</p>
        <button class="add-to-cart">+</button>
      </div>
      `;
    });
    const buttons = document.querySelectorAll('.add-to-cart');
    buttons.forEach((button) => {
      button.addEventListener('click', addToCart);
    });
  } else {
    productsContainer.innerHTML = 'Det fanns inga produkter att visa.';
  }
}

async function getProducts(category = '') {
  const products = await fetch('http://localhost:3000/api/products' + category)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw 'Det fanns inga produkter att visa.';
      }
    })
    .catch((err) => {
      console.error(err);
      return [];
    });

  return products;
}

function addToCart(e) {
  const product = e.currentTarget.parentElement;

  if (cart.find((item) => item.id === product.id)) {
    const updateItem = cart.find((item) => item.id === product.id);
    updateItem.amount += 1;
  } else {
    const cartItem = {
      id: product.id,
      name: product.querySelector('h4').innerHTML,
      price: product.querySelector('p').innerHTML,
      amount: 1,
    };
    cart.push(cartItem);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const cartContainer = document.querySelector('#cart');
  if (cart.length > 0) {
    cartContainer.innerHTML = '<button id="clear-cart">Töm kundavagn</button>';
    cart.forEach((item) => {
      cartContainer.innerHTML += `
      <div id="${item.id}" class="cart-item">
        <h4>${item.name}</h4>
        <p>Pris: ${item.price}</p>
        <p>Antal: ${item.amount}</p>
        <button class="remove-from-cart">Ta bort</button>
      </div>
      `;
    });
    cartContainer.innerHTML += `<button id="send-order">Skicka order!</button>`;
    addCartEventListeners();
  } else {
    cartContainer.innerHTML = 'Kundvagnen är tom.';
  }
}

function addCartEventListeners() {
  const clearCartBtn = document.querySelector('#clear-cart');
  clearCartBtn.addEventListener('click', () => {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  });

  const removeBtns = document.querySelectorAll('.remove-from-cart');
  removeBtns.forEach((button) => {
    button.addEventListener('click', (e) => {
      const targetId = e.currentTarget.parentElement.id;
      const cartItem = cart.findIndex((item) => item.id === targetId);
      cart.splice(cartItem, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    });
  });

  const sendOrderBtn = document.querySelector('#send-order');
  sendOrderBtn.addEventListener('click', createOrder);
}

function createOrder() {
  const user = localStorage.getItem('user');

  if (user) {
    const order = {
      user,
      products: [],
    };
    cart.forEach((item) => {
      const product = {
        productId: item.id,
        quantity: item.amount,
      };
      order.products.push(product);
    });
    sendOrder(order);
  } else {
    alert('Du måste vara inloggad!');
  }
}

async function sendOrder(order) {
  fetch('http://localhost:3000/api/orders/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  })
    .then((response) => {
      if (response.status === 201) {
        const cartContainer = document.querySelector('#cart');
        cartContainer.innerHTML =
          'Din order har skickats och tagits emot, tack!';
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
      } else {
        alert('Något gick fel!');
      }
    })
    .catch((err) => console.error(err));
}

async function getOrders() {
  const apiKey = document.querySelector('#api-input').value;

  if (apiKey) {
    fetch('http://localhost:3000/api/orders/all/' + apiKey)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw 'Not authorised!';
        }
      })
      .then((data) => renderOrders(data))
      .catch((err) => {
        alert(err);
      });
  } else {
    document.querySelector('#order-message').innerHTML = 'Fyll i fältet.';
  }
}

function renderOrders(orders) {
  document.body.innerHTML = `
  <button><a href="">Tillbaka</a></button>
  <h1>Ordrar</h1>
  `;

  orders.map((order) => {
    document.body.innerHTML += `
    <div class="order">
      <h4>Ordernummer: ${order._id}</h4>
      <p>Kund: ${order.user}</p>
      ${order.products.map((product) => {
        return `
        Produkt: ${product.productId[0]}<br>
        ${product.quantity} st<br>
        `;
      })}
    </div>
    `;
  });
}

function init() {
  checkLogin();
  renderCart();
  renderCategories();
  renderProducts();
}

getOrdersBtn.addEventListener('click', getOrders);

init();
