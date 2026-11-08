---
version: alpha
name: Ryvex Studio Web
description: ryvexstudio.com ürün vitrini ve stüdyo sitesi için görsel sistem.
brand: ./BRAND.md
colors:
  primary: "#1C1418"
  secondary: "#5E5459"
  tertiary: "#8E1B3B"
  tertiary-hover: "#74142F"
  neutral: "#F4F2F3"
  neutral-strong: "#EAE6E8"
  outline: "#E2DDE0"
  surface: "#FFFFFF"
  on-tertiary: "#FFFFFF"
  muted: "#8A8186"
  primary-dark: "#F2ECEE"
  secondary-dark: "#A99DA3"
  tertiary-dark: "#D9567A"
  tertiary-hover-dark: "#E57A97"
  neutral-dark: "#211A1D"
  neutral-strong-dark: "#2B2226"
  outline-dark: "#33292E"
  surface-dark: "#160F12"
  on-tertiary-dark: "#160F12"
  muted-dark: "#7A6F74"
typography:
  display:
    fontFamily: Geist
    fontSize: 6rem
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: -0.045em
  headline-xl:
    fontFamily: Geist
    fontSize: 3.5rem
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.035em
  headline-lg:
    fontFamily: Geist
    fontSize: 2.25rem
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Geist
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.015em
  title:
    fontFamily: Geist
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 1.0625rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Geist
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.3
  mono-sm:
    fontFamily: Geist Mono
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.4
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  3xl: 96px
  section: 160px
  section-mobile: 96px
  gutter: 24px
  margin-mobile: 20px
  margin-tablet: 40px
  margin-desktop: 64px
  content-max: 1240px
  measure: 64ch
rounded:
  sm: 8px
  md: 12px
  lg: 20px
  xl: 24px
  icon: 36px
  full: 999px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: 14px 22px
  button-primary-hover:
    backgroundColor: "{colors.tertiary-hover}"
    textColor: "{colors.on-tertiary}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: 13px 21px
  button-secondary-hover:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
  button-secondary-pressed:
    backgroundColor: "{colors.neutral-strong}"
    textColor: "{colors.primary}"
  link-inline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.tertiary}"
    typography: "{typography.body-md}"
  product-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.title}"
    rounded: "{rounded.icon}"
  product-label:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    typography: "{typography.body-sm}"
  segmented-filter:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: 4px
  segmented-filter-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
  product-facts:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xl}"
    padding: 32px
  screenshot-strip:
    backgroundColor: "{colors.neutral}"
    rounded: "{rounded.xl}"
    padding: 40px
  header:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    height: 72px
  footer:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    typography: "{typography.body-sm}"
    padding: 64px
  divider:
    backgroundColor: "{colors.outline}"
    height: 1px
  manifesto-word:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
  manifesto-word-lit:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
  closing-band:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    padding: 96px
  button-primary-dark:
    backgroundColor: "{colors.tertiary-dark}"
    textColor: "{colors.on-tertiary-dark}"
  button-primary-hover-dark:
    backgroundColor: "{colors.tertiary-hover-dark}"
    textColor: "{colors.on-tertiary-dark}"
  button-secondary-hover-dark:
    backgroundColor: "{colors.neutral-dark}"
    textColor: "{colors.primary-dark}"
  button-secondary-pressed-dark:
    backgroundColor: "{colors.neutral-strong-dark}"
    textColor: "{colors.primary-dark}"
  body-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.primary-dark}"
  caption-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.secondary-dark}"
    typography: "{typography.body-sm}"
  product-facts-dark:
    backgroundColor: "{colors.neutral-dark}"
    textColor: "{colors.primary-dark}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xl}"
    padding: 32px
  divider-dark:
    backgroundColor: "{colors.outline-dark}"
    height: 1px
  manifesto-word-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.muted-dark}"
---

# Ryvex Studio Web

## Overview

Bu tasarım sistemi, [Ryvex Studio markasını](./BRAND.md) ryvexstudio.com için
uygular: ana sayfa, ürünler, ürün detay sayfaları, stüdyo, iletişim, basın kiti
ve her ürünün gizlilik ve destek sayfaları.

