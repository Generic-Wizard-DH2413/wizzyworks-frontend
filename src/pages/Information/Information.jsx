import './Information.css';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useI18nStore } from "@/store/useI18nStore";
import { useText } from "@/i18n/useText";
import seFlag from "@/assets/seFlag2.png"
import gbFlag from "@/assets/gbFlag3.png"



export default function Information() {
    const { navigateTo } = useAppNavigation();
    const { lang, setLang } = useI18nStore();
    const text = useText();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6 px-4 py-8 pb-20">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold">
                    <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                        {text("BuildingFireworks")}
                    </span>{' '}
                    <span className="text-yellow-400">🎆</span>
                </h1>
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-lg md:text-xl text-gray-200">
                        {/*Please increase the <span className="text-orange-400 font-semibold">brightness</span> and turn up the <span className="text-orange-400 font-semibold">volume</span> for full experience*/}
                        {text("information")}
                    </h3>
                </div>
            </div>
            
            <nav className="fixed bottom-6 right-6">
                <button 
                    onClick={() => navigateTo('/fireworkBox')}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl py-4 px-8 rounded-full 
                             shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 
                             border border-orange-400/30"
                >
                    {text("next")}
                </button>
            </nav>

             <div className="p-6 flex flex-col gap-6">
                <div>
                    <h1 className="text-xl font-bold mb-2">
                    {text("chooseLanguageHeader")}
                    </h1>

                    <div className="flex gap-4">
                    <button
                        onClick={() => setLang("en")}
                        className={[
                        "relative w-25 h-17 rounded-lg border-4 overflow-hidden",
                        lang === "en"
                            ? "bg-orange-500  text-black border-orange-400/30"
                            : "bg-transparent text-white border-white/40",
                        ].join(" ")}
                    >
                        <img
                            src={gbFlag}
                            alt="English"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </button>

                    <button
                        onClick={() => setLang("sv")}
                        className={[
                            "relative w-25 h-17 rounded-lg border-4 overflow-hidden",
                            lang === "sv"
                            ? "bg-orange-500 text-black border-orange-400/30"
                            : "bg-transparent text-white border-white/40",
                        ].join(" ")}
                        >
                        <img
                            src={seFlag}
                            alt="Svenska"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </button>
                    </div>
                </div>
            </div>

            

        </div>
    )
}