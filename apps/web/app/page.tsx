import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center py-20">
      <p className="text-lg mb-8">Buchen Sie Ihren Termin bei MIYU Flow Spa.</p>
      <Link
        href="/book"
        className="inline-block bg-gold text-white px-8 py-3 rounded-full hover:opacity-90 transition"
      >
        Termin buchen
      </Link>
    </div>
  );
}
