// ═══════════════════════════════════════════════════════════
//  Diamond Perfume — Store Configuration
//  عدّل بيانات متجرك من هنا فقط / Edit your store info here
// ═══════════════════════════════════════════════════════════

export const CONFIG = {
  storeName: 'Diamond Perfume',
  storeNameAr: 'عطور الماس',

  // Phone & WhatsApp
  phoneDisplay: '+961 71 167 878',
  phoneLink: 'tel:+96171167878',
  whatsappNumber: '96171167878',

  // Location
  mapsShareUrl: 'https://maps.app.goo.gl/5xMrLDoUbc6N3xms8?g_st=ic',
  address: {
    ar: 'شارع كرامة، فردان، بيروت، لبنان',
    en: 'Karameh St., Verdun, Beirut, Lebanon',
  },
  // Google Maps embed (shows the exact store pin)
  mapEmbed: (lang = 'ar') =>
    `https://maps.google.com/maps?q=diamondperfumeverdun%20Karame%20Street%20Beirut%20Lebanon&z=17&hl=${lang}&output=embed`,

  // Social media
  social: {
    tiktok: 'https://www.tiktok.com/@diamondperfume.lb',
    instagram: 'https://www.instagram.com/diamondperfume.lb/',
    facebook: 'https://www.facebook.com/share/1BrH3pyS8B/?mibextid=wwXIfr',
  },

  // Currency — سعر صرف الدولار بالليرة (قابل للتعديل)
  usdToLbp: 89500,

  // Working hours
  hours: {
    weekdays: { ar: 'الإثنين – السبت', en: 'Monday – Saturday' },
    time: { ar: '9:00 صباحاً – 8:00 مساءً', en: '9:00 AM – 8:00 PM' },
    note: { ar: 'للاستفسار خارج الدوام، راسلنا واتساب', en: 'After hours? Message us on WhatsApp' },
  },

  // Delivery
  delivery: {
    ar: 'توصيل لجميع المناطق اللبنانية',
    en: 'Delivery to all Lebanese regions',
  },
}
