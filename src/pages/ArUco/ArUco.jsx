export default function ArUco({ arUcoId }) {
    // Markers generated with https://chev.me/arucogen/
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 px-4">
            <div className="text-center space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Your Firework Marker</h2>
                <p className="text-gray-300">Show this marker to the camera system</p>
                <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-yellow-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-orange-500/30">
                <img 
                    src={`/4x4_1000-${arUcoId}.svg`} 
                    className="w-48 h-48 md:w-64 md:h-64"
                    alt={`ArUco marker ${arUcoId}`}
                />
            </div>
            
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700 max-w-md">
                <p className="text-center text-gray-200">
                    🎯 Keep this marker visible to the camera system for your firework to launch correctly
                </p>
            </div>
        </div>
    )
}