Temel fikir: **bir stüdyonun sergi duvarı.** Site bir yazılım ajansı sayfası
değil, beyaz bir duvara asılmış eserlerin sergisidir. Ürün ikonları duvardaki
çerçeveli eserlerdir. Her birinin altında, müzelerdeki gibi küçük bir künye
durur: ürünün adı, türü ve platformu. Ziyaretçi bir şey satın almaya değil,
bir koleksiyonu gezmeye gelmiş gibi hissetmelidir.

Kitle çoğunlukla Türkiye'de, telefondan gezen ve mağazaya geçmeden önce
"bunlar ciddi mi" diye bakan kullanıcılardır. Site bu soruya önce düzenle,
sonra açık bilgiyle cevap verir: her ürünün kim tarafından yapıldığı, nerede
indirileceği, gizlilik politikası ve destek adresi her zaman bir tık uzaktadır.

Sitenin cesur anları ürünlerin etrafında toplanır: hero'da süzülen ikonlar,
dokunuşa cevap veren sergi duvarı, kaydırdıkça ekran değiştiren vitrin ve bir
ikonun ürün sayfasına uçtuğu geçiş. Metinler, menüler ve yasal sayfalar sakin
ve sessiz kalır. Vişne sayfa başına bir ya da iki yerde görünür. Renk ve enerji
ürünlerin kendi ikonlarından gelir.

Varsayılan tema aydınlıktır. Karanlık tema, aydınlığın birebir karşılığıdır;
ayrı bir tasarım değildir.

## Colors

Temiz beyaz zemin, vişne izli koyu mürekkep ve tek derin vurgu. Değerler
markanın onaylı renklerinden birebir alınmıştır; rol adları bu yüzeye özgüdür.

| Rol | Marka rengi | Değer | Kaynak |
|---|---|---|---|
| `surface` | Beyaz (zorunlu) | `#FFFFFF` | Birebir |
| `primary` | Mürekkep (zorunlu) | `#1C1418` | Birebir |
| `tertiary` | Vişne (zorunlu) | `#8E1B3B` | Birebir |
| `tertiary-hover` | yok | `#74142F` | Vişne'den türetildi |
| `secondary` | yok | `#5E5459` | Mürekkep'ten türetildi |
| `neutral` | yok | `#F4F2F3` | Mürekkep'ten türetildi |
| `neutral-strong` | yok | `#EAE6E8` | Mürekkep'ten türetildi |
| `outline` | yok | `#E2DDE0` | Mürekkep'ten türetildi |
| `on-tertiary` | Beyaz | `#FFFFFF` | Birebir |

