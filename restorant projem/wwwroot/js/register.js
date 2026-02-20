function kayit() {
    const data = {
        username: document.getElementById('rUser').value,
        password: document.getElementById('rPass').value
    };

    showLoader();

    fetch('/api/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.ok) {
                alert("Başarılı!");
                location.href = 'login.html';
            } else {
                return res.text().then(t => alert("Hata: " + t));
            }
        })
        .finally(() => {
            hideLoader();
        });
}




