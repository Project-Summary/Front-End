"use client";

import Link from 'next/link'
import { Calendar, Clock, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FilmHero({ film }: { film: any }) {

  const router = useRouter();
  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[800px] w-full overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />

      <img
        src={film.poster || '/images/placeholder-backdrop.jpg'}
        alt={film.title}
        className="absolute inset-0 object-cover w-full h-full z-0"
      />

      {/* Content */}
      <div className="container relative z-30 h-full flex flex-col justify-end px-4 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 hidden md:block">
            <div className="rounded-lg overflow-hidden shadow-2xl w-48 border border-muted">
              <img
                src={film.poster || '/images/placeholder.jpg'}
                alt={film.title}
                className="object-cover w-full aspect-[2/3]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{film.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-white/80">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-white" />
                  <span>{film.averageRating}/5</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{film.releaseDate}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>152 phút</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {film.categories.map((category: any, index: number) => (
                <>
                  <Badge className="cursor-pointer">{category.name}</Badge>
                </>
              ))}
            </div>

            <p className="text-white/80 max-w-xl">{film.description}</p>

            <div className="flex flex-wrap gap-3 mt-4">
              <Button onClick={() => router.push(`/${film.type}/${film._id}`)} size="lg">
                Đọc Đánh giá
              </Button>
              <Button onClick={() => router.push(`/${film.type}/${film._id}`)} variant="outline" size="lg">
                Xem Tóm tắt
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}