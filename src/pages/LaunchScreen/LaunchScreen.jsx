import { useState, useRef, useEffect } from "react";
import { useText } from "@/i18n/useText";


export default function LaunchScreen({ shouldLaunch, canLaunch, arUcoId }) {
    const text = useText();
    const videoRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);
    const [showMarker, setShowMarker] = useState(false);
    const [videoEnded, setVideoEnded] = useState(false);

    const handlePlay = () => {
        setShowMarker(true);
    };

    const handleVideoEnd = () => {
        setVideoEnded(true);
        setShowMarker(false);
    };

    const handleBackToHome = () => {
        window.location.reload();
    };

    if (canLaunch) {
        return (
            <div className="relative min-h-screen">
                {/* Video section - takes up full space */}
                {shouldLaunch && !videoEnded && (
                    <video
                        ref={videoRef}
                        src="/Firework_Box.mp4"
                        className="w-full max-w-4xl border-0 outline-0 m-0 p-0"
                        playsInline
                        webkit-playsinline="true"
                        muted={false}
                        controls={false}
                        onEnded={handleVideoEnd}
                        autoPlay={true}
                    />
                )}
                {!shouldLaunch && showMarker && (<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 shadow-2xl border-4 border-orange-500/30 aspect-square" >
                    <img
                        src={`/4x4_1000-${arUcoId}.svg`}
                        alt={`ArUco marker ${arUcoId}`}
                    />
                </div>)}

                {/* Floating button at bottom */}
                {isVisible && !videoEnded && (
                    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-3 border border-zinc-700">
                            <button
                                onClick={() => {
                                    handlePlay();
                                    setIsVisible(false);
                                    // Something else to time?
                                }}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-xl py-2 px-4 rounded-full 
                                         shadow-2xl transform transition-all duration-200 hover:scale-110 active:scale-95 
                                         border-2 border-orange-400/30"
                            >
                                {text("launch")}
                            </button>
                        </div>
                    </div>
                )}

                {/* Back to home button after video ends */}
                {videoEnded && (
                    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-3 border border-zinc-700">
                            <button
                                onClick={handleBackToHome}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-xl py-2 px-4 rounded-full 
                                         shadow-2xl transform transition-all duration-200 hover:scale-110 active:scale-95 
                                         border-2 border-orange-400/30"
                            >
                                Back to home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    }
    else {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6  px-4 py-8 pb-20">
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