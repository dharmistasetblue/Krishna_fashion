import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SiteInteractions from "../components/SiteInteractions";

export const metadata={title:"Krishna Fashion"};
export default function RootLayout({children}){
 return <html lang="en"><head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
  <link rel="stylesheet" href="/css/style.css" />
  <link rel="icon" href="/assets/images/favicon.png" />
  <meta name="theme-color" content="#15933a" />
 </head><body><Header />{children}<Footer /><SiteInteractions /></body></html>;
}
