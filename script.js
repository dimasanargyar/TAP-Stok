// module entry
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import {
  getDatabase, ref, set, push, remove, onValue, update
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

/* Config Database Barang */
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

/* Config Database Alat */
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

/* initialize two apps with names */
const appBarang = initializeApp(firebaseConfigBarang, "appBarang");
const analyticsBarang = getAnalytics(appBarang);
const dbBarang = getDatabase(appBarang);

const appAlat = initializeApp(firebaseConfigAlat, "appAlat");
const analyticsAlat = getAnalytics(appAlat);
const dbAlat = getDatabase(appAlat);

/* =======================================================
   LOGIN CONFIG
======================================================= */
const CREDENTIALS = {
  username: "admin",
  password: "gudangtap"
};

let currentRole = null; // 'admin' | 'guest'

/* =======================================================
   DOM ELEMENTS (global)
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

/* edit modal shared */
const editModal = document.getElementById("editModal");
const editModalTitle = document.getElementById("editModalTitle");
const editFieldsBarang = document.getElementById("editFieldsBarang");
const editFieldsAlat = document.getElementById("editFieldsAlat");
const btnUpdate = document.getElementById("btnUpdate");
const btnCancelEdit = document.getElementById("btnCancelEdit");

/* =======================================================
   STATE untuk barang & alat (terpisah)
======================================================= */
let stokBarang = {};
let riwayat = [];
let editMode = null;

let stokAlat = {};
let riwayatAlat = [];

/* =======================================================
   ELEMS (barang) - prefix barang_
======================================================= */
const barang_inputNama = document.getElementById("barang_inputNama");
const barang_inputJumlah = document.getElementById("barang_inputJumlah");
const barang_inputSatuan = document.getElementById("barang_inputSatuan");
const barang_inputTanggal = document.getElementById("barang_inputTanggal");
const barang_btnSimpan = document.getElementById("barang_btnSimpan");
const barang_btnReset = document.getElementById("barang_btnReset");
const barang_searchBar = document.getElementById("barang_searchBar");
const barang_searchStok = document.getElementById("barang_searchStok");
const barang_tabelStokBody = document.querySelector("#barang_tabelStok tbody");
const barang_tabelRiwayatBody = document.querySelector("#barang_tabelRiwayat tbody");
const barang_btnExportStok = document.getElementById("barang_btnExportStok");
const barang_btnExportRiwayat = document.getElementById("barang_btnExportRiwayat");
const barang_bulanExport = document.getElementById("barang_bulanExport");

/* edit modal barang inputs */
const edit_barang_nama = document.getElementById("edit_barang_nama");
const edit_barang_jumlah = document.getElementById("edit_barang_jumlah");
const edit_barang_satuan = document.getElementById("edit_barang_satuan");

/* =======================================================
   ELEMS (alat) - prefix alat_
======================================================= */
const alat_inputNama = document.getElementById("alat_inputNama");
const alat_inputSpesifikasi = document.getElementById("alat_inputSpesifikasi");
const alat_inputJumlah = document.getElementById("alat_inputJumlah");
const alat_inputSatuan = document.getElementById("alat_inputSatuan");
const alat_inputKeterangan = document.getElementById("alat_inputKeterangan");
const alat_inputTanggal = document.getElementById("alat_inputTanggal");
const alat_btnSimpan = document.getElementById("alat_btnSimpan");
const alat_btnReset = document.getElementById("alat_btnReset");
const alat_searchBar = document.getElementById("alat_searchBar");
const alat_searchStok = document.getElementById("alat_searchStok");
const alat_tabelStokBody = document.querySelector("#alat_tabelStok tbody");
const alat_tabelRiwayatBody = document.querySelector("#alat_tabelRiwayat tbody");
const alat_btnExportStok = document.getElementById("alat_btnExportStok");
const alat_btnExportRiwayat = document.getElementById("alat_btnExportRiwayat");
const alat_bulanExport = document.getElementById("alat_bulanExport");

/* edit modal alat inputs */
const edit_alat_nama = document.getElementById("edit_alat_nama");
const edit_alat_spesifikasi = document.getElementById("edit_alat_spesifikasi");
const edit_alat_jumlah = document.getElementById("edit_alat_jumlah");
const edit_alat_satuan = document.getElementById("edit_alat_satuan");
const edit_alat_keterangan = document.getElementById("edit_alat_keterangan");

/* pages */
const pageBarang = document.getElementById("pageBarang");
const pageAlat = document.getElementById("pageAlat");

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

if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    const type = loginPassword.getAttribute("type") === "password" ? "text" : "password";
    loginPassword.setAttribute("type", type);
    togglePassword.textContent = type === "password" ? "🔴" : "🟢";
  });
}

