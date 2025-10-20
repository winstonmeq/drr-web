
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Users, Package, Crown } from 'lucide-react';
import Link from 'next/link';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  subscriptionFee?: number;
  installationFee?: number;
  userCount?: string;
  features: PlanFeature[];
  ctaText: string;
  ctaLink: string;
  isFeatured?: boolean;
  customNote?: string;
}

const plans: PricingPlan[] = [
  {
    id: 'basic',
    title: 'FREE PLAN',
    icon: Package,
    description: 'Essential features for rural municipality.',
    // subscriptionFee: 0,
    // installationFee: 0,
    // userCount: 'Unlimited registered mobile devices',
    features: [
                  { text: 'No subscription and no installation fees', included: true },

            { text: 'Unlimited registered mobile devices', included: true },

      { text: 'Supports up to 500 DRR Codes', included: true },
      { text: 'Standard Customer Support', included: true },
      { text: 'Web/Mobile Incident Management System', included: true },
      { text: '1 Week Basic Reporting', included: true },
    ],
    ctaText: 'Get Started',
    ctaLink: '#contact',
  },
  {
    id: 'premium',
    title: 'Premium',
    icon: Star,
    description: 'Advanced capabilities for growing organizations.',
    subscriptionFee: 150000,
    installationFee: 50000,
    // userCount: 'Unlimited registered mobile devices',
    features: [
       { text: 'Unlimited registered mobile devices', included: true },
      { text: 'Supports up to 2000 DRR Codes', included: true },
      { text: 'Priority Support', included: true },
      { text: 'Advanced Web/Mobile Incident Management', included: true },
      { text: 'Customizable Reporting', included: true },
      { text: '6 months Basic Reporting', included: true },

    ],
    ctaText: 'Choose Premium',
    ctaLink: '#contact',
    isFeatured: true,
  },
  {
    id: 'ultimate',
    title: 'Ultimate',
    icon: Crown,
    description: 'Tailored solutions for large-scale enterprise needs.',
    customNote: 'System Customization. User count based on requirements.',
    features: [
      { text: 'Dedicated Support Manager', included: true },
      { text: 'Fully Customizable Platform', included: true },
      { text: 'Bespoke Integrations', included: true },
      { text: 'Scalable Infrastructure', included: true },
    ],
    ctaText: 'Contact Us',
    ctaLink: '#contact',
  },
];


interface PricingSectionProps {
  id?: string;
}


const formatCurrency = (amount?: number) => {
  if (amount === undefined) return 'N/A';
  return `P${amount.toLocaleString('pesos')}`;
};

export default function PricingSection({ id }: PricingSectionProps) {
  return (
    <section id={id} className="w-full flex flex-col items-center py-2 md:py-4 lg:py-12 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-primary">
            Pricing Plans
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            Find the Right Plan for Your Needs
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Choose a plan that scales with your organization, offering powerful tools for resilience and response.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                plan.isFeatured ? 'border-primary ring-2 ring-primary' : 'border-border'
              }`}
            >
              <CardHeader className="items-center text-center pb-4">
                {plan.isFeatured && (
                  <div className="mb-2 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    Most Popular
                  </div>
                )}
                <plan.icon className={`h-10 w-10 mb-2 ${plan.isFeatured ? 'text-primary' : 'text-accent'}`} />
                <CardTitle className="text-2xl font-bold font-headline">{plan.title}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-6 text-center">
                {plan.subscriptionFee !== undefined && plan.installationFee !== undefined && (
                  <div className="space-y-2">
                    <p className="text-3xl font-bold">
                      {formatCurrency(plan.subscriptionFee)}
                      <span className="text-sm font-normal text-muted-foreground">/Year</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Installation Fee: {formatCurrency(plan.installationFee)}
                    </p>
                  </div>
                )}
                {plan.userCount && (
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    {plan.userCount}
                  </div>
                )}
                {plan.customNote && (
                  <p className="text-sm text-muted-foreground font-medium p-2 bg-secondary/50 rounded-md">
                    {plan.customNote}
                  </p>
                )}
                <ul className="space-y-2 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check
                        className={`h-5 w-5 mr-2 ${
                          feature.included ? 'text-green-500' : 'text-muted-foreground'
                        }`}
                      />
                      <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild size="lg" className={`w-full ${plan.isFeatured ? 'bg-primary hover:bg-primary/90' : 'bg-accent hover:bg-accent/90 text-accent-foreground'}`}>
                  <Link href={plan.ctaLink}>{plan.ctaText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
