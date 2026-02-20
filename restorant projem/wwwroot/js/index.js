let updateId = null;
const userRole = localStorage.getItem('userRole');
const userName = localStorage.getItem('userName') || localStorage.getItem('username');

document.addEventListener('DOMContentLoaded', () => {
    // Yetki kontrolü
    if (!userRole) {
        window.location.href = 'login.html';
        return;
    }

    const userDisplay = document.getElementById('user-display');
    const titleElement = document.getElementById('main-title');

    if (userDisplay) {
        userDisplay.innerText = `Merhaba, ${userName || 'Misafir'}`;
    }

    if (titleElement) {
        if (userRole === 'Admin' || userRole === 'SuperAdmin') {
            titleElement.innerText = "🔥 Kanka Restoran (Yönetim Paneli)";
        } else {
            titleElement.innerText = "🍔 Kanka Restoran (Menü)";
            const adminArea = document.getElementById('admin-area');
            if (adminArea) adminArea.style.display = 'none';
        }
    }

    if (userRole === 'SuperAdmin') {
        const roleArea = document.getElementById('role-area');
        if (roleArea) roleArea.style.display = 'block';
        loadUsersForRole();
    }

    loadMenu();
});

function goCart() {
    window.location.href = 'cart.html';
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// Süperadmin için kullanıcılar
function loadUsersForRole() {
    showLoader();

    fetch('/api/Auth/users')
        .then(res => res.json())
        .then(users => {
            const container = document.getElementById('user-roles-content');
            if (!container) return;

            if (!users.length) {
                container.innerHTML = "<p>Hiç kullanıcı bulunamadı.</p>";
                return;
            }

            let html = `<table style="width:100%; border-collapse:collapse;">
                            <thead>
                                <tr>
                                    <th style="text-align:left; padding:6px 4px;">Kullanıcı</th>
                                    <th style="text-align:left; padding:6px 4px;">Rol</th>
                                    <th style="text-align:left; padding:6px 4px;">Yeni Şifre (reset)</th>
                                </tr>
                            </thead>
                            <tbody>`;

            users.forEach(u => {
                html += `<tr>
                            <td style="padding:4px 4px;">${u.username}</td>
                            <td style="padding:4px 4px;">
                                <select onchange="updateUserRole(${u.id}, this.value)" style="padding:4px 8px; border-radius:6px; border:1px solid #d1d5db;">
                                    <option value="User" ${u.role === 'User' ? 'selected' : ''}>User</option>
                                    <option value="Admin" ${u.role === 'Admin' ? 'selected' : ''}>Admin</option>
                                    <option value="SuperAdmin" ${u.role === 'SuperAdmin' ? 'selected' : ''}>SuperAdmin</option>
                                </select>
                            </td>
                            <td style="padding:4px 4px;">
                                <input type="password" id="pwd-${u.id}" placeholder="Yeni şifre" style="padding:4px 6px; border-radius:6px; border:1px solid #d1d5db; width:140px;" />
                                <button onclick="resetUserPassword(${u.id})" style="margin-left:4px; padding:4px 8px; border-radius:6px; border:none; background:#22c55e; color:#fff; font-size:12px; cursor:pointer;">Kaydet</button>
                            </td>
                          </tr>`;
            });

            html += "</tbody></table>";
            container.innerHTML = html;
        })
        .catch(() => {
            const container = document.getElementById('user-roles-content');
            if (container) container.innerHTML = "<p style='color:red;'>Kullanıcılar yüklenemedi.</p>";
        })
        .finally(() => {
            hideLoader();
        });
}

function updateUserRole(id, role) {
    fetch(`/api/Auth/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
    }).then(res => {
        if (!res.ok) {
            alert('Rol güncellenemedi!');
        }
    }).catch(() => alert('Rol güncellenemedi!'));
}

function resetUserPassword(id) {
    const input = document.getElementById(`pwd-${id}`);
    if (!input) return;
    const newPass = input.value.trim();
    if (!newPass) {
        alert('Lütfen yeni şifre gir.');
        return;
    }

    fetch(`/api/Auth/${id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPass })
    }).then(res => {
        if (res.ok) {
            alert('Şifre güncellendi.');
            input.value = '';
        } else {
            alert('Şifre güncellenemedi.');
        }
    }).catch(() => alert('Şifre güncellenemedi.'));
}

