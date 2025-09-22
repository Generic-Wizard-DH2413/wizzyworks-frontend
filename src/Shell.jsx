import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rk4Step } from "./rk4";

export default function Shell({ shell, gravity, onExplode }) {
    const meshRef = useRef();

    useFrame((_, delta) => {
        rk4Step(shell.pos, shell.vel, delta, shell.c, gravity);
        if (meshRef.current) {
            meshRef.current.position.copy(shell.pos);
        }
        console.log(shell.vel.y)
        if (shell.vel.y < 6) {
            onExplode(shell);
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshStandardMaterial color="orange" emissive="red" />
        </mesh>
    );
}
