import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EnvironmentProvider } from "@/lib/environment/state";
import { WorldStateProvider } from "@/lib/environment/WorldStateContext";
import { ContentProvider } from "@/lib/content/ContentEngine";
import { InteractionProvider } from "@/lib/environment/InteractionReactor";
import { I18nProvider } from "@/lib/i18n/I18nContext";
import { AudioEngineProvider } from "@/lib/audio/AudioEngine";
import { CreatorProvider } from "@/lib/environment/creatorState";
import { WeatherEffects } from "@/components/environment/WeatherEffects";
import { SystemWhispers } from "@/components/environment/SystemWhispers";

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
  description: "Adaptive Digital Environment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden selection:bg-cyber-cyan/30 selection:text-white`}>
        <I18nProvider>
          <WorldStateProvider>
            <EnvironmentProvider>
              <CreatorProvider>
                <InteractionProvider>
                  <ContentProvider>
                    <AudioEngineProvider>
                      <WeatherEffects />
                      <SystemWhispers />
                      {children}
                    </AudioEngineProvider>
                  </ContentProvider>
                </InteractionProvider>
              </CreatorProvider>
            </EnvironmentProvider>
          </WorldStateProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
