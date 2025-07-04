"use client";

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    MoreVertical,
    Play,
    Edit,
    Trash2,
    Share,
    Lock,
    Globe,
    Calendar,
    User
} from 'lucide-react';
import { AppDispatch } from '@/app/redux/store';
import { deletePlaylistThunk } from '@/app/redux/playlist/thunk.playlist';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { Playlist } from '@/app/redux/playlist/interface.playlist';

interface PlaylistCardProps {
    playlist: Playlist;
    onEdit?: (playlist: Playlist) => void;
    showOwner?: boolean;
    className?: string;
}

export default function PlaylistCard({
    playlist,
    onEdit,
    showOwner = false,
    className = ""
}: PlaylistCardProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await dispatch(deletePlaylistThunk({
                id: playlist._id,
                onSuccess: () => {
                    toast.success('Đã xóa danh sách phát thành công');
                    setShowDeleteDialog(false);
                }
            })).unwrap();
        } catch (error) {
            // Error handled in thunk
        } finally {
            setIsDeleting(false);
        }
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/playlists/${playlist._id}`;
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Liên kết danh sách phát đã được sao chép vào bảng tạm');
        } catch (error) {
            toast.error('Không sao chép được liên kết');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getThumbnail = () => {
        if (playlist.thumbnail) return playlist.thumbnail;
        if (playlist.items && playlist.items.length > 0) {
            return playlist.items[0].content.poster;
        }
        return '/images/default-playlist.jpg';
    };

    return (
        <>
            <Card className={`group hover:shadow-lg transition-all duration-200 ${className}`}>
                <CardHeader className="p-0">
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                        <Image
                            src={getThumbnail()}
                            alt={playlist.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <Link href={`/playlists/${playlist._id}`}>
                                <Button size="sm" className="gap-2">
                                    <Play className="h-4 w-4" />
                                    Xem danh sách phát
                                </Button>
                            </Link>
                        </div>

                        {/* Huy hiệu riêng tư */}
                        <div className="absolute top-2 left-2">
                            <Badge variant={playlist.isPublic ? "default" : "secondary"} className="gap-1">
                                {playlist.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                {playlist.isPublic ? 'Công khai' : 'Riêng tư'}
                            </Badge>
                        </div>

                        {/* Actions Menu */}
                        <div className="absolute top-2 right-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 bg-black/20 hover:bg-black/40"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {onEdit && (
                                        <DropdownMenuItem onClick={() => onEdit(playlist)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Sửa
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={handleShare}>
                                        <Share className="mr-2 h-4 w-4" />
                                        Chia sẻ
                                    </DropdownMenuItem>
                                    {onEdit && (
                                        <DropdownMenuItem
                                            onClick={() => setShowDeleteDialog(true)}
                                            className="text-red-600"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Xóa
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg line-clamp-1" title={playlist.name}>
                            {playlist.name}
                        </h3>

                        {playlist.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {playlist.description}
                            </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{playlist.totalItems} mục</span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(playlist.createdAt)}
                            </span>
                        </div>

                        {showOwner && playlist.userId && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span>by {playlist.userId.name}</span>
                            </div>
                        )}

                        {/* Thẻ */}
                        {playlist.tags && playlist.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {playlist.tags.slice(0, 3).map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                                {playlist.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{playlist.tags.length - 3} thêm
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                    <Link href={`/playlists/${playlist._id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                            Xem chi tiết
                        </Button>
                    </Link>
                </CardFooter>
            </Card>

            {/* Hộp thoại xác nhận xóa */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa danh sách phát</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa "{playlist.name}" không? Không thể hoàn tác hành động này.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? 'Đang xóa...' : 'Xóa'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
