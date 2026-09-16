import { useLang } from '../i18n'
import { IconDiamond } from './Icons'

export default function Hero() {
  const { t } = useLang()
  const sparkles = [
    { top: '18%', insetInlineStart: '8%', animationDelay: '0s' },
    { top: '30%', insetInlineStart: '46%', animationDelay: '1.2s' },
    { top: '62%', insetInlineStart: '12%', animationDelay: '2s' },
    { top: '14%', insetInlineStart: '70%', animationDelay: '0.6s' },
    { top: '70%', insetInlineStart: '58%', animationDelay: '1.7s' },
    { top: '42%', insetInlineStart: '85%', animationDelay: '2.6s' },
  ]
  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <img src="/images/hero.jpg" alt="" aria-hidden="true" />
      </div>
      {sparkles.map((s, i) => (
        <span key={i} className="sparkle" style={s} aria-hidden="true" />
      ))}

      <div className="container hero-inner">
        <div>
          <span className="hero-badge">
            <IconDiamond size={15} /> {t.heroBadge}
          </span>
          <h1 className="display hero-title">
            {t.heroTitleA}
            <br />
            <span className="shimmer">{t.heroTitleB}</span>
          </h1>
          <p className="hero-sub">{t.heroSub}</p>
          <div className="hero-ctas">
            <a href="#shop" className="btn btn-gold">
              {t.heroCtaShop}
            </a>
            <a href="#offers" className="btn btn-ghost">
              {t.heroCtaOffers}
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <b className="gold-text num">+250</b>
              <span>{t.heroStat1}</span>
            </div>
            <div className="hero-stat">
              <b className="gold-text num">+10K</b>
              <span>{t.heroStat2}</span>
            </div>
            <div className="hero-stat">
              <b className="gold-text num">100%</b>
              <span>{t.heroStat3}</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <span className="hero-glow" aria-hidden="true" />
          <img className="hero-bottle" src="/images/hero-bottle.jpg" alt="Diamond Perfume" />
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        {t.scrollDown}
      </div>
    </section>
  )
}
