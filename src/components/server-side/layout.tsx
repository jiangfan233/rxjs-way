import { Header } from "@/components/server-side/header";
import dynamic from "next/dynamic";
import { Loading } from "@/components/loading";
import { AiFillCloseCircle, AiOutlineArrowRight } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import Scrolling from "@public/scroll-2.webp";
import ScrollingBak from "@public/scroll.png";

const CanvasBg = dynamic(() => import("@/components/canvas"), {
  loading: () => <Loading />,
  ssr: false,
});

export const Layout = ({ childNodes }: { childNodes: React.ReactNode }) => {
  let scrollImg = Scrolling;
  return (
    <html>
      <body className='relative'>
        <a
          href='#'
          className='peer close top-16 right-4 z-20 h-fit sm:top-0 sm:right-[calc(20vw-2rem)] fixed transition-all duration-500'>
          <AiFillCloseCircle size={"1.5rem"} className='rounded-full' />
        </a>

        <Image
          className='fixed invisible sm:visible right-0 bottom-0 h-24 w-fit bg-transparent sm:top-0 peer-[.close]:-z-20 z-0 peer-[.close:focus]:z-10 transition-all duration-500'
          src={Scrolling || ScrollingBak}
          alt='scrolling'
          width={100}
          height={100}
        />

        <Link
          className='top-4 right-4 sm:top-28 h-fit -z-20 peer-[.close:focus]:z-10 sm:right-8 fixed transition-all duration-500'
          href='/canvas'>
          <AiOutlineArrowRight className='rounded-full' size={"1.5rem"} />
        </Link>

        <div
          className='flex flex-col mx-auto w-full relative 
        peer-[.close:focus]:invisible 
        peer-[.close:focus]:-z-50 
        sm:w-[60vw] p-2 gap-2'>
          <div className='h-10 rounded-md'>
            <Header />
          </div>

          {childNodes}
        </div>

        <CanvasBg></CanvasBg>
      </body>
    </html>
  );
};
