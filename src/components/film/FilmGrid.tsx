"use client";
import FilmCard from './FilmCard'

export default function FilmGrid({ films }:  {films: any}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
      {films.map((film: any) => (
        <FilmCard key={film.id} film={film} />
      ))}
    </div>
  )
}
