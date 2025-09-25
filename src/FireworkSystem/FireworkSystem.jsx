// https://codesandbox.io/p/sandbox/fireworks-km2wzy?file=%2Fsrc%2FFirework.tsx%3A14%2C6
import { useState, useEffect } from "react";
import * as THREE from "three";
import Shell from "../Shell";
import Fragment from "../Fragment";

function createShell() {
    return { pos: new THREE.Vector3(0, 1, 0), vel: new THREE.Vector3(0, 12, 0), c: 0.02 };
}
function createFragment(origin, baseVel) {
    return {
        pos: origin.clone(),
        vel: baseVel.clone().add(new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)),
        c: 0.02,
    };
}

export default function FireworkSystem({ fireworkColor }) {
    const gravity = new THREE.Vector3(0, -9.81, 0);
    const [shells, setShells] = useState([]);
    const [fragments, setFragments] = useState([]);

    useEffect(() => {
        setShells([createShell()]);
    }, []);

    const handleExplode = (shell) => {
        setShells([]); // remove shell
        const newFrags = [createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel),
        createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel),
        createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel),
        createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel),
        createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel),
        createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel), createFragment(shell.pos, shell.vel),
        ];
        setFragments(newFrags);
    };

    return (
        <>
            {shells.map((s, i) => (
                <Shell shellColor={fireworkColor} key={`shell-${i}`} shell={s} gravity={gravity} onExplode={handleExplode} />
            ))}
            {fragments.map((f, i) => (
                <Fragment fragmentColor={fireworkColor} key={`frag-${i}`} frag={f} gravity={gravity} />
            ))}
        </>
    );
}
