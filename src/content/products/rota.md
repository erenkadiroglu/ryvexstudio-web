---
name: "Rota"
type: web
tagline:
  tr: "Gezi planınızı gün gün kuran web uygulaması."
  en: "A web app that plans your trip day by day."
color: "#D2483F"
icon: ../../assets/products/rota.svg
platforms: [web]
links:
  web: "https://rota.ryvexstudio.com"
version: "0.9.0"
releaseDate: 2026-05-15
supportEmail: "destek@ryvexstudio.com"
privacyUpdated: 2026-10-01
privacy:
  dataCollected:
    - data: { tr: "Gezi planları", en: "Trip plans" }
      purpose: { tr: "Planınızı oluşturmak ve bağlantıyla paylaşmanızı sağlamak", en: "Building your plan and letting you share it by link" }
      storage: server
    - data: { tr: "Teknik kayıtlar (IP adresi, tarayıcı türü)", en: "Technical logs (IP address, browser type)" }
      purpose: { tr: "Hizmetin güvenliği ve hataların giderilmesi", en: "Keeping the service secure and fixing errors" }
      storage: server
faq:
  - q: { tr: "Hesap açmam gerekiyor mu?", en: "Do I need an account?" }
    a: { tr: "Hayır. Planlarınız size özel bir bağlantıyla saklanır.", en: "No. Your plans are saved under a private link." }
  - q: { tr: "Paylaştığım planı kimler görebilir?", en: "Who can see a plan I share?" }
    a: { tr: "Yalnızca bağlantıya sahip olan kişiler. Bağlantıyı istediğiniz zaman iptal edebilirsiniz.", en: "Only people who have the link. You can revoke the link at any time." }
aboutEn: |
  Rota takes the places you want to visit and the days you will stay, and builds a plan laid out day by day.

  It runs in the browser with nothing to install. You can share your plan with a link.
features:
  - title: { tr: "Gün gün plan", en: "Day-by-day plan" }
    text: { tr: "Gideceğiniz yerleri ve günleri girin, plan kendiliğinden oluşsun.", en: "Enter places and days; the plan builds itself." }
  - title: { tr: "Bağlantıyla paylaşım", en: "Share by link" }
    text: { tr: "Planınızı tek bir bağlantıyla paylaşın.", en: "Share your plan with a single link." }
  - title: { tr: "Kurulum yok", en: "Nothing to install" }
    text: { tr: "Tarayıcıda çalışır, her cihazdan açılır.", en: "Runs in the browser and opens on any device." }
releases:
  - version: "0.9.0"
    date: 2026-09-12
    notes:
      tr: ["Paylaşılan planlara salt okunur görünüm eklendi."]
      en: ["Added a read-only view for shared plans."]
  - version: "0.8.0"
    date: 2026-05-15
    notes:
      tr: ["Herkese açık ön sürüm."]
      en: ["Public preview."]
featured: true
order: 50
sample: true
---

Rota, gideceğiniz yerleri ve kalacağınız günleri alır; size gün gün düzenlenmiş bir plan çıkarır.

Tarayıcıda çalışır, kurulum gerektirmez. Planınızı bağlantıyla paylaşabilirsiniz.
