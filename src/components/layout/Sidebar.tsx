// components/layout/Sidebar.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ChevronDown, Star, Calendar, Filter } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge'

export default function Sidebar() {
  const pathname = usePathname()
  const [ratingRange, setRatingRange] = useState([0, 5])
  const [yearRange, setYearRange] = useState([1950, 2024])
  
  // For mobile view toggle
  const [isOpen, setIsOpen] = useState(false)
  
  const categories = [
    { name: 'Action', slug: 'action', count: 245 },
    { name: 'Adventure', slug: 'adventure', count: 189 },
    { name: 'Animation', slug: 'animation', count: 113 },
    { name: 'Comedy', slug: 'comedy', count: 327 },
    { name: 'Crime', slug: 'crime', count: 142 },
    { name: 'Documentary', slug: 'documentary', count: 89 },
    { name: 'Drama', slug: 'drama', count: 563 },
    { name: 'Family', slug: 'family', count: 76 },
    { name: 'Fantasy', slug: 'fantasy', count: 154 },
    { name: 'Horror', slug: 'horror', count: 167 },
    { name: 'Mystery', slug: 'mystery', count: 98 },
    { name: 'Romance', slug: 'romance', count: 213 },
    { name: 'Science Fiction', slug: 'sci-fi', count: 187 },
    { name: 'Thriller', slug: 'thriller', count: 205 },
  ]
  
  const collections = [
    { name: 'New Releases', slug: 'new-releases' },
    { name: 'Classics', slug: 'classics' },
    { name: 'Award Winners', slug: 'award-winners' },
    { name: 'Independent Films', slug: 'indie' },
    { name: 'International Cinema', slug: 'international' },
    { name: 'Critics Choice', slug: 'critics-choice' },
  ]
  
  return (
    <div className="flex flex-col gap-6">
      {/* Mobile Toggle */}
      <div className="lg:hidden w-full">
        <Button 
          variant="outline" 
          className="w-full flex justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>
      
      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Collections Section */}
        <div>
          <h3 className="text-lg font-medium mb-3">Collections</h3>
          <ul className="space-y-2">
            {collections.map((collection) => (
              <li key={collection.slug}>
                <Link 
                  href={`/category/${collection.slug}`} 
                  className={`block text-sm hover:text-primary transition-colors ${
                    pathname === `/category/${collection.slug}` ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {collection.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <Separator />
        
        {/* Rating Filter */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 fill-current" /> Rating
          </h3>
          <div className="px-1">
            <Slider
              defaultValue={[0, 5]}
              min={0}
              max={5}
              step={0.5}
              value={ratingRange}
              onValueChange={setRatingRange}
              className="mb-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{ratingRange[0]} stars</span>
              <span>{ratingRange[1]} stars</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Year Filter */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Release Year
          </h3>
          <div className="px-1">
            <Slider
              defaultValue={[1950, 2024]}
              min={1920}
              max={2024}
              step={1}
              value={yearRange}
              onValueChange={setYearRange}
              className="mb-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{yearRange[0]}</span>
              <span>{yearRange[1]}</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Categories */}
        <Accordion type="single" collapsible defaultValue="categories">
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger className="py-0 hover:no-underline">
              <h3 className="text-lg font-medium">Categories</h3>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-0">
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                {categories.map((category) => (
                  <div key={category.slug} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id={`category-${category.slug}`} />
                      <Label
                        htmlFor={`category-${category.slug}`}
                        className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {category.name}
                      </Label>
                    </div>
                    <Badge variant="outline" className="text-xs font-normal">
                      {category.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Separator />
        
        {/* Apply Filters Button */}
        <div className="flex gap-2">
          <Button className="flex-1">Apply Filters</Button>
          <Button variant="outline">Reset</Button>
        </div>
      </div>
    </div>
  )
}