# 🏋️ FitPulse — Çok Kiracılı (Multi-Tenant) Spor Salonu Yönetim SaaS Platformu

FitPulse, spor salonlarının kendi markaları, logoları, renkleri ve kurumsal kimlikleriyle üyelerini, antrenörlerini, turnike QR geçişlerini, antrenman ve beslenme programlarını profesyonel bir SaaS seviyesinde yönetmelerini sağlayan tam kapsamlı bir web uygulamasıdır.

---

## 🌟 Öne Çıkan Özellikler

### 1. Çok Kiracılı (Multi-Tenant) İzolasyon & Güvenlik
- **Tam Veri İzolasyonu:** Her spor salonu ayrı bir tenant (`Gym`) kimliğine sahiptir. Veritabanı ve API seviyesinde (IDOR korumalı) tenant ayrımı yapılır; bir salon diğer salonun hiçbir verisini göremez.
- **Rol Tabanlı Yetkilendirme (RBAC):** `SUPER_ADMIN`, `GYM_ADMIN`, `TRAINER` ve `MEMBER`.
- **Şifre Güvenliği:** Asla düz metin saklanmaz; bcrypt ile tuzlanmış hashleme kullanılır.

### 2. Spor Salonu Kayıt & 7 Günlük Ücretsiz Deneme (Trial)
- Modern ve dönüşüm odaklı landing page (`/`): "7 Gün Ücretsiz Dene" CTA.
- Kayıt sırasında otomatik gym/tenant hesabı ve 7 günlük ücretsiz deneme oluşturulur (`trialStart`, `trialEndsAt`, `subscriptionStatus`).
- Admin panelinde canlı sayaç: *"Deneme sürenizin bitmesine X gün kaldı"*.
- 7 gün dolduğunda veriler **silinmez**; gym durumu `EXPIRED` olur ve *"Deneme süreniz sona erdi. Devam etmek için hesabınızı aktifleştirin."* koruma ekranı devreye girer. Yönetici verilerini görebilir ve tek tıkla hesabını aktifleştirebilir.

### 3. Yönetici Paneli (Admin Dashboard)
- Linear, Vercel ve Stripe Dashboard tasarım hissi: Koyu/Açık tema, ince gölgeler, skeleton yüklemeler ve bildirimler.
- **KPI Kartları:** Toplam Müşteri, Aktif Müşteri, Bugün Giriş Yapanlar, Aktif Antrenörler, Yaklaşan Üyelik Bitişleri, Bugünkü Antrenmanlar, Salondaki Anlık Kişi Sayısı.
- **İnteraktif Recharts Grafikleri:** Haftalık Turnike Giriş Sayısı, Aktif/Pasif Dağılımı, Aylık Yeni Üye Artışı ve Son Salon Aktiviteleri akışı.

### 4. Müşteri Sistemi & Özel Aktivasyon Kodu
- Admin yeni üye eklediğinde sistem benzersiz bir müşteri kodu üretir (Örn: `GYM-A7K92X`).
- Müşteri `/activate-code` ekranından kodunu girdiğinde salonun logosu, adı ve hoş geldiniz mesajı karşılar; üye kendi şifresini belirleyerek anında mobil portala erişir.

### 5. Mobil Öncelikli Müşteri Portalı (`/member`)
- Mobil uygulama deneyimi sunan alt gezinme çubuğu (Bottom Navigation).
- Günlük antrenman kartı, kalori ve makro besin hedefleri.
- **İnteraktif Su Takibi:** `+250 ml` ve `+500 ml` hızlı ekleme butonları ve dolum animasyonu.
- Vücut ölçüm özeti, antrenör notları ve hızlı turnike QR butonu.

### 6. İnteraktif Antrenman Programı & Dinlenme Sayacı
- Pazartesi, Salı, Çarşamba vb. split gün ayrımı.
- Hareket adı, set, tekrar, ağırlık, dinlenme süresi, antrenör notu ve video bağlantısı.
- **Canlı Antrenman Modu:** `[ TAMAMLANDI ✓ ]` ile hareketleri tamamlama, set arası geri sayım sayacı (Rest Timer) ve antrenman bittiğinde konfeti (`canvas-confetti`) kutlaması ve geçmiş kayıt logları.

### 7. Diyet & Beslenme Yönetimi
- Kahvaltı, Ara Öğünler, Öğle, Akşam ve Ek Öğün planlaması.
- Yiyecek, miktar, kalori, protein, karbonhidrat ve yağ değerleri.
- Üye yediklerini işaretledikçe dolan anlık kalori ve makro ilerleme barları.

### 8. Vücut Gelişim & Ölçüm Takibi
- Kilo, boy, yağ oranı, kas kütlesi, bel, göğüs, kol, bacak ve omuz ölçümleri.
- Tarihsel gelişim çizgisi grafiği ve form fotoğrafları desteği.

### 9. Canlı QR Turnike & Check-In İstasyonu (`/admin/check-in`)
- Kamera vizör simülasyonu ve hızlı kod okuma.
- **Anlık Doluluk Sayacı:** *"Şu anda salonda: 9 kişi"* canlı sayaç.
- Giriş / Çıkış turnike hareketlerinin tarih ve saat bazlı loglanması.

### 10. Salon Markalaştırması (Branding)
- Logo görseli, salon adı, kurumsal renk paleti (HEX / hazır şablonlar) ve iletişim bilgileri.
- Müşteri portalı ve üye kartları salonun belirlediği ana renkle dinamik olarak boyanır.

---

## 🛠️ Teknoloji Yığını

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts, Canvas-Confetti, QRCode.react.
- **Backend:** Next.js Route Handlers & Server Actions, Jose (JWT), Bcryptjs (Password Hashing).
- **Veritabanı & ORM:** SQLite (geliştirme ve sıfır-konfigürasyon demo için) / PostgreSQL uyumlu Prisma ORM.

---

## 🚀 Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Ortam Değişkenleri (.env)
Kök dizindeki `.env` dosyasını doğrulayın:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="gym_saas_super_secret_jwt_key_99812_secure_token"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Veritabanı Şeması ve Seed
Veritabanını oluşturmak ve zengin demo verilerini yüklemek için:
```bash
npx prisma db push
npm run seed
```

### 4. Uygulamayı Başlatın

Geliştirme modu:
```bash
npm run dev
```

Production build & çalıştırma:
```bash
npm run build
npm run start
```
Tarayıcınızda `http://localhost:3000` adresine gidin.

---

## 🔑 Hazır Demo Hesapları

Uygulama açılış sayfasında (`/`) ve giriş ekranında (`/login`) tek tıkla anında test edebileceğiniz butonlar bulunmaktadır:

| Rol | E-posta | Şifre | Açıklama |
| :--- | :--- | :--- | :--- |
| **Gym Admin** | `admin@fitzone.com` | `Password123!` | FitZone Pro Club yöneticisi (Aktif 7 günlük deneme, 5 gün kaldı) |
| **Antrenör** | `murat@fitzone.com` | `Password123!` | Murat Kaya (Vücut geliştirme başantrenörü) |
| **Müşteri** | `caner@gmail.com` | `Password123!` | Caner Erkin (Kod: `GYM-A7K92X`, aktif antrenman ve diyet sahibi) |
| **Müşteri 2** | `zeynep@gmail.com` | `Password123!` | Zeynep Kaya (Kod: `GYM-B3M81Y`, kadınlara özel sıkılaşma programı) |
| **Süresi Dolan Gym Admin** | `admin@apexfit.com` | `Password123!` | Apex Performance Studio (Deneme süresi dolmuş paywall senaryosu testi) |

