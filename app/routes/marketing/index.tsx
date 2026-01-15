import {BeforeAfterSection} from '~/components/marketing/BeforeAfterSection'
import {CTASection} from '~/components/marketing/CTASection'
import {HeroSection} from '~/components/marketing/HeroSection'
import {PropertiesSection} from '~/components/marketing/PropertiesSection'
import {ServicesSection} from '~/components/marketing/ServicesSection'
import {StatsSection} from '~/components/marketing/StatsSection'
import {TestimonialsSection} from '~/components/marketing/TestimonialsSection'

export default function MarketingHome() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <BeforeAfterSection />
      <TestimonialsSection />
      <PropertiesSection />
      <CTASection />
    </>
  )
}