function afterLogin() {
  loginCard.style.display = "none";
  appRoot.style.display = "block";
  // default halaman: Barang
  showPage("barang");
  applyRoleUI();
}

/* logout simple (reset UI) */
btnLogout.addEventListener("click", () => {
  if (!confirm("Logout sekarang?")) return;
  currentRole = null;
  loginUsername.value = "";
  loginPassword.value = "";
  loginCard.style.display = "block";
  appRoot.style.display = "none";
});

/* switch halaman */
btnSwitch.addEventListener("click", () => {
  const isBarang = pageBarang.style.display !== "none";
  showPage(isBarang ? "alat" : "barang");
});

function showPage(page) {
  if (page === "barang") {
    pageBarang.style.display = "block";
    pageAlat.style.display = "none";
    appTitle.textContent = "Stok Barang";
    btnSwitch.textContent = "Switch Halaman → Alat";
  } else {
    pageBarang.style.display = "none";
    pageAlat.style.display = "block";
    appTitle.textContent = "Stok Alat";
    btnSwitch.textContent = "Switch Halaman → Barang";
  }
}

/* disable/enable inputs based on role */
function applyRoleUI() {
  const isGuest = currentRole === "guest";

  // barang
  barang_inputNama.disabled = isGuest;
  barang_inputJumlah.disabled = isGuest;
  barang_inputSatuan.disabled = isGuest;
  barang_inputTanggal.disabled = isGuest;
  barang_btnSimpan.disabled = isGuest;
  barang_btnReset.disabled = isGuest;
  barang_bulanExport.disabled = false;

  // alat
  alat_inputNama.disabled = isGuest;
  alat_inputSpesifikasi.disabled = isGuest;
  alat_inputJumlah.disabled = isGuest;
  alat_inputSatuan.disabled = isGuest;
  alat_inputTanggal.disabled = isGuest;
  alat_btnSimpan.disabled = isGuest;
  alat_btnReset.disabled = isGuest;
  alat_bulanExport.disabled = false;

  renderStok();
  renderRiwayat();
  renderStokAlat();
  renderRiwayatAlat();
}

/* =======================================================
   LOGIC: BARANG (database di dbBarang path: stok, riwayat)
======================================================= */
function resetFormBarang() {
  barang_inputNama.value = "";
  barang_inputJumlah.value = "";
  barang_inputSatuan.value = "";
  barang_inputTanggal.value = "";
}

barang_btnReset.addEventListener("click", () => {
  resetFormBarang();
});

