import { Hero } from '@/components/home/Hero'
import { FeaturedProperties } from '@/components/home/FeaturedProperties'
import { AboutSection } from '@/components/home/AboutSection'
import { RegionsSection } from '@/components/home/RegionsSection'
import { CTASection } from '@/components/home/CTASection'
import { usePageMeta } from '@/lib/usePageMeta'
import site from '@/config/site.config'
import styles from './HomePage.module.css'

export function HomePage() {
  usePageMeta(`${site.brand.name} · ${site.brand.role}`, site.hero.subtitle)

  return (
    <>
      <Hero />
      <FeaturedProperties />

      {/* Bloco "sobre" contínuo: quem conduz + onde atuo + contato direto */}
      <div className={styles.about}>
        <AboutSection />
        <RegionsSection />
        <CTASection />
      </div>
    </>
  )
}
