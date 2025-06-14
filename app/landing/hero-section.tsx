import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center py-12 md:py-24 lg:py-32 xl:py-8 bg-gradient-to-b from-background to-secondary/30">
      <Image
        src="/images/command2.jpg"
        alt="Background"
        fill
        className="absolute inset-0 object-cover z-[1] opacity-20"
        data-ai-hint="background image"
      />
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_400px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter text-red-700 sm:text-5xl xl:text-6xl/none font-headline">
                Q-ALERT: Your Lifeline in Crisis
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Stay informed, report incidents, and access critical resources during emergencies. Empowering communities with real-time disaster management.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-orange-400 hover:bg-accent/90 text-accent-foreground">
                <Link href="#download">
                  <Download className="mr-2 h-5 w-5" /> Download Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <Image
              alt="App Screenshot"
              className="mx-auto aspect-[9/19] overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              height="600"
              src="/images/q1.png"
              width="375"
              data-ai-hint="disaster app"
            />
          </div>
        </div>
      </div>
    </section>
  );
}