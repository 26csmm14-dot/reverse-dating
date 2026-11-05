import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'WANNA DATE U | Will You Go Out With Me?',
  description: 'A playful and interactive dating portfolio to see if we have that special spark.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased min-h-screen bg-mesh flex flex-col justify-between selection:bg-orange-500 selection:text-white relative">
        {/* Dynamic Navigation Bar with Profile Modal */}
        <Navbar />

        {/* Main Viewport */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          {children}
        </main>

        {/* Polished Responsive Footer */}
        <Footer />
      </body>
    </html>
  );
}
