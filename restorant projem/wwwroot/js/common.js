// Global loader (tüm sayfalarda kullanılabilir)
window.__loaderCount = 0;

// Basit dil desteği (TR / EN)
window.appLang = localStorage.getItem('appLang') || 'tr';

const SUPPORTED_LANGS = ['tr', 'en'];

const I18N = {
    tr: {
        // Genel / navbar
        'nav.mainTitle': '🔥 Kanka Restoran',
        'nav.cart': 'Sepet',
        'nav.logout': 'Çıkış',
        'nav.menu': 'Menü',
        'nav.profile': 'Profilim',
        'nav.orders': 'Siparişlerim',
        'nav.lang': 'TR / EN',

        // Login
        'login.title': '🍔 Giriş Yap',
        'login.subtitle': 'Rezervasyonlarını, siparişlerini ve favori lezzetlerini yönet.',
        'login.usernameLabel': 'Kullanıcı Adı',
        'login.usernamePlaceholder': 'örn. kanka.musteri',
        'login.passwordLabel': 'Şifre',
        'login.passwordPlaceholder': 'Şifreni gir',
        'login.button': 'Giriş Yap',
        'login.registerQuestion': 'Yeni misafir misin?',
        'login.registerLink': 'Kayıt Ol',

        // Register
        'register.title': '📝 Kayıt Ol',
        'register.subtitle': 'Kanka Restoran hesabını oluştur, siparişlerini kolayca yönet.',
        'register.usernameLabel': 'Kullanıcı Adı',
        'register.usernamePlaceholder': 'örn. kanka.musteri',
        'register.passwordLabel': 'Şifre',
        'register.passwordPlaceholder': 'En az 4 karakter',
        'register.button': 'Hesap Oluştur',
        'register.loginQuestion': 'Zaten hesabın var mı?',
        'register.loginLink': 'Giriş Yap',

        // Anasayfa / hero
        'hero.title': 'Kanka Restoran',
        'hero.text': 'Ustanın elinden, dumanı üstünde burgerler, pizzalar ve daha fazlası. Online sipariş ver, masanda hazır olsun.',
        'hero.orderNow': 'Hemen Sipariş Ver',
        'hero.whyKanka': 'Neden Kanka?',
        'hero.badgeTitle': 'Günün Menüsü',
        'hero.badgeDesc': 'Seçili ürünlerde %20 indirim',

        // About
        'about.title': 'Neden Kanka Restoran?',
        'about.fastTitle': '⚡ Hızlı Servis',
        'about.fastText': 'Siparişlerini mutfağa anında iletiyoruz, sıcak ve taze servis ediyoruz.',
        'about.freshTitle': '🥩 Taze Ürünler',
        'about.freshText': 'Her gün taze hazırlanan malzemelerle lezzetten ödün vermiyoruz.',
        'about.priceTitle': '💸 Uygun Fiyat',
        'about.priceText': 'Cep yakmayan menülerle müdavimlerimize özel avantajlar sunuyoruz.',

        // Menü
        'menu.title': 'Menü Listesi',
        'menu.filter.all': 'Tümü',
        'menu.filter.burger': 'Burger',
        'menu.filter.pizza': 'Pizza',
        'menu.filter.drink': 'İçecek',
        'menu.searchPlaceholder': '🔍 Yemek adı ara...',

        // Edit modal
        'edit.title': 'Ürünü Düzenle',
        'edit.text': 'Ürün bilgilerini güncelle.',
        'edit.name': 'Yemek Adı',
        'edit.desc': 'Açıklama',
        'edit.price': 'Fiyat',
        'edit.energy': 'Kalori',
        'edit.cancel': 'Vazgeç',
        'edit.save': 'Kaydet',

        // Ingredient modal
        'ingredient.title': 'Malzeme Çıkar',
        'ingredient.text': 'İstemediğin malzemeleri işaretle, biz mutfağa not düşelim.',
        'ingredient.cancel': 'Vazgeç',
        'ingredient.confirm': 'Sepete Ekle',

        // Footer
        'footer.col1Title': 'Kanka Restoran',
        'footer.col1Text': "Mahalle'nin buluşma noktası. Lezzetli burgerler, pizzalar ve günlük menüler.",
        'footer.col2Title': 'İletişim',
        'footer.col2Address': 'Adres: Örnek Cad. No:10, İstanbul',
        'footer.col2Phone': 'Tel: 0 (212) 000 00 00',
        'footer.col2Hours': 'Çalışma Saatleri: 11:00 - 23:30',
        'footer.col3Title': 'Sosyal',
        'footer.col3Instagram': 'Instagram: @kankarestoran',
        'footer.col3Whatsapp': 'WhatsApp: 0 (5xx) 000 00 00',
        'footer.bottom': 'Kanka Restoran. Tüm hakları saklıdır.',

        // Cart
        'cart.navTitle': '🛒 Sepetim',
        'cart.backToMenu': 'Menüye Dön',
        'cart.logout': 'Çıkış',
        'cart.summaryTitle': 'Sipariş Özeti',
        'cart.empty': 'Sepetiniz boş.',
        'cart.col.product': 'Ürün',
        'cart.col.qty': 'Adet',
        'cart.col.unitPrice': 'Birim Fiyat',
        'cart.col.total': 'Toplam',
        'cart.grandTotal': 'Genel Toplam:',
        'cart.completeOrder': 'Siparişi Tamamla',
        'cart.ordersTitleUser': 'Geçmiş Siparişlerim',
        'cart.ordersTitleAdmin': 'Tüm Siparişler',
        'cart.col.orderNo': 'Sipariş No',
        'cart.col.user': 'Kullanıcı',
        'cart.col.date': 'Tarih',
        'cart.col.status': 'Durum',
        'cart.col.amount': 'Tutar',
        'cart.col.detail': 'Detay',
        'cart.col.rating': 'Değerlendirme',
        'cart.adminMenu': '➕ Admin Menü',
        'cart.rolesTitle': '👤 Kullanıcı Rolleri',
        'cart.footerText': 'Sipariş özetini kontrol et, geçmiş siparişlerini incele.',

        // Rating modal
        'rating.title': 'Siparişi Değerlendir',
        'rating.text': 'Lütfen bu sipariş için 1-5 arası yıldız ve isteğe bağlı yorum bırakın.',
        'rating.placeholder': 'Yorumunuzu yazabilirsiniz (opsiyonel)',
        'rating.cancel': 'Vazgeç',
        'rating.save': 'Kaydet',
        'rating.button': 'Değerlendir',
        'rating.none': 'Henüz yok',

        // Profile
        'profile.navTitle': '👤 Profilim',
        'profile.menuButton': 'Menü',
        'profile.ordersButton': 'Siparişlerim',
        'profile.logout': 'Çıkış',
        'profile.welcomeTitle': 'Hoş geldin,',
        'profile.welcomeText': 'Buradan temel bilgilerini görebilir, sepetine ve geçmiş siparişlerine hızlıca gidebilirsin.',
        'profile.quickAccess': 'Hızlı Erişim',
        'profile.goMenu': 'Menüye Git',
        'profile.goCart': 'Sepetim',
        'profile.footerText': 'Profilinden sipariş geçmişine ve menüye her zaman ulaşabilirsin.'
    },
    en: {
        // General / navbar
        'nav.mainTitle': '🔥 Kanka Restaurant',
        'nav.cart': 'Cart',
        'nav.logout': 'Logout',
        'nav.menu': 'Menu',
        'nav.profile': 'My Profile',
        'nav.orders': 'My Orders',
        'nav.lang': 'TR / EN',

        // Login
        'login.title': '🍔 Login',
        'login.subtitle': 'Manage your reservations, orders and favorite tastes.',
        'login.usernameLabel': 'Username',
        'login.usernamePlaceholder': 'e.g. kanka.customer',
        'login.passwordLabel': 'Password',
        'login.passwordPlaceholder': 'Enter your password',
        'login.button': 'Login',
        'login.registerQuestion': 'New here?',
        'login.registerLink': 'Sign Up',

        // Register
        'register.title': '📝 Sign Up',
        'register.subtitle': 'Create your Kanka Restaurant account and manage your orders easily.',
        'register.usernameLabel': 'Username',
        'register.usernamePlaceholder': 'e.g. kanka.customer',
        'register.passwordLabel': 'Password',
        'register.passwordPlaceholder': 'At least 4 characters',
        'register.button': 'Create Account',
        'register.loginQuestion': 'Already have an account?',
        'register.loginLink': 'Login',

        // Homepage / hero
        'hero.title': 'Kanka Restaurant',
        'hero.text': 'Burgers, pizzas and more – hot and fresh from the chef. Order online, have it ready on your table.',
        'hero.orderNow': 'Order Now',
        'hero.whyKanka': 'Why Kanka?',
        'hero.badgeTitle': "Today’s Menu",
        'hero.badgeDesc': '20% discount on selected items',

        // About
        'about.title': 'Why Kanka Restaurant?',
        'about.fastTitle': '⚡ Fast Service',
        'about.fastText': 'We send your orders to the kitchen instantly, served hot and fresh.',
        'about.freshTitle': '🥩 Fresh Ingredients',
        'about.freshText': 'We never compromise on taste with fresh ingredients prepared daily.',
        'about.priceTitle': '💸 Fair Prices',
        'about.priceText': 'Wallet-friendly menus with special advantages for our regulars.',

        // Menu
        'menu.title': 'Menu List',
        'menu.filter.all': 'All',
        'menu.filter.burger': 'Burger',
        'menu.filter.pizza': 'Pizza',
        'menu.filter.drink': 'Drink',
        'menu.searchPlaceholder': '🔍 Search by meal name...',

        // Edit modal
        'edit.title': 'Edit Product',
        'edit.text': 'Update product information.',
        'edit.name': 'Meal Name',
        'edit.desc': 'Description',
        'edit.price': 'Price',
        'edit.energy': 'Calories',
        'edit.cancel': 'Cancel',
        'edit.save': 'Save',

        // Ingredient modal
        'ingredient.title': 'Remove Ingredients',
        'ingredient.text': 'Mark the ingredients you do not want, we will send a note to the kitchen.',
        'ingredient.cancel': 'Cancel',
        'ingredient.confirm': 'Add to Cart',

        // Footer
        'footer.col1Title': 'Kanka Restaurant',
        'footer.col1Text': 'The meeting point of the neighborhood. Delicious burgers, pizzas and daily menus.',
        'footer.col2Title': 'Contact',
        'footer.col2Address': 'Address: Ornek St. No:10, Istanbul',
        'footer.col2Phone': 'Phone: +90 (212) 000 00 00',
        'footer.col2Hours': 'Opening Hours: 11:00 - 23:30',
        'footer.col3Title': 'Social',
        'footer.col3Instagram': 'Instagram: @kankarestoran',
        'footer.col3Whatsapp': 'WhatsApp: +90 (5xx) 000 00 00',
        'footer.bottom': 'Kanka Restaurant. All rights reserved.',

        // Cart
        'cart.navTitle': '🛒 My Cart',
        'cart.backToMenu': 'Back to Menu',
        'cart.logout': 'Logout',
        'cart.summaryTitle': 'Order Summary',
        'cart.empty': 'Your cart is empty.',
        'cart.col.product': 'Product',
        'cart.col.qty': 'Qty',
        'cart.col.unitPrice': 'Unit Price',
        'cart.col.total': 'Total',
        'cart.grandTotal': 'Grand Total:',
        'cart.completeOrder': 'Place Order',
        'cart.ordersTitleUser': 'My Past Orders',
        'cart.ordersTitleAdmin': 'All Orders',
        'cart.col.orderNo': 'Order No',
        'cart.col.user': 'User',
        'cart.col.date': 'Date',
        'cart.col.status': 'Status',
        'cart.col.amount': 'Amount',
        'cart.col.detail': 'Details',
        'cart.col.rating': 'Rating',
        'cart.adminMenu': '➕ Admin Menu',
        'cart.rolesTitle': '👤 User Roles',
        'cart.footerText': 'Check your order summary and review your past orders.',

        // Rating modal
        'rating.title': 'Rate this Order',
        'rating.text': 'Please leave a 1–5 star rating and an optional comment for this order.',
        'rating.placeholder': 'You can write your comment (optional)',
        'rating.cancel': 'Cancel',
        'rating.save': 'Save',
        'rating.button': 'Rate',
        'rating.none': 'No rating yet',

        // Profile
        'profile.navTitle': '👤 My Profile',
        'profile.menuButton': 'Menu',
        'profile.ordersButton': 'My Orders',
        'profile.logout': 'Logout',
        'profile.welcomeTitle': 'Welcome,',
        'profile.welcomeText': 'From here you can see your basic info and quickly access your cart and order history.',
        'profile.quickAccess': 'Quick Access',
        'profile.goMenu': 'Go to Menu',
        'profile.goCart': 'My Cart',
        'profile.footerText': 'You can always access your order history and menu from your profile.'
    }
};

