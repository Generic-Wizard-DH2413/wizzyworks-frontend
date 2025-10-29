import { useState, useRef, useEffect } from "react";
import { useText } from "@/i18n/useText";
import { useI18nStore } from "@/store/useI18nStore";
import { useFireworkStore } from "@/store/useFireworkStore";
import { useAppNavigation } from "@/hooks/useAppNavigation";



export default function LaunchScreen({arUcoId }) {
    const text = useText();
    const videoRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);
    const [showMarker, setShowMarker] = useState(false);
    const [videoEnded, setVideoEnded] = useState(false);
    const [showInfoPopup, setShowInfoPopup] = useState(true)
    const [infoAccepted, setInfoAccepted] = useState(false)
    const { dontShowAgain, setDontShowAgain } = useI18nStore();
    const { resetSlots } = useFireworkStore();
    const [localDontShowAgain, setLocalDontShowAgain] = useState(dontShowAgain);
    const { navigateTo } = useAppNavigation();
    const [countdown, setCountdown] = useState(null);
    
    const { slots } = useFireworkStore();    
    const canLaunch = useFireworkStore((state) => state.canLaunch);
    const shouldLaunch = useFireworkStore((state) => state.shouldLaunch);
    const { setCanLaunch, setShouldLaunch } = useFireworkStore();

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCountdown(null);
        }
    }, [countdown]);

    const handlePlay = () => {
        setShowMarker(true);
    };

    const handleVideoEnd = () => {
        setVideoEnded(true);
        setShowMarker(false);
    };

    const handleNewFw = () => {
        resetSlots();          //wipe all slots
        setCanLaunch(false);
        setShouldLaunch(false);
        navigateTo("/fireworkBox"); //go back to design screen (keep lang settings) //window.location.reload();
    };

    const handleReuseFw = () => {
        setCanLaunch(false);
        setShouldLaunch(false);
        navigateTo("/fireworkBox");
    };

    const handleIntroOk = () => {
        // hide popup and allow launching
        setShowInfoPopup(false);
        setInfoAccepted(true);
        setDontShowAgain(localDontShowAgain);
    };
    const handleDontShowAgainChange = (e) => {
        const checked = e.target.checked;
        setLocalDontShowAgain(checked);

    };

    if (canLaunch) {
        return (
            <div className="relative min-h-screen">


                {/* Intro popup overlay (shows ONLY if still visible) */}
                {!dontShowAgain && showInfoPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                        <div className="bg-zinc-900 text-white rounded-2xl shadow-2xl border border-zinc-700 max-w-sm w-full p-6 text-center">
                            <h2 className="text-xl font-bold mb-3">
                                {/* You could add an emoji or icon here if you want */}
                                {text("infoTitle")}
                            </h2>
                            <p className="text-base text-zinc-300 mb-6">
                                {/* localizable if you add keys */}
                                {text("infoText")}

                            </p>
                            <button
                                onClick={handleIntroOk}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-lg py-2 px-4 rounded-full 
                                           shadow-xl transform transition-all duration-200 hover:scale-110 active:scale-95 
                                           border-2 border-orange-400/30 w-full"
                            >
                                OK
                            </button>
                            <div className="flex items-center justify-center mb-6 gap-2">
                                <input
                                    id="dontShowAgain"
                                    type="checkbox"


                                    onChange={(e) => handleDontShowAgainChange(e)} className="w-5 h-5 text-orange-500 bg-zinc-800 border-zinc-600 rounded focus:ring-orange-500"
                                />
                                <label htmlFor="dontShowAgain" className="text-sm text-zinc-300 select-none">
                                    {text("dontShowAgain")}
                                </label>
                            </div>
                        </div>
                    </div>
                )}


                {/* Video section - takes up full space */}
                {shouldLaunch && !videoEnded && (
                    <video
                        ref={videoRef}
                        src="/firebox.mp4"
                        className="w-full max-w-4xl border-0 outline-0 m-0 p-0"
                        playsInline
                        webkit-playsinline="true"
                        muted={false}
                        controls={false}
                        onPlay={() => {
                            setCountdown(10);
                            setTimeout(() => { handleVideoEnd() }, 9000 + (slots.filter(Boolean).length * 3000))
                        }}
                        onEnded={handleVideoEnd}
                        autoPlay={true}
                    />
                )}
                {shouldLaunch && !videoEnded && countdown !== null && (
                    <div className="absolute top-10 left-10 text-white text-6xl font-bold drop-shadow-lg">
                        {countdown}
                    </div>
                )}
                {!shouldLaunch && showMarker && (<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 shadow-2xl border-4 border-orange-500/30 aspect-square w-full" >
                    <img
                        src={`/4x4_1000-${arUcoId}.svg`}
                        alt={`ArUco marker ${arUcoId}`}
                        className="w-full h-full object-contain"
                    />
                </div>)}

                {/* Floating button at bottom */}
                {infoAccepted && isVisible && !videoEnded && (
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
                    <div className="fixed inset-0 z-10 flex items-center justify-center">
                        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 border border-zinc-700 flex flex-row items-center gap-4 font-lg text-xl shadow-xl">
                            <button
                                onClick={handleNewFw}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-xl leading-tight py-3 px-4 rounded-full 
                                shadow-2xl transform transition-all duration-200 hover:scale-110 active:scale-95 
                                border-2 border-orange-400/30 text-center"
                            >
                                {text("newFw")}
                            </button>
                            or
                            <button
                                onClick={handleReuseFw}
                                className="bg-transparent hover:bg-orange-600 text-white font-medium text-xl leading-tight py-3 px-4 rounded-full 
                                shadow-2xl transform transition-all duration-200 hover:scale-110 active:scale-95 
                                border-2 border-orange-400/30 text-center"
                            >
                                {text("reuseFw")}
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