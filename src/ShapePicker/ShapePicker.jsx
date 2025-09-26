import { useNavigate } from 'react-router-dom';
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FireworkSystem from '../FireworkSystem/FireworkSystem';
import './ShapePicker.css';
import { useState } from 'react';

export default function ShapePicker({ onSaveDataShape }) {
    const navigate = useNavigate();
    const [shape, setShape] = useState("square")
    const [currentColor, setCurrentColor] = useState("#00FF00");

    const sendData = () => {
        onSaveDataShape(shape, currentColor);

    }

    const setSelectedShape = (target) => {
        setShape(target.alt);
        let currentSelected = document.getElementsByClassName("selected")[0];
        if (currentSelected)
            currentSelected.classList.remove("selected");
        target.classList.add("selected");
    }

    return (
        <>
            <h3>Pick your firework shape</h3>
            <Canvas style={{ width: "100%", height: "50%" }} camera={{ position: [0, 5, 25], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={1} />
                <FireworkSystem fireworkColor={currentColor} onFireFirework={() => {

                }} />
                <mesh rotation-x={-Math.PI / 2} position={[0, -8, 0]}>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial color="rgba(155, 155, 155, 1)" />
                </mesh>
                <mesh position={[-1, 0, -100]}> {/* Background plane */}
                    <planeGeometry args={[350, 100]} />
                    <meshStandardMaterial color="rgba(26, 61, 113, 1)" />
                </mesh>
                <OrbitControls enableZoom={false} enablePan={false} /> {/* Handles zoom and stuff */}
            </Canvas>
            {/* <button
                onClick={() => {
                    window.dispatchEvent(
                        new CustomEvent("refire", {
                            detail: { type: "normal" },
                        })
                    );
                }
                }>

            </button> */}
            < div className='shapepicker-buttons'>
                <input onChange={(e) => {
                    setCurrentColor(e.target.value)
                    // const ctx = canvasRef.current.getContext("2d");
                    // ctx.strokeStyle = currentColor;
                }} type="color" id="foreground" name="foreground" value={currentColor} />
            </ div>

            <section className="picker-container">
                <div className="picker-item">
                    <img onClick={(e) => {
                        setSelectedShape(e.target)
                        window.dispatchEvent(
                            new CustomEvent("refire", {
                                detail: { type: "normal" },
                            })
                        );
                    }} className="picker-img" src={`./star.png`} alt="star" />
                </div>
                <div>
                    <img onClick={(e) => {
                        setSelectedShape(e.target)
                        window.dispatchEvent(
                            new CustomEvent("refire", {
                                detail: { type: "normal" },
                            })
                        );
                    }} className="picker-img" src={`./square.png`} alt='square' />
                </div>
                <div>
                    <img onClick={(e) => {
                        setSelectedShape(e.target)
                        window.dispatchEvent(
                            new CustomEvent("refire", {
                                detail: { type: "normal" },
                            })
                        );
                    }} className="picker-img" src={`./circle.png`} alt='circle' />
                </div>
                <div>
                    <img onClick={(e) => {
                        setSelectedShape(e.target)
                        window.dispatchEvent(
                            new CustomEvent("refire", {
                                detail: { type: "normal" },
                            })
                        );
                    }} className="picker-img" src={`./circle.png`} alt="circle" />
                </div>
            </section>


            <nav className='special-nav'>
                <button onClick={() => {
                    sendData();
                    navigate('/innerlayer')
                }
                }>Next</button>
            </nav>
        </>
    )
}