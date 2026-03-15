const addBtn = document.getElementById("addTransactionBtn");
const transactionModal = document.getElementById("transactionModal");
const transactionCloseBtn = document.querySelector("#transactionModal .close-btn");

const searchInput = document.querySelector(".search-bar input");

const accountTrigger = document.getElementById("account-trigger");
const accountModal = document.getElementById("accountModal");
const accountCloseBtn = document.querySelector("#accountModal .close-btn.account-close");
const createAccountBtn = document.getElementById("createAccountBtn");
const accountNameInput = document.getElementById("accountName");
const accountTypeInput = document.getElementById("accountType");
const accountFormContainer = document.getElementById("accountFormContainer");
const accountInfoContainer = document.getElementById("accountInfoContainer");
const infoName = document.getElementById("infoName");
const infoType = document.getElementById("infoType");
const logoutBtn = document.getElementById("logoutBtn");
const contactBtn = document.getElementById("contactBtn");

let account = null;

addBtn.addEventListener("click", function(){
  transactionModal.style.display = "flex";
});

transactionCloseBtn.addEventListener("click", function(){
  transactionModal.style.display = "none";
});

accountTrigger.addEventListener("click", function(event){
  event.preventDefault();
  accountModal.style.display = "flex";

  if (account) {
    accountFormContainer.style.display = "none";
    accountInfoContainer.style.display = "block";
    infoName.textContent = `Name: ${account.name}`;
    infoType.textContent = `Account type: ${account.type}`;
  } else {
    accountFormContainer.style.display = "block";
    accountInfoContainer.style.display = "none";
  }
});

accountCloseBtn.addEventListener("click", function(){
  accountModal.style.display = "none";
});

const paymentTrigger = document.getElementById("payment-trigger");
const expenseCard = document.getElementById("expense-card");
const paymentModal = document.getElementById("paymentModal");
const paymentCloseBtn = document.querySelector("#paymentModal .close-btn.payment-close");
const expenseList = document.getElementById("expenseList");

const exploreBtn = document.getElementById("exploreBtn");
const exploreModal = document.getElementById("exploreModal");
const exploreCloseBtn = document.querySelector("#exploreModal .close-btn.explore-close");
const exploreForm = document.getElementById("exploreForm");

const inboxTrigger = document.getElementById("inbox-trigger");
const inboxModal = document.getElementById("inboxModal");
const inboxCloseBtn = document.querySelector("#inboxModal .close-btn.inbox-close");
const notesList = document.getElementById("notesList");
const noteInput = document.getElementById("noteInput");
const noteAddBtn = document.getElementById("noteAddBtn");

const helpTrigger = document.getElementById("help-trigger");
const helpModal = document.getElementById("helpModal");
const helpCloseBtn = document.querySelector("#helpModal .close-btn.help-close");
const emailTo = document.getElementById("emailTo");
const emailFrom = document.getElementById("emailFrom");
const emailBody = document.getElementById("emailBody");
const emailSendBtn = document.getElementById("emailSendBtn");

let notes = [];

function renderNotes() {
  notesList.innerHTML = "";
  if (!notes.length) {
    notesList.innerHTML = "<p style='margin:0;color:#444;'>No notes yet.</p>";
    return;
  }

  notes.forEach((note, index) => {
    const item = document.createElement("div");
    item.style.marginBottom = "8px";
    item.style.padding = "8px";
    item.style.borderRadius = "6px";
    item.style.background = "#fff";
    item.style.display = "flex";
    item.style.justifyContent = "space-between";
    item.style.alignItems = "center";
    item.style.border = "1px solid #ddd";

    const text = document.createElement("div");
    text.textContent = note;
    text.style.flex = "1";
    text.style.marginRight = "8px";

    const remove = document.createElement("button");
    remove.textContent = "✕";
    remove.style.border = "none";
    remove.style.background = "transparent";
    remove.style.cursor = "pointer";
    remove.style.color = "#a00";
    remove.onclick = () => {
      notes.splice(index, 1);
      renderNotes();
    };

    item.appendChild(text);
    item.appendChild(remove);
    notesList.appendChild(item);
  });
}

function addNote() {
  const value = noteInput.value.trim();
  if (!value) return;

  notes.push(value);
  noteInput.value = "";
  renderNotes();
}


function renderExpenses() {
  const expenseRows = [];
  document.querySelectorAll(".transaction-item").forEach(item => {
    const amountEl = item.querySelector(".transaction-amount");
    if (amountEl && amountEl.classList.contains("negative")) {
      const title = item.querySelector(".transaction-title")?.textContent.trim() || "Unknown";
      const time = item.querySelector(".transaction-time")?.textContent.trim() || "";
      const amount = amountEl.textContent.trim();
      expenseRows.push(`<li><strong>${title}</strong> ${time} <span>${amount}</span></li>`);
    }
  });

  if (!expenseRows.length) {
    expenseList.innerHTML = "<p>No expense records found.</p>";
  } else {
    expenseList.innerHTML = `<ul style='list-style:none;padding:0;margin:0;'>${expenseRows.join("")}</ul>`;
  }
}

