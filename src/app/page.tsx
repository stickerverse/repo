import StickerCustomizer from "@/components/sticker-customizer";
import { LampContainer } from "@/components/ui/lamp";

export default function Home() {
  return (
    <main>
       <LampContainer>
        <div className="w-full max-w-7xl mx-auto px-4 z-10 pt-20">
          <StickerCustomizer />
        </div>
      </LampContainer>
    </main>
  );
}
