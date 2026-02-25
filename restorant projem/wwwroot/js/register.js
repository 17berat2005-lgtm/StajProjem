function kayit() {
    const usernameInput = document.getElementById('rUser');
    const passwordInput = document.getElementById('rPass');
    const errorBox = document.getElementById('register-error');

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

    fetch('/api/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.ok) {
                if (errorBox) {
                    errorBox.style.color = '#16a34a';
                    errorBox.textContent = 'Kayıt başarılı, giriş sayfasına yönlendiriliyorsun.';
                } else {
                    alert("Başarılı!");
                }
                setTimeout(() => {
                    location.href = 'login.html';
                }, 800);
            } else {
                return res.text().then(t => {
                    if (errorBox) {
                        errorBox.textContent = t || 'Kayıt sırasında bir hata oluştu.';
                    } else {
                        alert("Hata: " + t);
                    }
                });
            }
        })
        .finally(() => {
            hideLoader();
        });
}




