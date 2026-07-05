// Data Models
const mockTransactions = [
  { id: 'TXN-98421', date: '2026-07-05 14:22', type: 'LOAD', desc: 'Credit Card •••• 4242', fee: 20.00, amount: 1000.00, status: 'SUCCESS' },
  { id: 'TXN-98420', date: '2026-07-04 09:15', type: 'TRANSFER', desc: 'To UDAY REDDY (HDFC)', fee: 10.00, amount: 500.00, status: 'SUCCESS' },
  { id: 'TXN-98419', date: '2026-07-02 18:45', type: 'LOAD', desc: 'Credit Card •••• 1111', fee: 100.00, amount: 5000.00, status: 'SUCCESS' },
  { id: 'TXN-98418', date: '2026-07-01 11:30', type: 'TRANSFER', desc: 'To UDAY REDDY (ICICI)', fee: 0.00, amount: 2000.00, status: 'PENDING' },
  { id: 'TXN-98417', date: '2026-06-28 16:00', type: 'LOAD', desc: 'Credit Card •••• 9999', fee: 40.00, amount: 2000.00, status: 'FAILED' }
];

let savedCards = [
  { id: 1, name: 'UDAY REDDY', number: '4532 0123 4567 4242', expiry: '12/28', brand: 'Visa' },
  { id: 2, name: 'UDAY REDDY', number: '5555 4444 3333 1111', expiry: '09/27', brand: 'Mastercard' }
];

let savedBanks = [
  { id: 1, holder: 'UDAY REDDY', bank: 'HDFC Bank', account: '••••••••9876', ifsc: 'HDFC0000241' },
  { id: 2, holder: 'UDAY REDDY', bank: 'ICICI Bank', account: '••••••••1234', ifsc: 'ICIC0000123' }
];

let currentBalance = 10500.00;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderChart();
  renderActivityList();
  renderTransactionsTable();
  renderSavedCards();
  renderSavedBanks();
  updateWalletBalance(currentBalance);
});

// View Navigation
function switchTab(tabId) {
  // Update Nav
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.getElementById(`nav-${tabId}`).classList.add('active');
  
  // Update View
  document.querySelectorAll('.content-view').forEach(el => el.classList.remove('active'));
  document.getElementById(`view-${tabId}`).classList.add('active');
  
  // Update Title
  const titles = {
    dashboard: 'Dashboard',
    load: 'Load Funds',
    transfer: 'Transfer Money',
    cards: 'Cards & Banks',
    history: 'Activity Logs',
    settings: 'Settings'
  };
  document.getElementById('page-title').innerText = titles[tabId];
}

// Theme Toggling
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  document.body.classList.toggle('dark-mode');
  
  const isLight = document.body.classList.contains('light-mode');
  document.getElementById('sun-icon').classList.toggle('hidden', isLight);
  document.getElementById('moon-icon').classList.toggle('hidden', !isLight);
}

// Utility formatting
const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function updateWalletBalance(amount) {
  currentBalance = amount;
  document.getElementById('wallet-balance-display').innerText = formatCurrency(amount);
  document.getElementById('available-balance-helper').innerText = `Available Wallet Balance: ${formatCurrency(amount)}`;
}

// Chart Rendering (SVG)
function renderChart() {
  const inflowBars = document.getElementById('chart-bars-inflow');
  const outflowBars = document.getElementById('chart-bars-outflow');
  const xLabels = document.getElementById('chart-x-labels');
  
  if (!inflowBars) return;
  
  const data = [
    { day: 'Mon', in: 15000, out: 5000 },
    { day: 'Tue', in: 8000, out: 12000 },
    { day: 'Wed', in: 24500, out: 14000 },
    { day: 'Thu', in: 4000, out: 2000 },
    { day: 'Fri', in: 19000, out: 8000 },
    { day: 'Sat', in: 6000, out: 6000 },
    { day: 'Sun', in: 2000, out: 1000 }
  ];
  
  const maxVal = 25000;
  const chartHeight = 150; // matches y=20 to y=170
  const startY = 170;
  const startX = 60;
  const gap = 60;
  
  inflowBars.innerHTML = '';
  outflowBars.innerHTML = '';
  xLabels.innerHTML = '';
  
  data.forEach((d, i) => {
    const x = startX + (i * gap);
    
    // Inflow Bar
    const inHeight = (d.in / maxVal) * chartHeight;
    const inRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    inRect.setAttribute("x", x);
    inRect.setAttribute("y", startY - inHeight);
    inRect.setAttribute("width", "12");
    inRect.setAttribute("height", inHeight);
    inRect.setAttribute("fill", "var(--accent)");
    inRect.setAttribute("rx", "2");
    inflowBars.appendChild(inRect);
    
    // Outflow Bar
    const outHeight = (d.out / maxVal) * chartHeight;
    const outRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    outRect.setAttribute("x", x + 16);
    outRect.setAttribute("y", startY - outHeight);
    outRect.setAttribute("width", "12");
    outRect.setAttribute("height", outHeight);
    outRect.setAttribute("fill", "var(--primary-light)");
    outRect.setAttribute("rx", "2");
    outflowBars.appendChild(outRect);
    
    // X Label
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x + 14);
    label.setAttribute("y", startY + 20);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("class", "chart-label-text");
    label.textContent = d.day;
    xLabels.appendChild(label);
  });
}

