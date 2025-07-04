"use client";

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock, Star, Eye, Heart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RootState } from '@/app/redux/store';
import { getTopRatedMoviesThunk } from '@/app/redux/film/thunk.film';
import { getCategoriesThunk } from '@/app/redux/categories/thunk.categories';

export default function RatePage() {
  const dispatch = useDispatch();
  const { topRated, loading } = useSelector((state: RootState) => state.film);
  const { categories } = useSelector((state: RootState) => state.categories);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    dispatch(getTopRatedMoviesThunk() as any);
    dispatch(getCategoriesThunk() as any);
  }, [dispatch]);

  useEffect(() => {
    if (topRated) {
      let filtered = [...topRated];

      // Category filter
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(movie =>
          movie.categories?.some((cat: any) => cat._id === selectedCategory)
        );
      }

      // Sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return (b.averageRating || 0) - (a.averageRating || 0);
          case 'views':
            return (b.statistics?.views || 0) - (a.statistics?.views || 0);
          case 'recent':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });

      setFilteredMovies(filtered as any);
    }
  }, [topRated, selectedCategory, sortBy]);

  const formatRating = (rating: number) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải những bộ phim được đánh giá cao nhất...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-yellow-500" />
              Phim được đánh giá cao nhất
            </h1>
            <p className="text-muted-foreground mt-1">
              Khám phá những bộ phim được đánh giá cao nhất của cộng đồng chúng tôi
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Thể loại:</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả các thể loại</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Sắp xếp theo:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Xếp hạng</SelectItem>
                  <SelectItem value="views">Lượt xem</SelectItem>
                  <SelectItem value="recent">Gần đây</SelectItem>
                  <SelectItem value="title">Tiêu đề</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {selectedCategory !== 'all' && (
              <Badge variant="secondary">
                {categories?.find(c => c._id === selectedCategory)?.name}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Top 3 Featured Movies */}
      {filteredMovies.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            Top 3 được đánh giá cao nhất
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredMovies.slice(0, 3).map((movie: any, index) => (
              <Card key={movie._id} className="overflow-hidden h-full flex flex-col relative">
                {/* Ranking Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge
                    className={`text-white font-bold ${index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                        'bg-amber-600'
                      }`}
                  >
                    #{index + 1}
                  </Badge>
                </div>

                <div className="aspect-video relative overflow-hidden bg-muted">
                  <Image
                    src={movie.backdrop || movie.poster || '/placeholder-movie.jpg'}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Rating Overlay */}
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-black/80 rounded-lg px-3 py-1 flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-bold">
                        {formatRating(movie.averageRating)}
                      </span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-5 flex flex-col gap-3 flex-1">
                  <div>
                    <h3 className="font-bold text-lg hover:text-primary transition-colors line-clamp-2">
                      <Link href={`/film/${movie._id}`}>
                        {movie.title}
                      </Link>
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {movie.categories?.slice(0, 2).map((category: any) => (
                        <Badge key={category._id} variant="outline" className="text-xs">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-3 flex-1">
                    {movie.description}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{formatViews(movie.statistics?.views || 0)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" />
                        <span>{formatViews(movie.statistics?.likes || 0)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(movie.releaseDate).getFullYear()}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/film/${movie._id}`}
                    className="text-sm font-medium text-primary flex items-center gap-1 mt-2 hover:underline"
                  >
                    Xem chi tiết <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tất cả phim được đánh giá cao nhất */}
      <div>
        <h2 className="text-xl font-bold mb-6">Tất cả phim được đánh giá cao nhất</h2>
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMovies.map((movie: any, index) => (
              <Card key={movie._id} className="overflow-hidden h-full flex flex-col group hover:shadow-lg transition-shadow">
                <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                  <Image
                    src={movie.poster || '/placeholder-movie.jpg'}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2">
                    <div className="bg-black/80 rounded-lg px-2 py-1 flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-bold">
                        {formatRating(movie.averageRating)}
                      </span>
                    </div>
                  </div>

                  {/* Ranking for top movies */}
                  {index < 10 && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="font-bold">
                        #{index + 1}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4 flex flex-col gap-2 flex-1">
                  <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/film/${movie._id}`}>
                      {movie.title}
                    </Link>
                  </h3>

                  <div className="flex flex-wrap gap-1">
                    {movie.categories?.slice(0, 2).map((category: any) => (
                      <Badge key={category._id} variant="outline" className="text-xs">
                        {category.name}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatViews(movie.statistics?.views || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(movie.releaseDate).getFullYear()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Không tìm thấy phim được xếp hạng nào</h3>
              <p className="text-muted-foreground mb-4">
                {selectedCategory !== 'all'
                  ? 'Không tìm thấy phim được xếp hạng nào trong danh mục này'
                  : 'Không có phim được xếp hạng nào khả dụng tại thời điểm này'
                }
              </p>
              {selectedCategory !== 'all' && (
                <Button variant="outline" onClick={() => setSelectedCategory('all')}>
                  Hiển thị tất cả phim
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
