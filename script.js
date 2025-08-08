// --- Data ---
const users = [
  { name: 'admin', role: 'admin', password: 'Admin2025', balance: Infinity },
  { name: '1', role: 'user', password: 'userpass', balance: 1000 },
  { name: '2', role: 'user', password: 'userpass', balance: 500 },
  { name: '3', role: 'user', password: 'userpass', balance: 300 },
];

let currentUser = null;

const transactions = [
  {type: 'Příchozí', subject: '1', amount: 150, date: '2025-08-08'},
  {type: 'Odchozí', subject: '2', amount: 100, date: '2025-08-07'},
];

const shopItems = [
  {id: 1, name: 'Virtuální klobouk', price: 500},
  {id: 2, name: 'VIP karta', price: 1200},
  {id: 3, name: 'Bonusové body', price: 300},
];

const cart = [];

// --- Login ---

const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const nav = document.querySelector('nav');
const main = document.querySelector('main');

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  const user = users.find(u => u.name === username && u.password === password);
  if (!user) {
    loginError.style.display = 'block';
    return;
  }
  loginError.style.display = 'none';
  currentUser = user;

  loginModal.style.display = 'none';
  nav.style.display = 'block';
  main.style.display = 'block';

  initUI();
});

// --- UI Initialization ---

const links = document.querySelectorAll('nav ul.menu li a');
const sections = document.querySelectorAll('main section');

function showSection(id) {
  sections.forEach(sec => sec.classList.toggle('active-section', sec.id === id));
  links.forEach(link => link.classList.toggle('active', link.getAttribute('href').substring(1) === id));
}

links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showSection(link.getAttribute('href').substring(1));
  });
});

function initUI() {
  // Dashboard
  updateBalanceDisplay();

  // Show/hide admin elements
  const adminShopManage = document.getElementById('admin-shop-manage');
  const adminNote = document.getElementById('admin-note');
  const usersSection = document.getElementById('users');
  const addUserBtn = document.getElementById('add-user');

  if (currentUser.role === 'admin') {
    adminShopManage.style.display = 'block';
    adminNote.style.display = 'block';
    usersSection.style.display = 'block';
    addUserBtn.style.display = 'inline-block';
  } else {
    adminShopManage.style.display = 'none';
    adminNote.style.display = 'none';
    usersSection.style.display = 'none';
    addUserBtn.style.display = 'none';
  }

  renderUsers();
  renderTransactions();
  renderShop();
  renderCart();
  showSection('dashboard');
}

// --- Balance ---

function updateBalanceDisplay() {
  const balanceElem = document.getElementById('king-balance');
  if (currentUser.role === 'admin') {
    balanceElem.textContent = '∞ KIng';
  } else {
    balanceElem.textContent = currentUser.balance + ' KIng';
  }
}

// --- Users (admin only) ---

function renderUsers() {
  const tbody = document.querySelector('#users-table tbody');
  tbody.innerHTML = '';
  users.forEach((user, idx) => {
    if (user.name === 'admin') return; // admin neodstraňovat
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.name}</td>
      <td>${user.role}</td>
      <td><button data-idx="${idx}" class="del-user">Smazat</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.del-user').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-idx');
      users.splice(idx, 1);
      renderUsers();
    });
  });
}

document.getElementById('add-user').addEventListener('click', () => {
  const name = prompt('Zadej jméno nového uživatele:');
  if (!name) return alert('Neplatné jméno!');
  if (users.some(u => u.name === name)) return alert('Uživatel s tímto jménem už existuje!');
  const role = prompt('Zadej roli (admin/user):', 'user');
  users.push({name, role
