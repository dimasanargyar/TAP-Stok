// module entry
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import {
  getDatabase, ref, set, push, remove, onValue, update, get
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

/* =======================================================
   Dua Firebase project
======================================================= */
const firebaseConfigBarang = {
  apiKey: "AIzaSyAXwrQEVJpDXSsWSF-QEcEtwzl08khw_YI",
  authDomain: "stok-barang-d9ea6.firebaseapp.com",
  databaseURL: "https://stok-barang-d9ea6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "stok-barang-d9ea6",
  storageBucket: "stok-barang-d9ea6.firebasestorage.app",
  messagingSenderId: "761724837703",
  appId: "1:761724837703:web:d67a7a537fd81972317662",
  measurementId: "G-VBDWX1E7H3"
};

const firebaseConfigAlat = {
  apiKey: "AIzaSyCaOQPlCQ8oBNp1H2I1Frf6dN5lUmzBGN4",
  authDomain: "stok-alat.firebaseapp.com",
  databaseURL: "https://stok-alat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "stok-alat",
  storageBucket: "stok-alat.firebasestorage.app",
  messagingSenderId: "725607746091",
  appId: "1:725607746091:web:284c62588307ce7fb4f86e",
  measurementId: "G-BSZY4KFF0C"
};

const appBarang = initializeApp(firebaseConfigBarang, "appBarang");
const dbBarang = getDatabase(appBarang);

const appAlat = initializeApp(firebaseConfigAlat, "appAlat");
const dbAlat = getDatabase(appAlat);

/* =======================================================
   LOGIN CONFIG
======================================================= */
const CREDENTIALS = { username: "admin", password: "gudangtap" };
let currentRole = null;

/* =======================================================
   DOM ELEMENTS
======================================================= */
const loginCard = document.getElementById("loginCard");
const appRoot = document.getElementById("app");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const btnLogin = document.getElementById("btnLogin");
const btnGuest = document.getElementById("btnGuest");
const togglePassword = document.getElementById("togglePassword");

const btnSwitch = document.getElementById("btnSwitch");
const btnLogout = document.getElementById("btnLogout");
const appTitle = document.getElementById("appTitle");

const pageBarang = document.getElementById("pageBarang");
const pageAlat = document.getElementById("pageAlat");

/* =======================================================
   STATE
======================================================= */
let stokBarang = {};
let riwayatBarang = [];
let stokAlat = {};
let riwayatAlat = [];

/* =======================================================
   LOGIN & UI
======================================================= */
btnLogin.addEventListener("click", () => {
  const u = (loginUsername.value || "").trim();
  const p = (loginPassword.value || "").trim();
  if (u === CREDENTIALS.username && p === CREDENTIALS.password) {
    currentRole = "admin";
    afterLogin();
  } else {
    alert("Username atau password salah.");
  }
});

btnGuest.addEventListener("click", () => {
  currentRole = "guest";
  afterLogin();
});

function afterLogin() {
  loginCard.style.display = "none";
  appRoot.style.display = "block";
  showPage("barang");
  applyRoleUI();

  // langsung render data terbaru
  renderStokBarang();
  renderRiwayatBarang();
  renderStokAlat();
  renderRiwayatAlat();
}

btnLogout.addEventListener("click", () => {
  if (!confirm("Logout sekarang?")) return;
  currentRole = null;
  loginUsername.value = "";
  loginPassword.value = "";
  loginCard.style.display = "block";
  appRoot.style.display = "none";
});

btnSwitch.addEventListener("click", () => {
  const isBarang = pageBarang.style.display !== "none";
  showPage(isBarang ? "alat" : "barang");
});

function showPage(page) {
  if (page === "barang") {
    pageBarang.style.display = "block";
    pageAlat.style.display = "none";
    appTitle.textContent = "Monitoring Stok Barang";
    btnSwitch.textContent = "Switch Halaman → Alat";
  } else {
    pageBarang.style.display = "none";
    pageAlat.style.display = "block";
    appTitle.textContent = "Monitoring Stok Alat";
    btnSwitch.textContent = "Switch Halaman → Barang";
  }
}

function applyRoleUI() {
  const isGuest = currentRole === "guest";
  document.querySelectorAll("input,button.saveBtn").forEach(el => {
    if (el.dataset.guest !== "allow") el.disabled = isGuest;
  });
}

/* =======================================================
   REAL-TIME LISTENER BARANG
======================================================= */
onValue(ref(dbBarang, "stokBarang"), snap => {
  stokBarang = snap.val() || {};
  console.log("stokBarang updated:", stokBarang);
  renderStokBarang();
});
onValue(ref(dbBarang, "riwayatBarang"), snap => {
  const arr = [];
  snap.forEach(ch => arr.push({ id: ch.key, ...ch.val() }));
  riwayatBarang = arr;
  console.log("riwayatBarang updated:", riwayatBarang);
  renderRiwayatBarang();
});

/* =======================================================
   REAL-TIME LISTENER ALAT
======================================================= */
onValue(ref(dbAlat, "stokAlat"), snap => {
  stokAlat = snap.val() || {};
  console.log("stokAlat updated:", stokAlat);
  renderStokAlat();
});
onValue(ref(dbAlat, "riwayatAlat"), snap => {
  const arr = [];
  snap.forEach(ch => arr.push({ id: ch.key, ...ch.val() }));
  riwayatAlat = arr;
  console.log("riwayatAlat updated:", riwayatAlat);
  renderRiwayatAlat();
});

/* =======================================================
   RENDER FUNCTIONS
======================================================= */
function renderStokBarang() {
  const body = document.querySelector("#barang_tabelStok tbody");
  body.innerHTML = "";
  const keys = Object.keys(stokBarang);
  if (keys.length === 0) {
    body.innerHTML = `<tr><td colspan="4">Belum ada data barang</td></tr>`;
    return;
  }
  keys.sort().forEach(nama => {
    const it = stokBarang[nama];
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${nama}</td><td>${it.jumlah}</td><td>${it.satuan}</td><td></td>`;
    body.appendChild(tr);
  });
}

function renderRiwayatBarang() {
  const body = document.querySelector("#barang_tabelRiwayat tbody");
  body.innerHTML = "";
  if (riwayatBarang.length === 0) {
    body.innerHTML = `<tr><td colspan="5">Belum ada riwayat</td></tr>`;
    return;
  }
  riwayatBarang.forEach((it, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i+1}</td><td>${it.tanggal||"-"}</td><td>${it.nama}</td><td>${it.perubahan}</td><td>${it.sisa}</td>`;
    body.appendChild(tr);
  });
}

function renderStokAlat() {
  const body = document.querySelector("#alat_tabelStok tbody");
  body.innerHTML = "";
  const keys = Object.keys(stokAlat);
  if (keys.length === 0) {
    body.innerHTML = `<tr><td colspan="5">Belum ada data alat</td></tr>`;
    return;
  }
  keys.sort().forEach(nama => {
    const it = stokAlat[nama];
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${nama}</td><td>${it.spesifikasi||"-"}</td><td>${it.jumlah}</td><td>${it.satuan}</td><td></td>`;
    body.appendChild(tr);
  });
}

function renderRiwayatAlat() {
  const body = document.querySelector("#alat_tabelRiwayat tbody");
  body.innerHTML = "";
  if (riwayatAlat.length === 0) {
    body.innerHTML = `<tr><td colspan="6">Belum ada riwayat</td></tr>`;
    return;
  }
  riwayatAlat.forEach((it, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i+1}</td><td>${it.tanggal||"-"}</td><td>${it.nama}</td><td>${it.spesifikasi||"-"}</td><td>${it.perubahan}</td><td>${it.sisa}</td>`;
    body.appendChild(tr);
  });
}

/* =======================================================
   UTIL
======================================================= */
function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#039;'
  })[m]);
}
