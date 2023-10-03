import Image from "next/image";
import Link from "next/link";
import Scrolling from "@public/scroll-2.webp";
import ScrollingBak from "@public/scroll.png";
import { Header } from "@/components/server-side/header";
import { AiFillCloseCircle, AiOutlineArrowRight } from "react-icons/ai";
import dynamic from "next/dynamic";
import { Loading } from "@/components/loading";

const CanvasBg = dynamic(() => import("@/components/canvas"), {
  loading: () => <Loading />,
});

export const ContentWithCanvas = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <a
        href='#'
        className='peer close top-16 right-4 h-fit -z-20 sm:z-10 sm:top-0 sm:right-[calc(20vw-2rem)] fixed transition-all bg-transparent text-sky-500 duration-500 ease-in peer-[.arrow:visible]:invisible'>
        <AiFillCloseCircle className='rounded-full text-2xl' />
      </a>

      <Image
        className='fixed invisible sm:visible right-0 bottom-0 h-24 w-fit bg-transparent sm:top-0 peer-[.close]:-z-20 z-0 peer-[.close:focus]:z-10 transition-all duration-500 ease-in text-sky-500'
        src={Scrolling || ScrollingBak}
        alt='scrolling'
        width={100}
        height={100}
        priority
      />

      <Link
        className='top-24 z-10 arrow right-4 focus:-z-10 sm:top-28 h-fit sm:invisible sm:right-8 sm:peer-[.close:focus]:visible fixed transition-all duration-500 bg-transparent text-sky-500 ease-in'
        href='/canvas'>
        <AiOutlineArrowRight className='rounded-full text-2xl' />
      </Link>

      <div
        className='flex flex-col mx-auto w-full relative 
        peer-[.close:focus]:invisible 
        peer-[.close:focus]:-z-50 
        sm:w-[60vw] p-2 gap-2'>
        <div className='h-10 rounded-md'>
          <Header />
        </div>

        {children}
      </div>

      <CanvasBg></CanvasBg>
    </>
  );
};
