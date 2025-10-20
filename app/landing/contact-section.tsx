
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin as LocationPin } from 'lucide-react'; // Using MessageSquare for Facebook, MapPin for address
import Link from 'next/link';

// A generic Facebook icon SVG as lucide-react doesn't have a direct one.
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

interface ContactSectionProps {
  id?: string;
}

export default function ContactSection({id}:ContactSectionProps) {
  const contactDetails = [
    {
      icon: Mail,
      label: 'Email Us',
      value: 'qalertapps@gmail.com',
      href: 'mailto:winstonmequila@gmail.com',
    },
    {
      icon: Phone,
      label: 'Call Us',
      value: '+63 907 324 8462 or +63 908 864 8123',
      href: 'tel:+639073248462',
    },
    {
      icon: FacebookIcon,
      label: 'Connect on Facebook',
      value: 'qalertapp',
      href: 'https://www.facebook.com/qalertapp', // Assuming this is the profile/page URL
    },
    {
      icon: LocationPin,
      label: 'Our Office',
      value: 'DeltaPH IT Solution, Brgy. Lanao, Kidapawan City',
      href: '#', // Placeholder, can be a Google Maps link
    },
  ];

  return (
    <section id={id} className="w-full flex flex-col items-center py-8 md:py-14 lg:py-20 bg-secondary/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
            Get in Touch
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            Contact Us
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            We&apos;re here to help and answer any question you might have. We look forward to hearing from you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
          {contactDetails.map((detail) => (
            <Card key={detail.label} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="bg-primary/10 p-3 rounded-md">
                  <detail.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">{detail.label}</CardTitle>
              </CardHeader>
              <CardContent>
                {detail.href.startsWith('http') || detail.href.startsWith('mailto:') || detail.href.startsWith('tel:') ? (
                  <Link href={detail.href} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors break-all">
                    {detail.value}
                  </Link>
                ) : (
                  <p className="text-foreground break-all">{detail.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* <div className="mt-16 max-w-2xl mx-auto">
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="text-center">Send Us a Message</CardTitle>
                    <CardDescription className="text-center">
                        Have a specific inquiry? Fill out the form below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                                <input type="text" name="name" id="name" className="block w-full rounded-md border-input bg-background p-2.5 text-sm shadow-sm focus:ring-primary focus:border-primary" placeholder="John Doe" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                                <input type="email" name="email" id="email" className="block w-full rounded-md border-input bg-background p-2.5 text-sm shadow-sm focus:ring-primary focus:border-primary" placeholder="you@example.com" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">Subject</label>
                            <input type="text" name="subject" id="subject" className="block w-full rounded-md border-input bg-background p-2.5 text-sm shadow-sm focus:ring-primary focus:border-primary" placeholder="Regarding your services" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">Message</label>
                            <textarea name="message" id="message" rows={4} className="block w-full rounded-md border-input bg-background p-2.5 text-sm shadow-sm focus:ring-primary focus:border-primary resize-none" placeholder="Your message here..."></textarea>
                        </div>
                        <div className="text-center">
                            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Send Message
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div> */}

      </div>
    </section>
  );
}
