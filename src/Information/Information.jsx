import './Information.css';
import { useAppNavigation } from '../hooks/useAppNavigation';

export default function Information() {
    const { navigateTo } = useAppNavigation();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold">
                    <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                        Build your own firework
                    </span>{' '}
                    <span className="text-yellow-400">🎆</span>
                </h1>
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700">
                    <h3 className="text-lg md:text-xl text-gray-200">
                        Please increase the <span className="text-orange-400 font-semibold">brightness</span> and turn up the <span className="text-orange-400 font-semibold">volume</span> for full experience
                    </h3>
                </div>
            </div>
            
            <nav className="fixed bottom-6 right-6">
                <button 
                    onClick={() => navigateTo('/shapePicker')}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-lg py-4 px-8 rounded-full 
                             shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 
                             border border-orange-400/30"
                >
                    Next →
                </button>
            </nav>
        </div>
    )
}