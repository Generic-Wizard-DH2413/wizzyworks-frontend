import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { rk4Step } from "./rk4";

export default function Fragment({ frag, gravity }) {
    const meshRef = useRef();

    useFrame((_, delta) => {
        rk4Step(frag.pos, frag.vel, delta, frag.c, gravity);
        if (meshRef.current) {
            meshRef.current.position.copy(frag.pos);
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshStandardMaterial color="yellow" emissive="orange" />
        </mesh>
    );
}