function ensureLoaderElement() {
    let overlay = document.getElementById('global-loader');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'global-loader';
        overlay.className = 'loader-overlay';
        overlay.innerHTML = '<div class="loader-spinner"></div>';
        document.body.appendChild(overlay);
    }
    return overlay;
}

function showLoader() {
    const overlay = ensureLoaderElement();
    window.__loaderCount = (window.__loaderCount || 0) + 1;
    overlay.classList.add('visible');
}

function hideLoader() {
    const overlay = document.getElementById('global-loader');
    if (!overlay) return;
    window.__loaderCount = Math.max((window.__loaderCount || 0) - 1, 0);
    if (window.__loaderCount === 0) {
        overlay.classList.remove('visible');
    }
}

// Sepete ekleme animasyonu ve küçük bildirim
function showCartAddAnimation(customMessage) {
    const lang = SUPPORTED_LANGS.includes(window.appLang) ? window.appLang : 'tr';
    const message = customMessage
        || (lang === 'en' ? 'Added to cart' : 'Sepete eklendi');

    // Navbar'daki sepet butonunu hafifçe zıplat
    const cartBtn = document.querySelector('.btn-cart');
    if (cartBtn) {
        cartBtn.classList.remove('btn-cart-animated');
        // yeniden tetiklenebilmesi için timeout ile ekle
        setTimeout(() => {
            cartBtn.classList.add('btn-cart-animated');
        }, 10);
    }

    // Eski toast varsa temizle
    const existing = document.getElementById('cart-added-toast');
    if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
    }

    // Sağ altta küçük toast
    const toast = document.createElement('div');
    toast.id = 'cart-added-toast';
    toast.className = 'cart-added-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // 2.2 sn sonra otomatik kaldır
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 2200);
}

