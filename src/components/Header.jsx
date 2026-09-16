import { useState } from 'react'
import { useLang, useCurr } from '../i18n'
import { useCart } from '../cart'
import { CONFIG } from '../config'
import { IconCart, IconClose, IconDiamond, IconMenu, IconPhone, IconInstagram, IconTikTok, IconFacebook } from './Icons'

const LogoSvg = () => (
  <svg className="brand-logo" viewBox="0 0 64 64" aria-hidden="true">
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f6e27a" />
        <stop offset="0.5" stopColor="#d4af37" />
        <stop offset="1" stopColor="#8a6a1f" />
      </linearGradient>
    </defs>
    <path d="M32 10 L50 26 L32 56 L14 26 Z" fill="none" stroke="url(#lg)" strokeWidth="3.4" strokeLinejoin="round" />
    <path d="M14 26 H50 M32 10 L23 26 L32 56 M32 10 L41 26 L32 56" fill="none" stroke="url(#lg)" strokeWidth="2.2" strokeLinejoin="round" />
  </svg>
)

export function Brand() {
  const { isAr } = useLang()
  return (
    <a href="#home" className="brand">
      <LogoSvg />
      <span className="brand-name">
        <b className="gold-text">Diamond Perfume</b>
        <small>{isAr ? 'عطور الماس • فردان' : 'Verdun • Beirut'}</small>
      </span>
    </a>
  )
}

export default function Header() {
  const { t, toggleLang, isAr } = useLang()
  const { curr, setCurr } = useCurr()
  const cart = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    ['#home', t.navHome],
    ['#shop', t.navShop],
    ['#offers', t.navOffers],
    ['#about', t.navAbout],
    ['#location', t.navLocation],
  ]

  return (
    <>
      <div className="topbar" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="marquee">
          {[0, 1].map((n) => (
            <span key={n} aria-hidden={n === 1}>
              {[t.top1, t.top2, t.top3, t.top4, t.top5].map((txt, i) => (
                <span key={i}>
                  <i>✦</i> {txt}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <header className="header">
        <div className="container header-inner">
          <Brand />

          <nav className="nav">
            {links.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <div className="pill-toggle hide-m" title="Currency">
              <button className={curr === 'USD' ? 'active' : ''} onClick={() => setCurr('USD')}>
                $ USD
              </button>
              <button className={curr === 'LBP' ? 'active' : ''} onClick={() => setCurr('LBP')}>
                {t.curLBP}
              </button>
            </div>

            <div className="pill-toggle" title="Language">
              <button className={isAr ? 'active' : ''} onClick={() => !isAr || toggleLang()}>
                عربي
              </button>
              <button className={!isAr ? 'active' : ''} onClick={() => isAr && toggleLang()}>
                EN
              </button>
            </div>

            <a className="icon-btn hide-m" href={CONFIG.phoneLink} title={t.callUs}>
              <IconPhone size={19} />
            </a>

            <button className="icon-btn" onClick={() => cart.setOpen(true)} title={t.cart} aria-label={t.cart}>
              <IconCart size={20} />
              {cart.count > 0 && <span className="badge">{cart.count}</span>}
            </button>

            <button className="icon-btn burger" onClick={() => setMenuOpen(true)} aria-label="Menu">
              <IconMenu size={20} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          <button className="icon-btn menu-close" onClick={() => setMenuOpen(false)} aria-label={t.close}>
            <IconClose size={22} />
          </button>
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <div className="social-row" style={{ marginTop: '1rem' }}>
            <a href={CONFIG.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <IconInstagram size={18} />
            </a>
            <a href={CONFIG.social.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
              <IconTikTok size={18} />
            </a>
            <a href={CONFIG.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <IconFacebook size={18} />
            </a>
          </div>
        </div>
      )}
    </>
  )
}
