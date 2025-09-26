import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();
    const [currentColor, setCurrentColor] = useState("#FF0000");

    useEffect(() => {
        const canvas = canvasRef.current;
        // canvas.width = window.innerWidth; // Old way
        // canvas.height = window.innerHeight * 0.8;
        if (window.innerWidth < window.innerHeight) {
            canvas.width = window.innerWidth * 0.8;
            canvas.height = window.innerWidth * 0.8;
        } else {
            canvas.width = window.innerHeight * 0.8;
            canvas.height = window.innerHeight * 0.8;
        }
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
        ctx.strokeStyle = currentColor

        // TODO Check if canvas is in local storage and load the data.
    }, []);

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
        ctx.fillStyle = "rgb(26, 26, 26)";
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
        <>
            <h3>Draw your fireworks inner shape</h3>
            <canvas
                ref={canvasRef}
                className="canvas-element"
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

            <div className="canvas-buttons">
                <button onClick={clearCanvas}>Clear Canvas</button>
                <input onChange={(e) => {
                    setCurrentColor(e.target.value)
                    const ctx = canvasRef.current.getContext("2d");
                    ctx.strokeStyle = currentColor;
                }} type="color" id="foreground" name="foreground" value={currentColor} />
            </div>

            <nav>
                <button onClick={() => {
                    const ctx = canvasRef.current.getContext("2d");
                    ctx.save();
                    navigate('/shapePicker');
                }}>Back</button>
                <button onClick={() => {
                    sendDrawing()
                    navigate('/launch')
                }
                }>Next</button>
            </nav>

        </>
    );
}
