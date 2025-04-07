// import { auth } from '@clerk/nextjs/server'
// import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';


import {  SignInButton} from '@clerk/nextjs'


export default async function Home() {
  // const { userId } = await auth()

  // // If user is signed in, redirect to /maps
  // if (userId) {
  //   redirect('/maps')
  // }

  // If user is not signed in, show the page content
  return (
    <div className="bg-white text-gray-800">
 
      <div className="flex justify-end p-4 items-center  shadow-md">
        {/* <div className="text-2xl font-bold text-orange-500">
          Q-<span className="text-blue-500">ALERT</span>
        </div> */}
        {/* <nav className="space-x-6 hidden md:flex">
          <a href="#" className="hover:text-orange-500">Home</a>
        
          <a href="#" className="hover:text-orange-500">Contact Us</a>
        </nav> */}
              <SignInButton />
              </div>

      <div className="relative text-center py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        Q-ALERT: Real-time disaster alert application

<br />
          for a natural disaster <span className="text-orange-500">& Incident Report</span>.
        </h1>
        <Button className="mt-6 bg-blue-500 hover:bg-blue-600 m-3 text-white px-6 py-3 rounded-full text-lg">
          Select you province
        </Button>
       

        <Button className="mt-6 bg-orange-900 hover:bg-orange-600 m-3 text-white px-6 py-3 rounded-full text-lg">
          Select your municipality
        </Button>
     
      </div>

      <div className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">We Can Help You Succeed.</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Provide an emergency kit, educational courses and other services to help people get prepared.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {['Planner', 'Kit', 'Course', 'Radio'].map((item, index) => (
            <Card
              key={item}
              className={`hover:shadow-lg transition-all ${index === 1 ? 'border-2 border-blue-500' : ''}`}
            >
              <CardContent className="flex flex-col items-center py-10">
                <div className="text-4xl mb-4">📦</div>
                <p className="font-semibold">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}