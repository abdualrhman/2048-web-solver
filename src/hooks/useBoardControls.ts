import { useEffect } from "react";

type Direction = "up" | "down" | "left" | "right";

interface UseBoardControlsProps {
  onMove: (direction: Direction) => void;
}

export const useBoardControls = ({ onMove }: UseBoardControlsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          onMove("up");
          break;
        case "ArrowDown":
          onMove("down");
          break;
        case "ArrowLeft":
          onMove("left");
          break;
        case "ArrowRight":
          onMove("right");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onMove]);
};