// Render Dashboard Activity
function renderActivityList() {
  const container = document.getElementById('dashboard-activity-list');
  if(!container) return;
  
  container.innerHTML = mockTransactions.slice(0, 3).map(tx => `
    <div class="activity-item">
      <div class="activity-info">
        <span class="activity-title">${tx.desc}</span>
        <span class="activity-date">${tx.date} • ${tx.type}</span>
      </div>
      <div class="activity-amount ${tx.type === 'LOAD' ? 'positive' : 'negative'}">
        ${tx.type === 'LOAD' ? '+' : '-'}${formatCurrency(tx.amount)}
      </div>
    </div>
  `).join('');
}

// Forms & Calculations
function calculateLoadFees() {
  const amount = parseFloat(document.getElementById('load-amount').value) || 0;
  const fee = amount * 0.02;
  const total = amount + fee;
  
  document.getElementById('load-calc-base').innerText = formatCurrency(amount);
  document.getElementById('load-calc-fee').innerText = formatCurrency(fee);
  document.getElementById('load-calc-total').innerText = formatCurrency(total);
}

function calculateTransferFees() {
  const amount = parseFloat(document.getElementById('transfer-amount').value) || 0;
  const mode = document.getElementById('transfer-mode').value;
  const fee = mode === 'IMPS' ? 10 : 0;
  const total = amount + fee;
  
  document.getElementById('transfer-calc-base').innerText = formatCurrency(amount);
  document.getElementById('transfer-calc-fee').innerText = formatCurrency(fee);
  document.getElementById('transfer-calc-total').innerText = formatCurrency(total);
}

// 3D Card Interactivity
function flipCard(flipped) {
  const card = document.querySelector('.flip-card');
  if (flipped) card.classList.add('flipped');
  else card.classList.remove('flipped');
}

function handleCardNumberInput(input) {
  let val = input.value.replace(/\D/g, '');
  let formatted = val.replace(/(\d{4})/g, '$1 ').trim();
  input.value = formatted;
  
  document.getElementById('visual-card-number').innerText = formatted || '•••• •••• •••• ••••';
  
  let brand = 'Visa';
  let logo = '💳';
  if (val.startsWith('4')) { brand = 'Visa'; logo = 'V'; }
  else if (val.startsWith('5')) { brand = 'Mastercard'; logo = 'M'; }
  else if (val.startsWith('3')) { brand = 'Amex'; logo = 'A'; }
  
  document.getElementById('visual-card-brand').innerText = brand;
  document.getElementById('mini-card-brand').innerText = logo;
}

function handleCardExpiryInput(input) {
  let val = input.value.replace(/\D/g, '');
  if (val.length >= 2) val = val.substring(0,2) + '/' + val.substring(2,4);
  input.value = val;
  document.getElementById('visual-card-expiry').innerText = val || 'MM/YY';
}

function handleCVVInput(input) {
  input.value = input.value.replace(/\D/g, '');
  document.getElementById('visual-card-cvv').innerText = input.value || '•••';
}

function handleCardNameInput(input) {
  document.getElementById('visual-card-name').innerText = input.value.toUpperCase() || 'CARDHOLDER NAME';
}

function handleIFSCInput(input) {
  input.value = input.value.toUpperCase();
}

// Transaction Flows
let pendingLoadAmount = 0;
let pendingTransferAmount = 0;
let pendingTransferRecipient = '';

