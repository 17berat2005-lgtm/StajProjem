function login() {
    const usernameInput = document.getElementById('user');
    const passwordInput = document.getElementById('pass');
    const errorBox = document.getElementById('login-error');

    if (errorBox) errorBox.textContent = '';

    const username = usernameInput ? usernameInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!username || !password) {
        if (errorBox) {
            errorBox.textContent = 'Kullanıcı adı ve şifre boş bırakılamaz.';
        } else {
            alert('Kullanıcı adı ve şifre boş bırakılamaz.');
        }
        return;
    }

    if (password.length < 4) {
        if (errorBox) {
            errorBox.textContent = 'Şifre en az 4 karakter olmalıdır.';
        } else {
            alert('Şifre en az 4 karakter olmalıdır.');
        }
        return;
    }

    const data = { username, password };

    showLoader();

    fetch('/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (!res.ok) {
                return res.text().then(t => {
                    if (errorBox) {
                        errorBox.textContent = t || 'Giriş yapılamadı, bilgilerini kontrol et.';
                    } else {
                        alert("Sunucu yanıtı: " + res.status + " - " + t);
                    }
                    throw new Error("Login failed");
                });
            }
            return res.json();
        })
        .then(user => {
            const role = user.role || user.Role;
            const username = user.username || user.Username;
            localStorage.setItem('userRole', role);
            localStorage.setItem('userName', username);
            window.location.href = 'index.html';
        })
        .catch(err => {
            if (err.message !== "Login failed") {
                if (errorBox) {
                    errorBox.textContent = 'Bir hata oluştu, lütfen tekrar dene.';
                } else {
                    alert("Hatalı giriş kanka!");
                }
            }
        })
        .finally(() => {
            hideLoader();
        });
}




