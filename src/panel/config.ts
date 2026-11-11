import type { CmsConfig } from "@sveltia/cms";

/**
 * Content panel (Sveltia CMS) at /panel.
 *
 * Every field of the content schema (src/content.config.ts) is listed here: the panel rewrites a
 * whole file on save, and a field it does not know about could be lost. When the schema changes,
 * change this file in the same commit.
 *
 * Saving writes the files and, on the live site, commits them to GitHub under the signed-in
 * account; the site is then rebuilt. If an entry ever breaks the build, the previous version of the
 * site stays online.
 */

type AnyField = Record<string, unknown>;

/** A pair of fields for the same text in Turkish and English. */
const pair = (name: string, label: string, opts: { widget?: string; hint?: string; enRequired?: boolean } = {}) => ({
  name,
  label,
  widget: "object",
  hint: opts.hint,
  collapsed: false,
  fields: [
    { name: "tr", label: "Türkçe", widget: opts.widget ?? "string" },
    { name: "en", label: "English", widget: opts.widget ?? "string", required: opts.enRequired ?? true },
  ],
});

const image = (name: string, label: string, folder: string, opts: { required?: boolean; hint?: string } = {}) => ({
  name,
  label,
  widget: "image",
  required: opts.required ?? true,
  hint: opts.hint,
  // Files are kept in src/assets so the site can optimise them; entries point to them relatively.
  media_folder: `/src/assets/${folder}`,
  public_folder: `../../assets/${folder}`,
});

const date = (name: string, label: string, required = true, today = false) => ({
  name,
  label,
  widget: "datetime",
  type: "date",
  format: "YYYY-MM-DD",
  required,
  default: today ? "{{now}}" : undefined,
});

