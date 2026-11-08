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

## Proje yapısı

```text
src/
├── components/   Ortak arayüz bileşenleri
├── config/       Site genel ayarları
├── content/      Ürün içerikleri (her ürün bir dosya)
├── i18n/         Türkçe ve İngilizce arayüz metinleri
├── layouts/      Sayfa düzenleri
├── pages/        Sayfalar ve yönlendirme
└── styles/       Tasarım değerleri ve genel stiller
```

## Marka ve tasarım

- [BRAND.md](./BRAND.md): marka stratejisi, ses tonu ve onaylı görsel temeller.
- [DESIGN.md](./DESIGN.md): sitenin tasarım sistemi.
