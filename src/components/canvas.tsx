"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Engine, InstancedMesh, Scene, Vector3 } from "@babylonjs/core";
import { CanvasUtil } from "@lib/canvas";
import { PlanetItemType } from "@/app/canvas/types";
import { callWhenIdle, debounce, getData, throttle } from "@lib/utils";

const width = 1920;
const height = 1080;
const depth = (width + height) / 2;

/**
 * Length: 所有star都处于一个长方体
 */
const Length = Math.sqrt(width * width + height * height + depth * depth);
/**
 * 视距： 这里默认能看到立方体对角线长度的75%
 */
const Horizon = Length;
/**
 * sphere最大直径
 */
const MaxDiameter = 30;
const MinDiameter = 5;
const Segments = 16;

const randomDiameter = () => {
  return Math.random() * (MaxDiameter - MinDiameter) + MinDiameter;
};

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneAndEngineRef = useRef<{ engine: Engine; scene: Scene } | null>(
    null,
  );
  const canvasUtilRef = useRef<CanvasUtil | null>(null);
  const allStarsInfoRef = useRef<InstancedMesh[]>([]);
  const fetchedStarsRef = useRef<PlanetItemType[]>([]);
  const pageInfoRef = useRef({ currentPage: 2, perPage: 100 });
  const [error, setError] = useState("");

  const handleResize = useCallback(
    () => () => sceneAndEngineRef.current?.engine.resize(),
    [],
  );

  const addStar = useCallback(() => {
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        if (fetchedStarsRef.current.length <= 0) return;
        const { id, color, pos } = fetchedStarsRef.current.shift()!;
        const star = canvasUtilRef.current!.createStar(
          `star-${id}`,
          {
            diameter: randomDiameter(),
            segments: Segments,
          },
          color,
        );
        const camera = canvasUtilRef.current!.freeCamera;
        const cameraPos = camera!.position;
        star!.position = Vector3.FromArray([
          pos[0] * width + cameraPos.x,
          pos[1] * height + cameraPos.y,
          pos[2] * depth + cameraPos.z,
        ]);

        allStarsInfoRef.current.push(star);
      });
    }
  }, []);

  const getStars = useCallback(async () => {
    const { currentPage, perPage } = pageInfoRef.current;
    if (canvasRef.current) canvasRef.current!.style.cursor = "progress";
    const { data } = await getData(currentPage, perPage);
    fetchedStarsRef.current.push(...data);
    addStar();
    pageInfoRef.current.currentPage += 1;
    if (canvasRef.current) canvasRef.current!.style.cursor = "grab";
  }, [addStar]);

  // 摄像机移动时需要加载更多数据
  const handleGoForward = useMemo(() => debounce(getStars, 500), [getStars]);

  const canvasPointerEventHandler = useMemo(() => {
    let isClicking = false;

    const handlePointerDown = (e: React.PointerEvent) => {
      e.stopPropagation();
      isClicking = true;
      canvasRef.current!.style.cursor = "grabbing";
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (isClicking) canvasRef.current!.style.cursor = "grabbing";
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      e.stopPropagation();
      canvasRef.current!.style.cursor = "grab";
      isClicking = false;
    };

    return { handlePointerDown, handlePointerMove, handlePointerUp };
  }, []);

  // init engine, init scene
  useEffect(() => {
    try {
      const engine = new Engine(canvasRef.current, true, undefined, true);
      const scene = new Scene(engine);
      sceneAndEngineRef.current = { engine, scene };
      canvasUtilRef.current = new CanvasUtil(scene, engine, Horizon);
      canvasRef.current?.focus();
    } catch (e) {
      setError("Your browser does not support WebGL, I'm sorry for that.");
    }
  }, [setError]);

  // resize
  useEffect(() => {
    // sceneAndEngineRef.current?.engine.
    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", handleGoForward);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", handleGoForward);
    };
  }, [handleResize, handleGoForward]);

  // create initial stars
  useEffect(() => {
    const fetchData = async () => {
      const res = await getData(1, 100);
      fetchedStarsRef.current.push(...res.data);
      callWhenIdle(addStar);
    };

    fetchData();
  }, [addStar]);

  return (
    <>
      {error ? (
        error
      ) : (
        <canvas
          onPointerDown={canvasPointerEventHandler.handlePointerDown}
          onPointerMove={canvasPointerEventHandler.handlePointerMove}
          onPointerUp={canvasPointerEventHandler.handlePointerUp}
          ref={canvasRef}
          className=' cursor-grab w-[100vw] h-full absolute top-0 left-0 z-0 peer-[.close]:-z-10  peer-[.close:focus]:z-0'>
          It seems that your browser does not support canvas. What a pity :(
        </canvas>
      )}
    </>
  );
};

export default Canvas;
