"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Github, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { registerThunk } from "@/app/redux/auth/thunk.auth";
import { toast } from "sonner";
import { RegisterFormValues, registerSchema } from "@/interface/auth.interface";

export default function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/");
    router.prefetch('/login');
  }, [])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    console.log("Dữ liệu đăng ký:", data);
    await dispatch(registerThunk({
      data: { name: data.firstName + ' ' + data.lastName, email: data.email, password: data.password },
      onSuccess() {
        toast.success("Đăng ký tài khoản thành công");
        router.push('/login');
      },
    }));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container max-w-md mx-auto py-16 px-4"
    >
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="rounded-full bg-primary/20 p-1">
            <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              CC
            </div>
          </div>
          <span className="font-bold text-xl">CineCritique</span>
        </Link>
        <h1 className="text-2xl font-bold mt-6">Tạo tài khoản</h1>
        <p className="text-muted-foreground mt-2">
          Tham gia cộng đồng yêu thích phim
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="first-name">Họ</Label>
            <Input id="first-name" placeholder="họ..." {...register("firstName")} />
            {errors.firstName && (
              <p className="text-sm text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last-name">Tên</Label>
            <Input id="last-name" placeholder="tên..." {...register("lastName")} />
            {errors.lastName && (
              <p className="text-sm text-red-500">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@của.bạn"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input id="password" type="password" {...register("password")} />
          <p className="text-xs text-muted-foreground">
            Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ cái và số
          </p>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Controller
          control={control}
          name="terms"
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                Tôi đồng ý với
                <Link href="/terms" className="mx-1 text-primary hover:underline">
                  điều khoản dịch vụ
                </Link>
                và
                <Link href="/privacy" className="mx-1 text-primary hover:underline">
                  chính sách bảo mật
                </Link>
              </Label>
            </div>
          )}
        />
        {errors.terms && (
          <p className="text-sm text-red-500">{errors.terms.message}</p>
        )}

        <Button type="submit" className="w-full">
          Tạo Tài Khoản
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Bạn đã có tài khoản?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Hoặc tiếp tục với
            </span>
          </div>
        </div>

        {/* <div className="grid grid-cols-2 gap-4 mt-6">
          <Button variant="outline" className="gap-2" type="button">
            <Github className="h-4 w-4" /> GitHub
          </Button>
          <Button variant="outline" className="gap-2" type="button">
            <Twitter className="h-4 w-4" /> Twitter
          </Button>
        </div> */}
      </div>
    </form>
  );
}