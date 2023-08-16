"use client";

import { useEffect, useRef } from "react";
import {
  CreateSphere,
  Engine,
  FreeCamera,
  HemisphericLight,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { CanvasUtil } from "@lib/canvas";
import { PlanetItemType } from "@/app/canvas/types";

/**
 * Length: 所有star都处于一个立方体内部，立方体边长1000
 */
const Length = 1000;
/**
 * 视距： 这里默认能看到立方体对角线长度的75%
 */
const Horizon = 1.732 * 1000 * 0.75;
/**
 * sphere最大直径
 */
const MaxDiameter = 30;
const MinDiameter = 5;
const Segments = 16;

const randomDiameter = () => {
  return Math.random() * (MaxDiameter - MinDiameter) + MinDiameter;
};

export const Canvas = ({ data: initStars }: { data: PlanetItemType[] }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasUtilRef = useRef<CanvasUtil | null>(null);
  const allStarsInfoRef = useRef([]);

  useEffect(() => {
    const engine = new Engine(canvasRef.current, true, undefined, true);
    const scene = new Scene(engine);
    canvasUtilRef.current = new CanvasUtil(scene, engine);
    canvasRef.current?.focus();
  }, []);

  useEffect(() => {
    initStars.map(({ id, color, pos }) => {
      const star = canvasUtilRef.current!.createStar(
        `star-${id}`,
        {
          diameter: randomDiameter(),
        },
        color,
        Horizon,
      );
      star!.position = Vector3.FromArray(pos.map((n) => n * Length));
    });
  }, [initStars]);

  return (
    <canvas
      ref={canvasRef}
      className=' w-[100vw] h-full absolute top-0 left-0 z-0 peer-[.close]:-z-10  peer-[.close:focus]:z-0'>
      It seems that your browser does not support canvas. What a pity :(
    </canvas>
  );
};

export default Canvas;
