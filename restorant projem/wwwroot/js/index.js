let updateId = null;
const userRole = localStorage.getItem('userRole');
const userName = localStorage.getItem('userName') || localStorage.getItem('username');

// Sepete eklerken kullanılacak geçici ürün
let pendingCartItem = null;

// Varsayılan malzeme listesi (geliştirildikçe çeşitlendirilebilir)
const DEFAULT_INGREDIENTS = [
    'Soğan',
    'Domates',
    'Marul',
    'Turşu',
    'Peynir'
];

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
        }
    }

    wireEditModalEvents();
    wireIngredientModalEvents();

    loadMenu();
});

function goCart() {
    window.location.href = 'cart.html';
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
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
    // Aynı ürün ve aynı malzeme kombinasyonu varsa quantity artır
    const existing = cart.find(c =>
        c.id === item.id &&
        JSON.stringify(c.removedIngredients || []) === JSON.stringify(item.removedIngredients || [])
    );
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    saveCart(cart);
    alert('Ürün sepete eklendi.');
}

// Ürün düzenleme popup'ı bağlama
function wireEditModalEvents() {
    const overlay = document.getElementById('edit-modal-overlay');
    const cancelBtn = document.getElementById('edit-cancel');
    const saveBtn = document.getElementById('edit-save');

    if (!overlay || !cancelBtn || !saveBtn) return;

    cancelBtn.addEventListener('click', () => {
        overlay.classList.add('modal-hidden');
        updateId = null;
    });

    saveBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('edit-name');
        const descInput = document.getElementById('edit-desc');
        const priceInput = document.getElementById('edit-price');
        const energyInput = document.getElementById('edit-energy');

        if (!nameInput || !descInput || !priceInput || !energyInput) return;

        const payload = {
            id: updateId || 0,
            foodName: nameInput.value,
            description: descInput.value,
            price: parseFloat(priceInput.value),
            calories: parseInt(energyInput.value),
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
            overlay.classList.add('modal-hidden');
            location.reload();
        }).finally(() => {
            hideLoader();
        });
    });
}

// Malzeme çıkarma popup'ı bağlama
function wireIngredientModalEvents() {
    const overlay = document.getElementById('ingredient-modal-overlay');
    const cancelBtn = document.getElementById('ingredient-cancel');
    const confirmBtn = document.getElementById('ingredient-confirm');

    if (!overlay || !cancelBtn || !confirmBtn) return;

    cancelBtn.addEventListener('click', () => {
        overlay.classList.add('modal-hidden');
        pendingCartItem = null;
    });

    confirmBtn.addEventListener('click', () => {
        if (!pendingCartItem) {
            overlay.classList.add('modal-hidden');
            return;
        }

        const listContainer = document.getElementById('ingredient-list');
        if (!listContainer) return;

        const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');
        const removed = [];

        checkboxes.forEach(cb => {
            if (cb.checked) {
                removed.push(cb.value);
            }
        });

        const itemForCart = {
            id: pendingCartItem.id,
            name: pendingCartItem.name,
            price: pendingCartItem.price,
            removedIngredients: removed
        };

        addToCart(itemForCart);

        overlay.classList.add('modal-hidden');
        pendingCartItem = null;
    });
}