paymentTrigger.addEventListener("click", function(event) {
  event.preventDefault();
  renderExpenses();
  paymentModal.style.display = "flex";
});

if (expenseCard) {
  expenseCard.addEventListener("click", function() {
    renderExpenses();
    paymentModal.style.display = "flex";
  });
}

paymentCloseBtn.addEventListener("click", function() {
  paymentModal.style.display = "none";
});

exploreBtn.addEventListener("click", function(event) {
  event.preventDefault();
  exploreModal.style.display = "flex";
});

exploreCloseBtn.addEventListener("click", function() {
  exploreModal.style.display = "none";
});

inboxTrigger.addEventListener("click", function(event) {
  event.preventDefault();
  inboxModal.style.display = "flex";
  renderNotes();
});

inboxCloseBtn.addEventListener("click", function() {
  inboxModal.style.display = "none";
});

helpTrigger.addEventListener("click", function(event) {
  event.preventDefault();
  helpModal.style.display = "flex";
  emailFrom.value = "";
  emailBody.value = "";
});

helpCloseBtn.addEventListener("click", function() {
  helpModal.style.display = "none";
});

emailSendBtn.addEventListener("click", function() {
  const to = emailTo.value.trim();
  const from = emailFrom.value.trim();
  const body = emailBody.value.trim();

  if (!to || !from || !body) {
    alert("Please enter To, From, and message before sending the email.");
    return;
  }

  const subject = `Support request from ${from}`;
  const bodyText = `From: ${from}\n\n${body}`;
  const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  window.location.href = mailto;
});

noteAddBtn.addEventListener("click", function() {
  addNote();
});

noteInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addNote();
  }
});

exploreForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const age = Number(document.getElementById("signupAge").value);
  const accType = document.getElementById("signupAccType").value;
  const kraPin = document.getElementById("signupKP").value.trim();
  const cardType = document.querySelector("input[name='signupCardType']:checked").value;

  if (!name || !age || !kraPin) {
    alert("Please fill in all required fields.");
    return;
  }

  if (age < 13) {
    alert("Age must be 13 or older.");
    return;
  }

  exploreModal.style.display = "none";
  alert(`Sign-up complete:\nName: ${name}\nAge: ${age}\nAccount type: ${accType}\nKRA PIN: ${kraPin}\nCard: ${cardType}`);
  exploreForm.reset();
});

createAccountBtn.addEventListener("click", function(){
  const name = accountNameInput.value.trim();
  const type = accountTypeInput.value;

  if (!name) {
    alert("Please enter a name for your account.");
    return;
  }

  account = { name, type };
  infoName.textContent = `Name: ${name}`;
  infoType.textContent = `Account type: ${type}`;

  accountFormContainer.style.display = "none";
  accountInfoContainer.style.display = "block";

  alert(`Account created: ${name} (${type})`);
});

logoutBtn.addEventListener("click", function(){
  account = null;
  accountNameInput.value = "";
  accountTypeInput.value = "Personal";

  accountFormContainer.style.display = "block";
  accountInfoContainer.style.display = "none";

  alert("Logged out successfully.");
});

contactBtn.addEventListener("click", function(){
  const mailto = "mailto:support@finflow.com?subject=Support%20Request&body=Hello%20FinFlow%20team,";
  window.location.href = mailto;
});

function filterTransactions(query) {
  const normalized = query.toLowerCase().trim();
  const items = document.querySelectorAll(".transaction-item");

  items.forEach(item => {
    const title = item.querySelector(".transaction-title")?.textContent.toLowerCase() || "";
    const time = item.querySelector(".transaction-time")?.textContent.toLowerCase() || "";
    const amount = item.querySelector(".transaction-amount")?.textContent.toLowerCase() || "";

    if (normalized === "" || title.includes(normalized) || time.includes(normalized) || amount.includes(normalized)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

searchInput.addEventListener("input", function() {
  filterTransactions(this.value);
});

window.addEventListener("click", function(event){
  if (event.target === transactionModal) {
    transactionModal.style.display = "none";
  }
  if (event.target === accountModal) {
    accountModal.style.display = "none";
  }
  if (event.target === paymentModal) {
    paymentModal.style.display = "none";
  }
  if (event.target === exploreModal) {
    exploreModal.style.display = "none";
  }
  if (event.target === inboxModal) {
    inboxModal.style.display = "none";
  }
  if (event.target === helpModal) {
    helpModal.style.display = "none";
  }
});
