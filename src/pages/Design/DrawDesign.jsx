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
    const drawingPathsRef = useRef([]);

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

    // Function to redraw all paths from state
    const redrawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        
        // Redraw all paths (canvas is already cleared in updateCanvasSize)
        drawingPathsRef.current.forEach(path => {
            if (path.points.length > 1) {
                ctx.strokeStyle = path.color;
                ctx.lineWidth = 10.0;
                ctx.lineCap = "round";
                ctx.beginPath();
                
                // Convert normalized coordinates back to actual pixels
                const firstPoint = path.points[0];
                const actualX = firstPoint.normalizedX * canvas.width;
                const actualY = firstPoint.normalizedY * canvas.height;
                ctx.moveTo(actualX, actualY);
                
                for (let i = 1; i < path.points.length; i++) {
                    const point = path.points[i];
                    const actualX = point.normalizedX * canvas.width;
                    const actualY = point.normalizedY * canvas.height;
                    ctx.lineTo(actualX, actualY);
                }
                ctx.stroke();
            }
        });
        
        // Restore current stroke color
        ctx.strokeStyle = currentColor;
    };

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
            
            // Redraw all saved paths
            redrawCanvas();
        };

        updateCanvasSize();
        
        // Update canvas size on window resize
        window.addEventListener('resize', updateCanvasSize);
        
        // TODO Check if canvas is in local storage and load the data.
        
        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, [currentColor]); // Remove canvasState dependency

    // --- Mouse Events ---
    const startDrawing = (e) => {
        console.log("Mouse drawing started");
        // e.preventDefault();
        const ctx = canvasRef.current.getContext("2d");
        const canvas = canvasRef.current;
        const point = { 
            x: e.nativeEvent.offsetX, 
            y: e.nativeEvent.offsetY,
            normalizedX: e.nativeEvent.offsetX / canvas.width,
            normalizedY: e.nativeEvent.offsetY / canvas.height
        };
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        setIsDrawing(true);
        
        // Start a new path
        drawingPathsRef.current = [...drawingPathsRef.current, { color: currentColor, points: [point] }];
    };

    const draw = (e) => {
        console.log("Mouse drawing");
        // e.preventDefault();
        if (!isDrawing) return;
        const ctx = canvasRef.current.getContext("2d");
        const canvas = canvasRef.current;
        const point = { 
            x: e.nativeEvent.offsetX, 
            y: e.nativeEvent.offsetY,
            normalizedX: e.nativeEvent.offsetX / canvas.width,
            normalizedY: e.nativeEvent.offsetY / canvas.height
        };
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        
        // Add point to current path
        const currentPath = drawingPathsRef.current[drawingPathsRef.current.length - 1];
        currentPath.points.push(point);
        
        setPosition([
            ...position,
            [
                (e.nativeEvent.offsetX / canvasRef.current.width) * 2 - 1,
                (1 - (e.nativeEvent.offsetY / canvasRef.current.height) * 2),
            ],
        ]);
    };

    const stopDrawing = () => {
        console.log("Mouse drawing stopped");
        setIsDrawing(false);
    };

    // --- Touch Events ---
    const getTouchPos = (canvas, touch) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        };
    };

    const handleTouchStart = (e) => {
        console.log("Touch start event:", e.touches.length);
        const touch = e.touches[0];
        const rect = canvasRef.current.getBoundingClientRect();
        const isOnCanvas = 
            touch.clientX >= rect.left && 
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top && 
            touch.clientY <= rect.bottom;

        console.log("Touch started on canvas:", isOnCanvas);
        
        // Only prevent default if we're touching the canvas
        if (isOnCanvas) {
            console.log("Preventing default for canvas touch");
            // Use a more reliable way to prevent scrolling
            // e.preventDefault();
            const canvas = canvasRef.current;
            const pos = getTouchPos(canvas, touch);
            const point = {
                x: pos.x,
                y: pos.y,
                normalizedX: pos.x / canvas.width,
                normalizedY: pos.y / canvas.height
            };
            const ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            setIsDrawing(true);
            
            // Start a new path
            drawingPathsRef.current = [...drawingPathsRef.current, { color: currentColor, points: [point] }];
        } else {
            console.log("Not preventing default - touch outside canvas");
        }
    };

    const handleTouchMove = (e) => {
        console.log("Touch move event:", e.touches.length, "isDrawing:", isDrawing);
        if (!isDrawing) return;
        
        // Prevent default to avoid scrolling when drawing
        console.log("Preventing default for touch move");
        // e.preventDefault();
        
        const touch = e.touches[0];
        const canvas = canvasRef.current;
        const pos = getTouchPos(canvas, touch);
        const point = {
            x: pos.x,
            y: pos.y,
            normalizedX: pos.x / canvas.width,
            normalizedY: pos.y / canvas.height
        };
        const ctx = canvas.getContext("2d");
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        
        // Add point to current path
        const currentPath = drawingPathsRef.current[drawingPathsRef.current.length - 1];
        currentPath.points.push(point);
        
        setPosition([
            ...position,
            [
                (pos.x / canvasRef.current.width) * 2 - 1,
                (1 - pos.y / canvasRef.current.height) * 2
            ],
        ]);
    };

    const handleTouchEnd = () => {
        console.log("Touch end event");
        setIsDrawing(false);
    };

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
        drawingPathsRef.current = [];
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

    // Set up event listeners with proper configuration to avoid passive listener issues
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Configure the canvas to allow touch events to be non-passive
        const handleTouchStart = (e) => {
            console.log("Canvas touch start");
            // This will be handled by our component's event handler
        };

        const handleTouchMove = (e) => {
            console.log("Canvas touch move");
            // This will be handled by our component's event handler
        };

        const handleTouchEnd = (e) => {
            console.log("Canvas touch end");
            // This will be handled by our component's event handler
        };

        // Add event listeners with passive: false to prevent the error
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

        return () => {
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    return (

        <div className="flex flex-col space-y-2 px-4 py-4 pb-20">
    
            <div className="flex justify-between mb-3 font-medium text-xl">
                <button onClick={onCancel}>{text("cancel")}</button>
                <button className="bg-orange-500/80 hover:bg-orange-500 text-white font-medium  py-2 px-6 rounded-xl 
                                        transition-all duration-200 hover:scale-105 active:scale-95 border border-orange-400/30" onClick={sendDrawing}>{text("done")}</button>
            </div>
            
            
      
            <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{text("drawOptionalHeader")}</h3>
            </div>
            
            <div className="flex justify-center">
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 border border-zinc-700 touch-none">
                <button 
                        // onMouseDown={(e) => e.preventDefault()}
                        onClick={clearCanvas}
                        className="absolute bottom-0 left-0
                                 active:scale-90 pb-5 pl-5"
                    >
                       <img src="trash.png" className="w-8 h-8"></img>
                </button>
                    <canvas
                        ref={canvasRef}
                        className="rounded-xl bg-black border border-zinc-600 shadow-lg touch-none"
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

// 