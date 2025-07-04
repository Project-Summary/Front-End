'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { resetPasswordThunk } from '@/app/redux/auth/thunk.auth';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/redux/store';

// === Validation Schema ===
const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(6, 'Mật khẩu phải ít nhất 6 ký tự')
            .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
                message: 'Mật khẩu phải chứa chữ cái và số',
            }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Mật khẩu không khớp',
    });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordForm) => {
        try {
            const response = await dispatch(
                resetPasswordThunk({
                    token, newPassword: data.newPassword, confirmPassword: data.confirmPassword, onSuccess() {
                        toast.success("Reset password success");
                        router.push('/login');
                    },
                })
            ).unwrap();

            toast.success('Đổi mật khẩu thành công');
            router.push('/login');
        } catch (err: any) {
            toast.error(err.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-24 p-6 border rounded-xl shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Đặt lại mật khẩu</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label>Mật khẩu mới</Label>
                    <Input type="password" {...register('newPassword')} />
                    {errors.newPassword && (
                        <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                    )}
                </div>
                <div>
                    <Label>Nhập lại mật khẩu</Label>
                    <Input type="password" {...register('confirmPassword')} />
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </Button>
            </form>
        </div>
    );
}