// Malzeme popup'ını aç
function openIngredientModal(item) {
    const overlay = document.getElementById('ingredient-modal-overlay');
    const title = document.getElementById('ingredient-title');
    const listContainer = document.getElementById('ingredient-list');

    if (!overlay || !title || !listContainer) return;

    pendingCartItem = {
        id: item.id,
        name: item.foodName,
        price: item.price
    };

    title.textContent = `${item.foodName} için malzeme çıkar`;

    listContainer.innerHTML = '';

    DEFAULT_INGREDIENTS.forEach(ing => {
        const label = document.createElement('label');
        label.className = 'ingredient-chip';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = ing;

        const span = document.createElement('span');
        span.textContent = ing;

        label.appendChild(checkbox);
        label.appendChild(span);

        listContainer.appendChild(label);
    });

    overlay.classList.remove('modal-hidden');
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
            const template = document.getElementById('menu-card-template');
            if (!container || !template) return;

            container.innerHTML = '';

            if (!data.length) {
                const msg = document.createElement('p');
                msg.style.textAlign = 'center';
                msg.textContent = 'Menüde ürün bulunamadı.';
                container.appendChild(msg);
                return;
            }

            const imagePool = [
                'images/images.jpg',
                'images/indir.jpg',
                'images/indir (1).jpg'
            ];

            data.forEach((item, index) => {
                const fragment = template.content.cloneNode(true);

                const card = fragment.querySelector('.card');
                const img = fragment.querySelector('.card-image img');
                const nameSpan = fragment.querySelector('.card-name');
                const descP = fragment.querySelector('.card-desc');
                const priceSpan = fragment.querySelector('.card-price');
                const calSpan = fragment.querySelector('.card-cal-value');
                const dateSpan = fragment.querySelector('.card-date-value');
                const btnGroup = fragment.querySelector('.btn-group');

                const imageSrc = imagePool[index % imagePool.length];
                const dateStr = item.createdDate ? new Date(item.createdDate).toLocaleDateString('tr-TR') : 'N/A';

                if (img) {
                    img.src = imageSrc;
                    img.alt = item.foodName;
                }

                if (nameSpan) nameSpan.textContent = item.foodName;
                if (descP) descP.textContent = item.description;
                if (priceSpan) priceSpan.textContent = item.price;
                if (calSpan) calSpan.textContent = item.calories;
                if (dateSpan) dateSpan.textContent = dateStr;

                if (btnGroup) {
                    // Yönetici butonları
                    if (userRole === 'Admin' || userRole === 'SuperAdmin') {
                        const editBtn = document.createElement('button');
                        editBtn.className = 'btn-edit';
                        editBtn.textContent = '✏️ Düzenle';
                        editBtn.addEventListener('click', () => {
                            // Popup için alanları doldur
                            const overlay = document.getElementById('edit-modal-overlay');
                            const nameInput = document.getElementById('edit-name');
                            const descInput = document.getElementById('edit-desc');
                            const priceInput = document.getElementById('edit-price');
                            const energyInput = document.getElementById('edit-energy');

                            if (!overlay || !nameInput || !descInput || !priceInput || !energyInput) return;

                            updateId = item.id;
                            nameInput.value = item.foodName;
                            descInput.value = item.description;
                            priceInput.value = item.price;
                            energyInput.value = item.calories;

                            overlay.classList.remove('modal-hidden');
                        });

                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'btn-del';
                        deleteBtn.textContent = '🗑️ Sil';
                        deleteBtn.addEventListener('click', () => deleteItem(item.id));

                        btnGroup.appendChild(editBtn);
                        btnGroup.appendChild(deleteBtn);
                    } else {
                        // Normal kullanıcı butonu + malzeme çıkarma popup'ı
                        const addBtn = document.createElement('button');
                        addBtn.className = 'btn-edit';
                        addBtn.style.background = '#22c55e';
                        addBtn.textContent = '🛒 Sepete Ekle';
                        addBtn.addEventListener('click', () =>
                            openIngredientModal(item)
                        );

                        btnGroup.appendChild(addBtn);
                    }
                }

                container.appendChild(fragment);
            });
        })
        .catch(err => {
            const container = document.getElementById('menu-listesi');
            if (container) container.innerHTML = `<p style="color:red;">Error loading menu: ${err.message}</p>`;
        })
        .finally(() => {
            hideLoader();
        });
}

// Arama + kategori filtresi
let activeCategory = 'all';

function applyFilters() {
    const searchValue = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const cards = document.getElementsByClassName('card');
    let visibleCount = 0;

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const nameText = card.getElementsByTagName('h3')[0]?.innerText.toLowerCase() || '';

        // Kategori mantığı: ürün adında ilgili kelime varsa eşleşme olarak kabul et
        let categoryMatch = true;
        if (activeCategory !== 'all') {
            if (activeCategory === 'burger') {
                categoryMatch = nameText.includes('burger') || nameText.includes('hamburger');
            } else if (activeCategory === 'pizza') {
                categoryMatch = nameText.includes('pizza');
            } else if (activeCategory === 'içecek') {
                categoryMatch = nameText.includes('cola') || nameText.includes('ayran') || nameText.includes('içecek') || nameText.includes('icecek');
            }
        }

        const searchMatch = nameText.includes(searchValue);
        const isMatch = categoryMatch && searchMatch;

        card.style.display = isMatch ? "" : "none";
        if (isMatch) visibleCount++;
    }

    const container = document.getElementById('menu-listesi');
    if (container) {
        if (visibleCount === 1) {
            container.classList.add('single-result');
        } else {
            container.classList.remove('single-result');
        }
    }
}

function filterMenu() {
    applyFilters();
}

function filterByCategory(category) {
    activeCategory = category;

    // Buton aktiflik durumunu güncelle
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        if (chip.getAttribute('data-category') === category) {
            chip.classList.add('chip-active');
        } else {
            chip.classList.remove('chip-active');
        }
    });

    applyFilters();
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




