import { useEffect, useRef } from 'react'

export default function Reveal({ children, className = '', delay = 0, as: Tag = 'div', ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in')
          obs.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`reveal ${delay ? `reveal-d${delay}` : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
