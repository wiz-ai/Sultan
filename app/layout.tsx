import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { ChatLauncher } from '@/components/ChatLauncher';

export const metadata: Metadata = {
  title: 'Sultan — Tampa\'s Finest Middle Eastern Grocery',
  description:
    'Halal meats, produce, Middle Eastern pantry, coffee, hookah, and sweets — delivered across Tampa. Shop online with same-day or next-day delivery.',
  openGraph: {
    title: 'Sultan',
    description: "Tampa's finest Middle Eastern grocery — delivered.",
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-parchment min-h-screen antialiased">
        <Navbar />
        <main className="min-h-[calc(100vh-80px)]">{children}</main>
        <ChatLauncher />
        <footer className="border-t border-sultan-sand/60 mt-24">
          <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
            <div>
              <div className="heading-display text-2xl text-sultan-emerald-800">Sultan</div>
              <p className="text-sultan-ink/70 mt-2">
                Tampa's finest Middle Eastern grocery. Family-run since day one.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Shop</h4>
              <ul className="space-y-1.5 text-sultan-ink/70">
                <li>Middle Eastern</li>
                <li>Halal Meats</li>
                <li>Produce</li>
                <li>Coffee &amp; Tea</li>
                <li>Hookah</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Help</h4>
              <ul className="space-y-1.5 text-sultan-ink/70">
                <li>Delivery info</li>
                <li>Halal certification</li>
                <li>Contact us</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Visit</h4>
              <p className="text-sultan-ink/70">
                5010 E Busch Blvd<br />Tampa, FL 33617<br />(813) 555-0100
              </p>
            </div>
          </div>
          <div className="border-t border-sultan-sand/60 py-4 text-center text-xs text-sultan-ink/50">
            © {new Date().getFullYear()} Sultan Market. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
