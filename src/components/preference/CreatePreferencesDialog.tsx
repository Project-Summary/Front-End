"use client";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Heart, Upload, Image as ImageIcon } from 'lucide-react';
import { AppDispatch } from '@/app/redux/store';
import { createPreferencesThunk } from '@/app/redux/preferences/thunk.preferences';
import { toast } from 'sonner';

interface CreatePreferencesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PREFERENCE_TYPES = [
    { value: 'movie', label: 'Phim' },
    { value: 'story', label: 'Câu chuyện' },
    { value: 'mixed', label: 'Phim & Câu chuyện' },
    { value: 'watchlist', label: 'Danh sách xem' },
    { value: 'favorites', label: 'Yêu thích' },
    { value: 'recommendations', label: 'Đề xuất' }
];

const SUGGESTED_TAGS = [
    'Hành động', 'Phiêu lưu', 'Hài', 'Chính kịch', 'Giả tưởng', 'Kinh dị',
    'Bí ẩn', 'Lãng mạn', 'Khoa học viễn tưởng', 'Giật gân', 'Tài liệu',
    'Hoạt hình', 'Tội phạm', 'Gia đình', 'Lịch sử', 'Âm nhạc', 'Chiến tranh', 'Miền Tây',
    'Vui vẻ', 'Buồn', 'Phấn khích', 'Thư giãn', 'Mạo hiểm', 'Lãng mạn',
    'Bí ẩn', 'Đáng sợ', 'Truyền cảm hứng', 'Hoài niệm', 'Nhiệt huyết', 'Bình yên',
    'Phát hành mới', 'Kinh điển', 'Viên ngọc ẩn', 'Phổ biến', 'Xu hướng', 'Đoạt giải thưởng'
];


export default function CreatePreferencesDialog({ open, onOpenChange }: CreatePreferencesDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'movie',
        isPublic: false,
        tags: [] as string[],
        thumbnail: ''
    });

    const [currentTag, setCurrentTag] = useState('');
    const [thumbnailPreview, setThumbnailPreview] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Vui lòng nhập tiêu đề tùy chọn');
            return;
        }

        if (!formData.type) {
            toast.error('Vui lòng chọn loại tùy chọn');
            return;
        }

        const preferencesData = {
            title: formData.title.trim(),
            description: formData.description.trim() || undefined,
            type: formData.type,
            isPublic: formData.isPublic,
            tags: formData.tags.length > 0 ? formData.tags : undefined,
            thumbnail: formData.thumbnail || undefined
        };

        dispatch(createPreferencesThunk({
            data: preferencesData,
            onSuccess: () => {
                toast.success('Đã tạo tùy chọn thành công');
                onOpenChange(false);
                resetForm();
            },
        }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            type: 'movie',
            isPublic: false,
            tags: [],
            thumbnail: ''
        });
        setCurrentTag('');
        setThumbnailPreview('');
    };

    const addTag = (tag?: string) => {
        const tagToAdd = tag || currentTag.trim();
        if (tagToAdd && !formData.tags.includes(tagToAdd)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagToAdd]
            }));
            if (!tag) setCurrentTag('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setFormData({ ...formData, thumbnail: url });
        setThumbnailPreview(url);
    };

    const getAvailableSuggestedTags = () => {
        return SUGGESTED_TAGS.filter(tag => !formData.tags.includes(tag));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo tùy chọn
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5" />
                            Tạo tùy chọn mới
                        </DialogTitle>
                        <DialogDescription>
                            Tạo bộ sưu tập tùy chọn mới để sắp xếp nội dung của bạn.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        {/* Thông tin cơ bản */}
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Tiêu đề *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Sở thích phim của tôi"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Mô tả</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Mô tả bộ sưu tập tùy chọn của bạn..."
                                    rows={3}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="type">Loại *</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại tùy chọn" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PREFERENCE_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isPublic"
                                    checked={formData.isPublic}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                                />
                                <Label htmlFor="isPublic">Công khai tùy chọn</Label>
                            </div>
                        </div>

                        {/* Hình thu nhỏ */}
                        <div className="space-y-3">
                            <Label htmlFor="thumbnail">Hình thu nhỏ (tùy chọn)</Label>
                            <div className="space-y-3">
                                <Input
                                    id="thumbnail"
                                    type="url"
                                    value={formData.thumbnail}
                                    onChange={handleThumbnailChange}
                                    placeholder="https://example.com/image.jpg"
                                />
                                {thumbnailPreview && (
                                    <div className="relative w-32 h-20 border rounded-lg overflow-hidden">
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            className="w-full h-full object-cover"
                                            onError={() => setThumbnailPreview('')}
                                        />
                                    </div>
                                )}
                                {!thumbnailPreview && (
                                    <div className="w-32 h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                                        <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-3">
                            <Label>Thẻ</Label>

                            {/* Thêm thẻ tùy chỉnh */}
                            <div className="flex gap-2">
                                <Input
                                    value={currentTag}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Thêm thẻ tùy chỉnh"
                                    className="flex-1"
                                />
                                <Button type="button" onClick={() => addTag()} disabled={!currentTag.trim()}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Thẻ được đề xuất */}
                            {getAvailableSuggestedTags().length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground">Thẻ được đề xuất:</Label>
                                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                        {getAvailableSuggestedTags().slice(0, 20).map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="outline"
                                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                                onClick={() => addTag(tag)}
                                            >
                                                <Plus className="h-3 w-3 mr-1" />
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Selected tags */}
                            {formData.tags.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-sm">Các thẻ đã chọn:</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="gap-1">
                                                {tag}
                                                <X
                                                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                                                    onClick={() => removeTag(tag)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Thông tin */}
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Heart className="h-5 w-5 text-primary mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium mb-1">Giới thiệu về Tùy chọn</p>
                                    <p className="text-muted-foreground">
                                        Tùy chọn giúp bạn sắp xếp và phân loại nội dung dựa trên sở thích của mình.
                                        Bạn có thể thêm phim và truyện vào tùy chọn của mình sau.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit">Tạo tùy chọn</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
