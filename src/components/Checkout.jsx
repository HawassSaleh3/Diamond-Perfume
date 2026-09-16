import { useMemo, useState } from 'react'
import { useLang, useCurr } from '../i18n'
import { useCart } from '../cart'
import { CONFIG } from '../config'
import { IconCheck, IconClose, IconTruck, IconWhatsApp } from './Icons'

const initialForm = { name: '', phone: '', city: '', area: '', address: '', notes: '' }

export default function Checkout() {
  const { t, isAr } = useLang()
  const { fmt, fmtBoth } = useCurr()
  const cart = useCart()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(null) // order number after send

  const orderNo = useMemo(() => `DP-${Date.now().toString().slice(-6)}`, [cart.checkoutOpen])

  if (!cart.checkoutOpen) return null

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const buildWaUrl = () => {
    const L = []
    if (isAr) {
      L.push('🛍️ *طلب جديد — Diamond Perfume*')
      L.push('━━━━━━━━━━━━━━━━━')
      L.push(`👤 *الاسم الكامل:* ${form.name}`)
      L.push(`📱 *رقم الهاتف:* ${form.phone}`)
      L.push(`🏙️ *المدينة:* ${form.city}`)
      L.push(`📍 *المنطقة:* ${form.area}`)
      L.push(`🏠 *العنوان بالتفاصيل:* ${form.address}`)
      if (form.notes.trim()) L.push(`📝 *ملاحظات:* ${form.notes}`)
      L.push('━━━━━━━━━━━━━━━━━')
      L.push(`🧾 *تفاصيل الطلب (${cart.count} منتج):*`)
      cart.items.forEach((i, n) => {
        L.push(`${n + 1}) ${i.nameAr} — ${i.size} × ${i.qty} = $${(i.price * i.qty).toLocaleString('en-US')}`)
      })
      L.push('━━━━━━━━━━━━━━━━━')
      L.push(`💰 *المجموع:* ${fmtBoth(cart.total)}`)
      L.push('🚚 التوصيل: لجميع المناطق اللبنانية — الدفع عند الاستلام')
      L.push(`🔖 رقم الطلب: ${orderNo}`)
    } else {
      L.push('🛍️ *New Order — Diamond Perfume*')
      L.push('━━━━━━━━━━━━━━━━━')
      L.push(`👤 *Full Name:* ${form.name}`)
      L.push(`📱 *Phone:* ${form.phone}`)
      L.push(`🏙️ *City:* ${form.city}`)
      L.push(`📍 *Area:* ${form.area}`)
      L.push(`🏠 *Detailed Address:* ${form.address}`)
      if (form.notes.trim()) L.push(`📝 *Notes:* ${form.notes}`)
      L.push('━━━━━━━━━━━━━━━━━')
      L.push(`🧾 *Order Details (${cart.count} items):*`)
      cart.items.forEach((i, n) => {
        L.push(`${n + 1}) ${i.nameEn} — ${i.size} × ${i.qty} = $${(i.price * i.qty).toLocaleString('en-US')}`)
      })
      L.push('━━━━━━━━━━━━━━━━━')
      L.push(`💰 *Total:* ${fmtBoth(cart.total)}`)
      L.push('🚚 Delivery: all Lebanese regions — Cash on delivery')
      L.push(`🔖 Order No: ${orderNo}`)
    }
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(L.join('\n'))}`
  }

  const validate = () => {
    const er = {}
    if (form.name.trim().length < 3) er.name = t.errName
    if (form.phone.replace(/\D/g, '').length < 8) er.phone = t.errPhone
    if (!form.city.trim()) er.city = t.errCity
    if (!form.area.trim()) er.area = t.errArea
    if (form.address.trim().length < 5) er.address = t.errAddress
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    window.open(buildWaUrl(), '_blank')
    setSent(orderNo)
    cart.clear()
  }

  const close = () => {
    cart.setCheckoutOpen(false)
    setTimeout(() => {
      setSent(null)
      setForm(initialForm)
      setErrors({})
    }, 350)
  }

  return (
    <div className="modal" onClick={close}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <button className="icon-btn modal-close" onClick={close} aria-label={t.close}>
            <IconClose size={20} />
          </button>

          {sent ? (
            <div className="order-success">
              <div className="success-icon">
                <IconCheck size={44} />
              </div>
              <h3 className="display gold-text">{t.successTitle}</h3>
              <p>{t.successSub}</p>
              <div className="order-no">
                {t.successOrder}: <b>{sent}</b>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a className="btn btn-wa" href={buildWaUrl()} target="_blank" rel="noreferrer">
                  <IconWhatsApp size={18} /> {t.successOpen}
                </a>
                <button className="btn btn-ghost" onClick={close}>
                  {t.successAgain}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="co-head">
                <h3 className="display">
                  <span className="gold-text">{t.coTitle}</span>
                </h3>
                <p>{t.coSub}</p>
              </div>
              <div className="co-grid">
                <form onSubmit={submit} noValidate>
                  <div className={`form-field ${errors.name ? 'invalid' : ''}`}>
                    <label>{t.coName} *</label>
                    <input value={form.name} onChange={set('name')} placeholder={t.coNamePh} autoFocus />
                    {errors.name && <span className="err">{errors.name}</span>}
                  </div>
                  <div className="form-row">
                    <div className={`form-field ${errors.phone ? 'invalid' : ''}`}>
                      <label>{t.coPhone} *</label>
                      <input value={form.phone} onChange={set('phone')} placeholder={t.coPhonePh} inputMode="tel" dir="ltr" style={{ textAlign: isAr ? 'right' : 'left' }} />
                      {errors.phone && <span className="err">{errors.phone}</span>}
                    </div>
                    <div className={`form-field ${errors.city ? 'invalid' : ''}`}>
                      <label>{t.coCity} *</label>
                      <input value={form.city} onChange={set('city')} placeholder={t.coCityPh} list="lb-cities" />
                      <datalist id="lb-cities">
                        {['بيروت', 'طرابلس', 'صيدا', 'صور', 'زحلة', 'جونيه', 'جبيل', 'النبطية', 'بعلبك', 'عاليه', 'Beirut', 'Tripoli', 'Saida', 'Tyre', 'Zahle', 'Jounieh'].map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                      {errors.city && <span className="err">{errors.city}</span>}
                    </div>
                  </div>
                  <div className={`form-field ${errors.area ? 'invalid' : ''}`}>
                    <label>{t.coArea} *</label>
                    <input value={form.area} onChange={set('area')} placeholder={t.coAreaPh} />
                    {errors.area && <span className="err">{errors.area}</span>}
                  </div>
                  <div className={`form-field ${errors.address ? 'invalid' : ''}`}>
                    <label>{t.coAddress} *</label>
                    <textarea rows="2" value={form.address} onChange={set('address')} placeholder={t.coAddressPh} />
                    {errors.address && <span className="err">{errors.address}</span>}
                  </div>
                  <div className="form-field">
                    <label>
                      {t.coNotes} <small>{t.coNotesOpt}</small>
                    </label>
                    <textarea rows="2" value={form.notes} onChange={set('notes')} placeholder={t.coNotesPh} />
                  </div>
                  <div className="co-actions">
                    <button type="submit" className="btn btn-wa" style={{ width: '100%' }}>
                      <IconWhatsApp size={19} /> {t.coSubmit}
                    </button>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => {
                        cart.setCheckoutOpen(false)
                        cart.setOpen(true)
                      }}
                    >
                      {t.coBack}
                    </button>
                  </div>
                </form>

                <div className="co-summary">
                  <h4>
                    {t.coSummary}
                    <span>
                      {cart.count} {t.coItems}
                    </span>
                  </h4>
                  {cart.items.map((i) => (
                    <div className="co-item" key={i.id}>
                      <img src={i.image} alt="" />
                      <span className="n">
                        {isAr ? i.nameAr : i.nameEn}
                        <small>
                          {i.size} × {i.qty}
                        </small>
                      </span>
                      <span className="p">{fmt(i.price * i.qty)}</span>
                    </div>
                  ))}
                  <div className="co-total-row">
                    <span>{t.coTotal}</span>
                    <b>
                      {fmt(cart.total)}
                      <span className="lbp num" dir="ltr">
                        ≈ {fmtBoth(cart.total).match(/\(([^)]+)\)/)?.[1]}
                      </span>
                    </b>
                  </div>
                  <p className="co-delivery">
                    <IconTruck size={15} /> {t.coDeliveryInfo}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
  )
}
