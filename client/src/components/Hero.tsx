import Image from "next/image";
import { JSX } from "react";

export default function HeroImage(): JSX.Element {
  return (
    <section className="w-full h-80 md:h-[500px] relative">
      <Image
        src="/bg.webp"          // Make sure this is in public/bg.webp
        alt="Blood and organ donation"
        fill
        priority
        // className="object-cover" // fills container, can use object-contain if you want empty space
      />
    </section>
  );
}
