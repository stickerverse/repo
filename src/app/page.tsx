import StickerCustomizer from "@/components/sticker-customizer";
import { LampContainer } from "@/components/ui/lamp";

export default function Home() {
  return (
    <main>
       <LampContainer>
        <div className="w-full mx-auto px-6 lg:px-8 z-10 pt-40">
          <StickerCustomizer />
        </div>
      </LampContainer>
    </main>
  );
}
