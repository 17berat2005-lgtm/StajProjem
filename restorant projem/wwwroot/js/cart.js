const userName = localStorage.getItem('userName') || localStorage.getItem('username') || 'Misafir';
const userRole = localStorage.getItem('userRole');

let adminUpdateId = null;

document.addEventListener('DOMContentLoaded', () => {
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
        userDisplay.innerText = `Merhaba, ${userName}`;
    }

    // SuperAdmin için admin menü butonunu göster
    const adminMenuBtn = document.getElementById('admin-menu-btn');
    if (adminMenuBtn && (userRole === 'SuperAdmin' || userRole === 'Admin')) {
        adminMenuBtn.style.display = 'block';
        adminMenuBtn.addEventListener('click', () => {
            openAdminMenuModal();
        });
    }

    // SuperAdmin için kullanıcı rol yönetimi alanını göster
    if (userRole === 'SuperAdmin') {
        const roleArea = document.getElementById('role-area');
        if (roleArea) {
            roleArea.style.display = 'block';
            loadUsersForRole();
        }
    }

    wireAdminMenuModalEvents();
    renderCart();
});

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

function getCart() {
    const raw = localStorage.getItem('cart');
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
    const cart = getCart();
    const emptyMessage = document.getElementById('cart-empty-message');
    const tableWrapper = document.getElementById('cart-table-wrapper');
    const tbody = document.getElementById('cart-body');
    const totalElement = document.getElementById('cart-total');
    const orderBtn = document.getElementById('order-btn');

    if (!emptyMessage || !tableWrapper || !tbody || !totalElement || !orderBtn) return;

    // Önce mevcut satırları temizle
    tbody.innerHTML = '';

    if (!cart.length) {
        emptyMessage.style.display = 'block';
        tableWrapper.style.display = 'none';
        totalElement.textContent = '0.00';
        orderBtn.onclick = null;
        return;
    }

    emptyMessage.style.display = 'none';
    tableWrapper.style.display = 'block';

    let total = 0;

    cart.forEach((item, index) => {
        const sub = item.price * item.quantity;
        total += sub;

        const tr = document.createElement('tr');

        const nameTd = document.createElement('td');
        nameTd.textContent = item.name;

        const qtyTd = document.createElement('td');
        qtyTd.textContent = String(item.quantity);

        const priceTd = document.createElement('td');
        priceTd.textContent = `${item.price} TL`;

        const subTd = document.createElement('td');
        subTd.textContent = `${sub.toFixed(2)} TL`;

        const actionTd = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.className = 'btn-del';
        removeButton.style.padding = '4px 10px';
        removeButton.style.fontSize = '11px';
        removeButton.textContent = 'Sil';
        removeButton.addEventListener('click', () => removeItem(index));

        actionTd.appendChild(removeButton);

        tr.appendChild(nameTd);
        tr.appendChild(qtyTd);
        tr.appendChild(priceTd);
        tr.appendChild(subTd);
        tr.appendChild(actionTd);

        tbody.appendChild(tr);
    });

    totalElement.textContent = total.toFixed(2);

    orderBtn.onclick = submitOrder;
}

function removeItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

function submitOrder() {
    const cart = getCart();
    if (!cart.length) return;

    // Malzeme çıkarma notlarını sipariş notuna yaz
    const notesParts = cart
        .filter(c => Array.isArray(c.removedIngredients) && c.removedIngredients.length > 0)
        .map(c => `${c.name}: ${c.removedIngredients.join(', ')} çıkarıldı`);

    const payload = {
        username: userName,
        notes: notesParts.join(' | '),
        items: cart.map(c => ({ menuDetailId: c.id, quantity: c.quantity }))
    };

    const btn = document.getElementById('order-btn');
    if (btn) btn.disabled = true;

    showLoader();

    fetch('/api/Order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(res => {
        if (!res.ok) throw new Error('Sipariş oluşturulamadı');
        return res.json();
    }).then(order => {
        saveCart([]);

        const container = document.getElementById('cart-content');
        const emptyMessage = document.getElementById('cart-empty-message');
        const tableWrapper = document.getElementById('cart-table-wrapper');

        if (!container || !emptyMessage || !tableWrapper) return;

        // Tabloyu gizle, boş sepet mesajını göster
        tableWrapper.style.display = 'none';
        emptyMessage.style.display = 'block';
        emptyMessage.textContent = `Siparişiniz oluşturuldu. Numaranız: #${order.id} - Toplam: ${order.totalAmount} TL`;
    }).catch(err => {
        alert(err.message || 'Sipariş sırasında hata oluştu.');
        if (btn) btn.disabled = false;
    }).finally(() => {
        hideLoader();
    });
}

// Admin Menü Popup'ı aç
function openAdminMenuModal() {
    const overlay = document.getElementById('admin-menu-modal-overlay');
    const title = document.getElementById('admin-form-title');
    const nameInput = document.getElementById('admin-yName');
    const descInput = document.getElementById('admin-yDesc');
    const priceInput = document.getElementById('admin-yPrice');
    const energyInput = document.getElementById('admin-yEnergy');

    if (!overlay || !title || !nameInput || !descInput || !priceInput || !energyInput) return;

    adminUpdateId = null;
    title.textContent = '➕ Yeni Ürün Ekle';
    nameInput.value = '';
    descInput.value = '';
    priceInput.value = '';
    energyInput.value = '';

    overlay.classList.remove('modal-hidden');
}

// Admin Menü Popup event'lerini bağla
function wireAdminMenuModalEvents() {
    const overlay = document.getElementById('admin-menu-modal-overlay');
    const cancelBtn = document.getElementById('admin-menu-cancel');
    const saveBtn = document.getElementById('admin-menu-save');

    if (!overlay || !cancelBtn || !saveBtn) return;

    cancelBtn.addEventListener('click', () => {
        overlay.classList.add('modal-hidden');
        adminUpdateId = null;
    });

    saveBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('admin-yName');
        const descInput = document.getElementById('admin-yDesc');
        const priceInput = document.getElementById('admin-yPrice');
        const energyInput = document.getElementById('admin-yEnergy');

        if (!nameInput || !descInput || !priceInput || !energyInput) return;

        const payload = {
            id: adminUpdateId || 0,
            foodName: nameInput.value.trim(),
            description: descInput.value.trim(),
            price: parseFloat(priceInput.value) || 0,
            calories: parseInt(energyInput.value) || 0,
            isActive: true
        };

        if (!payload.foodName || !payload.description) {
            alert('Lütfen yemek adı ve açıklama girin.');
            return;
        }

        const method = adminUpdateId ? 'PUT' : 'POST';
        const url = adminUpdateId ? `/api/MenuDetail/${adminUpdateId}` : '/api/MenuDetail';

        showLoader();

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(res => {
            if (!res.ok) throw new Error('Ürün kaydedilemedi');
            return res.json();
        }).then(() => {
            adminUpdateId = null;
            overlay.classList.add('modal-hidden');
            alert('Ürün başarıyla kaydedildi!');
            // Menü sayfasına yönlendir
            window.location.href = 'index.html';
        }).catch(err => {
            alert(err.message || 'Ürün kaydedilemedi.');
        }).finally(() => {
            hideLoader();
        });
    });
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




