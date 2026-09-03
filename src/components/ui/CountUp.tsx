import { useInView, useCountUp } from '@/lib/hooks'

interface CountUpProps {
  /** Ex.: "97%", "R$ 480 mi", "18", 41. Anima só a parte numérica. */
  value: string | number
  duration?: number
  className?: string
}

/** Anima o primeiro número encontrado em `value` de 0 até o alvo quando entra na tela. */
export function CountUp({ value, duration = 1400, className }: CountUpProps) {
  const [ref, inView] = useInView<HTMLSpanElement>()
  const raw = String(value)
  const match = raw.match(/-?\d[\d.]*/)
  const target = match ? Math.round(parseFloat(match[0])) : 0
  const current = useCountUp(target, inView, duration)

  const text = match ? raw.replace(match[0], String(current)) : raw

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {text}
    </span>
  )
}
