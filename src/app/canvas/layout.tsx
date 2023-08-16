import "@/app/global.css";
import { Canvas } from "@/components/canvas";
import { getData } from "@lib/utils";

export const metadata = {
  title: "Fake Universe",
  description: "have fun~",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const res = await getData(1, 100);

  return (
    <html lang='en'>
      <body>
        <Canvas data={res.data}></Canvas>
      </body>
    </html>
  );
}


