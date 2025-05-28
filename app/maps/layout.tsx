

// "use client";

import type { Metadata } from "next";
import "../globals.css";
import TacticalNavbar from "./navbar";
import {
  ClerkProvider,
  // SignInButton,
  // SignUpButton,
  SignedIn,
 // SignedOut,
  // UserButton,
} from '@clerk/nextjs'


export const metadata: Metadata = {
  title: "MDRRMO President Roxas",
  description: "Monitoring and Disaster Risk Reduction Management Office",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 

   
  return (
    <ClerkProvider>

          <header className="flex justify-end items-center gap-4 h-16 ">
            {/* <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut> */}
            {/* <SignedIn> */}
              <TacticalNavbar />
            {/* </SignedIn> */}
          </header>

        {children}
    </ClerkProvider>

  );
}
