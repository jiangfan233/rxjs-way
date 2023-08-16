import { Header } from "@/components/server-side/header";
import { getData } from "@lib/utils";
import dynamic from "next/dynamic";
import { Loading } from "@/components/loading";
import { AiFillCloseCircle, AiOutlineArrowRight } from "react-icons/ai";
import Link from "next/link";

const CanvasBg = dynamic(async () => import("@/components/canvas"), {
  loading: () => <Loading />,
  ssr: false,
});

export const Layout = async ({
  childNodes,
}: {
  childNodes: React.ReactNode;
}) => {
  const res = await getData(1, 100);
  return (
    <html>
      <body className='relative'>
        <a
          href='#'
          className='peer close top-16 right-4 sm:top-0 sm:right-[calc(20vw-2rem)] absolute'>
          <AiFillCloseCircle size={"1.5rem"} className='rounded-full' />
        </a>

        <Link
          className='top-24 right-4 sm:top-8 sm:right-[calc(20vw-2rem)] absolute'
          href='/canvas'>
          <AiOutlineArrowRight className='rounded-full' size={"1.5rem"} />
        </Link>

        <div
          className='flex flex-col mx-auto w-full relative 
        peer-[.close:focus]:invisible 
        peer-[.close:focus]:absolute 
        peer-[.close:focus]:-z-50 
        peer-[.close:focus]:text-[10px]
        sm:w-[60vw] p-2 gap-2'>
          <div className='h-10 rounded-md'>
            <Header />
          </div>

          {childNodes}
        </div>

        <CanvasBg data={res.data}></CanvasBg>
      </body>
    </html>
  );
};
