import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import { Download } from 'lucide-react';
import Link from 'next/link';

export default function CtaSection() {
  return (
    <section id="download" className="flex flex-col items-center py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
            Ready to Enhance Your Safety?
          </h2>
          <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Download Q-ALERT today and join a community committed to preparedness and mutual support during emergencies.
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-2">
        
           <div className="flex justify-center gap-4 mt-6">
            {/* <Link href="#" aria-label="Download on the App Store">
              <Image 
                src="/images/apple.png" 
                alt="App Store Badge" 
                width={160} 
                height={50} 
                className="rounded"
                data-ai-hint="app store"
              />
            </Link> */}
            <Link href="https://play.google.com/store/apps/details?id=com.alertify.app&hl=en" aria-label="Get it on Google Play">
              <Image 
                src="/images/google.png" 
                alt="Google Play Badge" 
                width={160} 
                height={50} 
                className="rounded"
                data-ai-hint="play store"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
