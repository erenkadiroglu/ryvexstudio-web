---
name: "PerSayar"
type: app
status: coming-soon
tagline:
  tr: "Okey ıstakanızı kamerayla tarayın; perlerinizi ve elinizi açıp açamayacağınızı anında görün."
  en: "Scan your Okey rack with the camera and instantly see your sets and whether you can open your hand."
color: "#9A5A2B"
icon: ../../assets/products/persayar.png
screenshots:
  - src: ../../assets/screenshots/persayar/01-seri.png
    alt: { tr: "Seri dizilmiş ıstaka: 103 puan, el açılabilir", en: "Rack sorted into runs: 103 points, the hand can open" }
  - src: ../../assets/screenshots/persayar/02-cift.png
    alt: { tr: "Çift dizilmiş ıstaka: 6 çift, el açılabilir", en: "Rack sorted into pairs: 6 pairs, the hand can open" }
  - src: ../../assets/screenshots/persayar/03-baraj.png
    alt: { tr: "Baraj Ayarları: seri ve çift barajı", en: "Threshold settings for runs and pairs" }
platforms: [android]
specs:
  offline: true
supportEmail: "destek@ryvexstudio.com"
privacyUpdated: 2026-11-08
privacy:
  accountRequired: false
  tracking: false
  dataCollected:
    - data: { tr: "Istaka fotoğrafı (kamerayla çektiğiniz ya da galeriden seçtiğiniz)", en: "Rack photo (taken with the camera or chosen from your gallery)" }
      purpose: { tr: "Taşları tanımak. Fotoğraf telefonda işlenir, hiçbir yere gönderilmez ve uygulama tarafından saklanmaz.", en: "Recognising the tiles. The photo is processed on the phone, never sent anywhere and not kept by the app." }
      storage: device
    - data: { tr: "Istakadaki taşlar, okey, gösterge ve baraj ayarları", en: "Tiles on the rack, the okey, the indicator and threshold settings" }
      purpose: { tr: "Perleri denetlemek ve puanı hesaplamak", en: "Checking sets and calculating the score" }
      storage: device
faq:
  - q: { tr: "Fotoğraflarım bir sunucuya gönderiliyor mu?", en: "Are my photos sent to a server?" }
    a: { tr: "Hayır. Taş tanıma tamamen telefonunuzda yapılır; fotoğraf hiçbir yere gönderilmez.", en: "No. Tile recognition happens entirely on your phone; the photo is never sent anywhere." }
  - q: { tr: "İnternet bağlantısı gerekiyor mu?", en: "Do I need an internet connection?" }
    a: { tr: "Hayır. Tarama ve hesaplama internetsiz çalışır.", en: "No. Scanning and scoring work offline." }
  - q: { tr: "Bir taş yanlış tanınırsa ne yapabilirim?", en: "What if a tile is recognised wrongly?" }
    a: { tr: "Taşa dokunup düzeltebilir ya da Manuel Taş Ekle ile elle ekleyebilirsiniz.", en: "Tap the tile to correct it, or add it by hand with Add tile manually." }
  - q: { tr: "Hangi kuralları destekliyor?", en: "Which rules does it support?" }
    a: { tr: "Seri ve grup perleri ile çift gitmeyi denetler. Seri barajını (örneğin 101) ve çift barajını kendiniz ayarlarsınız.", en: "It checks runs, groups and pairs. You set the run threshold (for example 101) and the pairs threshold yourself." }
aboutEn: |
  PerSayar recognises the tiles on your Okey rack from a single photo. Take a picture with the camera or pick one from your gallery; the app finds your sets and pairs and shows whether you can open your hand.

  Recognition happens on your phone, with no server and no internet connection.
features:
  - title: { tr: "Akıllı tarama", en: "Smart scan" }
    text: { tr: "Istakayı kamerayla çekin ya da galeriden seçin; taşlar saniyeler içinde tanınır.", en: "Take a photo of your rack or pick one from the gallery; the tiles are recognised in seconds." }
    shot: 0
  - title: { tr: "Per ve çift denetimi", en: "Sets and pairs" }
    text: { tr: "Seri ve grup perleri ile çiftleri kurallara göre bulur.", en: "Finds runs, groups and pairs according to the rules." }
    shot: 1
  - title: { tr: "El açabilir mi?", en: "Can you open?" }
    text: { tr: "Elinizin barajı geçip geçmediğini anında gösterir.", en: "Shows at once whether your hand passes the threshold." }
    shot: 0
  - title: { tr: "Baraj ayarları", en: "Thresholds" }
    text: { tr: "Seri barajını (101 ya da yan) ve çift barajını masaya göre ayarlayın.", en: "Set the run threshold (101 or more) and the pairs threshold for your table." }
    shot: 2
  - title: { tr: "Okey ve gösterge", en: "Okey and indicator" }
    text: { tr: "Okey taşını seçin; hesaplar ona göre yapılır.", en: "Choose the okey tile and every calculation follows it." }
    shot: 0
  - title: { tr: "Telefonda çalışır", en: "Runs on your phone" }
    text: { tr: "Tanıma cihazda yapılır; internet ve sunucu gerekmez.", en: "Recognition runs on the device, with no internet or server." }
    shot: 1
featured: true
order: 30
---

PerSayar, Okey ıstakanızdaki taşları tek bir fotoğraftan tanır. Istakayı kamerayla çekin ya da galeriden seçin; uygulama perlerinizi ve çiftlerinizi bulur, elinizi açıp açamayacağınızı gösterir.

Tanıma telefonunuzda yapılır; sunucu ve internet bağlantısı gerekmez.
