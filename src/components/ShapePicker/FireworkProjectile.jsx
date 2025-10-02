// FireworkProjectile.jsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rk4Step } from "../rk4";

export default function FireworkProjectile() {
    // TODO Create FireworkSystem that is the parent of this
    const shells = useRef([{
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        c: 0.02,
    }]);

    const fragments = useRef([{
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        c: 0.02,
    }]);

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
        console.log(shells.current)
        if (shells.current) {
            for (let i = 0; i < shells.current.length; i++) {
                if (shells.current[i].vel.y <= 0) {
                    shells.current.splice(i, 1);
                }
            }
        }
    });

    function randomUnitVector() {
        const z = 2 * Math.random() - 1;
        const t = 2 * Math.PI * Math.random();
        const r = Math.sqrt(1 - z * z);
        return new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), z);
    }


    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial emissive="orange" color="red" />
        </mesh>
    );
}
