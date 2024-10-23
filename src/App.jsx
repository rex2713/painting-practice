import { useState, useEffect, useRef } from "react";

function App() {
  const canvasRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#6B7280");
  const [linePx, setLinePx] = useState(5);

  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const maxHistory = 10;

  const save = () => {
    const canvas = canvasRef.current;
    const data = canvas.toDataURL();
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push(data);
    if (newHistory.length > maxHistory) newHistory.shift();
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  const rePaint = (canvas, ctx, img) => {
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const undo = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      const canvas = canvasRef.current;
      const img = new Image();
      img.src = history[currentStep - 1];
      const ctx = canvas.getContext("2d");
      rePaint(canvas, ctx, img);
    }
  };

  const redo = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep((prev) => prev + 1);
      const canvas = canvasRef.current;
      const img = new Image();
      img.src = history[currentStep + 1];
      const ctx = canvas.getContext("2d");
      rePaint(canvas, ctx, img);
    }
  };

  const start = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = linePx;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const drawing = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const end = (e) => {
    setIsDrawing(false);
    save();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    if (history.length === 0) {
      save();
    }
  }, [color]);

  const colors = [
    "#6B7280",
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
  ];

  return (
    <>
      <div className="flex justify-center pt-14 gap-x-2">
        <button
          onClick={() => undo()}
          className="border px-2 rounded-xl border-black text-black"
        >
          復原
        </button>{" "}
        <button
          onClick={() => redo()}
          className="border px-2 rounded-xl border-black text-black"
        >
          重做
        </button>
        {colors.map((c, idx) => {
          return (
            <div
              key={c}
              className={`inline-block ${
                c === color
                  ? "border border-black rounded-full flex justify-center items-center"
                  : "border border-transparent"
              }`}
            >
              <button
                className="w-10 h-10 rounded-full m-1"
                style={{ backgroundColor: c }}
                onClick={() => {
                  setColor(c);
                }}
              ></button>
            </div>
          );
        })}
        <div className="flex flex-col items-center">
          <span className="text-main text-lg">{linePx}</span>
          <input
            onChange={(e) => setLinePx(e.target.value)}
            value={linePx}
            type="range"
            min="1"
            max="20"
          />
        </div>
        <button
          onClick={() => {
            setColor("#fff");
          }}
          className="border px-2 rounded-xl border-black text-black"
        >
          橡皮擦
        </button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={start}
        onMouseMove={drawing}
        onMouseUp={end}
        width={800}
        height={600}
        className="border border-black rounded-3xl mx-auto mt-6 cursor-crosshair bg-white"
      />
    </>
  );
}

export default App;
