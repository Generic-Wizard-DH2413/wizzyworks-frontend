import './Information.css';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useI18nStore } from "@/store/useI18nStore";
import { useText } from "@/i18n/useText";


export default function Information() {
    const { navigateTo } = useAppNavigation();
    const { lang, setLang } = useI18nStore();
    const text = useText();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6 px-4 py-8 pb-20">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold">
                    <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                        Build your own firework
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
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-lg py-4 px-8 rounded-full 
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
                        "px-4 py-2 rounded-lg border",
                        lang === "en"
                            ? "bg-white text-black border-white"
                            : "bg-transparent text-white border-white/40",
                        ].join(" ")}
                    >
                        {text("englishLabel")}
                    </button>

                    <button
                        onClick={() => setLang("sv")}
                        className={[
                        "px-4 py-2 rounded-lg border",
                        lang === "sv"
                            ? "bg-white text-black border-white"
                            : "bg-transparent text-white border-white/40",
                        ].join(" ")}
                    >
                        {text("swedishLabel")}
                    </button>
                    </div>
                </div>
            </div>

            

        </div>
    )
}