import { Header } from "@/components/server-side/header";

export const Layout = ({ childNodes }: { childNodes: React.ReactNode }) => {
  return (
    <html>
      <body>
        <div className='flex flex-col mx-auto w-full sm:w-[60vw] p-2 gap-2'>
          <div className='h-10'>
            <Header />
          </div>
          {childNodes}
        </div>
      </body>
    </html>
  );
};
