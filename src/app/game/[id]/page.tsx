import GameView, { GameViewId } from "@/components/GameView";
import { notFound } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  const isGame = ["mineSweepers", "snake", "tetris"].includes(params.id);
  if (!isGame) {
    notFound();
  }
  return <GameView id={params.id as GameViewId} />;
}
