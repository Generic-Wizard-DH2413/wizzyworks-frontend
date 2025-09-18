// rk4.js
import * as THREE from "three";

export function acceleration(vel, c, gravity) {
    const speed = vel.length();
    const drag = vel.clone().multiplyScalar(-c * speed);
    return drag.add(gravity);
}

export function rk4Step(pos, vel, dt, c, gravity) {
    // k1
    const k1v = acceleration(vel, c, gravity).multiplyScalar(dt);
    const k1p = vel.clone().multiplyScalar(dt);

    // k2
    const vel2 = vel.clone().addScaledVector(k1v, 0.5);
    const k2v = acceleration(vel2, c, gravity).multiplyScalar(dt);
    const k2p = vel.clone().addScaledVector(k1v, 0.5).multiplyScalar(dt);

    // k3
    const vel3 = vel.clone().addScaledVector(k2v, 0.5);
    const k3v = acceleration(vel3, c, gravity).multiplyScalar(dt);
    const k3p = vel.clone().addScaledVector(k2v, 0.5).multiplyScalar(dt);

    // k4
    const vel4 = vel.clone().add(k3v);
    const k4v = acceleration(vel4, c, gravity).multiplyScalar(dt);
    const k4p = vel.clone().add(k3v).multiplyScalar(dt);

    // combine
    pos.add(
        k1p.clone()
            .addScaledVector(k2p, 2)
            .addScaledVector(k3p, 2)
            .add(k4p)
            .multiplyScalar(1 / 6)
    );

    vel.add(
        k1v.clone()
            .addScaledVector(k2v, 2)
            .addScaledVector(k3v, 2)
            .add(k4v)
            .multiplyScalar(1 / 6)
    );
}
