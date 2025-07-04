"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart,
  Star,
  Eye,
  Calendar,
  Clock,
  BookOpen,
  Plus,
  Share,
  Flag,
  MessageCircle,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { RootState } from '@/app/redux/store';
import { getStoryByIdThunk, likeStoryThunk, incrementViewCountThunk } from '@/app/redux/story/thunk.story';
import { getFeedbackByContentThunk } from '@/app/redux/feedback/thunk.feedback';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import RatingDialog from '@/components/content/RatingDialog.component';
import PlaylistDialog from '@/components/content/PlaylistDialog.component';
import FeedbackSection from '@/components/content/FeedbackSection';
import { toast } from 'sonner';
import { StoriesCategories } from '@/app/redux/story/interface.story';

export default function StoryDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentStory, loading } = useSelector((state: RootState) => state.story);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (id) {
      dispatch(getStoryByIdThunk(id as string) as any);
      dispatch(incrementViewCountThunk(id as string) as any);
    }
  }, [id, dispatch]);

  const handleLike = () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }
    dispatch(likeStoryThunk({
      id: id as string, onSuccess() {
        toast.success("Like story summaries success");
      },
    }) as any);
  };

  const handleAddToWatchlist = () => {
    if (!isAuthenticated) {
      return;
    }
    // Add to watchlist logic
  };
  if (!currentStory) {
    return <div className="container mx-auto px-4 py-8">Không tìm thấy câu chuyện</div>;
  }
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <Button className="absolute left-5 top-5 z-40" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay trở lại
        </Button>
        <Image
          src={currentStory?.backdrop || currentStory.poster || '/placeholder-story.jpg'}
          alt={currentStory.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Image
                  src={currentStory.poster || '/placeholder-story.jpg'}
                  alt={currentStory.title}
                  width={200}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {currentStory.title}
                  </h1>
                  <div className="flex items-center gap-4 text-white/80">
                    {currentStory.releaseDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(currentStory.releaseDate).getFullYear()}
                      </span>
                    )}
                    {currentStory.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {currentStory.duration}phút đọc
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {currentStory.averageRating?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentStory.categories?.map((category: StoriesCategories) => (
                    <Badge key={category._id} variant="secondary">
                      {category.name}
                    </Badge>
                  ))}
                </div>

                <p className="text-white/90 max-w-2xl">
                  {currentStory.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button size="lg">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Đọc ngay
                  </Button>

                  {isAuthenticated && (
                    <>
                      <Button variant="outline" onClick={handleAddToWatchlist}>
                        <Plus className="mr-2 h-4 w-4" />
                        Danh sách đọc
                      </Button>
                      <Button variant="outline" onClick={handleLike}>
                        <Heart className="mr-2 h-4 w-4" />
                        Thích
                      </Button>
                      <Button variant="outline" onClick={() => setRatingDialogOpen(true)}>
                        <Star className="mr-2 h-4 w-4" />
                        Đánh giá
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
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Tab nội dung */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="summary">Tóm tắt</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            <TabsTrigger value="details">Chi tiết</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mô tả câu chuyện</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{currentStory.description}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <span className="font-medium">{currentStory.statistics?.views || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lượt thích:</span>
                    <span className="font-medium">{currentStory.statistics?.likes || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bình luận:</span>
                    <span className="font-medium">{currentStory.statistics?.comments || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Xếp hạng:</span>
                    <span className="font-medium">
                      {currentStory.averageRating?.toFixed(1) || 'N/A'}/10
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {currentStory.releaseDate && (
                    <div className="flex justify-between">
                      <span>Ngày phát hành:</span>
                      <span className="font-medium">
                        {new Date(currentStory.releaseDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {currentStory.duration && (
                    <div className="flex justify-between">
                      <span>Thời gian đọc:</span>
                      <span className="font-medium">{currentStory.duration}m</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Ngôn ngữ:</span>
                    <span className="font-medium">{currentStory.language || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quốc gia:</span>
                    <span className="font-medium">{currentStory.country || 'N/A'}</span>
                  </div>
                  {currentStory.ageRating && (
                    <div className="flex justify-between">
                      <span>Xếp hạng độ tuổi:</span>
                      <span className="font-medium">{currentStory.ageRating}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thẻ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentStory.tags?.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    )) || <span className="text-muted-foreground">Không có thẻ</span>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Tóm tắt câu chuyện
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentStory.summary ? (
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{currentStory.summary.content}</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Không có tóm tắt nào cho câu chuyện này</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <FeedbackSection
              contentId={currentStory._id}
              contentType="story"
              showAddReview={isAuthenticated}
            />
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chi tiết</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStory.script && (
                  <>
                    <div>
                      <h4 className="font-semibold mb-2">Xem trước tập lệnh</h4>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm">
                          {currentStory.script.content ?
                            currentStory.script.content.substring(0, 500) + '...' :
                            'No script content available'
                          }
                        </p>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Thể loại</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentStory.categories?.map((category) => (
                      <Badge key={category._id}>
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Thông tin bổ sung</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Trạng thái:</span>
                      <Badge className="ml-2" variant={
                        currentStory.status === 'published' ? 'default' : 'secondary'
                      }>
                        {currentStory.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">AI đã tạo:</span>
                      <Badge className="ml-2" variant={currentStory.isAIGenerated ? 'outline' : 'secondary'}>
                        {currentStory.isAIGenerated ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Đã tạo:</span>
                      <span className="ml-2">{new Date(currentStory.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Đã cập nhật:</span>
                      <span className="ml-2">{new Date(currentStory.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <RatingDialog
        open={ratingDialogOpen}
        onOpenChange={setRatingDialogOpen}
        item={currentStory}
        type="story"
      />

      <PlaylistDialog
        open={playlistDialogOpen}
        onOpenChange={setPlaylistDialogOpen}
        item={currentStory}
        type="story"
      />
    </div>
  );
}
