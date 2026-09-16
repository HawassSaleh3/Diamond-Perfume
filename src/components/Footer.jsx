import { CONFIG } from '../config'
import { useLang } from '../i18n'
import { Brand } from './Header'
import { IconPin, IconPhone, IconWhatsApp, IconClock, IconInstagram, IconTikTok, IconFacebook } from './Icons'

export default function Footer() {
  const { t, isAr, lang } = useLang()
  const links = [
    ['#home', t.navHome],
    ['#shop', t.navShop],
    ['#offers', t.navOffers],
    ['#about', t.navAbout],
    ['#location', t.navLocation],
  ]
  return (
    <footer className="footer">
      <div className="container">
        <div className="foot-grid">
          <div className="foot-about">
            <Brand />
            <p>{t.footAbout}</p>
            <div className="social-row">
              <a href={CONFIG.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <IconInstagram size={17} />
              </a>
              <a href={CONFIG.social.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
                <IconTikTok size={17} />
              </a>
              <a href={CONFIG.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <IconFacebook size={16} />
              </a>
            </div>
          </div>

          <div className="foot-col">
            <h4>{t.footLinks}</h4>
            <ul>
              {links.map(([href, label]) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="foot-col">
            <h4>{t.footContact}</h4>
            <ul className="foot-contact">
              <li>
                <IconPin size={16} />
                <span>{CONFIG.address[lang]}</span>
              </li>
              <li>
                <IconPhone size={16} />
                <a href={CONFIG.phoneLink} className="num" dir="ltr">
                  {CONFIG.phoneDisplay}
                </a>
              </li>
              <li>
                <IconWhatsApp size={16} />
                <a href={`https://wa.me/${CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer" className="num" dir="ltr">
                  {CONFIG.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>

          <div className="foot-col">
            <h4>{t.footHours}</h4>
            <ul className="foot-contact">
              <li>
                <IconClock size={16} />
                <span>
                  {CONFIG.hours.weekdays[lang]}
                  <br />
                  <small style={{ color: 'var(--muted)' }}>{CONFIG.hours.time[lang]}</small>
                </span>
              </li>
            </ul>
            <a
              className="btn btn-wa btn-sm"
              style={{ marginTop: '1.2rem' }}
              href={`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(t.waMsg)}`}
              target="_blank"
              rel="noreferrer"
            >
              <IconWhatsApp size={16} /> WhatsApp
            </a>
          </div>
        </div>

        <div className="foot-bottom">
          <span>
            © {new Date().getFullYear()} <span className="gold-text">Diamond Perfume</span> — {t.footRights}
          </span>
          <span>{t.footMade} ✦ Beirut</span>
        </div>
      </div>
    </footer>
  )
}
