import FilmHero from '@/components/film/FilmHero'
import FilmGrid from '@/components/film/FilmGrid'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import FeaturedReviews from '@/components/film/FilmReviews'

export default function Home() {
  // Mock data for featured film
  const featuredFilm = {
    id: 'dune-part-2',
    title: 'Dune: Part Two',
    posterUrl: '/images/dune-2.jpg',
    backdropUrl: '/images/dune-2-backdrop.jpg',
    rating: 4.8,
    releaseDate: '2024',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    categories: ['Sci-Fi', 'Adventure']
  }
  
  // Mock data for recent films
  const recentFilms = [
    {
      id: 'poor-things',
      title: 'Poor Things',
      posterUrl: '/images/poor-things.jpg',
      rating: 4.5,
      releaseDate: '2023',
      categories: ['Drama', 'Sci-Fi']
    },
    {
      id: 'oppenheimer',
      title: 'Oppenheimer',
      posterUrl: '/images/oppenheimer.jpg',
      rating: 4.6,
      releaseDate: '2023',
      categories: ['Drama', 'Biography']
    },
    {
      id: 'past-lives',
      title: 'Past Lives',
      posterUrl: '/images/past-lives.jpg',
      rating: 4.4,
      releaseDate: '2023',
      categories: ['Drama', 'Romance']
    },
    {
      id: 'killers-flower-moon',
      title: 'Killers of the Flower Moon',
      posterUrl: '/images/killers.jpg',
      rating: 4.3,
      releaseDate: '2023',
      categories: ['Crime', 'Drama']
    },
    {
      id: 'anatomy-fall',
      title: 'Anatomy of a Fall',
      posterUrl: '/images/anatomy.jpg',
      rating: 4.5,
      releaseDate: '2023',
      categories: ['Drama', 'Mystery']
    },
    {
      id: 'the-zone-interest',
      title: 'The Zone of Interest',
      posterUrl: '/images/zone.jpg',
      rating: 4.2,
      releaseDate: '2023',
      categories: ['Drama', 'History']
    }
  ]

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero section */}
      <FilmHero film={featuredFilm} />
      
      {/* Recent films section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Recent Reviews</h2>
          <Button variant="outline" asChild>
            <Link href="/film">
              View All
            </Link>
          </Button>
        </div>
        <FilmGrid films={recentFilms} />
      </section>
      
      {/* Featured Reviews section */}
      <section className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Featured Reviews</h2>
          <p className="text-muted-foreground mt-2">Deep dives into cinema's most compelling stories</p>
        </div>
        <FeaturedReviews />
      </section>
      
      {/* Newsletter section */}
      <section className="container mx-auto px-4 bg-accent/20 rounded-xl p-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6">Get the latest reviews and cinema news delivered to your inbox</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-2 bg-background border border-input rounded-md"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}