/* Ícones em linha (sem dependência externa). Herdam `currentColor`. */
import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Base({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export const IconBed = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 7v11M3 12h18v6M21 18v-4a3 3 0 0 0-3-3H9v4" />
    <path d="M6 9.5A1.5 1.5 0 0 1 7.5 8h1A1.5 1.5 0 0 1 10 9.5V11H6z" />
  </Base>
)

export const IconBath = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
    <path d="M6 12V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2M8.5 6.5h3" />
    <path d="M7 19l-1 2M18 19l1 2" />
  </Base>
)

export const IconCar = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 17h14M4 17v-4l2-5a2 2 0 0 1 1.9-1.4h8.2A2 2 0 0 1 18 8l2 5v4" />
    <path d="M4 13h16" />
    <circle cx="7.5" cy="17.5" r="1.5" />
    <circle cx="16.5" cy="17.5" r="1.5" />
  </Base>
)

export const IconRuler = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 15 15 3l6 6L9 21z" />
    <path d="M7 11l2 2M11 7l2 2M15 11l2 2" />
  </Base>
)

export const IconStairs = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 20h4v-4h4v-4h4V8h4V4" />
  </Base>
)

export const IconMapPin = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </Base>
)

export const IconArrowUpRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Base>
)

export const IconArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
)

export const IconArrowLeft = (p: IconProps) => (
  <Base {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Base>
)

export const IconHeart = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 20s-7-4.35-9.5-8.5C1 8 2.5 4.5 6 4.5c2 0 3.2 1 4 2 .8-1 2-2 4-2 3.5 0 5 3.5 3.5 7C19 15.65 12 20 12 20z" />
  </Base>
)

export const IconHeartFilled = (p: IconProps) => (
  <Base fill="currentColor" {...p}>
    <path d="M12 20s-7-4.35-9.5-8.5C1 8 2.5 4.5 6 4.5c2 0 3.2 1 4 2 .8-1 2-2 4-2 3.5 0 5 3.5 3.5 7C19 15.65 12 20 12 20z" />
  </Base>
)

export const IconPlay = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
  </Base>
)

export const IconClose = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
)

export const IconChevronLeft = (p: IconProps) => (
  <Base {...p}>
    <path d="M15 6l-6 6 6 6" />
  </Base>
)

export const IconChevronRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 6l6 6-6 6" />
  </Base>
)

export const IconChevronDown = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 9l6 6 6-6" />
  </Base>
)

export const IconMenu = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Base>
)

export const IconSearch = (p: IconProps) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Base>
)

export const IconSun = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5 3.5 3.5M20.5 20.5 19 19M19 5l1.5-1.5M3.5 20.5 5 19" />
  </Base>
)

export const IconMoon = (p: IconProps) => (
  <Base {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </Base>
)

export const IconCheck = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Base>
)

export const IconPlus = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
)

export const IconTrash = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13M9 7V4h6v3" />
  </Base>
)

export const IconEdit = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 20h4L20 8l-4-4L4 16z" />
    <path d="M14 6l4 4" />
  </Base>
)

export const IconLogout = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </Base>
)

export const IconStar = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 3 2.7 5.9 6.3.7-4.7 4.3 1.3 6.4L12 17l-5.9 3.3 1.3-6.4L2.7 9.6l6.3-.7z" />
  </Base>
)

export const IconQuote = (p: IconProps) => (
  <Base {...p}>
    <path d="M10 8c-3 0-5 2-5 5v3h5v-5H7c0-1.5 1-2.5 3-2.5zM19 8c-3 0-5 2-5 5v3h5v-5h-3c0-1.5 1-2.5 3-2.5z" fill="currentColor" stroke="none" />
  </Base>
)

export const IconPhone = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 5c0-1 1-2 2-2h2l2 5-2 1.5a11 11 0 0 0 4.5 4.5L16 16l5 2v2c0 1-1 2-2 2A16 16 0 0 1 4 5z" />
  </Base>
)

export const IconMail = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Base>
)

export const IconWhatsApp = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.6-1.3A9 9 0 1 0 12 3z" />
    <path d="M8.5 8.8c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.8 1.8c.1.3 0 .5-.1.7l-.5.6c-.2.2-.3.4-.1.7a6 6 0 0 0 2.8 2.5c.3.1.5.1.7-.1l.6-.7c.2-.2.4-.3.7-.2l1.7.8c.3.1.4.3.4.6 0 .9-.7 1.7-1.5 1.9-.8.2-1.7.2-3.8-.9a9 9 0 0 1-3.9-3.9c-1-1.9-1-3-.8-3.8z" fill="currentColor" stroke="none" />
  </Base>
)

export const IconInstagram = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1" fill="currentColor" />
  </Base>
)

export const IconFacebook = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1z" />
  </Base>
)

export const IconLinkedin = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 10v7" />
  </Base>
)

export const IconYoutube = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="6" width="18" height="12" rx="3" />
    <path d="m11 9 4 3-4 3z" fill="currentColor" />
  </Base>
)

export const IconShare = (p: IconProps) => (
  <Base {...p}>
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" />
  </Base>
)

export const IconCalendar = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </Base>
)

export const IconSparkle = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3s1.2 4.8 3 6.6S21 12 21 12s-4.2 1.2-6 3-3 6-3 6-1.2-4.8-3-6.6S3 12 3 12s4.2-1.2 6-3 3-6 3-6z" />
  </Base>
)

export const IconImage = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="2" />
    <path d="m4 18 5-4 3 2 4-4 4 4" />
  </Base>
)

export const IconGrip = (p: IconProps) => (
  <Base {...p}>
    <circle cx="9" cy="6" r="1" fill="currentColor" />
    <circle cx="15" cy="6" r="1" fill="currentColor" />
    <circle cx="9" cy="12" r="1" fill="currentColor" />
    <circle cx="15" cy="12" r="1" fill="currentColor" />
    <circle cx="9" cy="18" r="1" fill="currentColor" />
    <circle cx="15" cy="18" r="1" fill="currentColor" />
  </Base>
)

export const IconGauge = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 15a8 8 0 1 1 16 0" />
    <path d="m12 15 4-4" />
    <circle cx="12" cy="15" r="1.4" fill="currentColor" />
  </Base>
)
