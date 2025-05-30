import React from 'react'
import PlanCard from './PlanCard'
function PricingSection() {
  const plans = [
    {
      title: 'Basic',
      price: '$10/month',
      features: ['Access to 50+ basic courses', 'Basic learning materials', 'Community forum access', '1 skill assessment per month', 'Email support'],
      description: 'For beginners who want to learn the basics',
      important: false
    },
    {
      title: 'Silver',
      price: '$20/month',
      features: ['Access to 200+ premium courses', 'Advanced learning materials', 'Community forum with priority access', 'Unlimited skill assessments', '24/7 email & chat support', 'Downloadable resources', 'Course completion certificates'],
      description: 'For intermediate learners who want to improve their skills',
      important: true
    },
    {
      title: 'Gold',
      price: '$30/month',
      features: ['Access to all 500+ courses', 'Premium learning materials', 'Dedicated community forum', 'Unlimited skill assessments', '24/7 priority support', 'Team management dashboard', 'Custom learning paths', 'API access', 'Onboarding assistance'],
      description: 'For advanced learners who want to master their skills',
      important: false
    }
    
  ] 
  
  return (
    <div className='mt-10'>
        <div className='flex flex-col justify-center items-center'>
            <div className='text-primary font-primary bg-primary/20 mb-4 text-sm sm:text-base font-bold rounded-full px-4 py-2 w-fit'>
              <p>Simple Pricing</p>
            </div>
            <h2 className='text-foreground font-primary text-xl sm:text-2xl md:text-3xl font-bold text-center'>Choose the <span className='text-primary'>Plan</span> that's Right for You</h2>
            <p className='text-muted-foreground text-base sm:text-base text-center mt-1 sm:mt-2 px-4 sm:px-0'>
                We offer a range of plans to suit your needs.
            </p>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 md:px-8'>
            {plans.map((plan) => (
                <div className='flex justify-center'>
                    <PlanCard key={plan.title} {...plan} />
                </div>
            ))}
        </div>
    </div>
  )
}

export default PricingSection