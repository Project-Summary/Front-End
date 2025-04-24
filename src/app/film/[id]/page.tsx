"use client";
// app/film/[id]/page.js
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Play, Star, User2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FilmGrid from '@/components/film/FilmGrid'
import FilmReview from '@/components/film/FilmReview'

export default function FilmDetailPage({ params }: {params: any}) {
  // In a real application, you would fetch this based on params.id
  const film = {
    id: 'dune-part-2',
    title: 'Dune: Part Two',
    tagline: 'It begins.',
    posterUrl: '/images/dune-2.jpg',
    backdropUrl: '/images/dune-2-backdrop.jpg',
    rating: 4.8,
    voteCount: 2783,
    releaseDate: 'March 1, 2024',
    runtime: '166 min',
    director: 'Denis Villeneuve',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.',
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides', photoUrl: '/cast/timothee.jpg' },
      { name: 'Zendaya', role: 'Chani', photoUrl: '/cast/zendaya.jpg' },
      { name: 'Rebecca Ferguson', role: 'Lady Jessica', photoUrl: '/cast/rebecca.jpg' },
      { name: 'Javier Bardem', role: 'Stilgar', photoUrl: '/cast/javier.jpg' },
      { name: 'Josh Brolin', role: 'Gurney Halleck', photoUrl: '/cast/josh.jpg' },
      { name: 'Austin Butler', role: 'Feyd-Rautha Harkonnen', photoUrl: '/cast/austin.jpg' }
    ],
    categories: ['Sci-Fi', 'Adventure', 'Drama', 'Action'],
    trailer: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    fullReview: {
      id: 'dune-part-2-review',
      author: {
        name: 'James Rodriguez',
        avatar: '/avatars/james.jpg',
        initials: 'JR'
      },
      date: 'April 2, 2024',
      content: `<p>Denis Villeneuve's "Dune: Part Two" is that rare sequel that not only lives up to its predecessor but surpasses it in almost every way. Building on the foundation of the 2021 film, Part Two completes Frank Herbert's first Dune novel with spectacular visuals, emotional depth, and thematic richness.</p>

      <p>Where the first film was criticized by some for its deliberate pacing and extensive worldbuilding, Part Two hits the ground running. We rejoin Paul Atreides (Timothée Chalamet) and his mother Lady Jessica (Rebecca Ferguson) as they integrate into the Fremen society on Arrakis. Paul's journey from refugee to messianic figure forms the emotional core of the film, with Chalamet delivering a nuanced performance that captures both Paul's vulnerability and his growing power.</p>
      
      <p>Zendaya's Chani, merely glimpsed in the first film, becomes a fully realized character here. Her romance with Paul provides some of the film's most affecting moments, particularly as she wrestles with her feelings for him against her suspicion of his growing mythic status among her people. Their relationship serves as an emotional anchor amid the grand political and religious themes.</p>
      
      <p>Villeneuve's direction remains impeccable. The action sequences—particularly the Fremen's guerrilla attacks on Harkonnen spice operations and Paul's climactic knife fight—are staged with clarity and impact. The sandworm riding sequence, a pivotal moment for readers of the novel, is realized with breathtaking grandeur.</p>
      
      <p>The film's production design continues to impress, from the harsh beauty of the desert landscapes to the brutalist architecture of the Harkonnen stronghold. Hans Zimmer's score, with its blend of pounding percussion, haunting vocals, and electronic elements, enhances the otherworldly atmosphere.</p>
      
      <p>Among the new cast additions, Austin Butler stands out as the sadistic Feyd-Rautha Harkonnen, bringing a chilling charisma to the role. Florence Pugh makes the most of her limited screen time as Princess Irulan, setting up her character's importance for potential future installments.</p>
      
      <p>At its heart, "Dune: Part Two" is about the dangers of messianic figures and the double-edged sword of religious fervor. The film doesn't shy away from showing how Paul, despite his personal reservations, uses the Fremen's religious beliefs to advance his own agenda of revenge. These themes give the spectacular action sequences moral weight and complexity.</p>
      
      <p>With its combination of visual splendor, thoughtful themes, and emotional resonance, "Dune: Part Two" stands as one of the finest science fiction films in recent memory. It completes the story begun in Part One while leaving the door open for adaptations of Herbert's subsequent novels. Even viewers unfamiliar with the source material will find much to appreciate in this epic tale of destiny, power, and the price of vengeance.</p>`
    }
  }

  // Similar films (in a real app, these would be fetched based on the current film)
  const similarFilms = [
    {
      id: 'blade-runner-2049',
      title: 'Blade Runner 2049',
      posterUrl: '/images/blade-runner.jpg',
      rating: 4.5,
      releaseDate: '2017',
      categories: ['Sci-Fi', 'Drama']
    },
    {
      id: 'arrival',
      title: 'Arrival',
      posterUrl: '/images/arrival.jpg',
      rating: 4.6,
      releaseDate: '2016',
      categories: ['Sci-Fi', 'Drama']
    },
    {
      id: 'foundation',
      title: 'Foundation',
      posterUrl: '/images/foundation.jpg',
      rating: 4.2,
      releaseDate: '2021',
      categories: ['Sci-Fi', 'Drama']
    },
    {
      id: 'interstellar',
      title: 'Interstellar',
      posterUrl: '/images/interstellar.jpg',
      rating: 4.7,
      releaseDate: '2014',
      categories: ['Sci-Fi', 'Adventure']
    },
    {
      id: 'mad-max-fury-road',
      title: 'Mad Max: Fury Road',
      posterUrl: '/images/mad-max.jpg',
      rating: 4.6,
      releaseDate: '2015',
      categories: ['Action', 'Adventure']
    },
    {
      id: 'avatar-2',
      title: 'Avatar: The Way of Water',
      posterUrl: '/images/avatar-2.jpg',
      rating: 4.3,
      releaseDate: '2022',
      categories: ['Sci-Fi', 'Action']
    }
  ]

  return (
    <div className="pb-16">
      {/* Hero section */}
      <section className="relative h-[70vh] min-h-[500px] max-h-[800px] w-full overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
        
        <img 
          src={film.backdropUrl || '/images/placeholder-backdrop.jpg'} 
          alt={film.title}
          className="absolute inset-0 object-cover w-full h-full z-0"
        />
        
        {/* Back button */}
        <div className="absolute top-8 left-8 z-30">
          <Button variant="outline" size="sm" asChild>
            <Link href="/film" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Films
            </Link>
          </Button>
        </div>
        
        {/* Content */}
        <div className="container relative z-30 h-full flex flex-col justify-end px-4 pb-16">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 hidden md:block">
              <div className="rounded-lg overflow-hidden shadow-2xl w-52 border border-muted">
                <img 
                  src={film.posterUrl || '/images/placeholder.jpg'} 
                  alt={film.title}
                  className="object-cover w-full aspect-[2/3]"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{film.title}</h1>
                <p className="text-white/80 text-xl italic">{film.tagline}</p>
                <div className="flex flex-wrap items-center gap-3 text-white/80 mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-white" />
                    <span>{film.rating}/5</span>
                    <span className="text-white/60 text-sm">({film.voteCount})</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{film.releaseDate}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{film.runtime}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <User2 className="h-4 w-4" />
                    <span>Director: {film.director}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {film.categories.map((category, index) => (
                  <Link key={index} href={`/category/${category.toLowerCase()}`}>
                    <Badge className="cursor-pointer">{category}</Badge>
                  </Link>
                ))}
              </div>
              
              <p className="text-white/80 max-w-2xl">{film.description}</p>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <Button size="lg" className="gap-2">
                  <Play className="h-4 w-4 fill-current" /> Watch Trailer
                </Button>
                <Button variant="outline" size="lg">
                  Add to Watchlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="container px-4 mt-8 md:mt-12">
        <Tabs defaultValue="review" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="review">Review</TabsTrigger>
            <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="review" className="space-y-8">
            <FilmReview review={film.fullReview} />
          </TabsContent>
          
          <TabsContent value="cast">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
                {film.cast.map((person, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border">
                      <img 
                        src={person.photoUrl || '/images/placeholder-avatar.jpg'} 
                        alt={person.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h3 className="font-medium text-sm">{person.name}</h3>
                    <p className="text-muted-foreground text-xs">{person.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-2xl font-bold mb-4">Film Details</h2>
                <dl className="space-y-3">
                  <div className="flex flex-wrap">
                    <dt className="w-36 font-medium">Title</dt>
                    <dd>{film.title}</dd>
                  </div>
                  <div className="flex flex-wrap">
                    <dt className="w-36 font-medium">Director</dt>
                    <dd>{film.director}</dd>
                  </div>
                  <div className="flex flex-wrap">
                    <dt className="w-36 font-medium">Release Date</dt>
                    <dd>{film.releaseDate}</dd>
                  </div>
                  <div className="flex flex-wrap">
                    <dt className="w-36 font-medium">Runtime</dt>
                    <dd>{film.runtime}</dd>
                  </div>
                  <div className="flex flex-wrap">
                    <dt className="w-36 font-medium">Rating</dt>
                    <dd className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-primary" />
                      {film.rating}/5 ({film.voteCount} votes)
                    </dd>
                  </div>
                  <div className="flex flex-wrap">
                    <dt className="w-36 font-medium">Genres</dt>
                    <dd className="flex flex-wrap gap-1">
                      {film.categories.map((category, index) => (
                        <Link key={index} href={`/category/${category.toLowerCase()}`}>
                          <Badge variant="outline" className="cursor-pointer">{category}</Badge>
                        </Link>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Similar films section */}
      <section className="container mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Similar Films</h2>
          <Button variant="outline" asChild>
            <Link href="/film">
              View All
            </Link>
          </Button>
        </div>
        <FilmGrid films={similarFilms} />
      </section>
    </div>
  )
}