/* SIMPAN BARANG */
barang_btnSimpan.addEventListener("click", () => {
  if (currentRole === "guest") {
    alert("Mode Tamu: tidak diizinkan mengubah data.");
    return;
  }
  const nama = (barang_inputNama.value || "").trim();
  const jumlah = Number(barang_inputJumlah.value);
  const satuan = (barang_inputSatuan.value || "").trim() || "-";
  const tanggal = barang_inputTanggal.value;

  if (!nama) return alert("Nama barang wajib diisi.");
  if (!tanggal) return alert("Tanggal wajib diisi.");
  if (Number.isNaN(jumlah)) return alert("Jumlah harus angka.");
  if (jumlah === 0) return alert("Jumlah tidak boleh 0.");

  const stokLama = stokBarang[nama]?.jumlah || 0;
  const sisaBaru = stokLama + jumlah;
  if (jumlah < 0 && sisaBaru < 0) return alert(`Stok tidak cukup. Stok saat ini: ${stokLama}`);

  set(ref(dbBarang, `stok/${nama}`), { jumlah: sisaBaru, satuan })
    .then(() => {
      return push(ref(dbBarang, "riwayat"), {
        tanggal,
        nama,
        perubahan: jumlah,
        sisa: sisaBaru,
        satuan
      });
    })
    .then(() => {
      alert("✅ Data berhasil disimpan.");
      resetFormInput();
    })
    .catch(err => console.error("❌ Gagal menyimpan data:", err));
});

/* RENDER STOK BARANG */
function renderStok() {
  barang_tabelStokBody.innerHTML = "";
  const key = (barang_searchStok.value || "").trim().toLowerCase();
  const filtered = Object.keys(stokBarang).filter(nama => nama.toLowerCase().includes(key));

  if (filtered.length === 0) {
    barang_tabelStokBody.innerHTML = `<tr><td colspan="4">Tidak ada stok</td></tr>`;
    return;
  }

  const isGuest = currentRole === "guest";
  filtered.sort().forEach(nama => {
    const item = stokBarang[nama];
    const jumlah = item?.jumlah ?? 0;
    const satuan = item?.satuan ?? "-";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(nama)}</td>
      <td>${jumlah}</td>
      <td>${escapeHtml(satuan)}</td>
      <td>
        ${isGuest ? "" : `
          <button class="smallBtn" data-edit-barang="${escapeHtml(nama)}">Edit</button>
          <button class="smallBtn" data-hapus-barang="${escapeHtml(nama)}">Hapus</button>
        `}
      </td>
    `;
    barang_tabelStokBody.appendChild(tr);
  });

  if (!currentRole || currentRole === "guest") return;

  document.querySelectorAll("[data-hapus-barang]").forEach(btn => {
    btn.addEventListener("click", () => {
      const namaBarang = btn.getAttribute("data-hapus-barang");
      if (!confirm(`Yakin menghapus barang "${namaBarang}"?`)) return;
      remove(ref(dbBarang, `stok/${namaBarang}`));
      onValue(ref(dbBarang, "riwayat"), snapshot => {
        snapshot.forEach(child => {
          if (child.val().nama === namaBarang) remove(ref(dbBarang, `riwayat/${child.key}`));
        });
      }, { onlyOnce: true });
    });
  });

  document.querySelectorAll("[data-edit-barang]").forEach(btn => {
    btn.addEventListener("click", () => {
      const namaBarang = btn.getAttribute("data-edit-barang");
      const item = stokBarang[namaBarang];
      editMode = { type: "barang", namaLama: namaBarang };
      editModalTitle.textContent = `Edit Barang: ${namaBarang}`;
      editFieldsBarang.style.display = "block";
      editFieldsAlat.style.display = "none";
      edit_barang_nama.value = namaBarang;
      edit_barang_jumlah.value = item?.jumlah ?? 0;
      edit_barang_satuan.value = item?.satuan ?? "-";
      editModal.style.display = "flex";
    });
  });
}

/* RENDER RIWAYAT BARANG */
function renderRiwayat() {
  let data = [...riwayat];
  const key = (barang_searchBar.value || "").trim().toLowerCase();
  if (key) {
    data = data.filter(it => it.nama.toLowerCase().includes(key) || (it.tanggal || "").includes(key));
  }

  barang_tabelRiwayatBody.innerHTML = "";
  if (data.length === 0) {
    barang_tabelRiwayatBody.innerHTML = `<tr><td colspan="7">Tidak ada riwayat</td></tr>`;
    return;
  }

  const isGuest = currentRole === "guest";

  data.forEach((it, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escapeHtml(it.tanggal)}</td>
      <td>${escapeHtml(it.nama)}</td>
      <td>${it.perubahan > 0 ? "+" + it.perubahan : it.perubahan}</td>
      <td>${it.sisa}</td>
      <td>${escapeHtml(it.satuan ?? "-")}</td>
      <td>${isGuest ? "" : `<button class="smallBtn" data-id="${it.id}">Hapus</button>`}</td>
    `;
    barang_tabelRiwayatBody.appendChild(tr);
  });

  if (!currentRole || currentRole === "guest") return;

  document.querySelectorAll("#barang_tabelRiwayat .smallBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      if (id && confirm(`Yakin ingin menghapus riwayat ini?`)) {
        remove(ref(dbBarang, `riwayat/${id}`));
      }
    });
  });
}

