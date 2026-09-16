import { CONFIG } from '../config'
import { CATEGORIES, PRODUCTS } from '../data'
import { useLang, useCurr } from '../i18n'
import { useCart } from '../cart'
import Reveal from './Reveal'
import { Price, discountPct } from './Products'
import {
  IconTruck, IconShield, IconGift, IconCash, IconArrow, IconPin, IconPhone,
  IconClock, IconWhatsApp, IconDiamond, IconCheck,
} from './Icons'

/* ── Trust bar ── */
export function TrustBar() {
  const { t } = useLang()
  const items = [
    [<IconTruck size={26} key="i" />, t.top1, t.aboutFeat2D],
    [<IconShield size={26} key="i" />, t.aboutFeat1T, t.aboutFeat1D],
    [<IconGift size={26} key="i" />, t.top3, t.aboutFeat3D],
    [<IconCash size={26} key="i" />, t.top4, t.coDeliveryInfo],
  ]
  return (
    <div className="trust">
      <div className="container trust-grid">
        {items.map(([icon, b, s], i) => (
          <Reveal className="trust-item" key={i} delay={i + 1}>
            {icon}
            <div>
              <b>{b}</b>
              <span>{s}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

/* ── Categories ── */
export function Categories({ onSelect }) {
  const { t, isAr } = useLang()
  return (
    <section className="section" id="categories">
      <div className="container">
        <Reveal className="head-center">
          <span className="kicker center">{t.catKicker}</span>
          <h2 className="display section-title">
            <span className="gold-text">{t.catTitle}</span>
          </h2>
        </Reveal>
        <div className="cat-grid">
          {CATEGORIES.map((c, i) => (
            <Reveal
              as="a"
              key={c.id}
              className="cat-card"
              delay={i + 1}
              href="#shop"
              onClick={() => onSelect(c.id)}
            >
              <img src={c.image} alt={isAr ? c.ar : c.en} loading="lazy" />
              <div className="cat-info">
                <h3>{isAr ? c.ar : c.en}</h3>
                <p>{isAr ? c.descAr : c.descEn}</p>
                <span className="link">
                  {t.catExplore} <IconArrow size={15} />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Offers ── */
export function Offers() {
  const { t, isAr } = useLang()
  const cart = useCart()
  const offers = PRODUCTS.filter((p) => p.oldPrice)
  return (
    <section className="section offers" id="offers">
      <div className="container">
        <Reveal className="head-center">
          <span className="kicker center">{t.offersKicker}</span>
          <h2 className="display section-title">
            <span className="gold-text">{t.offersTitle}</span>
          </h2>
          <p className="section-sub">{t.offersSub}</p>
        </Reveal>

        <div className="offer-grid">
          {offers.map((p, i) => (
            <Reveal className="offer-card" key={p.id} delay={i + 1}>
              <div className="offer-media">
                <img src={p.image} alt={isAr ? p.nameAr : p.nameEn} loading="lazy" />
                <span className="offer-off">-{discountPct(p)}%</span>
              </div>
              <div className="offer-body">
                <h3>{isAr ? p.nameAr : p.nameEn}</h3>
                <p className="notes">{isAr ? p.notesAr : p.notesEn}</p>
                <div className="offer-foot">
                  <Price product={p} />
                  <button
                    className="btn btn-gold btn-sm"
                    onClick={() => {
                      cart.add(p)
                      cart.setOpen(true)
                    }}
                  >
                    {t.offerCta}
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="offer-note">{t.offerNote}</Reveal>
      </div>
    </section>
  )
}

/* ── About ── */
export function About() {
  const { t, isAr } = useLang()
  const feats = [
    [<IconShield size={22} key="i" />, t.aboutFeat1T, t.aboutFeat1D],
    [<IconTruck size={22} key="i" />, t.aboutFeat2T, t.aboutFeat2D],
    [<IconGift size={22} key="i" />, t.aboutFeat3T, t.aboutFeat3D],
  ]
  return (
    <section className="section" id="about">
      <div className="container about-grid">
        <Reveal className="about-img">
          <img src="/images/store.jpg" alt="Diamond Perfume — Verdun" loading="lazy" />
          <div className="about-exp">
            <b className="num">10+</b>
            <span>{isAr ? 'سنوات من الشغف' : 'Years of passion'}</span>
          </div>
        </Reveal>
        <Reveal className="about-text" delay={2}>
          <span className="kicker">{t.aboutKicker}</span>
          <h2 className="display section-title">
            {(() => {
              const [p1, p2] = t.aboutTitle.split('…')
              return (
                <>
                  {p1}
                  {p2 && (
                    <>
                      … <span className="gold-text">{p2}</span>
                    </>
                  )}
                </>
              )
            })()}
          </h2>
          <p>{t.aboutP1}</p>
          <p>{t.aboutP2}</p>
          <div className="about-feats">
            {feats.map(([icon, b, s], i) => (
              <div className="feat" key={i}>
                {icon}
                <b>{b}</b>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <div className="hours-card">
            <IconClock size={26} />
            <div>
              <b>{t.hoursTitle}</b>
              <span>
                {CONFIG.hours.weekdays[isAr ? 'ar' : 'en']} • {CONFIG.hours.time[isAr ? 'ar' : 'en']}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── Location ── */
export function Location() {
  const { t, isAr, lang } = useLang()
  return (
    <section className="section" id="location" style={{ background: 'var(--bg-2)', borderBlock: '1px solid var(--line)' }}>
      <div className="container">
        <Reveal className="head-center" style={{ marginBottom: '3rem' }}>
          <span className="kicker center">{t.locKicker}</span>
          <h2 className="display section-title">
            <span className="gold-text">{t.locTitle}</span>
          </h2>
        </Reveal>
        <div className="loc-grid">
          <Reveal className="loc-info">
            <div className="loc-item">
              <IconPin size={22} />
              <div>
                <b>{t.locAddress}</b>
                <span>{CONFIG.address[lang]}</span>
                <small>{isAr ? 'مقابل سنتر فردان' : 'Verdun, Beirut'}</small>
              </div>
            </div>
            <a className="loc-item" href={CONFIG.phoneLink}>
              <IconPhone size={22} />
              <div>
                <b>{t.locPhone}</b>
                <span className="num" dir="ltr">{CONFIG.phoneDisplay}</span>
              </div>
            </a>
            <div className="loc-item">
              <IconClock size={22} />
              <div>
                <b>{t.locHours}</b>
                <span>{CONFIG.hours.weekdays[lang]}</span>
                <small>{CONFIG.hours.time[lang]}</small>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
              <a className="btn btn-gold" href={CONFIG.mapsShareUrl} target="_blank" rel="noreferrer">
                <IconPin size={17} /> {t.locDirections}
              </a>
              <a
                className="btn btn-wa"
                href={`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(t.waMsg)}`}
                target="_blank"
                rel="noreferrer"
              >
                <IconWhatsApp size={18} /> WhatsApp
              </a>
            </div>
          </Reveal>
          <Reveal className="map-wrap" delay={2}>
            <iframe
              title="Diamond Perfume — Google Maps"
              src={CONFIG.mapEmbed(lang)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── CTA Banner ── */
export function CtaBanner() {
  const { t } = useLang()
  return (
    <section className="section" id="cta">
      <div className="container">
        <Reveal className="cta-banner">
          <h2 className="display">
            {t.heroTitleA} <span className="gold-text">{t.heroTitleB}</span>
          </h2>
          <p>{t.heroSub}</p>
          <div className="hero-ctas">
            <a href="#shop" className="btn btn-gold">
              {t.heroCtaShop} <IconDiamond size={16} />
            </a>
            <a
              className="btn btn-wa"
              href={`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(t.waMsg)}`}
              target="_blank"
              rel="noreferrer"
            >
              <IconWhatsApp size={18} /> +961 71 167 878
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
