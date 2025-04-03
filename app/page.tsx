import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const { userId } = await auth()

  // If user is signed in, redirect to /maps
  if (userId) {
    redirect('/maps')
  }

  // If user is not signed in, show the page content
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      main door
    </div>
  )
}