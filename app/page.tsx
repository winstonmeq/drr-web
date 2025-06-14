'use client'

import SiteHeader from './landing/site-header'
import HeroSection from './landing/hero-section'
import FeaturesSection from './landing/features-section'
import SafetyTipsSection from './landing/safety-tips'
import CtaSection from './landing/cta-section'
import SiteFooter from './landing/site-footer'
import PricingSection from './landing/pricing-section'
import ContactSection from './landing/contact-section'



const MainPage = () => {
 

 
  return (
     <div className="flex flex-col w-full min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection id="features" />
        <PricingSection id="pricing" />
        <SafetyTipsSection />
        <ContactSection id="contact" />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
      )
}

export default MainPage
