const userName = localStorage.getItem('userName') || localStorage.getItem('username') || 'Misafir';
document.addEventListener('DOMContentLoaded', () => {
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
        userDisplay.innerText = `Merhaba, ${userName}`;
    }
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
    const container = document.getElementById('cart-content');

    if (!container) return;

    if (!cart.length) {
        container.innerHTML = "<p>Sepetiniz boş.</p>";
        return;
    }

    let total = 0;
    let rows = cart.map((item, index) => {
        const sub = item.price * item.quantity;
        total += sub;
        return `<tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price} TL</td>
                    <td>${sub.toFixed(2)} TL</td>
                    <td><button onclick="removeItem(${index})" class="btn-del" style="padding:4px 10px; font-size:11px;">Sil</button></td>
                </tr>`;
    }).join('');

    container.innerHTML = `
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
            <thead>
                <tr>
                    <th style="text-align:left; padding:6px 4px;">Ürün</th>
                    <th style="text-align:left; padding:6px 4px;">Adet</th>
                    <th style="text-align:left; padding:6px 4px;">Birim Fiyat</th>
                    <th style="text-align:left; padding:6px 4px;">Toplam</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
        <div style="margin-top:15px; display:flex; justify-content:space-between; align-items:center;">
            <strong>Genel Toplam: ${total.toFixed(2)} TL</strong>
            <button onclick="submitOrder()" id="order-btn" style="padding:10px 20px; border:none; border-radius:999px; background:#22c55e; color:white; font-weight:600; cursor:pointer;">
                Siparişi Tamamla
            </button>
        </div>
    `;
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

    const payload = {
        username: userName,
        notes: '',
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
        if (!container) return;

        container.innerHTML = `
            <p>Siparişiniz oluşturuldu. Numaranız: <strong>#${order.id}</strong></p>
            <p>Toplam Tutar: <strong>${order.totalAmount} TL</strong></p>
            <h4 style="margin-top:15px;">Sipariş Detayları</h4>
            <ul>
                ${order.items.map(i => `<li>${i.name} x ${i.quantity} - ${i.subTotal} TL</li>`).join('')}
            </ul>
        `;
    }).catch(err => {
        alert(err.message || 'Sipariş sırasında hata oluştu.');
        if (btn) btn.disabled = false;
    }).finally(() => {
        hideLoader();
    });
}




