// app/layout.tsx
import './globals.css'; // Your global Tailwind CSS file
import Navbar from '../components/navbar'; // Adjust path if necessary
import Head from 'next/head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>JobBoard - Find Your Dream Job</title>
        <meta name="description" content="Your go-to platform for finding and posting jobs." />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Navbar /> {/* Your Navbar component */}
        <main>{children}</main> {/* Your page content */}
      </body>
    </html>
  );
}