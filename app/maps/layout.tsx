

// "use client";

import type { Metadata } from "next";
import "../globals.css";
import TacticalNavbar from "./navbar";


export const metadata: Metadata = {
  title: "Q-ALERT",
  description: "Incident Monitoring and Response Systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 

   
  return (
<div>
          {/* <header className="flex justify-end items-center gap-4 h-16 "> */}
       
              <TacticalNavbar />
          {/* </header> */}

        {children}
    </div>

  );
}