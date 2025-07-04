"use client";
import Link from 'next/link'
import { Calendar, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export default function FilmCard({ film }: { film: any }) {
  return (
    <Link href={`/film/${film.id}`}>
      <Card className="overflow-hidden group h-full transition-all hover:border-primary">
        <div className="aspect-[2/3] relative overflow-hidden bg-muted">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <img
            src={film.posterUrl || '/images/placeholder.jpg'}
            alt={film.title}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 z-20">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              <span>{film.rating}</span>
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {film.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {film.releaseDate
                  ? new Date(film.releaseDate).toLocaleDateString()
                  : new Date().toLocaleDateString()}
              </span>
            </div>
            <span>•</span>
            <div className="flex flex-wrap gap-1">
              {film.categories.slice(0, 2).map((category: any, index: number) => (
                <span key={index}>{category}{index < Math.min(film.categories.length, 2) - 1 && ', '}</span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

