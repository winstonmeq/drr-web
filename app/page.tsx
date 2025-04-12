import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SignInButton } from '@clerk/nextjs';
import { MapPin, AlertTriangle } from 'lucide-react'; // Icons for visual enhancement

export default async function Home() {
  const { userId } = await auth();

  // If user is signed in, redirect to /maps
  if (userId) {
    redirect('/maps');
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-24 px-6 bg-gradient-to-b from-orange-900 to-gray-50 text-white text-center">
        <AlertTriangle className="w-16 h-16 mb-4 animate-pulse" />
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight animate-pulse">
          Q-ALERT: Real-Time Disaster Alerts
        </h1>
          
      </section>

      {/* Features Section */}
      {/* <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Real-Time Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get instant notifications about earthquakes, floods, and other disasters in your area.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Incident Reporting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Report incidents directly to help authorities respond faster and save lives.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Location-Based Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Customize alerts based on your Province or Municipality for relevant information.
              </p>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* Call-to-Action Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Join Q-ALERT Today</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Sign in to access personalized disaster alerts and contribute to community safety.
        </p>
        <SignInButton>
          <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300">
            Sign In Now
          </Button>
        </SignInButton>
      </section>

      {/* Footer */}
      {/* <footer className="py-8 px-6 bg-gray-800 text-white text-center">
        <p>&copy; 2025 Q-ALERT. All rights reserved.</p>
      </footer> */}
    </div>
  );
}