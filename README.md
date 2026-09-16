# Diamond Perfume — عطور الماس 💎

موقع إلكتروني فاخر لمتجر عطور في فردان، بيروت — عربي/إنجليزي، سلة تسوّق، وطلب عبر واتساب.

## التشغيل

```bash
npm install
npm run dev        # تطوير على http://localhost:5173
npm run build      # نسخة الإنتاج في dist/
npm run preview    # معاينة نسخة الإنتاج
```

## تعديل بيانات المتجر (ملف واحد فقط)

كل شيء يتغيّر من **`src/config.js`**:

| البيان | المكان |
|---|---|
| رقم الهاتف والواتساب | `phoneDisplay` / `whatsappNumber` |
| رابط خرائط غوغل | `mapsShareUrl` |
| سعر صرف الدولار بالليرة | `usdToLbp` |
| روابط السوشال ميديا | `social` |
| أوقات الدوام والعنوان | `hours` / `address` |

## تعديل المنتجات

من **`src/data.js`** — انسخ أي منتج وعدّل: الاسم (عربي/إنجليزي)، السعر `price`، السعر قبل الخصم `oldPrice` (اتركه `null` بدون خصم)، التصنيف `cat` (`women` / `men` / `oriental` / `niche`)، الصورة `image`.

صور المنتجات توضع في **`public/images/`**.

## استبدال الشعار

الشعار الحالي رسم SVG مؤقت. لوضع شعارك: ضع ملفك في `public/images/logo.png` ثم استبدل مكوّن `LogoSvg` في `src/components/Header.jsx` بـ:

```jsx
<img src="/images/logo.png" alt="Diamond Perfume" className="brand-logo" />
```

## الخط العربي

«خط ثمانية» الرسمي (مجاني للاستخدام التجاري — font.thmanyah.com) بخمسة أوزان، مضمّن محلياً في `public/fonts/`.
