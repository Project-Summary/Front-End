"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Heart,
  Star,
  Eye,
  Calendar,
  Clock,
  Play,
  Plus,
  Share,
  Flag,
  MessageCircle,
  ArrowLeft,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize,
  Settings,
  Download,
  Bookmark
} from 'lucide-react';
import { AppDispatch, RootState } from '@/app/redux/store';
import RatingDialog from '@/components/content/RatingDialog.component';
import PlaylistDialog from '@/components/content/PlaylistDialog.component';
import FeedbackSection from '@/components/content/FeedbackSection';
import { getEpisodeDetailThunk, getFilmByIdThunk, incrementViewThunk, likeFilmThunk } from '@/app/redux/film/thunk.film';

export default function EpisodeDetailPage() {
  const { id, episodeId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedEpisode, loading, selectedFilm } = useSelector((state: RootState) => state.film);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (episodeId) {
      dispatch(getEpisodeDetailThunk({ epId: episodeId as string }));
      dispatch(incrementViewThunk(id as string) as any);
    }
    dispatch(getFilmByIdThunk(id as string));
  }, [id, dispatch, episodeId]);

  const handleLike = () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }
    dispatch(likeFilmThunk(id as string) as any);
  };

  const handleAddToWatchlist = () => {
    if (!isAuthenticated) {
      return;
    }
    // Add to watchlist logic
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-center text-muted-foreground">Đang tải tập phim...</p>
      </div>
    );
  }

  if (!selectedEpisode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Tập phim không tìm thấy</h3>
            <p className="text-muted-foreground mb-4">
              Tập phim bạn tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          {selectedEpisode.movieId && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                href={`/films/${selectedEpisode.movieId}`}
                className="hover:text-foreground transition-colors"
              >
                {selectedFilm?.title}
              </Link>
              <span>•</span>
              <span>Tập {selectedEpisode?.episodeNumber}</span>
              {selectedEpisode.seasonNumber && (
                <>
                  <span>•</span>
                  <span>Mùa {selectedEpisode.seasonNumber}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video Player Section */}
      <div className="bg-black">
        <div className="container mx-auto px-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {selectedEpisode.thumbnail && (
              <Image
                src={selectedEpisode.thumbnail}
                alt={selectedEpisode.title}
                fill
                className="object-cover"
              />
            )}

            {/* Video Player Overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Button
                size="lg"
                className="h-16 w-16 rounded-full"
                onClick={handlePlayPause}
              >
                <Play className="h-8 w-8" />
              </Button>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="space-y-2">
                {/* Progress Bar */}
                <div className="flex items-center gap-2 text-white text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <Progress value={progress} className="flex-1" />
                  <span>{formatTime(duration)}</span>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-white hover:text-white">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:text-white" onClick={handlePlayPause}>
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:text-white">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:text-white">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-white hover:text-white">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:text-white">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episode Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Title and Actions */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{selectedEpisode.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                {selectedFilm?.releaseDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(selectedFilm?.releaseDate).toLocaleDateString()}
                  </span>
                )}
                {selectedEpisode.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedEpisode.duration} phút
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {selectedFilm?.averageRating?.toFixed(1) || 'N/A'}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {selectedEpisode.statistics?.views || 0}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isAuthenticated && (
                <>
                  <Button variant="outline" onClick={handleLike}>
                    <Heart className="mr-2 h-4 w-4" />
                    Thích
                  </Button>
                  <Button variant="outline" onClick={() => setRatingDialogOpen(true)}>
                    <Star className="mr-2 h-4 w-4" />
                    Đánh giá
                  </Button>
                  <Button variant="outline" onClick={handleAddToWatchlist}>
                    <Bookmark className="mr-2 h-4 w-4" />
                    Lưu
                  </Button>
                  <Button variant="outline" onClick={() => setPlaylistDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Danh sách phát
                  </Button>
                </>
              )}
              <Button variant="outline">
                <Share className="mr-2 h-4 w-4" />
                Chia sẻ
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Tải xuống
              </Button>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="details">Chi tiết</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {selectedEpisode.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Mô tả tập phim</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedEpisode.description}</p>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Thống kê
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Lượt xem:</span>
                      <span className="font-medium">{selectedEpisode.statistics?.views || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lượt thích:</span>
                      <span className="font-medium">{selectedEpisode.statistics?.likes || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bình luận:</span>
                      <span className="font-medium">{selectedEpisode.statistics?.comments || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đánh giá:</span>
                      <span className="font-medium">
                        {selectedFilm?.averageRating?.toFixed(1) || 'N/A'}/10
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin tập phim</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tập:</span>
                      <span className="font-medium">#{selectedEpisode.episodeNumber}</span>
                    </div>
                    {selectedEpisode.seasonNumber && (
                      <div className="flex justify-between">
                        <span>Mùa:</span>
                        <span className="font-medium">{selectedEpisode.seasonNumber}</span>
                      </div>
                    )}
                    {selectedEpisode.duration && (
                      <div className="flex justify-between">
                        <span>Thời gian:</span>
                        <span className="font-medium">{selectedEpisode.duration} phút</span>
                      </div>
                    )}
                    {selectedFilm?.releaseDate && (
                      <div className="flex justify-between">
                        <span>Ngày phát hành:</span>
                        <span className="font-medium">
                          {new Date(selectedFilm?.releaseDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Trạng thái:</span>
                      <Badge variant={selectedEpisode.status === 'published' ? 'default' : 'secondary'}>
                        {selectedEpisode.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedFilm?.tags && selectedFilm?.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Thẻ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedFilm?.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chi tiết</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedEpisode.description && (
                    <>
                      <div>
                        <h4 className="font-semibold mb-2">Xem trước kịch bản</h4>
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="text-sm whitespace-pre-wrap">
                            {selectedEpisode.description.substring(0, 500)}
                            {selectedEpisode.description.length > 500 && '...'}
                          </p>
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  <div>
                    <h4 className="font-semibold mb-2">Chi tiết kỹ thuật</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Số tập:</span>
                        <span className="ml-2 font-medium">{selectedEpisode.episodeNumber}</span>
                      </div>
                      {selectedEpisode.seasonNumber && (
                        <div>
                          <span className="text-muted-foreground">Mùa:</span>
                          <span className="ml-2 font-medium">{selectedEpisode.seasonNumber}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Tạo bằng AI:</span>
                        <Badge className="ml-2" variant={selectedEpisode.isAIGenerated ? 'outline' : 'secondary'}>
                          {selectedEpisode.isAIGenerated ? 'Có' : 'Không'}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Trạng thái:</span>
                        <Badge className="ml-2" variant={
                          selectedEpisode.status === 'published' ? 'default' : 'secondary'
                        }>
                          {selectedEpisode.status}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ngày tạo:</span>
                        <span className="ml-2">{new Date(selectedEpisode.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cập nhật:</span>
                        <span className="ml-2">{new Date(selectedEpisode.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {selectedEpisode.movieId && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Phim liên quan</h4>
                        <Link href={`/films/${selectedEpisode.movieId}`}>
                          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                            <CardContent className="flex items-center gap-4 p-4">
                              {selectedFilm?.poster && (
                                <Image
                                  src={selectedFilm?.poster}
                                  alt={selectedFilm?.title}
                                  width={60}
                                  height={90}
                                  className="rounded object-cover"
                                />
                              )}
                              <div>
                                <h5 className="font-medium">{selectedFilm?.title}</h5>
                                <p className="text-sm text-muted-foreground">Xem tất cả các tập</p>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <RatingDialog
        open={ratingDialogOpen}
        onOpenChange={setRatingDialogOpen}
        item={selectedFilm}
        type="film"
      />

      <PlaylistDialog
        open={playlistDialogOpen}
        onOpenChange={setPlaylistDialogOpen}
        item={selectedFilm}
        type="film"
      />
    </div>
  );
}