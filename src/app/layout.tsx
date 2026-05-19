import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EnvironmentProvider } from "@/lib/environment/state";
import { CreatorProvider } from "@/lib/environment/creatorState";
import { InteractionProvider } from "@/lib/environment/InteractionReactor";
import { WorldStateProvider } from "@/lib/environment/WorldStateContext";
import { AudioEngineProvider } from "@/lib/audio/AudioEngine";
import { I18nProvider } from "@/lib/i18n/I18nContext";
import { ContentProvider } from "@/lib/content/ContentEngine";
import BackgroundCanvas from "@/components/environment/BackgroundCanvas";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEXUS VEIL",
  description: "Adaptive digital environment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <I18nProvider>
          <WorldStateProvider>
            <ContentProvider>
            <EnvironmentProvider>
              <InteractionProvider>
                <CreatorProvider>
                  <BackgroundCanvas />
                  <AudioEngineProvider>
                  <main className="relative z-0">
                    {children}
                  </main>
                  </AudioEngineProvider>
                </CreatorProvider>
              </InteractionProvider>
            </EnvironmentProvider>
            </ContentProvider>
          </WorldStateProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
