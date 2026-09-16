import { useMemo, useState } from 'react'
import { PRODUCTS, CAT_LABEL } from '../data'
import { useLang, useCurr } from '../i18n'
import { useCart } from '../cart'
import Reveal from './Reveal'
import { IconCart, IconCheck, IconClose, IconSearch, IconStar } from './Icons'

export function AddButton({ product, big = false }) {
  const { t } = useLang()
  const cart = useCart()
  const [added, setAdded] = useState(false)
  const onAdd = (e) => {
    e.stopPropagation()
    cart.add(product)
    cart.showToast(`${product.nameAr} — ${t.added}`)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }
  return (
    <button className={`add-btn ${added ? 'added' : ''} ${big ? 'btn' : ''}`} onClick={onAdd}>
      {added ? <IconCheck size={16} /> : <IconCart size={16} />}
      {added ? t.added : t.addToCart}
    </button>
  )
}

export function Price({ product }) {
  const { fmt } = useCurr()
  return (
    <div className="price">
      <span className="now">{fmt(product.price)}</span>
      {product.oldPrice && <span className="was">{fmt(product.oldPrice)}</span>}
    </div>
  )
}

export const discountPct = (p) => (p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0)

function ProductCard({ product, onQuick, delay = 0 }) {
  const { t, isAr } = useLang()
  const pct = discountPct(product)
  return (
    <Reveal className="prod-card" delay={delay}>
      <div className="prod-media" onClick={() => onQuick(product)}>
        <img src={product.image} alt={isAr ? product.nameAr : product.nameEn} loading="lazy" />
        <div className="prod-badges">
          {product.bestSeller && <span className="tag tag-gold">★ {t.bestSeller}</span>}
          {pct > 0 && <span className="tag tag-red">-{pct}%</span>}
        </div>
        <span className="quick-view">{t.quickView}</span>
      </div>
      <div className="prod-body">
        <span className="prod-cat">{CAT_LABEL[product.cat][isAr ? 'ar' : 'en']}</span>
        <h3 className="prod-name">{isAr ? product.nameAr : product.nameEn}</h3>
        <p className="prod-notes">{isAr ? product.notesAr : product.notesEn}</p>
        <div className="prod-meta">
          <span className="stars">
            <IconStar size={13} /> <span className="num">{product.rating}</span>
          </span>
          <span>•</span>
          <span className="num">{product.size}</span>
        </div>
        <div className="prod-foot">
          <Price product={product} />
          <AddButton product={product} />
        </div>
      </div>
    </Reveal>
  )
}

function QuickView({ product, onClose }) {
  const { t, isAr } = useLang()
  const { fmt } = useCurr()
  if (!product) return null
  const pct = discountPct(product)
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-box" style={{ width: 'min(820px, 100%)', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close" onClick={onClose} aria-label={t.close}>
          <IconClose size={20} />
        </button>
        <div className="qv-grid">
          <div className="qv-media">
            <img src={product.image} alt={isAr ? product.nameAr : product.nameEn} />
          </div>
          <div className="qv-body">
            <span className="prod-cat">{CAT_LABEL[product.cat][isAr ? 'ar' : 'en']}</span>
            <h3 className="display">{isAr ? product.nameAr : product.nameEn}</h3>
            <div className="prod-meta" style={{ marginBottom: 0 }}>
              <span className="stars">
                <IconStar size={14} /> <span className="num">{product.rating}</span>
              </span>
              <span>{t.ratingOf}</span>
              <span>•</span>
              <span>{product.gender[isAr ? 'ar' : 'en']}</span>
            </div>
            <p className="qv-desc">{isAr ? product.descAr : product.descEn}</p>
            <div className="qv-rows">
              <div className="qv-row">
                <span>{t.notesLabel}</span>
                <span>{isAr ? product.notesAr : product.notesEn}</span>
              </div>
              <div className="qv-row">
                <span>{t.sizeLabel}</span>
                <span className="num">{product.size}</span>
              </div>
              <div className="qv-row">
                <span>{t.catLabel}</span>
                <span>{CAT_LABEL[product.cat][isAr ? 'ar' : 'en']}</span>
              </div>
            </div>
            <div className="qv-foot">
              <div className="price">
                <span className="now gold-text">{fmt(product.price)}</span>
                {product.oldPrice && (
                  <span className="was">
                    {fmt(product.oldPrice)} — {pct}% {t.off}
                  </span>
                )}
              </div>
              <AddButton product={product} big />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Products({ activeFilter, setActiveFilter }) {
  const { t, isAr } = useLang()
  const [search, setSearch] = useState('')
  const [quick, setQuick] = useState(null)

  const filters = [
    ['all', t.filterAll],
    ['women', CAT_LABEL.women[isAr ? 'ar' : 'en']],
    ['men', CAT_LABEL.men[isAr ? 'ar' : 'en']],
    ['oriental', CAT_LABEL.oriental[isAr ? 'ar' : 'en']],
    ['niche', CAT_LABEL.niche[isAr ? 'ar' : 'en']],
    ['offers', t.filterOffers],
  ]

  const list = useMemo(() => {
    let l = PRODUCTS
    if (activeFilter === 'offers') l = l.filter((p) => p.oldPrice)
    else if (activeFilter !== 'all') l = l.filter((p) => p.cat === activeFilter)
    const q = search.trim().toLowerCase()
    if (q) l = l.filter((p) => (p.nameAr + p.nameEn + p.notesAr + p.notesEn).toLowerCase().includes(q))
    return l
  }, [activeFilter, search])

  return (
    <section className="section" id="shop">
      <div className="container">
        <Reveal className="shop-head">
          <div>
            <span className="kicker">{t.shopKicker}</span>
            <h2 className="display section-title gold-text">{t.shopTitle}</h2>
          </div>
          <div className="filters">
            {filters.map(([id, label]) => (
              <button key={id} className={`chip ${activeFilter === id ? 'active' : ''}`} onClick={() => setActiveFilter(id)}>
                {label}
              </button>
            ))}
            <div className="search-box">
              <IconSearch size={17} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPlaceholder} />
            </div>
          </div>
        </Reveal>

        <div className="prod-grid">
          {list.length === 0 && <p className="empty-msg">{t.noResults}</p>}
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} onQuick={setQuick} delay={(i % 4) + 1} />
          ))}
        </div>
      </div>
      {quick && <QuickView product={quick} onClose={() => setQuick(null)} />}
    </section>
  )
}
