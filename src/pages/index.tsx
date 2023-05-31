"use client";
import { getDirStructure, FileStructure } from "../../lib/post";


export async function getStaticProps() {
  const menuArray = getDirStructure();
  return {
    props: {
        menuArray,
    },
  };
}


interface HomeProps {
  menuArray: FileStructure[]
}

export default function Home({ menuArray }: HomeProps) {
  
  return (
    <div>Hello</div>
  )
}
