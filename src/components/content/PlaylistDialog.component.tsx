"use client";

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Loader2 } from 'lucide-react';
import { AppDispatch, RootState } from '@/app/redux/store';
import { toast } from 'sonner';
import {
    addItemToPlaylistThunk,
    createPlaylistThunk,
    getMyPlaylistsThunk
} from '@/app/redux/playlist/thunk.playlist';

interface PlaylistDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: any;
    type: 'film' | 'story';
}

export default function PlaylistDialog({
    open,
    onOpenChange,
    item,
    type
}: PlaylistDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { playlists, loading } = useSelector((state: RootState) => state.playlist);

    const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
    const [newPlaylistData, setNewPlaylistData] = useState({
        name: '',
        description: '',
        isPublic: false,
        tags: [] as string[]
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            dispatch(getMyPlaylistsThunk());
            // Reset form when dialog opens
            setSelectedPlaylists([]);
            setNewPlaylistData({
                name: '',
                description: '',
                isPublic: false,
                tags: []
            });
            setShowCreateForm(false);
        }
    }, [open, dispatch]);

    const handleCreatePlaylist = async () => {
        if (!newPlaylistData.name.trim()) {
            toast.error('Vui lòng nhập tên danh sách phát');
            return;
        }

        try {
            setIsSubmitting(true);
            await dispatch(createPlaylistThunk({
                data: {
                    name: newPlaylistData.name,
                    description: newPlaylistData.description,
                    isPublic: newPlaylistData.isPublic,
                    tags: newPlaylistData.tags
                },
                onSuccess: () => {
                    setNewPlaylistData({
                        name: '',
                        description: '',
                        isPublic: false,
                        tags: []
                    });
                    setShowCreateForm(false);
                    // Refresh playlists to show the new one
                    dispatch(getMyPlaylistsThunk());
                }
            })).unwrap();
        } catch (error) {
            // Error already handled in thunk
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        if (selectedPlaylists.length === 0) {
            toast.error('Vui lòng chọn ít nhất một danh sách phát');
            return;
        }

        if (!item?._id) {
            toast.error('Mục đã chọn không hợp lệ');
            return;
        }

        try {
            setIsSubmitting(true);

            // Determine content type based on the type prop
            const contentType = type === 'film' ? 'Movie' : 'Story';

            // Add item to each selected playlist
            const promises = selectedPlaylists.map(playlistId =>
                dispatch(addItemToPlaylistThunk({
                    playlistId,
                    itemData: {
                        contentId: item._id,
                        contentType
                    }
                })).unwrap()
            );

            await Promise.all(promises);

            toast.success(`Đã thêm "${item.title}" vào danh sách phát ${selectedPlaylists.length})`);
            onOpenChange(false);
            setSelectedPlaylists([]);
        } catch (error) {
            // Error already handled in thunk
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePlaylistToggle = (playlistId: string, checked: boolean) => {
        if (checked) {
            setSelectedPlaylists(prev => [...prev, playlistId]);
        } else {
            setSelectedPlaylists(prev => prev.filter(id => id !== playlistId));
        }
    };

    const handleTagsChange = (tagsString: string) => {
        const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        setNewPlaylistData(prev => ({ ...prev, tags }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Thêm vào danh sách phát</DialogTitle>
                    <DialogDescription>
                        Thêm "{item?.title}" vào danh sách phát của bạn
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Đang tải trạng thái */}
                    {loading && (
                        <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span className="ml-2">Đang tải danh sách phát...</span>
                        </div>
                    )}
                    {/* Existing Playlists */}
                    {!loading && playlists && playlists.length > 0 && (
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {playlists.map((playlist: any) => {
                                // Check if item already exists in this playlist
                                const itemExists = playlist.items?.some((playlistItem: any) =>
                                    playlistItem.content._id === item?._id
                                );

                                return (
                                    <div key={playlist._id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={playlist._id}
                                            checked={selectedPlaylists.includes(playlist._id)}
                                            onCheckedChange={(checked) => handlePlaylistToggle(playlist._id, checked as boolean)}
                                            disabled={itemExists}
                                        />
                                        <Label
                                            htmlFor={playlist._id}
                                            className={`flex-1 ${itemExists ? 'text-muted-foreground' : ''}`}
                                        >
                                            {playlist.name} ({playlist.totalItems ?? 0} item)
                                            {itemExists && <span className="text-xs ml-2">(Đã thêm)</span>}
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && playlists && playlists.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                            Không tìm thấy danh sách phát nào. Tạo danh sách phát đầu tiên của bạn bên dưới.
                        </div>
                    )}

                    {/* Create New Playlist */}
                    {showCreateForm ? (
                        <div className="space-y-4 border-t pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="playlistName">Tên danh sách phát *</Label>
                                <Input
                                    id="playlistName"
                                    value={newPlaylistData.name}
                                    onChange={(e) => setNewPlaylistData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Nhập tên danh sách phát"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="playlistDescription">Mô tả</Label>
                                <Textarea
                                    id="playlistDescription"
                                    value={newPlaylistData.description}
                                    onChange={(e) => setNewPlaylistData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Mô tả tùy chọn"
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="playlistTags">Thẻ (phân cách bằng dấu phẩy)</Label>
                                <Input
                                    id="playlistTags"
                                    value={newPlaylistData.tags.join(', ')}
                                    onChange={(e) => handleTagsChange(e.target.value)}
                                    placeholder="action, comedy, drama"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isPublic"
                                    checked={newPlaylistData.isPublic}
                                    onCheckedChange={(checked) => setNewPlaylistData(prev => ({ ...prev, isPublic: checked }))}
                                />
                                <Label htmlFor="isPublic">Công khai danh sách phát</Label>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleCreatePlaylist}
                                    disabled={!newPlaylistData.name.trim() || isSubmitting}
                                    className="flex-1"
                                >
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Tạo danh sách phát
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowCreateForm(false)}
                                    disabled={isSubmitting}
                                >
                                    Hủy
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => setShowCreateForm(true)}
                            className="w-full"
                            disabled={loading}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo danh sách phát mới
                        </Button>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={selectedPlaylists.length === 0 || isSubmitting || loading}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Thêm vào danh sách phát ({selectedPlaylists.length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
