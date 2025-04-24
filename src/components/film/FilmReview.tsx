// components/film/FilmReview.js
import { Calendar, MessageSquare, Share2, ThumbsUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function FilmReview({ review }: {review: any}) {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Review header with author info */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.author.avatar} alt={review.author.name} />
            <AvatarFallback>{review.author.initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{review.author.name}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{review.date}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span className="text-xs">64</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">12</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Separator className="mb-6" />
      
      {/* Review content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: review.content }} />
      </div>
      
      {/* Review actions */}
      <div className="mt-10 pt-6 border-t flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Was this review helpful?</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <ThumbsUp className="h-4 w-4" /> Yes
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <ThumbsUp className="h-4 w-4 rotate-180" /> No
            </Button>
          </div>
        </div>
        
        <div>
          <Button variant="outline" size="sm" className="gap-1">
            <Share2 className="h-4 w-4" /> Share review
          </Button>
        </div>
      </div>
      
      {/* Comments section */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-6">Comments (12)</h3>
        
        {/* Comment form */}
        <div className="flex gap-3 mb-8">
          <Avatar className="h-8 w-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea 
              placeholder="Add a comment..." 
              className="w-full p-3 border rounded-md bg-background min-h-[80px] resize-none"
            />
            <div className="mt-2 flex justify-end">
              <Button>Post Comment</Button>
            </div>
          </div>
        </div>
        
        {/* Comment list */}
        <div className="space-y-6">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/user1.jpg" />
              <AvatarFallback>RJ</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Robert Johnson</h4>
                <span className="text-xs text-muted-foreground">2 days ago</span>
              </div>
              <p className="mt-1 text-sm">I completely agree with your assessment of Villeneuve's direction. The way he balanced the spectacle with the character development was masterful.</p>
              <div className="mt-2 flex gap-4">
                <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" /> 8
                </button>
                <button className="text-xs text-muted-foreground hover:text-foreground">Reply</button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/user2.jpg" />
              <AvatarFallback>LM</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Lisa Mitchell</h4>
                <span className="text-xs text-muted-foreground">3 days ago</span>
              </div>
              <p className="mt-1 text-sm">I thought Austin Butler was a bit over the top as Feyd-Rautha, but otherwise I agree with your points. The sandworm riding sequence was definitely a highlight!</p>
              <div className="mt-2 flex gap-4">
                <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" /> 5
                </button>
                <button className="text-xs text-muted-foreground hover:text-foreground">Reply</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Button variant="ghost" className="text-sm">Load more comments</Button>
        </div>
      </div>
    </article>
  )
}