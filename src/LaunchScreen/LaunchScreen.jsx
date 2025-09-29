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
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
                <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-orange-400 via-yellow-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                    {count}
                </div>
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700">
                    <button 
                        onClick={() => {
                            startLaunch();
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-xl py-6 px-12 rounded-full 
                                 shadow-2xl transform transition-all duration-200 hover:scale-110 active:scale-95 
                                 border-2 border-orange-400/30"
                    >
                        🚀 LAUNCH 🚀
                    </button>
                </div>
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