// Sepet
function getCart() {
    const raw = localStorage.getItem('cart');
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(item) {
    const cart = getCart();
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    saveCart(cart);
    alert('Ürün sepete eklendi.');
}

// Menü yükleme
function loadMenu() {
    showLoader();

    fetch('/api/MenuDetail')
        .then(res => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
        })
        .then(data => {
            const container = document.getElementById('menu-listesi');
            if (!container) return;

            let html = '';
            if (!data.length) {
                html = '<p style="text-align:center;">Menüde ürün bulunamadı.</p>';
            } else {
                const imagePool = [
                    'images/images.jpg',
                    'images/indir.jpg',
                    'images/indir (1).jpg'
                ];

                data.forEach((item, index) => {
                    let dateStr = item.createdDate ? new Date(item.createdDate).toLocaleDateString('tr-TR') : 'N/A';

                    let adminButtons = (userRole === 'Admin' || userRole === 'SuperAdmin') ? `
                            <div class="btn-group">
                                <button class="btn-edit" onclick="setUpdateMode(${item.id}, '${item.foodName}', '${item.description}', ${item.price}, ${item.calories})">✏️ Düzenle</button>
                                <button class="btn-del" onclick="deleteItem(${item.id})">🗑️ Sil</button>
                            </div>` : '';

                    let userButtons = (userRole === 'Admin' || userRole === 'SuperAdmin') ? '' : `
                            <div class="btn-group">
                                <button class="btn-edit" style="background:#22c55e;" onclick="addToCart({ id: ${item.id}, name: '${item.foodName}', price: ${item.price} })">🛒 Sepete Ekle</button>
                            </div>`;

                    const imageSrc = imagePool[index % imagePool.length];

                    html += `
                            <div class="card">
                                <div class="card-image">
                                    <img src="${imageSrc}" alt="${item.foodName}">
                                </div>
                                <h3>🍔 ${item.foodName}</h3>
                                <p>${item.description}</p>
                                <p class="price-text">💰 Fiyat: ${item.price} TL</p>
                                <small>🔥 Kalori: ${item.calories} kcal</small><br>
                                <small style="color: #888; font-size: 11px;">🗓️ Eklenme: ${dateStr}</small>
                                ${adminButtons || userButtons}
                            </div>`;
                });
            }
            container.innerHTML = html;
        })
        .catch(err => {
            const container = document.getElementById('menu-listesi');
            if (container) container.innerHTML = `<p style="color:red;">Error loading menu: ${err.message}</p>`;
        })
        .finally(() => {
            hideLoader();
        });
}

// Arama
function filterMenu() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.getElementsByClassName('card');

    for (let i = 0; i < cards.length; i++) {
        let foodName = cards[i].getElementsByTagName('h3')[0].innerText.toLowerCase();
        cards[i].style.display = foodName.includes(input) ? "" : "none";
    }
}

// Edit mode
function setUpdateMode(id, name, desc, price, energy) {
    updateId = id;
    document.getElementById('yName').value = name;
    document.getElementById('yDesc').value = desc;
    document.getElementById('yPrice').value = price;
    document.getElementById('yEnergy').value = energy;

    document.getElementById('form-title').innerText = "✏️ Edit Item";
    document.getElementById('btn-action').innerText = "UPDATE ITEM";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Save/Update
function handleAction() {
    const payload = {
        id: updateId || 0,
        foodName: document.getElementById('yName').value,
        description: document.getElementById('yDesc').value,
        price: parseFloat(document.getElementById('yPrice').value),
        calories: parseInt(document.getElementById('yEnergy').value),
        isActive: true
    };

    const method = updateId ? 'PUT' : 'POST';
    const url = updateId ? `/api/MenuDetail/${updateId}` : '/api/MenuDetail';

    showLoader();

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(() => {
        updateId = null;
        location.reload();
    }).finally(() => {
        hideLoader();
    });
}

// Delete
function deleteItem(id) {
    if (confirm("Bu ürünü silmek istediğine emin misin?")) {
        showLoader();
        fetch(`/api/MenuDetail/${id}`, { method: 'DELETE' })
            .then(() => location.reload())
            .finally(() => hideLoader());
    }
}




