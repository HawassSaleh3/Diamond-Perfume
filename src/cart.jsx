import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'

const CartCtx = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dp-cart') || '[]')
    } catch {
      return []
    }
  })
  const [open, setOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    localStorage.setItem('dp-cart', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    document.body.style.overflow = open || checkoutOpen ? 'hidden' : ''
  }, [open, checkoutOpen])

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }, [])

  const api = useMemo(
    () => ({
      items,
      open,
      setOpen,
      checkoutOpen,
      setCheckoutOpen,
      toast,
      showToast,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
      add: (p, qty = 1) =>
        setItems((prev) => {
          const ex = prev.find((i) => i.id === p.id)
          if (ex) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i))
          return [
            ...prev,
            {
              id: p.id,
              price: p.price,
              oldPrice: p.oldPrice,
              size: p.size,
              image: p.image,
              nameAr: p.nameAr,
              nameEn: p.nameEn,
              qty,
            },
          ]
        }),
      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i))
        ),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      clear: () => setItems([]),
    }),
    [items, open, checkoutOpen, toast, showToast]
  )

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>
}

export const useCart = () => useContext(CartCtx)
