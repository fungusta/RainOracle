import { useEffect, useState } from "react";

interface LightningPath {
  id: number;
  d: string;
}

export default function Lightning() {
  const [paths, setPaths] = useState<LightningPath[]>([]);
  const [flash, setFlash] = useState(false);

  function generateLightning() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const xStart = Math.random() * width;
    let yCurrent = 0;

    let zigzag = `M${xStart},${yCurrent}`;

    while (yCurrent < height) {
      const xOffset = (Math.random() - 0.5) * 100;
      const yOffset = Math.random() * 100 + 50;

      yCurrent += yOffset;
      zigzag += ` L${xStart + xOffset},${yCurrent}`;

      // branch occasionally
      if (Math.random() > 0.7) {
        const bx = xStart + xOffset + (Math.random() - 0.5) * 50;
        const by = yCurrent + Math.random() * 30;
        zigzag += ` M${xStart + xOffset},${yCurrent} L${bx},${by}`;
      }
    }

    const id = Date.now();
    setPaths(prev => [...prev, { id, d: zigzag }]);

    // screen flash
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    // remove lightning after animation is done (your disappear is 2s + 1s = 3s)
    setTimeout(() => {
      setPaths(prev => prev.filter(p => p.id !== id));
    }, 3000);
  }

  useEffect(() => {
    function schedule() {
      const delay = Math.random() * 3000 + 1000;
      return setTimeout(() => {
        generateLightning();
        schedule();
      }, delay);
    }

    const timer = schedule();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none ${flash ? "animate-[lightning-flash_0.2s]" : ""}`}>
      <svg className="w-full h-full">
        {paths.map(p => (
          <path key={p.id} d={p.d} className="lightning" fill="none" />
        ))}
      </svg>
    </div>
  );
}
