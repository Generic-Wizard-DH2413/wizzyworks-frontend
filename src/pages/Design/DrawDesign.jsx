import { useRef, useEffect, useState } from "react";
import {
    DEFAULT_COLOR_PRIMARY,
    FIREWORK_COLOR_CLASSES,
    FIREWORK_COLOR_KEYS,
} from "@/utils/fireworkAssets";
import { useText } from "@/i18n/useText";


// TODO Save canvas state when user navigates around (Store state in parent?)
// Change to black background on canvas. Make it a square.
// Send data to server first, then get confirmation for launch screen.
// What is priority?
/*
    Fix the TODO
    Make fuse in blender - Impement in three.js
    Check with Harry P on Godot part.
*/
export default function DrawDesign({
    onCancel,
    onDrawDone,
    onDrawingChange,
    drawing
}) {
    const text = useText();
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [position, setPosition] = useState([]);
    const [currentColor, setCurrentColor] = useState(DEFAULT_COLOR_PRIMARY);

    const colorItems = FIREWORK_COLOR_KEYS.map((color) => (
        <button
            key={color}
            onClick={() => {
                setCurrentColor(color);
            }}
            className={
                currentColor === color
                    ? `${FIREWORK_COLOR_CLASSES[color]} ring-4 ring-zinc-200`
                    : FIREWORK_COLOR_CLASSES[color]
            }
        >
            {" "}
        </button>
    ));

    // Initialize canvas size and setup - only run once on mount
    useEffect(() => {
        const updateCanvasSize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            // Account for container padding (px-4 = 16px on each side, so 32px total)
            // Also account for the canvas container padding (p-4 = 16px on each side, so 32px total)
            const containerPadding = 32; // px-4 from App.jsx container
            const canvasContainerPadding = 32; // p-4 from canvas container
            const totalHorizontalPadding = containerPadding + canvasContainerPadding;
            
            // Calculate available space
            const availableWidth = window.innerWidth - totalHorizontalPadding;
            const availableHeight = window.innerHeight * 0.7; // Leave space for UI elements
            
            // Make it square and responsive
            let canvasSize = Math.min(availableWidth, availableHeight);
            
            // Ensure minimum size for usability
            canvasSize = Math.max(canvasSize, 200);
            
            // Set both internal canvas dimensions and CSS dimensions to the same value
            canvas.width = canvasSize;
            canvas.height = canvasSize;
            canvas.style.width = canvasSize + 'px';
            canvas.style.height = canvasSize + 'px';
            
            const ctx = canvas.getContext("2d");
            ctx.lineCap = "round";
            ctx.lineWidth = 10.0;
            ctx.strokeStyle = currentColor;
            
            // Set initial background to black
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        updateCanvasSize();
        
        // Update canvas size on window resize
        window.addEventListener('resize', updateCanvasSize);
        
        // TODO Check if canvas is in local storage and load the data.
        
        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, []); // Remove currentColor from dependencies

    // Update stroke color when currentColor changes - without clearing canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");
        ctx.strokeStyle = currentColor;
    }, [currentColor]);

    // --- Mouse Events ---
    const startDrawing = (e) => {
        e.preventDefault();
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const ctx = canvasRef.current.getContext("2d");
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
        setPosition([
            ...position,
            [
                (e.nativeEvent.offsetX / canvasRef.current.width) * 2 - 1,
                (1 - (e.nativeEvent.offsetY / canvasRef.current.height) * 2),
            ],
        ]);
    };

    const stopDrawing = () => setIsDrawing(false);

    // --- Touch Events ---
    const getTouchPos = (canvas, touch) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        };
    };

    const handleTouchStart = (e) => {
        e.preventDefault(); // stop page scroll
        const touch = e.touches[0];
        const pos = getTouchPos(canvasRef.current, touch);
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        setIsDrawing(true);
    };

    const handleTouchMove = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const touch = e.touches[0];
        const pos = getTouchPos(canvasRef.current, touch);
        const ctx = canvasRef.current.getContext("2d");
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        setPosition([
            ...position,
            [
                (pos.x / canvasRef.current.width) * 2 - 1,
                (1 - pos.y / canvasRef.current.height) * 2
            ],
        ]);
    };

    const handleTouchEnd = () => setIsDrawing(false);

    const clearCanvas = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.clearRect(
            0,
            0,
            canvasRef.current.width ,
            canvasRef.current.height 
        );
        ctx.fillStyle = "rgb(0, 0, 0)"; // Pure black
        ctx.fill();
        ctx.stroke();
        setPosition([]);
    };


    const sendDrawing = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const canvasDataURL = canvas.toDataURL();
        onDrawingChange?.(canvasDataURL);
        onDrawDone();
    };

    return (

        <div className="flex flex-col space-y-2 px-4 py-4 pb-20">
    
            <div className="flex justify-between mb-3">
                <button onClick={onCancel}>{text("cancel")}</button>
                <button onClick={sendDrawing}>{text("done")}</button>
            </div>
      
            <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{text("drawOptionalHeader")}</h3>
            </div>
            
            <div className="flex justify-center">
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 border border-zinc-700">
                <button 
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={clearCanvas}
                        className="absolute bottom-0 left-0
                                 active:scale-90 pb-5 pl-5"
                    >
                       <img src="../assets/trash.png" className="w-8 h-8"></img>
                </button>
                    <canvas
                        ref={canvasRef}
                        className="rounded-xl bg-black border border-zinc-600 shadow-lg"
                        // mouse
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        // touch
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        
                    />
                </div>
            </div>

            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 border border-zinc-700">
            <div className="grid grid-cols-3 gap-3">

                            {colorItems}

                </div>
            </div>
        </div>
    );
}
