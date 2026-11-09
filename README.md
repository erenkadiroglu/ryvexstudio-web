# Ryvex Studio

Ryvex Studio'nun resmi web sitesi: [ryvexstudio.com](https://ryvexstudio.com)

Mobil uygulamalar, oyunlar ve web projeleri tek imza altında.

## Teknolojiler

- [Astro](https://astro.build) ve React adaları
- TypeScript
- Tailwind CSS
- Geist ve Geist Mono yazı tipleri

## Geliştirme

Node.js 22.23.4 veya üzeri gerekir.

```bash
npm install
npm run dev
```

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusunu başlatır |
| `npm run build` | Üretim derlemesini `dist/` klasörüne çıkarır |
| `npm run preview` | Derlenmiş siteyi yerelde gösterir |
| `npm run check` | Astro ve TypeScript tip kontrolü |
| `npm run format` | Kodu Prettier ile biçimlendirir |
| `npm run test` | Erişilebilirlik, bağlantı ve panel testleri (Playwright) |

## İçerik paneli

Ürünler, Günlük yazıları ve site ayarları `/panel` adresindeki panelden düzenlenir (Sveltia CMS,
MIT lisanslı, sürümü `package.json`'da sabit).

- **Yerelde:** `npm run dev` ile siteyi açın, Chrome ya da Edge'de `http://localhost:4321/panel`
  adresine gidin ve **Yerel Repo ile Çalış** ile proje klasörünü seçin. Değişiklikler doğrudan
  dosyalara yazılır; ardından her zamanki gibi commit'lenir.
- **Yayında:** `https://ryvexstudio.com/panel` adresinde GitHub erişim token'ıyla giriş yapılır.
  Her kayıt, giriş yapan hesabın adıyla `main`'e bir commit olur ve site yeniden derlenir.
- **Alanlar:** `src/panel/config.ts`. İçerik şeması (`src/content.config.ts`) değiştiğinde bu
  dosya da aynı commit'te güncellenir; `tests/panel.spec.ts`, içerikte kullanılan her alanın
  panelde tanımlı olduğunu denetler.
- **Ayarlar:** İletişim adresleri `src/config/contact.json`, bağlantılar
  `src/config/integrations.json` dosyasındadır; panelden de düzenlenir.

## Proje yapısı

```text
src/
├── components/   Ortak arayüz bileşenleri
├── config/       Site genel ayarları (iletişim ve bağlantılar panelden düzenlenir)
├── content/      Ürün içerikleri (her ürün bir dosya)
├── i18n/         Türkçe ve İngilizce arayüz metinleri
├── layouts/      Sayfa düzenleri
├── pages/        Sayfalar ve yönlendirme
├── panel/        İçerik panelinin alan tanımları
└── styles/       Tasarım değerleri ve genel stiller
```

## Marka ve tasarım

- [BRAND.md](./BRAND.md): marka stratejisi, ses tonu ve onaylı görsel temeller.
- [DESIGN.md](./DESIGN.md): sitenin tasarım sistemi.