/* real-time listeners barang */
onValue(ref(dbBarang, "stok"), snapshot => {
  stokBarang = snapshot.val() || {};
  renderStok();
});

onValue(ref(dbBarang, "riwayat"), snapshot => {
  const arr = [];
  snapshot.forEach(child => {
    arr.push({ id: child.key, ...child.val() });
  });
  arr.sort((a, b) => {
    if (a.tanggal === b.tanggal) return a.id < b.id ? 1 : -1;
    return (a.tanggal < b.tanggal ? 1 : -1);
  });
  riwayat = arr;
  renderRiwayat();
});

/* search listeners barang */
barang_searchBar.addEventListener("input", renderRiwayat);
barang_searchStok.addEventListener("input", renderStok);

/* EXPORT BARANG */
document.getElementById("barang_btnExportStok").addEventListener("click", () => {
  const rows = [["Nama Barang","Jumlah","Satuan"]];
  Object.keys(stokBarang).sort().forEach(nama => {
    const item = stokBarang[nama];
    rows.push([nama, item?.jumlah ?? 0, item?.satuan ?? "-"]);
  });
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Stok");
  XLSX.writeFile(wb, `stok_barang_${todayCompact()}.xls`);
});

document.getElementById("barang_btnExportRiwayat").addEventListener("click", () => {
  const bulan = (barang_bulanExport.value || "").trim();
  if (!bulan) { alert("Pilih bulan terlebih dahulu."); return; }
  const rows = [["Tanggal","Nama Barang","Perubahan","Sisa","Satuan"]];
  riwayat.filter(it => (it.tanggal||"").startsWith(bulan)).forEach(it => rows.push([it.tanggal, it.nama, it.perubahan, it.sisa, it.satuan ?? "-"]));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Riwayat");
  XLSX.writeFile(wb, `riwayat_${bulan}.xls`);
});

/* =======================================================
   LOGIC: ALAT (database di dbAlat path: stokAlat, riwayatAlat)
======================================================= */
function resetFormAlat() {
  alat_inputNama.value = "";
  alat_inputSpesifikasi.value = "";
  alat_inputJumlah.value = "";
  alat_inputSatuan.value = "";
  alat_inputTanggal.value = "";
}

alat_btnReset.addEventListener("click", () => resetFormAlat());

