import { useNavigate } from 'react-router-dom';
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FireworkSystem from '../FireworkSystem/FireworkSystem';


export default function ShapePicker() {
    const navigate = useNavigate();

    return (
        <>
            <Canvas style={{ width: "100%", height: "300px" }} camera={{ position: [0, 5, 25], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={1} />
                <FireworkSystem />
                <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}>
                    <planeGeometry args={[100, 50]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh position={[-1, -1, -1]}> {/* Background plane */}
                    <planeGeometry args={[300, 50]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <OrbitControls enableZoom={false} enablePan={false} /> {/* Handles zoom and stuff */}
            </Canvas>


            <h3>Pick your firework shape</h3>

            <nav className='special-nav'>
                <button onClick={() => navigate('/innerlayer')}>Next</button>
            </nav>
        </>
    )
}