const productFields: AnyField[] = [
  { name: "name", label: "Ürün adı", widget: "string" },
  {
    name: "type",
    label: "Tür",
    widget: "select",
    options: [
      { label: "Uygulama", value: "app" },
      { label: "Oyun", value: "game" },
      { label: "Web", value: "web" },
    ],
  },
  {
    name: "status",
    label: "Durum",
    widget: "select",
    default: "coming-soon",
    hint: "Yayında: mağaza bağlantıları, telefonda alttaki indirme barı ve masaüstünde QR kod görünür. Yakında: 'Yakında' etiketi ve (bülten açıksa) 'Çıkınca haber ver' formu görünür.",
    options: [
      { label: "Yakında", value: "coming-soon" },
      { label: "Yayında", value: "released" },
    ],
  },
  pair("tagline", "Tek cümlelik tanıtım", { widget: "text", enRequired: false }),
  {
    name: "color",
    label: "Ürün rengi",
    widget: "color",
    hint: "Ürünün ana rengi (#RRGGBB). Ürün sayfasının ışığı, kartlar ve geçişler bu renkten gelir.",
  },
  image("icon", "Uygulama ikonu", "products", { hint: "Kare, en az 512×512 piksel PNG." }),
  {
    name: "platforms",
    label: "Platformlar",
    widget: "select",
    multiple: true,
    min: 1,
    options: [
      { label: "iOS", value: "ios" },
      { label: "Android", value: "android" },
      { label: "Web", value: "web" },
    ],
  },
  {
    name: "links",
    label: "Mağaza bağlantıları",
    widget: "object",
    required: false,
    hint: "Yalnızca durum 'Yayında' iken gösterilir.",
    fields: [
      { name: "googlePlay", label: "Google Play", widget: "string", required: false },
      { name: "appStore", label: "App Store", widget: "string", required: false },
      { name: "web", label: "Web adresi", widget: "string", required: false },
    ],
  },
  {
    name: "screenshots",
    label: "Ekran görüntüleri",
    label_singular: "Ekran görüntüsü",
    widget: "list",
    required: false,
    hint: "Gerçek ekranlar, gösterilecek sırayla. Türkçe ve aydınlık tema zorunlu; diğerleri varsa kullanılır.",
    summary: "{{fields.alt.tr}}",
    fields: [
      image("src", "Ekran (Türkçe, aydınlık)", "screenshots"),
      pair("alt", "Ekranın açıklaması", { hint: "Ekranda ne göründüğünü bir cümleyle yazın." }),
      image("en", "Ekran (İngilizce, aydınlık)", "screenshots", { required: false }),
      image("dark", "Ekran (Türkçe, gece modu)", "screenshots", { required: false }),
      image("darkEn", "Ekran (İngilizce, gece modu)", "screenshots", { required: false }),
    ],
  },
  {
    name: "video",
    label: "Tanıtım videosu",
    widget: "object",
    required: false,
    hint: "10-15 saniyelik, sessiz MP4. Ürün sayfasının girişindeki telefonda döngüyle oynar.",
    fields: [
      { name: "tr", label: "Türkçe video", widget: "file", media_folder: "/public/videos", public_folder: "/videos" },
      {
        name: "en",
        label: "İngilizce video",
        widget: "file",
        required: false,
        media_folder: "/public/videos",
        public_folder: "/videos",
      },
    ],
  },
  {
    name: "features",
    label: "Öne çıkan özellikler",
    label_singular: "Özellik",
    widget: "list",
    required: false,
    summary: "{{fields.title.tr}}",
    fields: [
      pair("title", "Başlık"),
      pair("text", "Açıklama", { widget: "text" }),
      {
        name: "shot",
        label: "Gösterilecek ekran",
        widget: "number",
        value_type: "int",
        min: 0,
        required: false,
        hint: "Bu özelliği gösteren ekranın sırası: ilk ekran 0, ikincisi 1…",
      },
    ],
  },
  { name: "body", label: "Ürün açıklaması (Türkçe)", widget: "markdown", required: false },
  {
    name: "aboutEn",
    label: "Ürün açıklaması (İngilizce)",
    widget: "text",
    required: false,
    hint: "Paragrafları boş bir satırla ayırın.",
  },
  {
    name: "faq",
    label: "Sık sorulan sorular",
    label_singular: "Soru",
    widget: "list",
    required: false,
    summary: "{{fields.q.tr}}",
    fields: [pair("q", "Soru"), pair("a", "Cevap", { widget: "text" })],
  },
  {
    name: "privacy",
    label: "Gizlilik bilgileri",
    widget: "object",
    hint: "Ürünün gizlilik politikası ve gizlilik özeti bu bilgilerden üretilir. Her zaman doğru tutun.",
    fields: [
      { name: "accountRequired", label: "Hesap gerekli", widget: "boolean", default: false },
      { name: "tracking", label: "Reklam amaçlı takip var", widget: "boolean", default: false },
      { name: "childDirected", label: "Çocuklara yönelik", widget: "boolean", default: false },
      {
        ...pair("childrenNote", "Çocukların gizliliği için özel metin", { widget: "text" }),
        required: false,
        hint: "Boş bırakılırsa standart metin kullanılır.",
      },
      {
        name: "dataCollected",
        label: "İşlenen veriler",
        label_singular: "Veri",
        widget: "list",
        required: false,
        summary: "{{fields.data.tr}}",
        fields: [
          pair("data", "Veri", { widget: "text" }),
          pair("purpose", "Amaç", { widget: "text" }),
          {
            name: "storage",
            label: "Nerede saklanır",
            widget: "select",
            options: [
              { label: "Cihazda", value: "device" },
              { label: "Sunucuda", value: "server" },
            ],
          },
        ],
      },
      {
        name: "thirdParties",
        label: "Üçüncü taraf hizmetler",
        label_singular: "Hizmet",
        widget: "list",
        required: false,
        summary: "{{fields.name}}",
        fields: [
          { name: "name", label: "Hizmet adı", widget: "string" },
          pair("purpose", "Ne için kullanılıyor", { widget: "text" }),
          { name: "policyUrl", label: "Gizlilik politikası adresi", widget: "string" },
        ],
      },
    ],
  },
  date("privacyUpdated", "Gizlilik politikasının son güncellemesi", false),
  { name: "supportEmail", label: "Destek e-postası", widget: "string", required: false },
  {
    name: "releases",
    label: "Sürüm notları",
    label_singular: "Sürüm",
    widget: "list",
    required: false,
    hint: "En yeni sürüm en üstte.",
    summary: "{{fields.version}}",
    fields: [
      { name: "version", label: "Sürüm", widget: "string" },
      date("date", "Yayın tarihi"),
      {
        name: "notes",
        label: "Yenilikler",
        widget: "object",
        fields: [
          { name: "tr", label: "Türkçe", widget: "list", field: { name: "item", label: "Madde", widget: "string" } },
          { name: "en", label: "English", widget: "list", field: { name: "item", label: "Item", widget: "string" } },
        ],
      },
    ],
  },
  { name: "version", label: "Güncel sürüm", widget: "string", required: false },
  {
    name: "specs",
    label: "Teknik bilgiler",
    widget: "object",
    collapsed: true,
    hint: "Ürün sayfasındaki künyede görünür; boş bırakılan satır gösterilmez.",
    fields: [
      { name: "minAndroid", label: "En düşük Android sürümü", widget: "string", required: false, hint: "Ör. 8.0" },
      { name: "minIos", label: "En düşük iOS sürümü", widget: "string", required: false, hint: "Ör. 16" },
      { name: "size", label: "İndirme boyutu", widget: "string", required: false, hint: "Mağazadaki değer, ör. 32 MB" },
      {
        name: "languages",
        label: "Uygulamanın dilleri",
        widget: "select",
        multiple: true,
        required: false,
        options: [
          { label: "Türkçe", value: "tr" },
          { label: "İngilizce", value: "en" },
        ],
      },
      { name: "offline", label: "İnternetsiz çalışır", widget: "boolean", default: false },
    ],
  },
  {
    ...date("releaseDate", "Yayın tarihi", false),
    hint: "Yakında ise planlanan çıkış tarihi; sayfada \"12 Aralık'ta çıkıyor\" olarak görünür. Yayında ise ilk yayın tarihi; ürün bu tarihten sonraki 30 gün \"Yeni\" rozeti ve sitenin üstünde duyuru alır.",
  },
  { name: "featured", label: "Ana sayfadaki vitrinde göster", widget: "boolean", default: false },
  { name: "order", label: "Sıra", widget: "number", value_type: "int", default: 100, hint: "Küçük sayı önde gösterilir." },
  { name: "draft", label: "Taslak (sitede gösterme)", widget: "boolean", default: false },
  { name: "sample", label: "Örnek ürün", widget: "boolean", default: false, hint: "Yalnızca geliştirme içindir; gerçek ürünlerde kapalı olmalı." },
];

