import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import NavBar from "@/components/Navbar";
import Header from "@/components/Header";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import Provider from "@/components/Provider";
import DesktopNavbar from "@/components/DesktopNavbar";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DynamicContextProvider
          settings={{
            environmentId: "729cedfa-59bc-4da0-b3fa-d73f460267c8",
            walletConnectors: [EthereumWalletConnectors],
          }}
        >
          <Provider>
            <div className="h-screen w-full flex-col">
              <div className="h-1/3">
                <div className="max-md:hidden">
                  <DesktopNavbar />
                </div>
                <Header />
              </div>
              <div className="my-24">{children}</div>
              <div className="md:hidden">
                <NavBar />
              </div>
            </div>
          </Provider>
        </DynamicContextProvider>
      </body>
    </html>
  );
}
