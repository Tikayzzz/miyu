import './globals.css';

export const metadata = {
  title: 'MIYU Flow Spa — Buchung',
  description: 'Online-Terminbuchung für MIYU Flow Spa',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen font-sans">
        <header className="py-6 text-center">
          <h1 className="font-serif text-3xl tracking-wide">MIYU · Flow Spa</h1>
        </header>
        <main className="max-w-2xl mx-auto px-4 pb-16">{children}</main>
      </body>
    </html>
  );
}
