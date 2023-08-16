import { Color3, Color4 } from "@babylonjs/core";
import { PlanetItemType } from "../types";
import { NextResponse } from "next/server";

const getRandom = () => {
  return (Math.random() <= 0.5 ? -1 : 1) * Math.random();
};

const generateFakeData = (
  currentPage: number,
  perPage: number,
): PlanetItemType[] => {
  return Array.from({ length: perPage }).map((_, index) => {
    return {
      id: (currentPage - 1) * perPage + index,
      pos: [getRandom(), getRandom(), getRandom()],
      color: Color3.Random().asArray(),
    };
  });
};

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const params = url.searchParams;
  const currentPage = Number(params.get("currentPage"));
  const perPage = Number(params.get("perPage"));
  const data = generateFakeData(currentPage, perPage);
  return await NextResponse.json({ data });
};
