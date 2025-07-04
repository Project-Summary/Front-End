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
import { Plus } from 'lucide-react';
import { AppDispatch } from '@/app/redux/store';
import { createPlaylistThunk } from '@/app/redux/playlist/thunk.playlist';
import { toast } from 'sonner';

interface CreatePlaylistDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreatePlaylistDialog({ open, onOpenChange }: CreatePlaylistDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isPublic: false,
        tags: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const playlistData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        };

        dispatch(createPlaylistThunk({
            data: playlistData,
            onSuccess: () => {
                toast.success('Danh sách phát đã được tạo thành công');
                onOpenChange(false);
                setFormData({ name: '', description: '', isPublic: false, tags: '' });
            }
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo danh sách phát
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Tạo danh sách phát mới</DialogTitle>
                        <DialogDescription>
                            Tạo danh sách phát mới để sắp xếp nội dung yêu thích của bạn.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Tên *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Nhập tên danh sách phát"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Mô tả danh sách phát của bạn"
                                rows={3}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tags">Thẻ (phân cách bằng dấu phẩy)</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="action, comedy, thriller"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isPublic"
                                checked={formData.isPublic}
                                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                            />
                            <Label htmlFor="isPublic">Công khai danh sách phát</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit">Tạo danh sách phát</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
