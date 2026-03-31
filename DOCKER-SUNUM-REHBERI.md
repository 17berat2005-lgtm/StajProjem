# Docker Sunum Rehberi – Kanka Restoran Projesi

Ustaların sorabileceği Docker sorularına cevap vermek için kısa özet.

---

## 1. Docker’ı siteye nasıl ekledik?

- **Dockerfile** ekledik: Uygulamanın nasıl image’a dönüşeceğini tanımlıyor.
- **docker-compose.yml** ekledik: Hem web uygulamasını hem SQL Server’ı tek komutla ayağa kaldırıyor.

**Dockerfile ne yapıyor?**
- **Multi-stage build** kullanıyor (SDK ile derleme, runtime ile çalıştırma).
- Önce `restorant projem.csproj` ile `dotnet restore` ve `dotnet publish` yapıyor.
- Son aşamada sadece yayınlanmış dosyalar + ASP.NET Core 9 runtime ile hafif bir image oluşuyor.
- Container içinde uygulama **8080** portunda dinliyor.

**docker-compose ne yapıyor?**
- **web** servisi: Bizim ASP.NET uygulamamız (Dockerfile’dan build ediliyor).
- **sqlserver** servisi: Veritabanı (Microsoft’un resmî SQL Server 2022 image’ı).
- İkisi birlikte ağda konuşuyor; connection string `Server=sqlserver;Database=StajDB` ile veritabanına bağlanıyor.

---

## 2. Docker’ı nasıl çalıştırıyoruz?

**Proje klasörüne girip tek komut:**

```powershell
cd "C:\Users\Admin\Desktop\restorant projem"
docker compose up --build
```

- **`--build`**: Image yoksa veya kod değiştiyse önce build eder.
- Açılan pencerede hem SQL Server hem web uygulaması logları görünür.
- **Site adresi:** `http://localhost:8080`  
  (Örnek: `http://localhost:8080/index.html`, `http://localhost:8080/login.html`)

**Durdurmak için:** Aynı pencerede `Ctrl+C` veya başka bir terminalde:

```powershell
docker compose down
```

---

## 3. Siteye entegrasyon nasıl? (Frontend + Backend)

- **Tek bir Docker image** kullanıyoruz; hem **backend (API)** hem **frontend (wwwroot)** aynı container’da.
- ASP.NET Core projesi zaten:
  - **Backend:** Controllers, API, Entity Framework, StajDB bağlantısı.
  - **Frontend:** `wwwroot` içindeki `index.html`, `login.html`, `js/`, CSS vb. static dosyalar.
- `Program.cs` içinde `app.UseStaticFiles()` ile wwwroot dışarıya açılıyor; yani Docker’dan çalışırken de aynı sayfalar servis ediliyor.
- **Veritabanı:** docker-compose ile ayrı bir **SQL Server container** çalışıyor; uygulama ortam değişkeniyle (`ConnectionStrings__DefaultConnection`) buna bağlanıyor. StajDB bu container’da; uygulama ilk açılışta migration ile tabloları oluşturuyor.

Özet: **Frontend (wwwroot) + Backend (API + DB erişimi) birlikte tek “web” servisinde;** veritabanı ayrı “sqlserver” servisinde. İkisi birlikte **docker compose** ile çalışıyor.

---

## 4. Frontend ve backend ayrı ayrı yaptık mı?

- **Hayır, ayrı iki Docker image yok.** Proje yapısı zaten tek ASP.NET Core uygulaması:
  - **Backend:** C# API, EF Core, StajDB.
  - **Frontend:** HTML/CSS/JS, wwwroot’ta.
- Docker tarafında da buna uygun tek image: Bu uygulama container’da çalışınca hem API hem static dosyalar aynı porttan (8080) sunuluyor.
- Veritabanı için ekstra bir **image** (SQL Server) kullanıyoruz; o da “backend veri katmanı” olarak düşünülebilir.

Yani: **Frontend ve backend kodları projede var, Docker’da ise ikisi tek image’ta birleşik çalışıyor.**

---

## 5. Kısa soru–cevap (Ustalar sorarsa)

| Soru | Kısa cevap |
|------|-------------|
| Docker’ı nasıl ekledin? | Dockerfile + docker-compose ile; Dockerfile’da multi-stage build, docker-compose’da web + SQL Server servisleri tanımlı. |
| Nasıl çalıştırıyorsun? | `docker compose up --build` ile; site `http://localhost:8080`. |
| Site nasıl entegre? | Aynı ASP.NET projesi container’da çalışıyor; wwwroot (frontend) + API (backend) tek image’ta. |
| Frontend/backend ayrı mı? | Kodda var ama tek container’da; ayrı frontend image yok, hepsi bu projede. |
| Veritabanı nerede? | Ayrı SQL Server container (docker-compose’da `sqlserver`); StajDB orada, connection string ile bağlanıyoruz. |

---

## 6. Sunumda göstermek için (adım adım)

1. Proje kökünü aç, `Dockerfile` ve `docker-compose.yml` dosyalarını göster.
2. Terminalde: `docker compose up --build` çalıştır.
3. Tarayıcıda `http://localhost:8080` veya `http://localhost:8080/login.html` aç; site Docker’dan çalışıyor de.
4. İstersen `docker ps` ile çalışan container’ları (web + sqlserver) göster.

Bu rehberi sunum öncesi bir kez okuyup aklında tutman yeterli; sorular aynen buna göre cevaplanabilir.
