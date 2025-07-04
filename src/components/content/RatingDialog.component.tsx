// components/content/RatingDialog.tsx
"use client";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { rateFilmThunk } from '@/app/redux/film/thunk.film';
import { rateStoryThunk } from '@/app/redux/story/thunk.story';
import { toast } from 'sonner';

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  type: 'film' | 'story';
}

export default function RatingDialog({
  open,
  onOpenChange,
  item,
  type
}: RatingDialogProps) {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    const thunk = type === 'film'
      ? rateFilmThunk
      : rateStoryThunk;

    const payload = type === 'film'
      ? item._id
      : { id: item._id, rating };

    dispatch(thunk(payload) as any);

    toast.success(`Rated ${item?.title} ${rating} stars`);
    onOpenChange(false);
    setRating(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đánh giá {item?.title}</DialogTitle>
          <DialogDescription>
            Bạn đánh giá {type} này như thế nào?
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-6">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="p-1 hover:scale-110 transition-transform"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`h-8 w-8 ${star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                    }`}
                />
              </button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            Gửi Đánh giá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
