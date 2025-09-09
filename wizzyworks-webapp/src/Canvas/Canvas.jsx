import { useRef, useEffect, useState } from "react";
// https://www.youtube.com/watch?v=tev71VzEJos&t=402s&ab_channel=frontend-coder
// https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas
// https://dev.to/javascriptacademy/create-a-drawing-app-using-javascript-and-canvas-2an1

export default function Canvas() {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.8;
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#000000";
    }, []);

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
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.rect(-3, -3, canvasRef.current.width + 10, canvasRef.current.height + 10);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.stroke();
    };

    const sendDrawing = () => {
        console.log("Sending drawing")
    };

    // Write down how we are using AI
    return (
        <>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                className="canvas-element"
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            />

            <button onClick={sendDrawing}>Send Drawing</button>
            <button onClick={clearCanvas}>Clear Canvas</button>
        </>

    );
}
