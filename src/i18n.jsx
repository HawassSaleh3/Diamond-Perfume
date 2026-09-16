import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { CONFIG } from './config'

// ── Translations ────────────────────────────────────────────
const T = {
  ar: {
    dir: 'rtl',
    langName: 'العربية',
    otherLang: 'EN',
    // top announcement marquee
    top1: 'توصيل لجميع المناطق اللبنانية',
    top2: 'عطور أصلية 100%',
    top3: 'تغليف هدايا فاخر مجاناً',
    top4: 'دفع عند الاستلام',
    top5: 'فردان — بيروت',
    // nav
    navHome: 'الرئيسية',
    navShop: 'المتجر',
    navOffers: 'العروض',
    navAbout: 'من نحن',
    navLocation: 'موقعنا',
    // header
    cart: 'السلة',
    callUs: 'اتصل بنا',
    // hero
    heroBadge: 'فردان • بيروت • لبنان',
    heroTitleA: 'عطرٌ يليق',
    heroTitleB: 'بك وبالماس',
    heroSub:
      'في قلب فردان، ننتقي لك أرقى العطور العالمية والشرقية والنيش — أصلية 100%، بتغليف يليق بالهدايا، وتوصيل إلى كل لبنان.',
    heroCtaShop: 'تسوّق الآن',
    heroCtaOffers: 'اكتشف العروض',
    heroStat1: 'عطر فاخر',
    heroStat2: 'عميل سعيد',
    heroStat3: 'أصالة مضمونة',
    scrollDown: 'مرّر للأسفل',
    // categories
    catKicker: 'المجموعات',
    catTitle: 'تسوّق حسب ذوقك',
    catExplore: 'استكشف',
    // products
    shopKicker: 'المتجر',
    shopTitle: 'مجموعة الماس',
    filterAll: 'الكل',
    filterOffers: 'العروض',
    searchPlaceholder: 'ابحث عن عطر…',
    noResults: 'لا توجد نتائج مطابقة',
    addToCart: 'أضف إلى السلة',
    added: 'تمت الإضافة ✓',
    quickView: 'عرض سريع',
    bestSeller: 'الأكثر مبيعاً',
    off: 'خصم',
    newTag: 'جديد',
    // offers
    offersKicker: 'لفترة محدودة',
    offersTitle: 'عروضٌ تلمع كالماس',
    offersSub: 'خصومات حقيقية على أرقى العطور — اطلبها قبل انتهاء العرض',
    offerCta: 'اطلب الآن',
    offerSave: 'وفّر',
    offerNote: 'العروض سارية حتى نفاد الكمية — تُطبّق عند الطلب عبر الموقع',
    // about
    aboutKicker: 'قصتنا',
    aboutTitle: 'شغفٌ بالعطور… منذ اليوم الأول',
    aboutP1:
      'انطلقت Diamond Perfume من قلب فردان في بيروت لنكون وجهة عشاق العطور الفاخرة في لبنان. نؤمن أن العطر ليس مجرّد رائحة، بل توقيعٌ شخصي وذكرى لا تُنسى.',
    aboutP2:
      'ننتقي كل عطر بعناية من مصادر موثوقة — عطور عالمية أصلية، عود وشرقيات فاخرة، وإصدارات نيش نادرة — لنضمن لك تجربة عطرية تليق بك في كل مناسبة.',
    aboutFeat1T: 'أصلية 100%',
    aboutFeat1D: 'كل منتجاتنا مصدرها موزّعون معتمدون',
    aboutFeat2T: 'توصيل سريع',
    aboutFeat2D: 'لجميع المناطق اللبنانية خلال أيام',
    aboutFeat3T: 'تغليف هدايا',
    aboutFeat3D: 'تغليف فاخر مجاني يليق بمن تحب',
    hoursTitle: 'أوقات الدوام',
    visitUs: 'زورونا في المتجر',
    // location
    locKicker: 'موقعنا',
    locTitle: 'في قلب فردان',
    locAddress: 'العنوان',
    locPhone: 'الهاتف',
    locHours: 'الدوام',
    locDirections: 'احصل على الاتجاهات',
    locOpen: 'افتح في خرائط غوغل',
    // cart
    cartTitle: 'سلة التسوّق',
    cartEmpty: 'سلّتك فارغة',
    cartEmptySub: 'اكتشف مجموعتنا وأضف ما يعجبك',
    cartStart: 'ابدأ التسوّق',
    cartSubtotal: 'المجموع الفرعي',
    cartDeliveryNote: 'التوصيل لكل لبنان — تُؤكَّد التفاصيل عبر واتساب',
    cartCheckout: 'إتمام الطلب عبر واتساب',
    cartContinue: 'متابعة التسوّق',
    cartClear: 'إفراغ السلة',
    // checkout
    coTitle: 'إتمام الطلب',
    coSub: 'املأ بياناتك وسيصلنا طلبك مباشرة عبر واتساب',
    coName: 'الاسم الكامل',
    coNamePh: 'مثال: محمد أحمد خليل',
    coPhone: 'رقم الهاتف',
    coPhonePh: 'مثال: 71 123 456',
    coCity: 'المدينة',
    coCityPh: 'مثال: بيروت',
    coArea: 'المنطقة',
    coAreaPh: 'مثال: فردان',
    coAddress: 'العنوان بالتفاصيل',
    coAddressPh: 'الشارع، المبنى، الطابق، علامة مميزة…',
    coNotes: 'ملاحظات',
    coNotesOpt: '(اختياري)',
    coNotesPh: 'وقت توصيل مفضّل، تغليف هدية…',
    coSummary: 'ملخّص الطلب',
    coTotal: 'المجموع',
    coItems: 'منتج',
    coSubmit: 'إرسال الطلب عبر واتساب',
    coBack: 'رجوع للسلة',
    coDeliveryInfo: 'توصيل لجميع المناطق اللبنانية — الدفع عند الاستلام',
    errName: 'الرجاء إدخال الاسم الكامل',
    errPhone: 'الرجاء إدخال رقم هاتف صحيح (8 أرقام على الأقل)',
    errCity: 'الرجاء إدخال المدينة',
    errArea: 'الرجاء إدخال المنطقة',
    errAddress: 'الرجاء إدخال العنوان بالتفصيل',
    successTitle: 'تم تجهيز طلبك! ✨',
    successSub:
      'فتحنا لك واتساب مع تفاصيل الطلب — اضغط "إرسال" هناك ليصلنا طلبك فوراً وسنتواصل معك للتأكيد.',
    successOrder: 'رقم الطلب',
    successAgain: 'تسوّق من جديد',
    successOpen: 'فتح واتساب مجدداً',
    // footer
    footAbout:
      'وجهة العطور الفاخرة في فردان، بيروت. عطور أصلية 100% — عالمية، شرقية، ونيش — بأسعار تنافسية وتوصيل لكل لبنان.',
    footLinks: 'روابط سريعة',
    footContact: 'تواصل معنا',
    footHours: 'أوقات الدوام',
    footFollow: 'تابعنا',
    footRights: 'جميع الحقوق محفوظة',
    footMade: 'صُنع بشغف في بيروت',
    // floating
    waTooltip: 'تواصل معنا واتساب',
    waMsg: 'مرحباً Diamond Perfume! لدي استفسار عن عطوركم.',
    // currency
    curUSD: '$',
    curLBP: 'ل.ل',
    // modal
    sizeLabel: 'الحجم',
    notesLabel: 'النفحات العطرية',
    catLabel: 'المجموعة',
    qty: 'الكمية',
    close: 'إغلاق',
    ratingOf: 'من 5',
  },
  en: {
    dir: 'ltr',
    langName: 'English',
    otherLang: 'عربي',
    top1: 'Delivery across all Lebanon',
    top2: '100% authentic perfumes',
    top3: 'Free luxury gift wrapping',
    top4: 'Cash on delivery',
    top5: 'Verdun — Beirut',
    navHome: 'Home',
    navShop: 'Shop',
    navOffers: 'Offers',
    navAbout: 'About',
    navLocation: 'Location',
    cart: 'Cart',
    callUs: 'Call us',
    heroBadge: 'Verdun • Beirut • Lebanon',
    heroTitleA: 'A fragrance',
    heroTitleB: 'worthy of diamonds',
    heroSub:
      'In the heart of Verdun, we hand-pick the finest designer, oriental and niche perfumes — 100% authentic, gift-ready wrapped, and delivered everywhere in Lebanon.',
    heroCtaShop: 'Shop Now',
    heroCtaOffers: 'View Offers',
    heroStat1: 'luxury perfumes',
    heroStat2: 'happy clients',
    heroStat3: 'authenticity',
    scrollDown: 'Scroll down',
    catKicker: 'Collections',
    catTitle: 'Shop by taste',
    catExplore: 'Explore',
    shopKicker: 'The Shop',
    shopTitle: 'The Diamond Collection',
    filterAll: 'All',
    filterOffers: 'Offers',
    searchPlaceholder: 'Search a fragrance…',
    noResults: 'No matching results',
    addToCart: 'Add to Cart',
    added: 'Added ✓',
    quickView: 'Quick view',
    bestSeller: 'Best Seller',
    off: 'OFF',
    newTag: 'New',
    offersKicker: 'Limited time',
    offersTitle: 'Deals that shine like diamonds',
    offersSub: 'Real discounts on the finest fragrances — order before they are gone',
    offerCta: 'Order Now',
    offerSave: 'Save',
    offerNote: 'Offers valid while stocks last — applied when ordering via the website',
    aboutKicker: 'Our Story',
    aboutTitle: 'A passion for perfume… since day one',
    aboutP1:
      'Diamond Perfume was born in the heart of Verdun, Beirut, to be the destination of fine-fragrance lovers in Lebanon. We believe a perfume is not just a scent, but a personal signature and an unforgettable memory.',
    aboutP2:
      'Every fragrance is carefully sourced from trusted suppliers — authentic designer perfumes, luxurious oud & orientals, and rare niche editions — to guarantee an experience worthy of you, for every occasion.',
    aboutFeat1T: '100% Authentic',
    aboutFeat1D: 'All products from authorized distributors',
    aboutFeat2T: 'Fast Delivery',
    aboutFeat2D: 'To all Lebanese regions within days',
    aboutFeat3T: 'Gift Wrapping',
    aboutFeat3D: 'Free luxury wrapping for your loved ones',
    hoursTitle: 'Opening Hours',
    visitUs: 'Visit our boutique',
    locKicker: 'Find Us',
    locTitle: 'In the heart of Verdun',
    locAddress: 'Address',
    locPhone: 'Phone',
    locHours: 'Hours',
    locDirections: 'Get Directions',
    locOpen: 'Open in Google Maps',
    cartTitle: 'Shopping Cart',
    cartEmpty: 'Your cart is empty',
    cartEmptySub: 'Discover our collection and add what you love',
    cartStart: 'Start shopping',
    cartSubtotal: 'Subtotal',
    cartDeliveryNote: 'Delivery across Lebanon — details confirmed on WhatsApp',
    cartCheckout: 'Checkout via WhatsApp',
    cartContinue: 'Continue shopping',
    cartClear: 'Clear cart',
    coTitle: 'Complete Your Order',
    coSub: 'Fill in your details and your order reaches us instantly on WhatsApp',
    coName: 'Full Name',
    coNamePh: 'e.g. John Smith',
    coPhone: 'Phone Number',
    coPhonePh: 'e.g. 71 123 456',
    coCity: 'City',
    coCityPh: 'e.g. Beirut',
    coArea: 'Area / District',
    coAreaPh: 'e.g. Verdun',
    coAddress: 'Detailed Address',
    coAddressPh: 'Street, building, floor, landmark…',
    coNotes: 'Notes',
    coNotesOpt: '(optional)',
    coNotesPh: 'Preferred delivery time, gift wrap…',
    coSummary: 'Order Summary',
    coTotal: 'Total',
    coItems: 'items',
    coSubmit: 'Send Order via WhatsApp',
    coBack: 'Back to cart',
    coDeliveryInfo: 'Delivery across Lebanon — cash on delivery',
    errName: 'Please enter your full name',
    errPhone: 'Please enter a valid phone number (min 8 digits)',
    errCity: 'Please enter your city',
    errArea: 'Please enter your area',
    errAddress: 'Please enter your detailed address',
    successTitle: 'Your order is ready! ✨',
    successSub:
      'We opened WhatsApp with your order details — press "Send" there and we will contact you to confirm right away.',
    successOrder: 'Order No.',
    successAgain: 'Shop again',
    successOpen: 'Open WhatsApp again',
    footAbout:
      'The destination of fine fragrances in Verdun, Beirut. 100% authentic designer, oriental and niche perfumes at competitive prices, delivered across Lebanon.',
    footLinks: 'Quick Links',
    footContact: 'Contact Us',
    footHours: 'Opening Hours',
    footFollow: 'Follow Us',
    footRights: 'All rights reserved',
    footMade: 'Crafted with passion in Beirut',
    waTooltip: 'Chat on WhatsApp',
    waMsg: "Hello Diamond Perfume! I have a question about your fragrances.",
    curUSD: '$',
    curLBP: 'LBP',
    sizeLabel: 'Size',
    notesLabel: 'Fragrance notes',
    catLabel: 'Collection',
    qty: 'Quantity',
    close: 'Close',
    ratingOf: 'of 5',
  },
}

