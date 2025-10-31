import { useState, useRef, useEffect, useCallback } from "react";
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
    const wsError = useFireworkStore((state) => state.wsError);
    const wsConnected = useFireworkStore((state) => state.wsConnected);
    const sendFireworkData = useFireworkStore((state) => state.sendFireworkData);
    const { setCanLaunch, setShouldLaunch, resetLaunchState } = useFireworkStore();

    const [isMuted, setIsMuted] = useState(true)
    const [showUnmute, setShowUnmute] = useState(true)


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
        resetLaunchState();    //reset launch state
        navigateTo("/fireworkBox"); //go back to design screen (keep lang settings) //window.location.reload();
    };

    const handleReuseFw = () => {
        resetLaunchState();    //reset launch state
        navigateTo("/fireworkBox");
    };

    const handleTryAgain = () => {
        resetLaunchState();    //reset error and launch state
        sendFireworkData();    //retry sending the same data
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

    const handleUnmute = () => {
        const v = videoRef.current;
        if (!v) return;

        //Turn sound on
        v.muted = false; //unmute
        //setIsMuted(false);
        setShowUnmute(false); //hide button
        //v.play() 
    };

    useEffect(() => { //called for every re-render AKA useState update
        if (!shouldLaunch) return;             //only play video check if we can unmute or not without pausing the video
        const v = videoRef.current;
        if (!v) return;

        // Try auto-unmute directly (after 0.5s)
        const t = setTimeout(async () => {
            const wasMuted = v.muted; //current status (muted=true)
            try {
            v.muted = false;                   //try unmuting
            await v.play();                    //v.play() returns a promise. Await will pause until promise either resolves or rejects and give error which catch catches
            //setIsMuted(false);               //success -> dont mute
            setShowUnmute(false);              //success -> hide the button
            } catch {
            v.muted = wasMuted;                // fail -> keep it muted (revert back to muted=true)
            //setIsMuted(true);                //fail -> mute
            setShowUnmute(true);               // keep button so user can manually unmute
            v.play()                           //REQUIRED!!!
            }
        }, 10); //call directly (after 0.01s)

        return () => clearTimeout(t);
        }, [shouldLaunch]);

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
                            <div className="flex items-center justify-center mb-4 gap-2 pt-6">
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
                        //webkit-playsinline="true"
                        muted={true}
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


                 {/* Corner audio toggle (only shown when we know auto-unmute failed) */}
                {shouldLaunch && !videoEnded && showUnmute && (
                    <button
                    type="button"
                    onClick={handleUnmute}
                    className="absolute top-10 right-10 text-white
                    bg-orange-500 hover:bg-orange-600 font-medium text-xl leading-tight py-3 px-4 rounded-full 
                                shadow-2xl transform transition-all duration-200 hover:scale-110 active:scale-95 
                                border-2 border-orange-400/30 text-center"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                    {isMuted ? "🔊 Unmute" : "🔇 Mute"}
                    </button>
                )}

                {!shouldLaunch && showMarker && (<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 shadow-2xl border-4 border-orange-500/30 aspect-square w-full" >
                    <img
                        src={`/4x4_1000-${arUcoId}.svg`}
                        alt={`ArUco marker ${arUcoId}`}
                        className="w-full h-full object-contain"
                    />
                </div>)}

                {/* Floating button centered vertically */}
                {infoAccepted && isVisible && !videoEnded && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700 text-center">
                            <p className="text-lg text-white mb-4">
                                {text("placePhoneInstruction")}
                            </p>
                            <button
                                onClick={() => {
                                    handlePlay();
                                    setIsVisible(false);
                                    // Something else to time?
                                }}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-6xl py-4 px-8 rounded-full 
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
                        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 border border-zinc-700 flex flex-col items-center gap-4 font-lg text-xl shadow-xl w-full m-6">
                            <button
                                onClick={handleNewFw}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-xl leading-tight py-3 px-4 rounded-full 
                                shadow-2xl transform transition-all duration-200 hover:scale-110 active:scale-95 
                                border-2 border-orange-400/30 text-center w-full"
                            >
                                {text("newFw")}
                            </button>
                            <button
                                onClick={handleReuseFw}
                                className="bg-transparent hover:bg-orange-600 text-white font-medium text-xl leading-tight py-3 px-4 rounded-full 
                                shadow-2xl transform transition-all duration-200 hover:scale-110 active:scale-95 
                                border-2 border-orange-400/30 text-center w-full"
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
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700 max-w-md w-full">
                    {wsError ? (
                        // Error state
                        <>
                            <div className="mb-4 text-6xl">⚠️</div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                {text("connectionError")}
                            </h1>
                            <p className="text-lg text-zinc-300 mb-6">
                                {wsError}
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleTryAgain}
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-xl py-3 px-6 rounded-full 
                                             shadow-2xl transform transition-all duration-200 hover:scale-110 active:scale-95 
                                             border-2 border-orange-400/30 w-full"
                                >
                                    {text("tryAgain")}
                                </button>
                                <button
                                    onClick={handleReuseFw}
                                    className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium text-xl py-3 px-6 rounded-full 
                                             shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95 
                                             border-2 border-zinc-600/30 w-full"
                                >
                                    {text("back")}
                                </button>
                            </div>
                        </>
                    ) : (
                        // Loading state
                        <>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                📱 {wsConnected ? text("waitingForDevice") : text("connecting")}
                            </h1>
                            <p className="text-lg text-zinc-300 mb-6">
                                {wsConnected 
                                    ? text("deviceDetected")
                                    : text("establishingConnection")}
                            </p>
                            <div className="flex justify-center gap-2 mb-6">
                                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <button
                                onClick={handleTryAgain}
                                className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium text-lg py-2 px-6 rounded-full 
                                         shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95 
                                         border-2 border-zinc-600/30"
                            >
                                {text("cancel")}
                            </button>
                        </>
                    )}
                </div>
            </div>
        )
    }
}