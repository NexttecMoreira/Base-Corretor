import type { ElementType, ReactNode } from 'react'
import { useScrollReveal } from '@/lib/hooks'

interface RevealProps {
  children: ReactNode
  as?: ElementType
  /** Atraso em ms para efeito cascata. */
  delay?: number
  className?: string
  /** Só rastreia a visibilidade (adiciona .is-visible); a animação fica por conta do CSS do filho. */
  plain?: boolean
}

export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className,
  plain = false,
}: RevealProps) {
  const ref = useScrollReveal<HTMLElement>()
  return (
    <Tag
      ref={ref}
      className={[plain ? 'in-view' : 'reveal', className].filter(Boolean).join(' ')}
      style={delay ? ({ ['--reveal-delay' as string]: `${delay}ms` } as object) : undefined}
    >
      {children}
    </Tag>
  )
}
