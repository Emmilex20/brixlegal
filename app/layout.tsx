import "./globals.css";
import "./why-replica.css";
import "./fidelity.css";
import "./nav-replica.css";
export const metadata = {
  title: "Brix Legal Practice & Consultancy — For Seamless Legal Practice",
  description: "A multidisciplinary law firm delivering detail-driven corporate, commercial and compliance counsel."
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}