"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="bg-[#ffd6d6] min-h-screen flex flex-col">
      {/* Cream-colored content area */}
      <div className="bg-[#fff8ee] mx-auto my-4 rounded-3xl w-full max-w-6xl flex-grow flex flex-col shadow-lg">
        {/* Navigation */}
        <nav className="container mx-auto p-6 flex justify-between items-center">
          <div className="flex space-x-8 text-[#8a7e6b]">   
            <Link href="/" className="text-2xl font-medium hover:text-[#ff9d7d] transition-colors">
              CheatFlow
            </Link>
            
          </div>

          <div className="flex items-center justify-center">
            <img
              src="/cat-svgrepo-com.svg"
                alt="CheatFlow Logo"
                className="h-12 w-12 rounded-full hover:shadow-lg transition-shadow"
                style={{ filter: "drop-shadow(0 0 5px #ff9d7d)" }} // Add a shadow effect
            />
          </div>

          <div className="flex space-x-4 text-[#8a7e6b]">
            <Link href="##how-it-works" className="font-medium hover:text-[#ff9d7d] transition-colors">
            How It Works
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12 flex-grow flex flex-col">
          {/* Hero Section */}
          <section className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#5d5a4c]">Hello And Welcome</h1>
            <p className="text-xl md:text-2xl text-[#8a7e6b] leading-relaxed mb-12">
              CheatFlow Is A Habit Tracker Designed To Help You Build
              <br />
              One Perfect Habit At A Time!
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/login">
                <Button className="bg-[#ff9d7d] hover:bg-[#ff8a64] text-white rounded-full px-10 py-6 text-lg font-medium">
                  Login
                </Button>
              </Link>
            </div>
          </section>
           
        </main>
      </div>

      {/* Features Section (outside the cream area) */}
      <section id="how-it-works" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#5d5a4c]">How CheatFlow Works</h2>
          <p className="text-[#8a7e6b] max-w-2xl mx-auto">
            Our simple three-step process helps you build habits that last a lifetime
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              emoji: "🌱",
              title: "Plant a Habit",
              description: "Choose one habit you want to build and focus on it completely.",
            },
            {
              emoji: "🔄",
              title: "Daily Check-ins",
              description: "Track your progress with simple daily check-ins to build your streak.",
            },
            {
              emoji: "🏆",
              title: "Achieve Mastery",
              description: "After 30 days, your habit becomes activated and part of your lifestyle.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl shadow-sm border border-[#ffe8e8] hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="text-xl font-bold mb-2 text-[#5d5a4c]">{feature.title}</h3>
              <p className="text-[#8a7e6b]">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#fff8ee] py-8 mt-8 border-t border-[#ffe8e8]">
        <div className="container mx-auto px-4 text-center text-[#8a7e6b] text-sm">
          Made with <Heart className="h-4 w-4 inline-block text-[#ffb8c5] fill-[#ffb8c5]" /> for personal growth — ©{" "}
          {new Date().getFullYear()} CheatFlow
        </div>
      </footer>
    </div>
  )
}
