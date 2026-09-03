import { useEffect, useRef, useState } from 'react'

/* -------------------------------------------------------------------------- */
/* Scroll reveal — adiciona .is-visible quando o elemento entra na viewport.   */
/* IntersectionObserver para a animação + fallbacks (scroll/resize/timeout)    */
/* para garantir que o conteúdo NUNCA fique preso invisível.                   */
/* -------------------------------------------------------------------------- */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number
}) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let done = false
    let observer: IntersectionObserver | null = null
    let timer = 0

    const inView = (margin: number) => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      return r.top < vh * margin && r.bottom > 0
    }

    const onScrollOrResize = () => {
      if (inView(0.9)) reveal()
    }

    const cleanup = () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      if (observer) observer.disconnect()
      if (timer) window.clearTimeout(timer)
    }

    const reveal = () => {
      if (done) return
      done = true
      el.classList.add('is-visible')
      cleanup()
    }

    // Já visível (ou quase) no carregamento: mostra sem animação de entrada.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || inView(1.15)) {
      reveal()
      return cleanup
    }

    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) reveal()
        },
        { threshold: options?.threshold ?? 0.14, rootMargin: '0px 0px -6% 0px' },
      )
      observer.observe(el)
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)
    // Rede de segurança: se nada disparar, revela mesmo assim.
    timer = window.setTimeout(reveal, 2600)

    return cleanup
  }, [options?.threshold])

  return ref
}

/* -------------------------------------------------------------------------- */
/* Trava o scroll do body (modais, menu mobile, lightbox)                     */
/* -------------------------------------------------------------------------- */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return
    const { overflow, paddingRight } = document.body.style
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [active])
}

/* -------------------------------------------------------------------------- */
/* Media query reativa                                                        */
/* -------------------------------------------------------------------------- */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

/* -------------------------------------------------------------------------- */
/* Tecla Escape                                                               */
/* -------------------------------------------------------------------------- */
export function useOnEscape(handler: () => void, active = true) {
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handler, active])
}

/* -------------------------------------------------------------------------- */
/* Detecta quando um elemento entra na viewport (uma vez)                     */
/* -------------------------------------------------------------------------- */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  rootMargin = '0px 0px -12% 0px',
) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let done = false
    let observer: IntersectionObserver | null = null
    let timer = 0

    const near = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      return r.top < vh * 0.92 && r.bottom > 0
    }
    const trigger = () => {
      if (done) return
      done = true
      setInView(true)
      cleanup()
    }
    const onScroll = () => {
      if (near()) trigger()
    }
    const cleanup = () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (observer) observer.disconnect()
      if (timer) window.clearTimeout(timer)
    }

    if (near()) {
      trigger()
      return cleanup
    }
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) trigger()
        },
        { rootMargin, threshold: 0.2 },
      )
      observer.observe(el)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    timer = window.setTimeout(trigger, 3500)

    return cleanup
  }, [rootMargin])

  return [ref, inView] as const
}

/* -------------------------------------------------------------------------- */
/* Contador animado (0 → valor) quando visível                                */
/* -------------------------------------------------------------------------- */
export function useCountUp(target: number, run: boolean, duration = 1400) {
  const [value, setValue] = useState(0)
  const raf = useRef<number>(0)

  useEffect(() => {
    if (!run) return
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.hidden
    ) {
      setValue(target)
      return
    }
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    // Rede de segurança: garante o valor final mesmo se o rAF for pausado.
    const safety = window.setTimeout(() => setValue(target), duration + 600)
    return () => {
      cancelAnimationFrame(raf.current)
      window.clearTimeout(safety)
    }
  }, [target, run, duration])

  return value
}