function initiateLoad() {
  pendingLoadAmount = parseFloat(document.getElementById('load-amount').value) || 0;
  if(pendingLoadAmount < 100) return showToast('Minimum load amount is ₹100', 'error');
  
  const total = pendingLoadAmount + (pendingLoadAmount * 0.02);
  document.getElementById('otp-modal-amount').innerText = formatCurrency(total);
  
  const cardNum = document.getElementById('card-number-input').value;
  const mask = cardNum ? cardNum.slice(-4) : '4242';
  document.getElementById('otp-modal-card-mask').innerText = '•••• ' + mask;
  
  document.getElementById('otp-modal').classList.add('show');
}

function closeOTPModal(clear) {
  document.getElementById('otp-modal').classList.remove('show');
  if(clear) document.getElementById('otp-input').value = '';
}

function verifyOTPLoad() {
  const otp = document.getElementById('otp-input').value;
  if (otp !== '123456') {
    document.getElementById('otp-error').innerText = 'Invalid OTP. Use 123456.';
    return;
  }
  
  closeOTPModal(true);
  updateWalletBalance(currentBalance + pendingLoadAmount);
  
  const tx = {
    id: 'TXN-' + Math.floor(Math.random()*100000),
    date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    type: 'LOAD',
    desc: 'Credit Card Load',
    fee: pendingLoadAmount * 0.02,
    amount: pendingLoadAmount,
    status: 'SUCCESS'
  };
  mockTransactions.unshift(tx);
  
  showReceipt(tx);
  renderActivityList();
  renderTransactionsTable();
  document.getElementById('load-funds-form').reset();
  calculateLoadFees();
}

function initiateTransfer() {
  pendingTransferAmount = parseFloat(document.getElementById('transfer-amount').value) || 0;
  const mode = document.getElementById('transfer-mode').value;
  const fee = mode === 'IMPS' ? 10 : 0;
  const total = pendingTransferAmount + fee;
  
  if (total > currentBalance) {
    showToast('Insufficient wallet balance', 'error');
    return;
  }
  
  pendingTransferRecipient = document.getElementById('bank-holder-input').value || 'Unknown';
  
  document.getElementById('pin-modal-amount').innerText = formatCurrency(pendingTransferAmount);
  document.getElementById('pin-modal-recipient').innerText = pendingTransferRecipient;
  
  document.getElementById('pin-modal').classList.add('show');
}

function closePINModal(clear) {
  document.getElementById('pin-modal').classList.remove('show');
  if(clear) document.getElementById('pin-input').value = '';
}

function verifyPINTransfer() {
  const pin = document.getElementById('pin-input').value;
  if (pin !== '0000') {
    document.getElementById('pin-error').innerText = 'Invalid PIN. Use 0000.';
    return;
  }
  
  closePINModal(true);
  const mode = document.getElementById('transfer-mode').value;
  const fee = mode === 'IMPS' ? 10 : 0;
  const total = pendingTransferAmount + fee;
  
  updateWalletBalance(currentBalance - total);
  
  const tx = {
    id: 'TXN-' + Math.floor(Math.random()*100000),
    date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    type: 'TRANSFER',
    desc: `To ${pendingTransferRecipient}`,
    fee: fee,
    amount: pendingTransferAmount,
    status: 'SUCCESS'
  };
  mockTransactions.unshift(tx);
  
  showReceipt(tx);
  renderActivityList();
  renderTransactionsTable();
  document.getElementById('transfer-funds-form').reset();
  calculateTransferFees();
}

// Receipt
function showReceipt(tx) {
  const details = document.getElementById('receipt-details');
  details.innerHTML = `
    <div class="receipt-row"><span class="receipt-label">Transaction ID</span><span class="receipt-value">${tx.id}</span></div>
    <div class="receipt-row"><span class="receipt-label">Date & Time</span><span class="receipt-value">${tx.date}</span></div>
    <div class="receipt-row"><span class="receipt-label">Type</span><span class="receipt-value">${tx.type}</span></div>
    <div class="receipt-row"><span class="receipt-label">Description</span><span class="receipt-value">${tx.desc}</span></div>
    <div class="receipt-row"><span class="receipt-label">Base Amount</span><span class="receipt-value">${formatCurrency(tx.amount)}</span></div>
    <div class="receipt-row"><span class="receipt-label">Processing Fee</span><span class="receipt-value">${formatCurrency(tx.fee)}</span></div>
    <div class="receipt-row" style="border:none; margin-top:10px;"><span class="receipt-label" style="font-size:1.1rem; color:var(--text-main);">Total ${tx.type==='LOAD'?'Charged':'Debited'}</span><span class="receipt-value" style="font-size:1.1rem; color:var(--primary-light);">${formatCurrency(tx.amount + tx.fee)}</span></div>
  `;
  document.getElementById('receipt-modal').classList.add('show');
}
function closeReceiptModal() {
  document.getElementById('receipt-modal').classList.remove('show');
}
function downloadReceiptAsHTML() {
  showToast('Receipt downloaded!', 'success');
}

