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
supportEmail: "support@ryvexstudio.com"
privacyUpdated: 2026-11-20
privacy:
  accountRequired: false
  tracking: false
  dataCollected:
    - data: { tr: "Istaka fotoğrafı (kamerayla çektiğiniz ya da galeriden seçtiğiniz)", en: "Rack photo (taken with the camera or chosen from your gallery)" }
      purpose: { tr: "Taşları tanımak. Fotoğraf telefonda işlenir, hiçbir yere gönderilmez ve uygulama tarafından saklanmaz.", en: "Recognising the tiles. The photo is processed on the phone, never sent anywhere and not kept by the app." }
      storage: device
    - data: { tr: "Istakadaki taşlar, okey, gösterge ve baraj ayarları", en: "Tiles on the rack, the okey, the indicator and threshold settings" }
      purpose: { tr: "Perleri denetlemek ve puanı hesaplamak. Yalnızca uygulama açıkken telefonun belleğinde durur; uygulama kapanınca silinir, hiçbir yere kaydedilmez.", en: "Checking sets and calculating the score. Kept only in the phone's memory while the app is open; erased when the app closes and never saved anywhere." }
      storage: device
faq:
  - q: { tr: "Fotoğraflarım bir sunucuya gönderiliyor mu?", en: "Are my photos sent to a server?" }
    a: { tr: "Hayır. Taş tanıma tamamen telefonunuzda yapılır; fotoğraf hiçbir yere gönderilmez.", en: "No. Tile recognition happens entirely on your phone; the photo is never sent anywhere." }
  - q: { tr: "İnternet bağlantısı gerekiyor mu?", en: "Do I need an internet connection?" }
    a: { tr: "Hayır. Tarama ve hesaplama internetsiz çalışır.", en: "No. Scanning and scoring work offline." }
  - q: { tr: "Uygulama hangi izinleri istiyor?", en: "Which permissions does the app ask for?" }
    a: { tr: "Yalnızca kamera izni: ıstakanızı taramak için. Galeriden fotoğraf seçmek Android'in kendi fotoğraf seçicisiyle yapılır, bunun için depolama ya da medya izni istenmez. Uygulama internet izni istemez; mikrofon, konum ve rehbere erişmez.", en: "Only the camera, to scan your rack. Picking a photo from the gallery uses Android's own photo picker, so no storage or media permission is asked for. The app does not ask for internet access and does not use the microphone, location or contacts." }
  - q: { tr: "Kamera iznini reddedersem ne olur?", en: "What happens if I deny the camera permission?" }
    a: { tr: "Galeriden bir ıstaka fotoğrafı seçebilir ya da taşları Manuel Giriş ile elle ekleyebilirsiniz. İzni sonradan Ayarlar › Uygulamalar › PerSayar › İzinler'den açabilirsiniz.", en: "You can pick a rack photo from your gallery or add the tiles by hand with Manual entry. You can turn the permission on later in Settings › Apps › PerSayar › Permissions." }
  - q: { tr: "Verilerimi nasıl silerim?", en: "How do I delete my data?" }
    a: { tr: "Silinecek bir veri yok: uygulama fotoğraf, ıstaka ya da ayar saklamaz, hesap da istemez. Tarama için çekilen fotoğraf işlem bitince geçici klasörde kalabilir; uygulamayı kaldırmak ya da Ayarlar › Uygulamalar › PerSayar › Depolama › Önbelleği temizle bunu da siler.", en: "There is nothing to delete: the app keeps no photos, racks or settings and needs no account. The photo taken for a scan may stay in a temporary folder after processing; uninstalling the app or Settings › Apps › PerSayar › Storage › Clear cache removes it too." }
  - q: { tr: "PerSayar bir kumar ya da şans oyunu mu?", en: "Is PerSayar a gambling or betting app?" }
    a: { tr: "Hayır. PerSayar, 101 Okey oynarken ıstakanızın puanını hesaplayan bir yardımcıdır. Oyun oynatmaz; para, bahis ya da ödül yoktur.", en: "No. PerSayar is a helper that calculates the score of your rack while you play 101 Okey. It does not run a game, and there is no money, betting or prize." }
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
