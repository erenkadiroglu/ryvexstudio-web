import type { Lang } from "@/i18n/ui";

export interface FaqItem {
  q: string;
  a: string;
}

/** Answers only state what the site already guarantees; product specifics live on product pages. */
export const studioFaq: Record<Lang, FaqItem[]> = {
  tr: [
    {
      q: "Ürünleriniz ücretli mi?",
      a: "Bir ürünün ücretli olup olmadığı ve varsa uygulama içi satın alımlar, ürünün mağaza sayfasında açıkça yazar. Satın alımlar App Store ya da Google Play üzerinden yapılır.",
    },
    {
      q: "Ürünlerinizde reklam var mı?",
      a: "Bir üründe reklam kullanılıp kullanılmadığı, ürünün mağaza sayfasında ve gizlilik politikasında belirtilir. Reklam kullanan bir üründe hangi hizmetin kullanıldığı da gizlilik politikasında yer alır.",
    },
    {
      q: "Verilerim nerede saklanıyor?",
      a: "Her ürünün gizlilik politikasında hangi verinin toplandığı, ne için kullanıldığı ve cihazınızda mı sunucularımızda mı saklandığı tablo hâlinde yazar.",
    },
    {
      q: "Hangi platformlarda varsınız?",
      a: "iOS, Android ve web. Her ürünün hangi platformlarda olduğu ürün sayfasında yazar.",
    },
    {
      q: "Bir hata buldum, nasıl bildirebilirim?",
      a: "Ürünün destek sayfasındaki e-posta butonunu kullanın. Cihazınızın modelini ve uygulamanın sürümünü eklerseniz daha hızlı yardımcı olabiliriz.",
    },
    {
      q: "Müşteri projesi alıyor musunuz?",
      a: "Hayır. Ryvex Studio kendi ürünlerini geliştiren bağımsız bir stüdyodur ve dışarıdan proje almaz. İş birliği fikirleriniz için yine de bize yazabilirsiniz.",
    },
  ],
  en: [
    {
      q: "Are your products paid?",
      a: "Whether a product is paid, and any in-app purchases, is stated clearly on its store page. Purchases are made through the App Store or Google Play.",
    },
    {
      q: "Do your products show ads?",
      a: "Whether a product uses ads is stated on its store page and in its privacy policy. If a product uses ads, its privacy policy also names the service used.",
    },
    {
      q: "Where is my data stored?",
      a: "Each product's privacy policy lists what data is collected, what it is used for, and whether it is stored on your device or on our servers.",
    },
    {
      q: "Which platforms are you on?",
      a: "iOS, Android and the web. Each product page lists the platforms it is available on.",
    },
    {
      q: "I found a bug. How do I report it?",
      a: "Use the email button on the product's support page. Including your device model and the app version helps us help you faster.",
    },
    {
      q: "Do you take on client projects?",
      a: "No. Ryvex Studio is an independent studio that builds its own products and does not take on outside projects. You are still welcome to write to us with ideas for working together.",
    },
  ],
};

export function faqSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang === "tr" ? "tr-TR" : "en-US",
    mainEntity: studioFaq[lang].map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