/* SIMPAN ALAT */
alat_btnSimpan.addEventListener("click", () => {
  if (currentRole === "guest") {
    alert("Mode Tamu: tidak diizinkan mengubah data.");
    return;
  }

  const nama = alat_inputNama.value.trim();
  const spesifikasi = alat_inputSpesifikasi.value.trim() || "-";
  const jumlah = Number(alat_inputJumlah.value);
  const satuan = alat_inputSatuan.value.trim() || "-";
  const tanggal = alat_inputTanggal.value;
  const keterangan = alat_inputKeterangan.value.trim() || "-";

  if (!nama) return alert("Nama alat wajib diisi.");
  if (!tanggal) return alert("Tanggal wajib diisi.");
  if (Number.isNaN(jumlah)) return alert("Jumlah harus angka.");
  if (jumlah === 0) return alert("Jumlah tidak boleh 0.");

  const stokLama = stokAlat[nama]?.jumlah || 0;
  const sisaBaru = stokLama + jumlah;
  if (jumlah < 0 && sisaBaru < 0) {
    return alert(`Stok tidak cukup. Stok saat ini: ${stokLama}`);
  }

  set(ref(dbAlat, `stokAlat/${nama}`), { jumlah: sisaBaru, satuan, spesifikasi, keterangan })
    .then(() => {
      return push(ref(dbAlat, "riwayatAlat"), {
        tanggal,
        nama,
        spesifikasi,
        perubahan: jumlah,
        sisa: sisaBaru,
        satuan,
        keterangan
      });
    })
    .then(() => {
      alert("✅ Data berhasil disimpan.");
      resetFormInputs();
    })
    .catch(err => console.error("❌ Gagal menyimpan data:", err));
});

alat_btnReset.addEventListener("click", () => {
  resetFormInputs();
  editMode = null;
});

function resetFormInputs() {
  alat_inputNama.value = "";
  alat_inputSpesifikasi.value = "";
  alat_inputJumlah.value = "";
  alat_inputSatuan.value = "";
  alat_inputTanggal.value = "";
  alat_inputKeterangan.value = "";
}

/* RENDER STOK ALAT */
function renderStokAlat() {
  alat_tabelStokBody.innerHTML = "";

  const key = (alat_searchStok.value || "").trim().toLowerCase();
  const filtered = Object.keys(stokAlat).filter(nama =>
    nama.toLowerCase().includes(key)
  );

  if (filtered.length === 0) {
    alat_tabelStokBody.innerHTML = `<tr><td colspan="5">Tidak ada stok</td></tr>`;
    return;
  }

  const isGuest = currentRole === "guest";

  filtered.sort().forEach(nama => {
    const item = stokAlat[nama];
    const jumlah = item?.jumlah ?? item ?? 0;
    const satuan = item?.satuan ?? "-";
    const spesifikasi = item?.spesifikasi ?? "-";
    const keterangan = item?.keterangan ?? "-";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(nama)}</td>
      <td>${escapeHtml(spesifikasi)}</td>
      <td>${jumlah}</td>
      <td>${escapeHtml(satuan)}</td>
      <td>${escapeHtml(keterangan)}</td>
      <td>
        ${isGuest ? "" : `
          <button class="smallBtn" data-edit-alat="${escapeHtml(nama)}">Edit</button>
          <button class="smallBtn" data-hapus-alat="${escapeHtml(nama)}">Hapus</button>
        `}
      </td>
    `;
    alat_tabelStokBody.appendChild(tr);
  });

  if (!currentRole || currentRole === "guest") return;

  document.querySelectorAll("[data-hapus-alat]").forEach(btn => {
    btn.addEventListener("click", () => {
      const namaAlat = btn.getAttribute("data-hapus-alat");
      if (confirm(`Yakin ingin menghapus alat "${namaAlat}"?`)) {
        remove(ref(dbAlat, `stokAlat/${namaAlat}`));
        onValue(ref(dbAlat, "riwayatAlat"), snapshot => {
          snapshot.forEach(child => {
            if (child.val().nama === namaAlat) {
              remove(ref(dbAlat, `riwayatAlat/${child.key}`));
            }
          });
        }, { onlyOnce: true });
      }
    });
  });

  document.querySelectorAll("[data-edit-alat]").forEach(btn => {
    btn.addEventListener("click", () => {
      const namaAlat = btn.getAttribute("data-edit-alat");
      const item = stokAlat[namaAlat];
      editMode = { type: "alat", namaLama: namaAlat };
      editModalTitle.textContent = `Edit Alat: ${namaAlat}`;
      editFieldsBarang.style.display = "none";
      editFieldsAlat.style.display = "block";
      edit_alat_nama.value = namaAlat;
      edit_alat_spesifikasi.value = item?.spesifikasi ?? "-";
      edit_alat_jumlah.value = item?.jumlah ?? item ?? 0;
      edit_alat_satuan.value = item?.satuan ?? "-";
      edit_alat_keterangan.value = item?.keterangan ?? "-";
      editModal.style.display = "flex";
    });
  });
}

/* RENDER RIWAYAT ALAT */
function renderRiwayatAlat() {
  let data = [...riwayatAlat];
  const key = (alat_searchBar.value || "").trim().toLowerCase();
  if (key) {
    data = data.filter(it => 
      it.nama.toLowerCase().includes(key) || 
      (it.spesifikasi || "").toLowerCase().includes(key) || 
      (it.tanggal || "").includes(key)
    );
  }

  alat_tabelRiwayatBody.innerHTML = "";
  if (data.length === 0) {
    alat_tabelRiwayatBody.innerHTML = `<tr><td colspan="8">Tidak ada riwayat</td></tr>`;
    return;
  }

  const isGuest = currentRole === "guest";

  data.forEach((it, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escapeHtml(it.tanggal)}</td>
      <td>${escapeHtml(it.nama)}</td>
      <td>${escapeHtml(it.spesifikasi ?? "-")}</td>
      <td>${it.perubahan > 0 ? "+" + it.perubahan : it.perubahan}</td>
      <td>${it.sisa}</td>
      <td>${escapeHtml(it.satuan ?? "-")}</td>
      <td>${escapeHtml(it.keterangan ?? "-")}</td>
      <td>${isGuest ? "" : `<button class="smallBtn" data-id="${it.id}">Hapus</button>`}</td>
    `;
    alat_tabelRiwayatBody.appendChild(tr);
  });

  if (!currentRole || currentRole === "guest") return;

  document.querySelectorAll("#alat_tabelRiwayat .smallBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      if (id && confirm(`Yakin ingin menghapus riwayat ini?`)) {
        remove(ref(dbAlat, `riwayatAlat/${id}`));
      }
    });
  });
}