const journalFields = (lang: "tr" | "en"): AnyField[] => [
  { name: "title", label: "Başlık", widget: "string" },
  { name: "description", label: "Kısa açıklama", widget: "text", hint: "Listede ve paylaşım görselinde görünür." },
  date("date", "Tarih", true, true),
  { name: "lang", label: "Dil", widget: "hidden", default: lang },
  {
    name: "translationKey",
    label: "Çeviri anahtarı",
    widget: "string",
    hint: "Türkçe ve İngilizce yazıyı birbirine bağlar; ikisinde de aynı olmalı (ör. fileconvert-compression).",
  },
  { name: "tags", label: "Etiketler", widget: "list", required: false, field: { name: "tag", label: "Etiket", widget: "string" } },
  {
    name: "draft",
    label: "Taslak (yayınlama)",
    widget: "boolean",
    default: true,
    hint: "Yayınlamaya hazır olduğunda kapatın.",
  },
  { name: "body", label: "Yazı", widget: "markdown" },
];

const config = {
  load_config_file: false,
  app_title: "Ryvex Studio Panel",
  site_url: "https://ryvexstudio.com",
  display_url: "https://ryvexstudio.com",
  logo: { src: "/favicon.svg" },
  backend: {
    name: "github",
    repo: "erenkadiroglu/ryvexstudio-web",
    branch: "main",
    // Plain English messages in the repository's own style; no tool names.
    commit_messages: {
      create: "content: add {{collection}} {{slug}}",
      update: "content: update {{collection}} {{slug}}",
      delete: "content: remove {{collection}} {{slug}}",
      uploadMedia: "content: upload {{path}}",
      deleteMedia: "content: remove {{path}}",
    },
  },
  publish_mode: "simple",
  // Fallback for files not tied to a field; every image and video field sets its own folder.
  media_folder: "/public/uploads",
  public_folder: "/uploads",
  output: { omit_empty_optional_fields: true },
  collections: [
    {
      name: "products",
      label: "Ürünler",
      label_singular: "Ürün",
      folder: "src/content/products",
      extension: "md",
      format: "frontmatter",
      create: true,
      delete: false,
      identifier_field: "name",
      slug: "{{slug}}",
      summary: "{{name}}",
      sortable_fields: ["order", "name"],
      fields: productFields,
    },
    {
      name: "journal-tr",
      label: "Günlük (Türkçe)",
      label_singular: "Yazı",
      folder: "src/content/journal/tr",
      extension: "md",
      format: "frontmatter",
      create: true,
      slug: "{{year}}-{{month}}-{{slug}}",
      summary: "{{title}}",
      sortable_fields: ["date", "title"],
      fields: journalFields("tr"),
    },
    {
      name: "journal-en",
      label: "Günlük (İngilizce)",
      label_singular: "Post",
      folder: "src/content/journal/en",
      extension: "md",
      format: "frontmatter",
      create: true,
      slug: "{{year}}-{{month}}-{{slug}}",
      summary: "{{title}}",
      sortable_fields: ["date", "title"],
      fields: journalFields("en"),
    },
    {
      name: "settings",
      label: "Ayarlar",
      files: [
        {
          name: "contact",
          label: "İletişim ve sosyal medya",
          file: "src/config/contact.json",
          format: "json",
          fields: [
            { name: "contactEmail", label: "Genel e-posta", widget: "string" },
            { name: "supportEmail", label: "Destek e-postası", widget: "string" },
            {
              name: "social",
              label: "Sosyal medya hesapları",
              label_singular: "Hesap",
              widget: "list",
              summary: "{{fields.name}}",
              fields: [
                { name: "name", label: "Ad", widget: "string" },
                { name: "url", label: "Adres", widget: "string" },
              ],
            },
          ],
        },
        {
          name: "roadmap",
          label: "Yol haritası",
          file: "src/config/roadmap.json",
          format: "json",
          fields: [
            date("updated", "Son güncelleme"),
            {
              name: "items",
              label: "Maddeler",
              label_singular: "Madde",
              widget: "list",
              summary: "{{fields.product}} · {{fields.status}} · {{fields.title.tr}}",
              fields: [
                { name: "product", label: "Ürün kimliği", widget: "string", hint: "Ürün dosyasının adı, ör. fileconvert." },
                {
                  name: "status",
                  label: "Durum",
                  widget: "select",
                  options: [
                    { label: "Üzerinde çalışılıyor", value: "now" },
                    { label: "Sırada", value: "next" },
                    { label: "Tamamlandı", value: "done" },
                  ],
                },
                pair("title", "Madde"),
              ],
            },
          ],
        },
        {
          name: "timeline",
          label: "Stüdyonun hikâyesi (zaman çizelgesi)",
          file: "src/config/timeline.json",
          format: "json",
          fields: [
            {
              name: "items",
              label: "Duraklar",
              label_singular: "Durak",
              widget: "list",
              summary: "{{fields.date}} · {{fields.title.tr}}",
              fields: [
                {
                  name: "date",
                  label: "Tarih (yıl-ay)",
                  widget: "string",
                  required: false,
                  pattern: ["^\\d{4}-\\d{2}$", "YYYY-AA biçiminde, ör. 2026-10"],
                  hint: "Boşsa durak \"Yakında\" olarak gösterilir.",
                },
                pair("title", "Durak"),
              ],
            },
          ],
        },
        {
          name: "integrations",
          label: "Bağlantılar (bülten, ölçüm, reklam, uygulama bağlantıları)",
          file: "src/config/integrations.json",
          format: "json",
          fields: [
            {
              name: "analyticsToken",
              label: "Cloudflare Web Analytics token'ı",
              widget: "string",
              required: false,
              hint: "Boşsa ziyaret ölçümü kapalıdır. Doldurunca Gizlilik ve Çerez metinleri kendiliğinden güncellenir.",
            },
            {
              name: "newsletterUser",
              label: "Buttondown kullanıcı adı",
              widget: "string",
              required: false,
              hint: "Boşsa bülten formu görünmez. Açmadan önce avukata danışın (İYS).",
            },
            {
              name: "admobPublisherId",
              label: "AdMob yayıncı kimliği",
              widget: "string",
              required: false,
              pattern: ["^pub-\\d{16}$", "pub- ve 16 rakam, ör. pub-1234567890123456"],
              hint: "AdMob › Ayarlar › Hesap bilgileri. Doluysa site /app-ads.txt dosyasını yayınlar; boşsa dosya hiç oluşmaz.",
            },
            {
              name: "androidApps",
              label: "Android uygulama bağlantıları",
              label_singular: "Uygulama",
              widget: "list",
              summary: "{{fields.package}}",
              fields: [
                { name: "package", label: "Paket adı", widget: "string" },
                {
                  name: "fingerprints",
                  label: "SHA-256 parmak izleri",
                  widget: "list",
                  required: false,
                  hint: "Play Console › Uygulama bütünlüğü › Uygulama imzalama anahtarı sertifikası.",
                  field: { name: "fingerprint", label: "Parmak izi", widget: "string" },
                },
              ],
            },
            {
              name: "appleTeamId",
              label: "Apple Team ID",
              widget: "string",
              required: false,
              hint: "Apple Developer › Membership details › Team ID (10 karakter). Boşsa iPhone uygulama bağlantıları kapalıdır.",
            },
            {
              name: "iosApps",
              label: "iPhone uygulama bağlantıları",
              label_singular: "Uygulama",
              widget: "list",
              summary: "{{fields.product}}",
              fields: [
                { name: "product", label: "Ürün kimliği", widget: "string", hint: "Ürün dosyasının adı, ör. fileconvert." },
                {
                  name: "bundleId",
                  label: "Bundle ID",
                  widget: "string",
                  required: false,
                  hint: "Xcode ya da App Store Connect'teki paket kimliği, ör. com.erenkadiroglu.fileconvert. Boşsa bu ürün için kapalıdır.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/** The configuration without undefined values, which the panel's own validation rejects. */
export const panelConfig = JSON.parse(JSON.stringify(config)) as CmsConfig;
