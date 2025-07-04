// components/content/ContentGrid.tsx
"use client";
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Heart,
  Plus,
  Star,
  Eye,
  Calendar,
  Clock,
  MoreVertical,
  List,
  Settings
} from 'lucide-react';
import { RootState } from '@/app/redux/store';
import { likeFilmThunk } from '@/app/redux/film/thunk.film';
import { likeStoryThunk } from '@/app/redux/story/thunk.story';
import { toast } from 'sonner';
import { addToWatchlistThunk } from '@/app/redux/users/thunk.users';
import RatingDialog from './RatingDialog.component';
import PlaylistDialog from './PlaylistDialog.component';

interface ContentGridProps {
  items: any[];
  type: 'film' | 'story';
  showActions?: boolean;
  columns?: number;
}

export default function ContentGrid({
  items,
  type,
  showActions = false,
  columns = 6
}: ContentGridProps) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddToWatchlist = (item: any) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm vào danh sách theo dõi');
      return;
    }

    dispatch(addToWatchlistThunk({
      contentId: item._id,
      onSuccess: () => {
        toast.success(`Đã thêm ${item.title} vào danh sách theo dõi`);
      }
    }) as any);
  };

  const handleLike = (item: any) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thích nội dung');
      return;
    }

    const thunk = type === 'film' ? likeFilmThunk : likeStoryThunk;
    dispatch(thunk(item._id) as any);
  };

  const handleRate = (item: any) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để đánh giá nội dung');
      return;
    }

    setSelectedItem(item);
    setRatingDialogOpen(true);
  };

  const handleAddToPlaylist = (item: any) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm vào danh sách phát');
      return;
    }

    setSelectedItem(item);
    setPlaylistDialogOpen(true);
  };

  const gridCols: any = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy {type} nào</p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {items.map((item) => (
          <Card key={item._id} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-[2/3] overflow-hidden">
              <Link href={`/${type}/${item._id}`}>
                <Image
                  src={item.poster || '/images/placeholder.jpg'}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </Link>

              {/* Overlay Actions */}
              {showActions && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleAddToWatchlist(item)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleRate(item)}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="secondary">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleAddToPlaylist(item)}>
                          <List className="mr-2 h-4 w-4" />
                          Thêm vào danh sách phát
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLike(item)}>
                          <Heart className="mr-2 h-4 w-4" />
                          Thích
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              {item.status && (
                <Badge
                  className="absolute top-2 left-2"
                  variant={item.status === 'published' ? 'default' : 'secondary'}
                >
                  {item.status}
                </Badge>
              )}

              {/* AI Generated Badge */}
              {item.isAIGenerated && (
                <Badge className="absolute top-2 right-2 text-white" variant="outline">
                  AI
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              <Link href={`/${type}/${item._id}`}>
                <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary">
                  {item.title}
                </h3>
              </Link>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(item.releaseDate || item.createdAt).getFullYear()}
                </span>
                {item.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.duration}phút
                  </span>
                )}
              </div>

              {/* Categories */}
              {item.categories && item.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.categories.slice(0, 2).map((category: any) => (
                    <Badge key={category._id} variant="outline" className="text-xs">
                      {category.name}
                    </Badge>
                  ))}
                  {item.categories.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.categories.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Statistics */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {item.statistics?.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {item.averageRating?.toFixed(1) || 'N/A'}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {item.statistics?.likes || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rating Dialog */}
      <RatingDialog
        open={ratingDialogOpen}
        onOpenChange={setRatingDialogOpen}
        item={selectedItem}
        type={type}
      />

      {/* Playlist Dialog */}
      <PlaylistDialog
        open={playlistDialogOpen}
        onOpenChange={setPlaylistDialogOpen}
        item={selectedItem}
        type={type}
      />
    </>
  );
}