/* real-time listeners alat */
onValue(ref(dbAlat, "stokAlat"), snapshot => {
  stokAlat = snapshot.val() || {};
  renderStokAlat();
});

onValue(ref(dbAlat, "riwayatAlat"), snapshot => {
  const arr = [];
  snapshot.forEach(child => {
    arr.push({ id: child.key, ...child.val() });
  });
  arr.sort((a, b) => {
    if (a.tanggal === b.tanggal) return a.id < b.id ? 1 : -1;
    return (a.tanggal < b.tanggal ? 1 : -1);
  });
  riwayatAlat = arr;
  renderRiwayatAlat();
});

/* search listeners alat */
alat_searchBar.addEventListener("input", renderRiwayatAlat);
alat_searchStok.addEventListener("input", renderStokAlat);

/* EXPORT ALAT */
document.getElementById("alat_btnExportStok").addEventListener("click", () => {
  const rows = [["Nama Alat","Spesifikasi","Jumlah","Satuan"]];
  Object.keys(stokAlat).sort().forEach(nama => {
    const item = stokAlat[nama];
    rows.push([nama, item?.spesifikasi ?? "-", item?.jumlah ?? 0, item?.satuan ?? "-"]);
  });
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Stok");
  XLSX.writeFile(wb, `stok_alat_${todayCompact()}.xls`);
});

document.getElementById("alat_btnExportRiwayat").addEventListener("click", () => {
  const bulan = (alat_bulanExport.value || "").trim();
  if (!bulan) { alert("Pilih bulan terlebih dahulu."); return; }
  const rows = [["Tanggal","Nama Alat","Spesifikasi","Perubahan","Sisa","Satuan"]];
  riwayatAlat.filter(it => (it.tanggal||"").startsWith(bulan)).forEach(it => rows.push([it.tanggal, it.nama, it.spesifikasi ?? "-", it.perubahan, it.sisa, it.satuan ?? "-"]));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Riwayat");
  XLSX.writeFile(wb, `riwayat_alat_${bulan}.xls`);
});

