import { useEffect, useRef } from "react";

export default function GameMount() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { createGame } = await import("./index");
      if (cancelled || !containerRef.current) return;
      gameRef.current = createGame(containerRef.current);
    })();

    return () => {
      cancelled = true;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div id="game-root" ref={containerRef} />;
}
