import './globals.css';
import { Inter, Be_Vietnam_Pro } from 'next/font/google'; 

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const beVietnamPro = Be_Vietnam_Pro({ 
  subsets: ['vietnamese'], 
  weight: ['400', '700', '900'], // Cần 3 độ dày này
  variable: '--font-be-vietnam-pro' 
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${beVietnamPro.variable}`}> 
      <body>{children}</body>
    </html>
  );
}