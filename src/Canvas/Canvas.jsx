import { useRef, useEffect, useState } from "react";

export default function Canvas({ onSend }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [position, setPosition] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.8;
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#000000";
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
                e.nativeEvent.offsetX / canvasRef.current.width,
                e.nativeEvent.offsetY / canvasRef.current.height,
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
            [pos.x / canvasRef.current.width, pos.y / canvasRef.current.height],
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
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();
        setPosition([]);
    };

    const sendDrawing = () => {
        console.log("Sending drawing");
        onSend(position);
        console.log(position);
    };

    return (
        <>
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

            <button onClick={sendDrawing}>Send Drawing</button>
            <button onClick={clearCanvas}>Clear Canvas</button>
        </>
    );
}