// Managers & Tables
function renderTransactionsTable() {
  const tbody = document.getElementById('transactions-table-body');
  if(!tbody) return;
  tbody.innerHTML = mockTransactions.map(tx => `
    <tr>
      <td>${tx.date}</td>
      <td>${tx.id}</td>
      <td>${tx.type}</td>
      <td>${tx.desc}</td>
      <td>${formatCurrency(tx.fee)}</td>
      <td><strong>${formatCurrency(tx.amount)}</strong></td>
      <td><span class="status-badge ${tx.status.toLowerCase()}">${tx.status}</span></td>
      <td><button class="btn-sm-primary" onclick="showReceipt(${JSON.stringify(tx).replace(/"/g, '&quot;')})">View</button></td>
    </tr>
  `).join('');
}

function filterTransactions() {
  showToast('Filters applied', 'success');
  // Simple mock filter applied msg
}

function renderSavedCards() {
  const html = savedCards.map(c => `
    <div class="saved-item-card">
      <div class="item-icon">💳</div>
      <div class="item-details">
        <span class="item-title">${c.brand} ending in ${c.number.slice(-4)}</span>
        <span class="item-sub">${c.name} • Exp ${c.expiry}</span>
      </div>
    </div>
  `).join('');
  
  const mgrList = document.getElementById('cards-manager-list');
  const quickList = document.getElementById('quick-saved-cards');
  if(mgrList) mgrList.innerHTML = html;
  if(quickList) quickList.innerHTML = html;
}

function renderSavedBanks() {
  const html = savedBanks.map(b => `
    <div class="saved-item-card">
      <div class="item-icon">🏦</div>
      <div class="item-details">
        <span class="item-title">${b.bank}</span>
        <span class="item-sub">${b.holder} • ${b.account}</span>
      </div>
    </div>
  `).join('');
  
  const mgrList = document.getElementById('banks-manager-list');
  const quickList = document.getElementById('quick-saved-banks');
  if(mgrList) mgrList.innerHTML = html;
  if(quickList) quickList.innerHTML = html;
}

// Modals for Adding
function showAddCardModal() { document.getElementById('add-card-modal').classList.add('show'); }
function closeAddCardModal() { document.getElementById('add-card-modal').classList.remove('show'); }
function showAddBankModal() { document.getElementById('add-bank-modal').classList.add('show'); }
function closeAddBankModal() { document.getElementById('add-bank-modal').classList.remove('show'); }

function formatCardInput(input) {
  let val = input.value.replace(/\D/g, '');
  input.value = val.replace(/(\d{4})/g, '$1 ').trim();
}
function formatCardExpiry(input) {
  let val = input.value.replace(/\D/g, '');
  if (val.length >= 2) val = val.substring(0,2) + '/' + val.substring(2,4);
  input.value = val;
}

function submitNewCard() {
  closeAddCardModal();
  showToast('New card added successfully', 'success');
  document.getElementById('add-card-form').reset();
}
function submitNewBank() {
  closeAddBankModal();
  showToast('Bank account linked successfully', 'success');
  document.getElementById('add-bank-form').reset();
}

// Settings
function updateSettingsSliderValues() {
  document.getElementById('settings-load-limit-val').innerText = formatCurrency(parseFloat(document.getElementById('settings-load-limit').value));
  document.getElementById('settings-transfer-limit-val').innerText = formatCurrency(parseFloat(document.getElementById('settings-transfer-limit').value));
}
function saveSettings() {
  showToast('Settings saved successfully', 'success');
}

// Toast System
function showToast(message, type='success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : '❌'}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
