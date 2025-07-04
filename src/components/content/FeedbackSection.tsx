// components/content/FeedbackSection.tsx
"use client";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  MessageCircle,
  ThumbsUp,
  Flag,
  Edit,
  Trash2,
  Send
} from 'lucide-react';
import { AppDispatch, RootState } from '@/app/redux/store';
import {
  getFeedbackByContentThunk,
  createFeedbackThunk,
  updateFeedbackThunk,
  deleteFeedbackThunk
} from '@/app/redux/feedback/thunk.feedback';
import { toast } from 'sonner';
import { getFilmByIdThunk } from '@/app/redux/film/thunk.film';

interface FeedbackSectionProps {
  contentId: string;
  contentType: 'movie' | 'story';
  showAddReview?: boolean;
}

export default function FeedbackSection({
  contentId,
  contentType,
  showAddReview = false
}: FeedbackSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { contentFeedbacks, isLoading } = useSelector((state: RootState) => state.feedback);
  const { selectedFilm, loading } = useSelector((state: RootState) => state.film);
  const { user } = useSelector((state: RootState) => state.auth);

  const [newReview, setNewReview] = useState({
    content: '',
    rate: 0
  });
  const [editingReview, setEditingReview] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    dispatch(getFeedbackByContentThunk({
      contentId,
      contentType,
      page: 1,
      limit: 10
    }) as any);

    dispatch(getFilmByIdThunk(contentId));
  }, [contentId, contentType, dispatch]);

  const handleSubmitReview = () => {
    if (!newReview.content.trim()) {
      toast.error('Vui lòng viết đánh giá');
      return;
    }

    if (newReview.rate === 0) {
      toast.error('Vui lòng chọn đánh giá');
      return;
    }

    const data = {
      content: newReview.content,
      rate: newReview.rate,
      ...(contentType === 'movie' ? { movieId: contentId } : { storyId: contentId })
    };

    dispatch(createFeedbackThunk({
      data,
      onSuccess: () => {
        setNewReview({ content: '', rate: 0 });
        toast.success('Đã gửi đánh giá thành công');
        // Refresh feedback list
        dispatch(getFeedbackByContentThunk({
          contentId,
          contentType,
          page: 1,
          limit: 10
        }) as any);
      }
    }) as any);
  };

  const handleDeleteReview = (reviewId: string) => {
    dispatch(deleteFeedbackThunk({
      id: reviewId,
      onSuccess: () => {
        toast.success('Đánh giá đã được xóa thành công');
        // Refresh feedback list
        dispatch(getFeedbackByContentThunk({
          contentId,
          contentType,
          page: 1,
          limit: 10
        }) as any);
      }
    }) as any);
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`${interactive ? 'hover:scale-110 transition-transform cursor-pointer' : ''}`}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            onClick={() => interactive && onRate && onRate(star)}
            disabled={!interactive}
          >
            <Star
              className={`h-4 w-4 ${star <= (interactive ? (hoveredRating || rating) : rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
                }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      {selectedFilm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Đánh giá & Xếp hạng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedFilm.statistics.comments}</div>
                <div className="text-sm text-muted-foreground">Tổng số đánh giá</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold flex items-center justify-center gap-1">
                  {selectedFilm.averageRating.toFixed(1)}
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="text-sm text-muted-foreground">Xếp hạng trung bình</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedFilm.totalRatings}</div>
                <div className="text-sm text-muted-foreground">Tổng số đánh giá</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.max(...Object.values(selectedFilm.averageRating))}
                </div>
                <div className="text-sm text-muted-foreground">Phổ biến nhất</div>
              </div>
            </div>

            {/* Rating Distribution */}
            <Separator className="my-4" />
            <div className="space-y-2">
              <h4 className="font-semibold">Phân phối xếp hạng</h4>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-4">{rating}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${(selectedFilm.averageRating / selectedFilm.totalRatings) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {selectedFilm.averageRating}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Review Form */}
      {showAddReview && user && (
        <Card>
          <CardHeader>
            <CardTitle>Viết bài đánh giá</CardTitle>
            <CardDescription>
              Chia sẻ suy nghĩ của bạn về {contentType} này
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Đánh giá của bạn</label>
              {renderStars(newReview.rate, true, (rating) =>
                setNewReview(prev => ({ ...prev, rate: rating }))
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Đánh giá của bạn</label>
              <Textarea
                placeholder="Write your review here..."
                value={newReview.content}
                onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
              />
            </div>

            <Button onClick={handleSubmitReview} disabled={loading}>
              <Send className="mr-2 h-4 w-4" />
              Gửi Đánh giá
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Danh sách Đánh giá */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Đánh giá ({contentFeedbacks?.length || 0})
        </h3>

        {contentFeedbacks?.map((feedback) => (
          <Card key={feedback._id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={feedback.userId.avatar} alt={feedback.userId.name} />
                  <AvatarFallback>
                    {feedback.userId.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{feedback.userId.name}</h4>
                      <div className="flex items-center gap-2">
                        {renderStars(feedback.rate)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {user && user._id === feedback.userId._id && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingReview(feedback as any)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReview(feedback._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <p className="text-sm">{feedback.content}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground">
                      <ThumbsUp className="h-4 w-4" />
                      Hữu ích ({feedback.helpfulCount})
                    </button>
                    <button className="flex items-center gap-1 hover:text-foreground">
                      <Flag className="h-4 w-4" />
                      Báo cáo
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {contentFeedbacks?.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chưa có đánh giá nào</h3>
              <p className="text-muted-foreground">
                Hãy là người đầu tiên chia sẻ suy nghĩ của bạn về {contentType} này
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
