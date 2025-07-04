// components/content/EpisodesSection.tsx
"use client";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Play,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Search,
  Filter,
  Grid3X3,
  List,
  Calendar,
  Star
} from 'lucide-react';
import { RootState } from '@/app/redux/store';
import { getEpisodesWithFilmThunk } from '@/app/redux/film/thunk.film';
import { Episode } from '@/app/redux/film/interface.film';
import Link from 'next/link';

interface EpisodesSectionProps {
  filmId: string;
}

export default function EpisodesSection({ filmId }: EpisodesSectionProps) {
  const dispatch = useDispatch();
  const { episodes, loading } = useSelector((state: RootState) => state.film);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('episode');

  useEffect(() => {
    if (filmId) {
      dispatch(getEpisodesWithFilmThunk(filmId) as any);
    }
  }, [filmId, dispatch]);

  // Filter and sort episodes
  const filteredAndSortedEpisodes = episodes
    ?.filter((episode: Episode) => {
      const matchesSearch = episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        episode.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeason = seasonFilter === 'all' ||
        episode.seasonNumber?.toString() === seasonFilter;
      const matchesStatus = statusFilter === 'all' || episode.status === statusFilter;

      return matchesSearch && matchesSeason && matchesStatus;
    })
    ?.sort((a: Episode, b: Episode) => {
      switch (sortBy) {
        case 'episode':
          return a.episodeNumber - b.episodeNumber;
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'views':
          return b.statistics.views - a.statistics.views;
        case 'duration':
          return (b.duration || 0) - (a.duration || 0);
        default:
          return a.episodeNumber - b.episodeNumber;
      }
    }) || [];

  // Get unique seasons for filter
  const availableSeasons = Array.from(
    new Set(episodes?.map((ep: Episode) => ep.seasonNumber).filter(Boolean))
  ).sort((a, b) => (a || 0) - (b || 0));

  const handlePlayEpisode = (episode: Episode) => {
    // Handle episode play logic
    console.log('Playing episode:', episode);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-40 h-24 bg-muted rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!episodes || episodes.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Play className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Không có tập nào khả dụng</h3>
              <p className="text-muted-foreground">
                Nội dung này hiện chưa có tập nào.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm tập phim..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {availableSeasons.length > 0 && (
                <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả các mùa</SelectItem>
                    {availableSeasons.map((season) => (
                      <SelectItem key={season} value={season?.toString() || ''}>
                        Mùa {season}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="published">Đã xuất bản</SelectItem>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="archived">Đã lưu trữ</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="episode">Tập #</SelectItem>
                  <SelectItem value="date">Ngày thêm</SelectItem>
                  <SelectItem value="views">Đã xem nhiều nhất</SelectItem>
                  <SelectItem value="duration">Thời lượng</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Episodes Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredAndSortedEpisodes.length} tập{filteredAndSortedEpisodes.length !== 1 ? 's' : ''} đã tìm thấy
        </p>
      </div>

      {/* Episodes List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedEpisodes.map((episode: Episode) => (
            <EpisodeGridCard
              key={episode._id}
              episode={episode}
              onPlay={handlePlayEpisode}
              isAuthenticated={isAuthenticated}
              filmId={filmId}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedEpisodes.map((episode: Episode) => (
            <EpisodeListCard
              key={episode._id}
              episode={episode}
              onPlay={handlePlayEpisode}
              isAuthenticated={isAuthenticated}
              filmId={filmId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Grid Card Component
function EpisodeGridCard({
  episode,
  onPlay,
  isAuthenticated,
  filmId,
}: {
  episode: Episode;
  onPlay: (episode: Episode) => void;
  isAuthenticated: boolean;
  filmId: string;
}) {
  return (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
      <Link href={`/film/${filmId}/episode/${episode._id}`}>
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          {episode.thumbnail ? (
            <Image
              src={episode.thumbnail}
              alt={episode.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Play className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Button
              size="lg"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onPlay(episode)}
            >
              <Play className="mr-2 h-5 w-5" />
              Phát
            </Button>
          </div>

          <div className="absolute top-2 left-2">
            <Badge variant="secondary">
              Tập {episode.episodeNumber}
              {episode.seasonNumber && ` - S${episode.seasonNumber}`}
            </Badge>
          </div>

          {episode.duration && (
            <div className="absolute bottom-2 right-2">
              <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                <Clock className="mr-1 h-3 w-3" />
                {episode.duration}phút
              </Badge>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {episode.title}
          </h3>

          {episode.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {episode.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {episode.statistics.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {episode.statistics.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {episode.statistics.comments}
              </span>
            </div>

            <Badge
              variant={episode.status === 'published' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {episode.status}
            </Badge>
          </div>

          {episode.isAIGenerated && (
            <Badge variant="outline" className="text-xs">
              AI tạo ra
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// List Card Component
function EpisodeListCard({
  episode,
  onPlay,
  isAuthenticated,
  filmId
}: {
  episode: Episode;
  onPlay: (episode: Episode) => void;
  isAuthenticated: boolean;
  filmId: string;
}) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <Link href={`/film/${filmId}/episode/${episode._id}`}>
          <div className="flex gap-4">
            <div className="relative w-40 h-24 flex-shrink-0 overflow-hidden rounded">
              {episode.thumbnail ? (
                <Image
                  src={episode.thumbnail}
                  alt={episode.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Play className="h-6 w-6 text-muted-foreground" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Button
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onPlay(episode)}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>

              {episode.duration && (
                <div className="absolute bottom-1 right-1">
                  <Badge variant="outline" className="bg-black/50 text-white border-white/20 text-xs">
                    {episode.duration}m
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      Tập {episode.episodeNumber}
                      {episode.seasonNumber && ` - Phần ${episode.seasonNumber}`}
                    </Badge>
                    <Badge
                      variant={episode.status === 'published' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {episode.status}
                    </Badge>
                    {episode.isAIGenerated && (
                      <Badge variant="outline" className="text-xs">
                        AI
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {episode.title}
                  </h3>
                </div>
              </div>

              {episode.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {episode.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {episode.statistics.views.toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {episode.statistics.likes.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {episode.statistics.comments.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(episode.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <Button variant="outline" size="sm" onClick={() => onPlay(episode)}>
                  <Play className="mr-2 h-4 w-4" />
                  Xem
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
