import "@/app/global.css";
import { Canvas } from "@/components/canvas";
import Image from "next/image";
import Scrolling from "@public/scroll-2.webp";
import ScrollingBak from "@public/scroll.png";

export const metadata = {
  title: "Stars",
  description: "have fun~",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang='en'>
      <body>
        <Canvas></Canvas>
        <Image
          className='fixed invisible sm:visible right-0 bottom-0 h-24 w-fit bg-transparent sm:top-0 peer-[.close]:-z-20 z-0 peer-[.close:focus]:z-10 transition-all duration-300'
          src={Scrolling || ScrollingBak}
          alt='scrolling'
          width={100}
          height={100}
        />
      </body>
    </html>
  );
}


