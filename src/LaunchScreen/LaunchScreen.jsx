import { useState, useRef, useEffect } from "react";
import { useAppNavigation } from "../hooks/useAppNavigation";

export default function LaunchScreen({ onSendLaunchData, canLaunch, arUcoId }) {
    const { navigateTo } = useAppNavigation();
    const [count, setCount] = useState(3);
    const intervalRef = useRef(null);
    const videoRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);
    const [showMarker, setShowMarker] = useState(false);

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

    const handlePlay = () => {
        if (videoRef.current) {
            setTimeout(() => {
                setShowMarker(false);
                videoRef.current.play();

            }, 2000)
            setShowMarker(true);
        }
    };

    if (canLaunch) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
                <video
                    ref={videoRef}
                    src="/Firework_With_Sound.mp4"
                    width="640"
                    height="360"
                    playsInline
                    webkit-playsinline="true"
                    muted={false}
                    controls={false}
                />
                {showMarker && <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-orange-500/30" style={{ position: "absolute" }}>
                    <img
                        src={`/4x4_1000-${arUcoId}.svg`}
                        className="w-48 h-48 md:w-64 md:h-64"
                        alt={`ArUco marker ${arUcoId}`}
                    />
                </div>}
                {isVisible && <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700" style={{ position: "absolute" }}>
                    <button
                        onClick={() => {
                            handlePlay();
                            setIsVisible(false);
                            // Something else to time?
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-xl py-6 px-12 rounded-full 
                                 shadow-2xl transform transition-all duration-200 hover:scale-110 active:scale-95 
                                 border-2 border-orange-400/30"
                    >
                        🚀 LAUNCH 🚀
                    </button>
                </div>}
            </div>
        )
    }
    else {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6">
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        📱 Place the phone in the launch area
                    </h1>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
                    </div>
                </div>
            </div>
        )
    }
}