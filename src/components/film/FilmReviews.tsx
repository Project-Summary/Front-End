"use client";

import Link from 'next/link'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function FeaturedReviews() {
  // Mock data for featured reviews
  const featuredReviews = [
    {
      id: 'review-1',
      title: "The Zone of Interest: A Chilling Study in Normalization of Evil",
      excerpt: "Jonathan Glazer's film about the family of Auschwitz's commandant creates a haunting portrait of the banality of evil through immaculate formal precision.",
      filmTitle: 'The Zone of Interest',
      filmId: 'the-zone-interest',
      date: 'Apr 15, 2024',
      readTime: '8 min read',
      author: {
        name: 'Emma Thompson',
        avatar: '/avatars/emma.jpg',
        initials: 'ET'
      },
      imageUrl: '/images/zone-review.jpg'
    },
    {
      id: 'review-2',
      title: "Dune: Part Two - A Spectacular Epic That Improves on Its Predecessor",
      excerpt: "Denis Villeneuve expands his adaptation of Frank Herbert's sci-fi classic with breathtaking visuals and stronger character development.",
      filmTitle: 'Dune: Part Two',
      filmId: 'dune-part-2',
      date: 'Apr 2, 2024',
      readTime: '10 min read',
      author: {
        name: 'James Rodriguez',
        avatar: '/avatars/james.jpg',
        initials: 'JR'
      },
      imageUrl: '/images/dune-review.jpg'
    },
    {
      id: 'review-3',
      title: "Poor Things: Yorgos Lanthimos's Feminist Frankenstein Tale",
      excerpt: "Emma Stone delivers a mesmerizing performance in this wild, visually sumptuous Victorian sci-fi reimagining that tackles female agency and sexual liberation.",
      filmTitle: 'Poor Things',
      filmId: 'poor-things',
      date: 'Mar 18, 2024',
      readTime: '7 min read',
      author: {
        name: 'Sophia Chen',
        avatar: '/avatars/sophia.jpg',
        initials: 'SC'
      },
      imageUrl: '/images/poor-things-review.jpg'
    }
  ]
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featuredReviews.map((review) => (
        <Card key={review.id} className="overflow-hidden h-full flex flex-col">
          <div className="aspect-video relative overflow-hidden bg-muted">
            <img 
              src={review.imageUrl} 
              alt={review.title}
              className="object-cover w-full h-full"
            />
          </div>
          <CardContent className="p-5 flex flex-col gap-3 flex-1">
            <div>
              <h3 className="font-bold text-lg hover:text-primary transition-colors">
                <Link href={`/review/${review.id}`}>
                  {review.title}
                </Link>
              </h3>
              <Link href={`/film/${review.filmId}`} className="text-sm text-primary">
                {review.filmTitle}
              </Link>
            </div>
            
            <p className="text-muted-foreground text-sm line-clamp-3 flex-1">
              {review.excerpt}
            </p>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={review.author.avatar} alt={review.author.name} />
                  <AvatarFallback>{review.author.initials}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium leading-none">{review.author.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{review.date}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{review.readTime}</span>
                </div>
              </div>
            </div>
            
            <Link href={`/review/${review.id}`} className="text-sm font-medium text-primary flex items-center gap-1 mt-2 hover:underline">
              Read full review <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}