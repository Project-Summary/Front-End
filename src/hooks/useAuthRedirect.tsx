"use client";
// hooks/useAuthRedirect.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
    exp: number;
};

export function useAuthRedirect() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.log("May lai vao day af");
            router.push("/login");
            return;
        }

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                console.log("May co vao day khogn");
                localStorage.removeItem("token");
                router.push("/login");
            }
        } catch (error) {
            console.log("May co vao day khogn");

            localStorage.removeItem("token");
            router.push("/login");
        }
    }, [router]);
}
