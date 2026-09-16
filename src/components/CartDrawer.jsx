import { useLang, useCurr } from '../i18n'
import { useCart } from '../cart'
import { CONFIG } from '../config'
import { IconCart, IconClose, IconTrash, IconTruck, IconWhatsApp } from './Icons'

export default function CartDrawer() {
  const { t, isAr } = useLang()
  const { fmt } = useCurr()
  const cart = useCart()

  if (!cart.open) return null

  return (
    <>
      <div className="overlay" onClick={() => cart.setOpen(false)} />
      <aside className="drawer" role="dialog" aria-label={t.cartTitle}>
        <div className="drawer-head">
          <h3>
            <IconCart size={20} /> {t.cartTitle}
            {cart.count > 0 && <span className="badge">{cart.count}</span>}
          </h3>
          <button className="icon-btn" onClick={() => cart.setOpen(false)} aria-label={t.close}>
            <IconClose size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {cart.items.length === 0 ? (
            <div className="cart-empty">
              <IconCart size={56} strokeWidth={1} />
              <b>{t.cartEmpty}</b>
              <span>{t.cartEmptySub}</span>
              <a href="#shop" className="btn btn-gold btn-sm" onClick={() => cart.setOpen(false)}>
                {t.cartStart}
              </a>
            </div>
          ) : (
            <>
              {cart.items.map((i) => (
                <div className="cart-item" key={i.id}>
                  <img src={i.image} alt={isAr ? i.nameAr : i.nameEn} />
                  <div>
                    <div className="ci-name">{isAr ? i.nameAr : i.nameEn}</div>
                    <div className="ci-size num">{i.size}</div>
                    <div className="qty-ctrl">
                      <button onClick={() => cart.setQty(i.id, i.qty + 1)} aria-label="+">
                        +
                      </button>
                      <span>{i.qty}</span>
                      <button onClick={() => cart.setQty(i.id, i.qty - 1)} aria-label="-">
                        −
                      </button>
                    </div>
                  </div>
                  <div className="ci-side">
                    <button className="ci-remove" onClick={() => cart.remove(i.id)} aria-label="remove">
                      <IconTrash size={17} />
                    </button>
                    <span className="ci-price">{fmt(i.price * i.qty)}</span>
                  </div>
                </div>
              ))}
              <button className="link-btn" onClick={cart.clear}>
                {t.cartClear}
              </button>
            </>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="drawer-foot">
            <div className="subtotal">
              <span>{t.cartSubtotal}</span>
              <b>{fmt(cart.total)}</b>
            </div>
            <p className="delivery-note">
              <IconTruck size={15} /> {t.cartDeliveryNote}
            </p>
            <button
              className="btn btn-wa"
              onClick={() => {
                cart.setOpen(false)
                cart.setCheckoutOpen(true)
              }}
            >
              <IconWhatsApp size={19} /> {t.cartCheckout}
            </button>
            <button className="link-btn" onClick={() => cart.setOpen(false)}>
              {t.cartContinue}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
