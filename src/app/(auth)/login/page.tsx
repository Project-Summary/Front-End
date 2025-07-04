"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Github, Twitter, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { loginSchema, LoginFormValues } from "@/interface/auth.interface";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loginThunk, getSavedCredentials, forgotPasswordThunk } from "@/app/redux/auth/thunk.auth";
import { toast } from "sonner";

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const authLoading = useSelector((state: RootState) => state.auth?.isLoading || false);

  useEffect(() => {
    router.prefetch("/");
    router.prefetch('/register');
    
    const { rememberMe, savedEmail } = getSavedCredentials();
    if (rememberMe && savedEmail) {
      setValue('email', savedEmail);
      setValue('rememberMe', true);
    }
  }, []);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const watchedEmail = watch('email');

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await dispatch(loginThunk({
        data: {
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
        },
        onSuccess() {
          toast.success("Đăng nhập thành công!");
          router.push('/');
        },
      }));
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!watchedEmail) {
      toast.error("Vui lòng nhập địa chỉ email của bạn trước");
      return;
    } 

    const response = await dispatch(forgotPasswordThunk({email: watchedEmail, onSuccess() {
        
    },}))

    console.log("Phản hồi: ", response.payload.data.data);
    router.push(`${response.payload.data.data}`)
  };

  const handleSocialLogin = (provider: 'github' | 'twitter') => {
    toast.info(`Đăng nhập bằng ${provider} sẽ được triển khai sớm`);
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
        <h1 className="text-2xl font-bold mt-6">Chào mừng trở lại</h1>
        <p className="text-muted-foreground mt-2">
          Đăng nhập vào tài khoản của bạn để tiếp tục
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="email@của.bạn"
              className="pl-10"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu của bạn"
              className="pl-10 pr-10"
              {...register("password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Controller
            control={control}
            name="rememberMe"
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="remember-me" className="text-sm font-normal">
                  Ghi nhớ tôi
                </Label>
              </div>
            )}
          />

          <Button
            type="button"
            variant="link"
            className="px-0 font-normal text-sm"
            onClick={handleForgotPassword}
          >
            Quên mật khẩu?
          </Button>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || authLoading}
        >
          {(isLoading || authLoading) ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Đang đăng nhập...</span>
            </div>
          ) : (
            "Đăng Nhập"
          )}
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Tạo một tài khoản ngay
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
          <Button
            variant="outline"
            className="gap-2"
            type="button"
            onClick={() => handleSocialLogin('github')}
            disabled={isLoading || authLoading}
          >
            <Github className="h-4 w-4" /> GitHub
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            type="button"
            onClick={() => handleSocialLogin('twitter')}
            disabled={isLoading || authLoading}
          >
            <Twitter className="h-4 w-4" /> Twitter
          </Button>
        </div> */}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Bằng cách đăng nhập, bạn đồng ý với{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Điều khoản dịch vụ
          </Link>{" "}
          và{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Chính sách bảo mật
          </Link>
        </p>
      </div>
    </form>
  );
}