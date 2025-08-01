
import './globals.css';
import type { Metadata } from 'next';
import { ApolloWrapper } from '@/components/providers/apollo-wrapper';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export const metadata: Metadata = {
  title: 'Kombee - Premium Jewelry Store',
  description: 'Discover our collection of premium jewelry and accessories',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <ErrorBoundary>
          <ApolloWrapper>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </ApolloWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}
