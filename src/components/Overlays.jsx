import { CONFIG } from '../config'
import { useLang } from '../i18n'
import { useCart } from '../cart'
import { IconCheck, IconWhatsApp } from './Icons'

export function FloatingWhatsApp() {
  const { t } = useLang()
  return (
    <a
      className="wa-float"
      href={`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(t.waMsg)}`}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
    >
      <IconWhatsApp size={30} />
      <span className="wa-tip">{t.waTooltip}</span>
    </a>
  )
}

export function Toast() {
  const cart = useCart()
  if (!cart.toast) return null
  return (
    <div className="toast" role="status">
      <IconCheck size={18} />
      {cart.toast}
    </div>
  )
}
