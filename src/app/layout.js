import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Reusable Auth System",
  description: "Professional and reusable authentication system.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        {children}
      </body>
    </html>
  );
}