import "./globals.css";

export const metadata = {
  title: "jubs.studio",
  description: "Design Engineering — Julia Hoffmann Buratto",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
