import React from "react";
import Navbar from "./Navbar";

export default function Layouts({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="container mx-auto px-4 pt-10 relative">
        <Navbar />
        {children}
      </main>
    </>
  );
}
