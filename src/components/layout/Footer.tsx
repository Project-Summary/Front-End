"use client";

import Link from 'next/link'
import { Github, Twitter, Youtube, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t py-8 md:py-12">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="rounded-full bg-primary/20 p-1">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  CC
                </div>
              </div>
              <span className="font-bold text-xl">CineCritique</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              CineCritique is dedicated to bringing you thoughtful analysis and reviews of films
              across all genres, eras, and cultures.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://youtube.com" className="text-muted-foreground hover:text-foreground">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="https://github.com" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/film" className="text-muted-foreground hover:text-foreground">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/category/new-releases" className="text-muted-foreground hover:text-foreground">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="/category/classics" className="text-muted-foreground hover:text-foreground">
                  Classics
                </Link>
              </li>
              <li>
                <Link href="/category/indie" className="text-muted-foreground hover:text-foreground">
                  Indie Films
                </Link>
              </li>
              <li>
                <Link href="/category/international" className="text-muted-foreground hover:text-foreground">
                  International Cinema
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-muted-foreground hover:text-foreground">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CineCritique. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}