import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/ui/Toast";
import DestinationQuickViewModal from "@/components/DestinationQuickViewModal";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Navbar />

        {children}

        <Footer />
        <DestinationQuickViewModal />
        <ToastContainer />
      </body>
    </html>
  );
}