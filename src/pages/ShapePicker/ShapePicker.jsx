import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FireworkSystem from '@/components/ShapePicker/FireworkSystem';
import './ShapePicker.css';
import { useState } from 'react';

export default function ShapePicker({ onSaveDataShape }) {
    const { navigateTo } = useAppNavigation();
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
        <div className="flex flex-col space-y-4 px-4 py-8 pb-20">
            <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Pick your firework shape</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-yellow-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="bg-zinc-800/30 backdrop-blur-sm rounded-2xl border border-zinc-700 overflow-hidden">
                <Canvas style={{ width: "100%", height: "300px" }} camera={{ position: [0, 5, 25], fov: 60 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 10, 5]} intensity={1} />
                    <FireworkSystem fireworkColor={currentColor} onFireFirework={() => {}} />
                    <mesh rotation-x={-Math.PI / 2} position={[0, -8, 0]}>
                        <planeGeometry args={[100, 100]} />
                        <meshStandardMaterial color="rgba(155, 155, 155, 1)" />
                    </mesh>
                    <mesh position={[-1, 0, -100]}> {/* Background plane */}
                        <planeGeometry args={[350, 100]} />
                        <meshStandardMaterial color="rgba(26, 61, 113, 1)" />
                    </mesh>
                    <OrbitControls enableZoom={false} enablePan={false} />
                </Canvas>
            </div>
            
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 border border-zinc-700">
                <div className="flex justify-center mb-4">
                    <div className="flex items-center space-x-3 bg-zinc-700/50 rounded-lg p-3">
                        <label htmlFor="foreground" className="text-sm font-medium text-gray-300">Color:</label>
                        <input 
                            onChange={(e) => {
                                setCurrentColor(e.target.value)
                            }} 
                            type="color" 
                            id="foreground" 
                            name="foreground" 
                            value={currentColor}
                            className="w-12 h-10 rounded-lg border-2 border-zinc-600 cursor-pointer bg-transparent"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    <div className="flex justify-center">
                        <img 
                            onClick={(e) => {
                                setSelectedShape(e.target)
                                window.dispatchEvent(
                                    new CustomEvent("refire", {
                                        detail: { type: "normal" },
                                    })
                                );
                            }} 
                            className="w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 border-transparent hover:border-orange-500 
                                     cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 bg-zinc-700/30 p-2" 
                            src={`./star.png`} 
                            alt="star" 
                        />
                    </div>
                    <div className="flex justify-center">
                        <img 
                            onClick={(e) => {
                                setSelectedShape(e.target)
                                window.dispatchEvent(
                                    new CustomEvent("refire", {
                                        detail: { type: "normal" },
                                    })
                                );
                            }} 
                            className="w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 border-transparent hover:border-orange-500 
                                     cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 bg-zinc-700/30 p-2" 
                            src={`./square.png`} 
                            alt='square' 
                        />
                    </div>
                    <div className="flex justify-center">
                        <img 
                            onClick={(e) => {
                                setSelectedShape(e.target)
                                window.dispatchEvent(
                                    new CustomEvent("refire", {
                                        detail: { type: "normal" },
                                    })
                                );
                            }} 
                            className="w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 border-transparent hover:border-orange-500 
                                     cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 bg-zinc-700/30 p-2" 
                            src={`./circle.png`} 
                            alt='circle' 
                        />
                    </div>
                    <div className="flex justify-center">
                        <img 
                            onClick={(e) => {
                                setSelectedShape(e.target)
                                window.dispatchEvent(
                                    new CustomEvent("refire", {
                                        detail: { type: "normal" },
                                    })
                                );
                            }} 
                            className="w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 border-transparent hover:border-orange-500 
                                     cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 bg-zinc-700/30 p-2" 
                            src={`./circle.png`} 
                            alt="circle" 
                        />
                    </div>
                </div>
            </div>

            <nav className="fixed bottom-6 right-6">
                <button 
                    onClick={() => {
                        sendData();
                        navigateTo('/innerlayer')
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-lg py-4 px-8 rounded-full 
                             shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 
                             border border-orange-400/30"
                >
                    Next →
                </button>
            </nav>
        </div>
    )
}