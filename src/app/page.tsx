import StickerCustomizer from "@/components/sticker-customizer";
import { LampContainer } from "@/components/ui/lamp";

export default function Home() {
  return (
    <LampContainer>
      <div className="w-[calc(100vw-2rem)] md:w-[calc(100vw-4rem)] lg:w-[1230px] z-10 -mt-80">
        <StickerCustomizer />
      </div>
    </LampContainer>
  );
}