- **Surface, Beyaz (#FFFFFF):** Sayfa zemini. Krem ya da kırık beyaza
  çevrilmez.
- **Primary, Mürekkep (#1C1418):** Tüm başlıklar ve metinler. Saf siyah
  kullanılmaz.
- **Secondary (#5E5459):** İkincil metinler, künyeler, açıklamalar. Beyaz
  üzerinde yaklaşık 7:1 kontrast verir.
- **Tertiary, Vişne (#8E1B3B):** Birincil buton, metin içi linkler, logo
  sembolü ve klavye odak halkası. Başka hiçbir yerde kullanılmaz. Beyaz
  üzerinde yaklaşık 9:1 kontrast verir.
- **Neutral (#F4F2F3) ve Neutral strong (#EAE6E8):** Ürün künye kutusu, ekran
  görüntüsü şeridi, filtre zemini ve footer. Vişneye doğru çok hafif ısınmış bir
  gri; saf gri değil.
- **Outline (#E2DDE0):** Ayırıcı çizgiler ve ikincil buton kenarlığı.

### Karanlık tema

Karanlık tema, her rolün karşılığını taşır. Zemin Mürekkep'ten türetilir; saf
siyah kullanılmaz.

| Rol | Değer | Kaynak |
|---|---|---|
| `surface-dark` | `#160F12` | Mürekkep'ten türetildi |
| `neutral-dark` | `#211A1D` | Mürekkep'ten türetildi |
| `neutral-strong-dark` | `#2B2226` | Mürekkep'ten türetildi |
| `outline-dark` | `#33292E` | Mürekkep'ten türetildi |
| `primary-dark` | `#F2ECEE` | Beyaz'dan türetildi |
| `secondary-dark` | `#A99DA3` | Mürekkep'ten türetildi |
| `tertiary-dark` | `#D9567A` | Vişne'den açıltıldı |
| `tertiary-hover-dark` | `#E57A97` | Vişne'den açıltıldı |
| `on-tertiary-dark` | `#160F12` | Mürekkep'ten türetildi |

Koyu zeminde derin vişne okunmaz. Bu yüzden karanlık temada vurgu, aynı tonun
açık hâlidir (`#D9567A`). Bu bir yeniden tanımlama değil, aynı rengin koyu zemine
uyarlanmasıdır. Logo sembolü karanlık temada da `#8E1B3B` kalır, çünkü kendi
dolgusu içinde durur.

### Ürün renkleri

Her ürün kendi rengini getirir. Ürün rengi yalnızca o ürünün ikonunda ve detay
sayfasındaki ekran görüntüsü şeridinin zemininde (ürün renginin beyazla yüzde 8
karışımı) kullanılır. Ürün rengi asla buton, link ya da başlık rengi olmaz;
o roller markaya aittir.

### Tema davranışı

İlk ziyarette tema aydınlıktır. Header'daki tema düğmesiyle karanlığa geçilir ve
tercih tarayıcıda saklanır. Tema, sayfa çizilmeden önce uygulanır; yanlış temada
yanıp sönme olmaz.

## Typography

Tek aile: Geist. Markanın sesi başlıkta da metinde de aynıdır; hiyerarşi boyut,
ağırlık ve boşlukla kurulur.

- **Display (6rem):** Yalnızca ana sayfa başlığı. Sayfada bir kez. Mobilde
  3.25rem'e iner. Sıkı satır aralığı ve negatif harf aralığı, başlığı bir logo
  gibi okunur kılar.
- **Headline xl (3.5rem):** Alt sayfaların başlığı ve ürün adı. Mobilde 2.5rem.
- **Headline lg (2.25rem):** Bölüm başlıkları.
- **Headline md (1.5rem):** Alt bölüm başlıkları.
- **Title (1.125rem):** Sergi duvarındaki ürün adları, liste başlıkları.
- **Body lg (1.25rem):** Giriş paragrafları ve ürün tek cümlelik tanıtımları.
- **Body md (1.0625rem):** Tüm akan metin. Satır uzunluğu en fazla 64 karakter.
- **Body sm (0.9375rem):** Künyeler, footer, yardımcı metin.
- **Label (0.875rem, 500):** Buton, navigasyon ve filtre metinleri. Normal yazım,
  büyük harf yok.
- **Mono sm (Geist Mono):** Yalnızca sürüm numaraları ve sürüm notu tarihleri.
  Künyelerde, etiketlerde ya da süs amacıyla kullanılmaz.

Sayfa dili `tr` olarak işaretlenir; böylece "i/İ" ve "ı/I" dönüşümleri doğru
yapılır. Tipografide büyük harf dönüşümü kullanılmaz.

## Layout

12 sütunlu ızgara, içerik en fazla 1240px genişlikte, sütun arası 24px. Kenar
boşlukları mobilde 20px, tablette 40px, masaüstünde 64px. Kırılma noktaları
640px, 960px ve 1280px.

Hizalama soldandır. Ortalanmış metin yalnızca 404 sayfası gibi tek mesajlı
ekranlarda kullanılır.

Bölümler arasında masaüstünde 160px, mobilde 96px boşluk vardır. Hiyerarşi önce
boşlukla kurulur.

### Ana sayfa

```text
[R] Ryvex Studio                  Ürünler   Stüdyo   İletişim   [tema]
----------------------------------------------------------------------
Her ekranda                          ┌──┐   ┌──┐   ← süzülen ikonlar
aynı özen.                         ┌──┐   ┌───┐      (5 sütun, yalnızca
                                         ┌──┐  ┌──┐     masaüstü)
Mobil uygulamalar, oyunlar ve web projeleri.   (body-lg, 7 sütun)
[Ürünleri keşfet]  [Stüdyoyu tanı]

 ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐    ← sergi duvarı
 │ikon│  │ikon│  │ikon│  │ikon│  │ikon│  │ikon│
 └────┘  └────┘  └────┘  └────┘  └────┘  └────┘
 Ad      Ad      Ad      Ad      Ad      Ad        ← künye: ad
 Oyun    Uyg.    Web     Oyun    Uyg.    Uyg.      ← künye: tür, platform

Ne yapıyoruz
┌ ikonlar ┐    ┌ ikonlar ┐    ┌ ikonlar ┐        ← 3 sütun, 4:3 panelde o türün ikonları
Uygulamalar    Oyunlar        Web
link           link           link               ← filtreli ürün listesi

█████████████████ koyu vitrin bandı (kenardan kenara) █████████████████
█  Öne çıkanlar                                                       █
█  ┌──────┐ sabit sahne          ■ Oyun, iOS ve Android               █
█  │ikon  │ (ekran görüntüsü     Kelimo                               █
█  └──────┘  varsa cihaz)        Her gün yeni bir kelime bulmacası.   █
████████████████████████████████████████████████████████████████████████

Nasıl çalışıyoruz
●───────────●───────────●───────────●───────────●   ← 5 adım, numaralı
01 Fikir    02 Tasarım  03 Geliştirme 04 Yayın  05 Destek

Stüdyo hakkında tek cümle

Footer
```

Ana sayfa sırası: hero, sergi duvarı, tek cümlelik manifesto, Ne yapıyoruz
(türün ürün ikonları ve ad; açıklama yok), koyu vitrin bandı, Günlükten ve
vişne kapanış bandı. Kural: bir bölüm bir şey söyler; açıklama gerekiyorsa o
bilgi kendi sayfasında durur. Sitede kişi fotoğrafı, stok fotoğraf ve yapay zekâ ile üretilmiş görsel kullanılmaz.

Ana sayfa beyaz bölümlerle koyu vitrin bandı arasında gidip gelir; bant,
sayfanın ortasında ritmi değiştiren tek koyu alandır. "Nasıl çalışıyoruz"
gerçek bir sıra olduğu için numaralıdır; vişne noktalar adımları çizgiye bağlar.

Sergi duvarında ikonlar masaüstünde 6, tablette 3, mobilde 2 sütunlu bir
ızgaraya, eşit aralıklarla asılır. İkon en fazla 160px'tir ve sütun genişliğine
göre küçülür. Ürün sayısı sütun sayısını aşınca duvar alt satıra geçer;
kaydırmalı karusel kullanılmaz.

### Ürünler sayfası

Başlık, altında tür filtresi (Tümü, Uygulamalar, Oyunlar, Web) ve aynı sergi
duvarı. Filtre değiştiğinde yalnızca görünen ürünler değişir; sayfa yeniden
yüklenmez ve adres çubuğu güncellenir (`/urunler?tur=oyun`).

### Ürün detay sayfası

```text
[ikon 128px]  Ürün adı                              (headline-xl)
              Tek cümlelik tanıtım                  (body-lg)
              [App Store]  [Google Play]  [Web'de aç]

┌──────────────────────────────────────────────────────────┐
│  ekran   ekran   ekran   ekran   →  (yatay kaydırma)     │ ← ürün rengi %8
└──────────────────────────────────────────────────────────┘

Ne yapar (kısa paragraflar)          ┌ Ürün bilgileri ─────┐
                                     │ Geliştirici  Ryvex  │
                                     │ Tür          Oyun   │
                                     │ Platform     iOS    │
                                     │ Sürüm        1.2.0  │
                                     │ Gizlilik  · Destek  │
                                     └─────────────────────┘
```

### Gizlilik ve destek sayfaları

Tek sütun, 64 karakter satır uzunluğu, başlıklar arasında net boşluk. Sayfanın
üstünde ürün ikonu, ürün adı ve son güncelleme tarihi bulunur. Bu sayfalar
mağaza inceleme ekipleri tarafından okunur; süsleme yapılmaz.

## Elevation & Depth

Arayüz öğelerinde gölge yoktur. Kartlar, butonlar, header ve menüler düzdür.
Derinlik yalnızca zemin tonu farkıyla (`surface` → `neutral` → `neutral-strong`)
kurulur.

Koyu vitrin bandı, `data-theme="dark"` ile karanlık tema değerlerini yalnızca
kendi içine uygular; böylece aydınlık sayfanın ortasında koyu bir sahne
oluşur. Sayfanın kendisi karanlık temadayken bant bir kademe açılır
(`#241C20`), böylece yine ayrışır. Bant, aktif ürünün renginin yüzde 7'lik
tonunu alır; sayfa zemini ve header bundan etkilenmez.

Bu yüzden bileşen içi stillerde `--color-*` yerine doğrudan `--rv-*`
değişkenleri kullanılır: `--color-*` sayfanın kökünde çözümlenir ve bölüm
düzeyindeki temayı takip etmez.

Tek istisna gerçek nesnelerdir: cihaz çerçevesi içindeki ekran görüntüleri ve
sergi duvarındaki ürün ikonları, duvara asılmış bir nesne gibi tek ve yumuşak
bir gölge taşır: `0 24px 48px -24px rgba(28, 20, 24, 0.28)`. Karanlık temada bu
gölge kaldırılır, yerine `outline-dark` renginde 1px kenar kullanılır.

Header sabit kalır; sayfa kaydırılınca altında 1px `outline` çizgisi belirir.
Bulanık cam efekti kullanılmaz.

## Shapes

Köşe yarıçapı hiyerarşiyi taşır; her şeye aynı yarıçap verilmez.

- **Ürün ikonları:** Kenar uzunluğunun yüzde 22,5'i, uygulama ikonu biçimi.
  `rounded.icon` değeri (36px) 160px'lik ikon içindir; diğer boyutlarda oran
  korunur.
  Logo sembolü de aynı biçimdedir. Bu, markanın "çerçeve" fikrinin sitedeki
  karşılığıdır.
- **Butonlar, filtreler, mağaza rozetleri:** Tam yuvarlak uçlar (999px).
- **Büyük bloklar** (künye kutusu, ekran görüntüsü şeridi): 24px.
- **Fotoğraflar:** 20px.
- **Form alanları:** 12px.
- **Küçük öğeler** (tooltip, bildirim): 8px.

## Components

- **Header:** 72px yükseklik. Solda logo (sembol + "Ryvex Studio"), sağda
  navigasyon, dil seçici (TR / EN) ve tema düğmesi. Mobilde navigasyon tam ekran
  bir menüye dönüşür; logo her zaman kelime logosuyla birlikte görünür.
- **Tema düğmesi:** Güneş ve ay ikonu arasında geçen tek düğme. Erişilebilir
  adı mevcut duruma göre "Karanlık temaya geç" ya da "Aydınlık temaya geç".
- **Birincil buton:** Vişne zemin, beyaz metin, tam yuvarlak. Üzerine gelince
  zemin `tertiary-hover` olur. Sayfa başına en fazla bir tane.
- **İkincil buton:** Beyaz zemin, `outline` kenarlık, Mürekkep metin. Üzerine
  gelince zemin `neutral`, basılıyken `neutral-strong` olur.
- **Metin içi link:** Vişne metin, 1px alt çizgi, alt çizgi metinden 3px uzakta.
  Üzerine gelince alt çizgi 2px olur.
- **Ürün kutucuğu (sergi duvarı):** İkon, altında ürün adı (title) ve künye
  (body-sm, `secondary`): tür ve platform, virgülle ayrılmış. Bütün kutucuk tek
  bir link. Üzerine gelince yalnızca ürün adının altı çizilir; ikon büyümez,
  kart kalkmaz.
- **Tür filtresi:** `neutral` zeminli tek bir hap; içinde seçenekler. Seçili
  seçenek beyaz zemin ve Mürekkep metin alır. Klavyeyle ok tuşlarıyla gezilir.
- **Mağaza rozetleri:** Apple ve Google'ın resmi rozetleri, kendi kurallarına
  uygun boyut ve boşlukla. Renkleri değiştirilmez. Aydınlık temada siyah,
  karanlık temada beyaz kenarlıklı siyah sürümleri kullanılır.
- **Ürün bilgileri kutusu:** `neutral` zemin, 24px köşe. Etiket ve değer iki
  sütunda; satırlar arasında `outline` çizgi. Gizlilik ve Destek linkleri her
  zaman bu kutuda bulunur.
- **Ekran görüntüsü şeridi:** Ürün renginin yüzde 8'lik tonu üzerinde, yatay
  kaydırmalı. Görüntüler cihaz oranında, 20px köşeli.
- **Footer:** `neutral` zemin. Solda logo ve slogan; sağda üç kolon: Ürünler,
  Stüdyo, Yasal. En altta "© 2026 Ryvex Studio" ve dil seçici.
- **Odak halkası:** Tüm etkileşimli öğelerde 2px Vişne halka, öğeden 2px
  uzakta. Karanlık temada `tertiary-dark`. Hiçbir zaman kaldırılmaz.

### Hareket

Hareket ürünleri sahneye taşımak için vardır, süs için değil. Hepsi
`cubic-bezier(0.2, 0.7, 0.2, 1)` eğrisini kullanır ve `prefers-reduced-motion`
açıksa kapatılır.

- **Hero açılışı:** Başlığın her satırı kendi maskesinin içinden yükselir
  (900ms, satırlar arası 110ms). Ardından giriş metni ve butonlar 12px aşağıdan
  yerine oturur. Sağda ürün ikonları elle yerleştirilmiş bir kompozisyonda
  belirir ve her biri kendi ritminde (6,5-10 saniye) birkaç piksel yukarı aşağı
  süzülür. Mobilde bu kompozisyon gösterilmez.
- **Sergi duvarı:** Duvar ekrana girdiğinde ikonlar soldan sağa, 80ms arayla
  asılır; bu bir kez olur. Fareyle üzerine gelinen ikon 6px kalkar, gölgesi
  derinleşir ve imleci takip ederek en fazla 8 derece eğilir. Bu sırada sayfa
  zemini o ürünün renginin yüzde 6'lık tonuna geçer (500ms). Dokunmatik
  cihazlarda eğim yoktur.
- **Kaydırmalı vitrin:** Öne çıkan ürünler (`featured`) için. Masaüstünde solda
  sabit bir cihaz durur; sağdaki metin adımları kaydırıldıkça cihazın ekranı
  çapraz geçişle değişir. Web ürünlerinde cihaz telefondan tarayıcı penceresine
  dönüşür (700ms). Aktif olmayan adımların başlığı ikincil renge çekilir; sayfa
  zemini aktif ürünün tonunu alır. Mobilde cihaz her adımın içinde durağandır.
- **Sayfa geçişleri:** Sayfalar arası geçiş 260ms'lik çapraz geçiştir. Bir ürün
  ikonu, sergi duvarından ürün sayfasına ve oradan gizlilik ile destek
  sayfalarına aynı ikon olarak uçar (520ms).
- **Hero derinliği ve iniş:** Hero'daki ikonlar imleci derinliklerine göre
  takip eder (yakındakiler en fazla 28px, uzaktakiler daha az). Sayfa aşağı
  kaydırıldıkça her ikon, sergi duvarındaki kendi yerine uçar, boyutu duvar
  ikonuna eşitlenir ve süzülme hareketi sıfıra iner; duvara vardığında duvar
  ikonu onun yerini alır. Künyeler inişin son yüzde 30'unda belirir. Mobilde ve
  hareket azaltma açıkken duvar normal biçimde asılır.
- **Manifesto:** Kelimeler okundukça `muted` tonundan Mürekkep'e dolar
  (280ms). `muted` büyük metinde 3:1 kontrastı korur; dolmamış metin de
  okunur kalır.
- **Tema geçişi:** Yeni tema, tema düğmesinin bulunduğu noktadan başlayan bir
  daireyle sayfaya yayılır (700ms). Desteklemeyen tarayıcılarda tema anında
  değişir.
- **Mıknatıslı butonlar:** Sayfanın ana çağrısı olan butonlar (`data-magnetic`)
  imleç 40px yakına geldiğinde ona doğru en fazla 8px kayar (250ms). Yalnızca
  fare gibi hassas imleçlerde çalışır.
- **404:** Ürün ikonları bir kutunun içine düşer, birbirine çarpar ve fareyle
  itilebilir. Mesaj ve ana sayfa linki bu oyundan bağımsızdır; hareket azaltma
  açıkken ikonlar kutunun dibinde durağan durur.
- **Kullanıcı eylemleri:** Buton zemin geçişleri 150ms, tema değişimi 200ms,
  mobil menü açılışı 240ms.

### İkonlar

Arayüz ikonları Lucide setinden, 1.5px çizgi kalınlığında, 20px boyutunda.
Dolgulu ikon kullanılmaz.

### Görseller

Sitede yalnızca ürünlerin kendi görselleri kullanılır: ürün ikonları ve gerçek
ürünlerden alınmış ekran görüntüleri. Stok fotoğraf, yapay zekâ ile üretilmiş
görsel, maket ya da temsili arayüz çizimi kullanılmaz.

Ekran görüntüleri gerçek bir telefonda ya da emülatörde, dikey, Türkçe ve aydınlık
temada alınır; durum çubuğu gösteri kipiyle temizlenir (saat 09.41, pil dolu,
bildirim yok). Kişisel dosya adı, fotoğraf ya da gerçek kişi adı görünmez.

Uygulama ve oyun görüntüleri `PhoneFrame` bileşenindeki telefon çerçevesinde
gösterilir: koyu gövde, ince metal kenar, yan tuş ve ortada delik kamera. Çerçeve
CSS ile çizilir; hazır maket görseli kullanılmaz. Web ürünleri tarayıcı
çerçevesinde durur.

Bir ürünün ekran görüntüsü yoksa çerçeve gösterilmez; onun yerine ürünün kendi
ikonu, ürünün renginde sade bir zemin üzerinde büyük boyda durur. Ekran görüntüsü
eklendiğinde ürün sayfası ve vitrin bandı onu kendiliğinden çerçevede gösterir.

## Do's and Don'ts

- **Do** vişneyi sayfa başına bir ya da iki yerde kullan. Nadir olduğu için
  anlam taşır.
- **Do** hiyerarşiyi önce boşlukla, sonra boyutla kur.
- **Do** gizlilik ve destek linklerini her ürün sayfasında aynı yerde tut.
- **Do** her ürünün kendi rengini yalnızca kendi ikonunda, şeridinde, vitrin
  ekranında ve sayfa zemininin çok hafif tonunda kullan.
- **Do** iki temayı da aynı özenle tasarla; karanlık tema sonradan eklenmiş bir
  filtre gibi görünmesin.
- **Don't** zemini kreme ya da kırık beyaza çevirme.
- **Don't** başlıkların üstüne büyük harfli küçük etiketler koyma.
- **Don't** başlıkta tek bir kelimeyi renklendirme, italik ya da kalın yapma.
- **Don't** buton ve link metinlerinin sonuna ok işareti ekleme.
- **Don't** her bölüme kayarak belirme animasyonu koyma. Hareket yalnızca
  ürünlerin etrafında ve kullanıcının eylemine cevap olarak kullanılır.
- **Don't** soluklaştırmak için metne saydamlık verme; kontrast düşer. Renk
  tonuyla geri çekil.
- **Don't** içerikleri birbirinin aynısı, gölgeli, aynı köşeli kartlara bölme.
- **Don't** süs amaçlı gradyan, parıltı ya da bulanık cam efekti kullanma.
- **Don't** sıralı olmayan içerikte numara kullanma (01, 02, 03).
- **Don't** Geist Mono'yu künye ya da etiket süsü olarak kullanma.
- **Don't** ürün rengini buton, link ya da başlık rengi yapma.
- **Don't** mağaza rozetlerini yeniden çizme ya da renklendirme.
