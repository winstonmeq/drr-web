import FeatureCard from './feature-card';
import { MapPin, FilePenLine, BookMarked, BellRing } from 'lucide-react';
import Image from 'next/image';

interface FeaturesSectionProps {
  id?: string;
}

export default function FeaturesSection({ id }: FeaturesSectionProps) {
  const features = [
    {
      icon: MapPin,
      title: 'Interactive Map Visualization',
      description: 'No more guessing where an incident is. Q-ALERT plots all reported incidents on an interactive map, allowing you to visualize hotspots, understand the scope of an issue, and navigate safely around affected areas.',
      content: (
        <Image 
          src="/images/q3.png" 
          alt="Incident Map Preview" 
          width={600} 
          height={400} 
          className="rounded-md mt-2"
          data-ai-hint="map interface" 
        />
      )
    },
    {
      icon: FilePenLine,
      title: 'Real-Time Incident Reporting',
      description: 'See something, say something, instanly. User can quickly report emergency incidents - directly from their smartphone. Our intuitive interface makes reporting effortless.',
      content: (
         <Image 
          src="/images/q2.png" 
          alt="Report Submission Preview" 
          width={600} 
          height={400} 
          className="rounded-md mt-2"
          data-ai-hint="form interface"
        />
      )
    },
    {
      icon: BookMarked,
      title: 'Resource Directory',
      description: 'Access a curated list of emergency resources, shelters, and contacts tailored to your location. Find help when you need it most.',
       content: (
         <Image 
          src="/images/q5.png" 
          alt="Resource Directory Preview" 
          width={600} 
          height={400} 
          className="rounded-md mt-2"
          data-ai-hint="list interface"
        />
      )
    },
    {
      icon: BellRing,
      title: 'Alert System',
      description: 'Stay informed with real-time alerts about incidents in your vicinity or areas you care about. Receive updates as situations evolve, ensuring you always have the most current information.',
      content: (
         <Image 
          src="/images/q4.png" 
          alt="Alert System" 
          width={600} 
          height={400} 
          className="rounded-md mt-2"
          data-ai-hint="list interface"
        />
      )
    },
  ];

  return (
    <section id={id} className="flex flex-col items-center py-8 md:py-14 lg:py-22 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            Tools for Safety and Fast Response
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Q-ALERT provides comprehensive features to help you navigate through challenging times.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            >
              {feature.content}
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  );
}
