import { useState, useRef, useEffect } from "react";
import { useAppNavigation } from "../hooks/useAppNavigation";

export default function LaunchScreen({ onSendLaunchData, canLaunch }) {
    const { navigateTo } = useAppNavigation();
    const [count, setCount] = useState(3);
    const intervalRef = useRef(null);

    useEffect(() => {
        onSendLaunchData();
    }, [onSendLaunchData])


    const startLaunch = () => {
        if (intervalRef.current) return;

        intervalRef.current = setInterval(() => {
            setCount(prevCount => {
                if (prevCount === 1) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    navigateTo('/marker');
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);
    };

    if (canLaunch) {
        return (
            <>
                <h2>{count}</h2> {/* This will be the animation later */}
                <button onClick={() => {
                    startLaunch();
                }}>Launch</button>
            </>
        )
    }
    else {
        return (
            <h1>Place the phone in the launch area</h1>
        )
    }
}