/* =======================================================
   EDIT MODAL SAVE (satu tombol update untuk kedua tipe)
======================================================= */
btnUpdate.addEventListener("click", () => {
  if (!editMode) return;
  if (editMode.type === "barang") {
    const { namaLama } = editMode;
    const namaBaru = (edit_barang_nama.value || "").trim();
    const jumlahBaru = Number(edit_barang_jumlah.value);
    const satuanBaru = (edit_barang_satuan.value || "").trim() || "-";
    const tanggal = todayISO();

    if (!namaBaru) return alert("Nama barang wajib diisi.");
    if (Number.isNaN(jumlahBaru)) return alert("Jumlah harus angka.");
    if (jumlahBaru < 0) return alert("Jumlah tidak boleh negatif.");

    remove(ref(dbBarang, `stok/${namaLama}`))
      .then(() => set(ref(dbBarang, `stok/${namaBaru}`), { jumlah: jumlahBaru, satuan: satuanBaru }))
      .then(() => {
        onValue(ref(dbBarang, `riwayat`), snapshot => {
          snapshot.forEach(child => {
            if (child.val().nama === namaLama) {
              update(ref(dbBarang, `riwayat/${child.key}`), { nama: namaBaru, sisa: jumlahBaru, satuan: satuanBaru });
            }
          });
        }, { onlyOnce: true });
        alert("✅ Data barang berhasil diperbarui.");
        editMode = null;
        editModal.style.display = "none";
      })
      .catch(err => { console.error("Gagal update barang:", err); alert("Terjadi kesalahan saat update."); });

  } else if (editMode.type === "alat") {
    const { namaLama } = editMode;
    const namaBaru = (edit_alat_nama.value || "").trim();
    const spesifikasiBaru = (edit_alat_spesifikasi.value || "").trim() || "-";
    const jumlahBaru = Number(edit_alat_jumlah.value);
    const perubahan = jumlahBaru;
    const satuanBaru = (edit_alat_satuan.value || "").trim() || "-";
    const keteranganBaru = (edit_alat_keterangan.value || "").trim() || "-";
    const tanggal = todayISO();

    if (!namaBaru) return alert("Nama alat wajib diisi.");
    if (Number.isNaN(jumlahBaru)) return alert("Jumlah harus angka.");
    if (jumlahBaru < 0) return alert("Jumlah tidak boleh negatif.");

    remove(ref(dbAlat, `stokAlat/${namaLama}`))
      .then(() => set(ref(dbAlat, `stokAlat/${namaBaru}`), { jumlah: jumlahBaru, satuan: satuanBaru, spesifikasi: spesifikasiBaru, keterangan: keteranganBaru }))
      .then(() => {
        onValue(ref(dbAlat, `riwayatAlat`), snapshot => {
          snapshot.forEach(child => {
            if (child.val().nama === namaLama) {
              update(ref(dbAlat, `riwayatAlat/${child.key}`), { nama: namaBaru, spesifikasi: spesifikasiBaru, perubahan = jumlahBaru, sisa: jumlahBaru, satuan: satuanBaru, keterangan: keteranganBaru });
            }
          });
        }, { onlyOnce: true });
        alert("✅ Data alat berhasil diperbarui.");
        editMode = null;
        editModal.style.display = "none";
      })
      .catch(err => { console.error("Gagal update alat:", err); alert("Terjadi kesalahan saat update."); });
  }
});

btnCancelEdit.addEventListener("click", () => {
  editMode = null;
  editModal.style.display = "none";
});

/* =======================================================
   UTIL
======================================================= */
function todayCompact() {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
}
function todayISO() {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#039;'
  })[m]);
}
