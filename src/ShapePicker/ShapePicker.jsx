import { useNavigate } from 'react-router-dom';
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FireworkProjectile from "../FireworkProjectile/FireworkProjectile";

export default function ShapePicker() {
    const navigate = useNavigate();

    return (
        <>
            <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={1} />
                <FireworkProjectile />
                <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}>
                    <planeGeometry args={[50, 50]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <OrbitControls />
            </Canvas>

            <h3>Pick your firework shape</h3>

            <nav className='special-nav'>
                <button onClick={() => navigate('/innerlayer')}>Next</button>
            </nav>
        </>
    )
}