// Alert override: özellikle menü sayfasında (index.html) tarayıcı popup'ı yerine kendi animasyonumuzu kullan
(function () {
    const originalAlert = window.alert;
    window.alert = function (message) {
        try {
            const text = typeof message === 'string' ? message : String(message ?? '');
            const lower = text.toLowerCase();
            const path = (window.location.pathname || '').toLowerCase();
            const isMenuPage = path.endsWith('/') || path.endsWith('/index.html');

            // Menü sayfasındaysak, TÜM alert mesajlarını kendi toast animasyonumuzla göster
            if (isMenuPage && typeof showCartAddAnimation === 'function') {
                showCartAddAnimation(text);
                return; // Tarayıcı popup'ını hiç açma
            }

            // Diğer sayfalarda yalnızca "sepete eklendi" mesajlarını yakala
            if (lower.includes('sepete eklendi') && typeof showCartAddAnimation === 'function') {
                showCartAddAnimation();
                return;
            }

            // Geri kalan alert'ler normal çalışsın
            originalAlert(message);
        } catch {
            originalAlert(message);
        }
    };
})();

function applyTranslations() {
    const lang = SUPPORTED_LANGS.includes(window.appLang) ? window.appLang : 'tr';
    const dict = I18N[lang] || I18N['tr'];

    // <html lang="...">
    if (document.documentElement) {
        document.documentElement.setAttribute('lang', lang);
    }

    // Metin içeriği
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = dict[key];
        if (value) {
            el.textContent = value;
        }
    });

    // Placeholder çevirileri
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = dict[key];
        if (value) {
            el.setAttribute('placeholder', value);
        }
    });
}

function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) {
        lang = 'tr';
    }
    window.appLang = lang;
    localStorage.setItem('appLang', lang);
    applyTranslations();
}

document.addEventListener('DOMContentLoaded', () => {
    // Sayfa açılır açılmaz loader elemanını hazırla ama gizli bırak.
    ensureLoaderElement();

    // Dil butonu
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const next = window.appLang === 'tr' ? 'en' : 'tr';
            setLanguage(next);
        });
    }

    // Sayfa yüklendiğinde çevirileri uygula
    applyTranslations();
});