// ── Context ─────────────────────────────────────────────────
const LangCtx = createContext(null)
const CurrCtx = createContext(null)

export function AppProviders({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('dp-lang') || 'ar')
  const [curr, setCurr] = useState(() => localStorage.getItem('dp-curr') || 'USD')

  useEffect(() => {
    const t = T[lang]
    document.documentElement.lang = lang
    document.documentElement.dir = t.dir
    document.documentElement.dataset.lang = lang
    localStorage.setItem('dp-lang', lang)
  }, [lang])
  useEffect(() => localStorage.setItem('dp-curr', curr), [curr])

  const langVal = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang((l) => (l === 'ar' ? 'en' : 'ar')),
      t: T[lang],
      isAr: lang === 'ar',
    }),
    [lang]
  )
  const currVal = useMemo(
    () => ({
      curr,
      setCurr,
      // format a USD base price in the active currency
      fmt: (usd) => {
        if (curr === 'USD') return `$${Number(usd).toLocaleString('en-US')}`
        const lbp = Math.round((usd * CONFIG.usdToLbp) / 1000) * 1000
        return `${lbp.toLocaleString('en-US')} ${T[langVal.lang].curLBP}`
      },
      fmtBoth: (usd) => {
        const lbp = Math.round((usd * CONFIG.usdToLbp) / 1000) * 1000
        return `$${Number(usd).toLocaleString('en-US')} (${lbp.toLocaleString('en-US')} LBP)`
      },
    }),
    [curr, langVal.lang]
  )

  return (
    <LangCtx.Provider value={langVal}>
      <CurrCtx.Provider value={currVal}>{children}</CurrCtx.Provider>
    </LangCtx.Provider>
  )
}

export const useLang = () => useContext(LangCtx)
export const useCurr = () => useContext(CurrCtx)
