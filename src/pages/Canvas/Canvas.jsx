import './Canvas.css';
import { useRef, useEffect, useState } from "react";
import { useAppNavigation } from '@/hooks/useAppNavigation';

// TODO Save canvas state when user navigates around (Store state in parent?)
// Change to black background on canvas. Make it a square.
// Send data to server first, then get confirmation for launch screen.
// What is priority?
/*
    Fix the TODO
    Make fuse in blender - Impement in three.js
    Check with Harry P on Godot part.
*/
export default function Canvas({ onSaveDataURL }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [position, setPosition] = useState([]);
    const { navigateTo } = useAppNavigation();
    const [currentColor, setCurrentColor] = useState("#FF0000");

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
            ctx.lineWidth = 3;
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
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
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
        console.log(position)
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
        ctx.rect(
            -3,
            -3,
            canvasRef.current.width + 10,
            canvasRef.current.height + 10
        );
        ctx.fillStyle = "rgb(0, 0, 0)"; // Pure black
        ctx.fill();
        ctx.stroke();
        setPosition([]);
    };


    const sendDrawing = () => {
        // TODO Maybe rename to save drawing? 
        // TODO clear local storage?
        const ctx = canvasRef.current.getContext("2d");
        let canvasDataURL = canvasRef.current.toDataURL()
        console.log("Sending drawing");
        console.log(canvasDataURL)
        onSaveDataURL(canvasDataURL);
    };


    return (
        <div className="flex flex-col space-y-4 px-4 py-8 pb-20">
            <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Draw your fireworks inner shape</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-yellow-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="flex justify-center">
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 border border-zinc-700">
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
                <div className="flex flex-row justify-center items-center gap-4">
                    <button 
                        onClick={clearCanvas}
                        className="bg-orange-500/80 hover:bg-orange-500 text-white font-medium text-base py-3 px-6 rounded-xl h-16
                                 transition-all duration-200 hover:scale-105 active:scale-95 border border-orange-400/30"
                    >
                        Clear Canvas
                    </button>
                    <div className="flex justify-around items-center space-x-3 bg-zinc-700/50 rounded-lg pl-3 h-16">
                        <label htmlFor="foreground" className="text-base font-medium text-gray-300">Color:</label>
                        <input 
                            onChange={(e) => setCurrentColor(e.target.value)} 
                            type="color" 
                            id="foreground" 
                            name="foreground" 
                            value={currentColor}
                            className="w-12 h-10 rounded-lg border-2 border-zinc-600 cursor-pointer bg-transparent"
                        />
                    </div>
                </div>
            </div>

            <nav className="fixed bottom-6 left-0 right-0 px-6">
                <div className="flex justify-between">
                    <button 
                        onClick={() => {
                            const ctx = canvasRef.current.getContext("2d");
                            ctx.save();
                            navigateTo('/shapePicker');
                        }}
                        className="bg-zinc-700/80 hover:bg-zinc-600 text-white font-medium text-lg py-4 px-6 rounded-full 
                                 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 border border-zinc-600"
                    >
                        ← Back
                    </button>
                    <button 
                        onClick={() => {
                            sendDrawing()
                            navigateTo('/launch')
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-lg py-4 px-8 rounded-full 
                                 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 
                                 border border-orange-400/30"
                    >
                        Next →
                    </button>
                </div>
            </nav>
        </div>
    );
}
