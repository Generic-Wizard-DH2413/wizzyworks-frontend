// FireworkProjectile.jsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rk4Step } from "../rk4";

export default function FireworkProjectile() {
    const meshRef = useRef();

    // particle state (mutable, not React state!)
    const pos = useRef(new THREE.Vector3(0, 0, 0));
    const vel = useRef(new THREE.Vector3(5, 12, 0)); // launch velocity
    const c = 0.02; // drag constant
    const gravity = new THREE.Vector3(0, -9.81, 0);

    useFrame((state, delta) => {
        rk4Step(pos.current, vel.current, delta, c, gravity);
        if (meshRef.current) {
            meshRef.current.position.copy(pos.current);
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial emissive="orange" color="red" />
        </mesh>
    );
}
