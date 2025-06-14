import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ShieldCheck, Waves, Flame, Construction } from 'lucide-react'; // Using Construction for landslide/earthquake as a generic 'hazard'

interface SafetyTip {
  id: string;
  title: string;
  icon: React.ElementType;
  tips: string[];
}

// Placeholder for specific icons if available or generic ones
const EarthquakeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M3 12h2l2-9l3 18l3-9l2 9h2"/>
    <path d="M10 6h11"/>
    <path d="M10 18h11"/>
  </svg>
);

const safetyTipsData: SafetyTip[] = [
  {
    id: 'earthquake',
    title: 'Earthquake Safety',
    icon: EarthquakeIcon,
    tips: [
      'Drop, Cover, and Hold On.',
      'Stay away from windows and heavy objects.',
      'If outdoors, move to an open area.',
      'Be prepared for aftershocks.',
    ],
  },
  {
    id: 'flood',
    title: 'Flood Safety',
    icon: Waves,
    tips: [
      'Move to higher ground immediately.',
      'Do not walk or drive through floodwaters.',
      'Listen to emergency alerts and evacuation orders.',
      'Have an emergency kit ready.',
    ],
  },
  {
    id: 'landslide',
    title: 'Landslide Safety',
    icon: Construction, // Using generic hazard icon
    tips: [
      'Be aware of warning signs like cracking ground or tilting trees.',
      'Evacuate immediately if you suspect danger.',
      'Listen for unusual sounds that might indicate moving debris.',
      'If caught in a landslide, curl into a tight ball and protect your head.',
    ],
  },
  {
    id: 'fire',
    title: 'Fire Safety',
    icon: Flame,
    tips: [
      'Install and maintain smoke alarms.',
      'Have a fire escape plan and practice it.',
      'If a fire occurs, get out and stay out.',
      'Call emergency services from a safe location.',
    ],
  },
];

export default function SafetyTipsSection() {
  return (
    <section id="safety-tips" className="flex flex-col items-center py-8 md:py-10 lg:py-14 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
            <ShieldCheck className="inline-block h-4 w-4 mr-1 text-primary" />
            Stay Prepared
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            Essential Safety Guidelines
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Knowledge is your best defense. Familiarize yourself with these safety tips for various disaster scenarios.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {safetyTipsData.map((category) => (
            <AccordionItem value={category.id} key={category.id} className="border-b border-border">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                <div className="flex items-center gap-3">
                  <category.icon className="h-6 w-6 text-blue-900" />
                  {category.title}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                  {category.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
