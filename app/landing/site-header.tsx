import { ShieldAlertIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 flex flex-col items-center border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <ShieldAlertIcon className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline">
            Q-ALERT
          </span>
        </Link>
        <nav className="hidden md:flex flex-1 items-center space-x-6">
          <Link
            href="#features"
            className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80"
          >
            FEATURES
          </Link>
          <Link
            href="#pricing" // Assuming you'll add a pricing section with id="pricing"
            className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80"
          >
            PRICING
          </Link>
          <Link
            href="#contact" // Assuming you'll add a contact section with id="contact"
            className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80"
          >
            CONTACT US
          </Link>
        </nav>
        <div className="flex flex-1 items-end justify-end space-x-4 md:flex-none">
          <Button asChild variant="default">
            <Link href="/weblogin">JOIN US</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
