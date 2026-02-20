function login() {
    const data = {
        username: document.getElementById('user').value,
        password: document.getElementById('pass').value
    };

    showLoader();

    fetch('/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (!res.ok) {
                return res.text().then(t => {
                    alert("Sunucu yanıtı: " + res.status + " - " + t);
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
                alert("Hatalı giriş kanka!");
            }
        })
        .finally(() => {
            hideLoader();
        });
}




