import { beVietnamPro, inter } from '@/lib/font';
import Provider from '@/providers/Provider';
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <title> FILM</title>
      <body className={`${inter.variable} ${beVietnamPro.variable} antialiased`}>
        <Provider>
          <Toaster position="top-right" richColors />
          {children}
        </Provider>
      </body>
    </html>
  );
}
