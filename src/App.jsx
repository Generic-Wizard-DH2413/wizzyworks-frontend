import { Routes, Route } from "react-router-dom";
import { useFireworkStore } from '@/store/useFireworkStore';
import { useRefreshRedirect } from './hooks/useRefreshRedirect';
import { usePreventBackButton } from './hooks/usePreventBackButton';
import ArUco from './pages/ArUco/ArUco';
import LaunchScreen from './pages/LaunchScreen/LaunchScreen';
import Information from './pages/Information/Information';
import FireworkBox from './pages/FireworkBox/FireworkBox';
import PresenterDesign from './pages/Design/PresenterDesign';
import './App.css';

function App() {
  // Handle refresh redirect to index page
  useRefreshRedirect();

  // Prevent browser back button navigation
  usePreventBackButton(true, () => {
    console.log('User attempted to navigate back - prevented');
  }, false);

  // Zustand store
  const arUcoId = useFireworkStore((state) => state.arUcoId);
  const sendFireworkData = useFireworkStore((state) => state.sendFireworkData);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="container mx-auto">
        <Routes>
          <Route index element={<Information />} />
          <Route
            path="/fireworkBox"
            element={
              <FireworkBox
                onFinishBox={() => {
                  console.log("Sending launch data...");
                  sendFireworkData();
                }}
              />
            }
          />
          <Route path="/design" element={<PresenterDesign />} />
          <Route path="/marker" element={<ArUco arUcoId={arUcoId} />} />
          <Route path="/launch" element={<LaunchScreen arUcoId={arUcoId} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
