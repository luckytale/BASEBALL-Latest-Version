import { Routes, Route } from 'react-router-dom';
import './App.css';

import TopPage from './pages/TopPage';
import Teams from './pages/Teams';
import TeamPlayers from './pages/TeamPlayers';
import Pitcher from './pages/Pitcher';
import Batter from './pages/Batter';
import Games from './pages/Games';
import GameDetail from './pages/GameDetail';
import NotFound from './pages/NotFound';
import Header from './components/Header';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<TopPage />}></Route>
        <Route path="/teams" element={<Teams />}></Route>
        <Route path="/teams/:teamName" element={<TeamPlayers />} />
        <Route path="/games" element={<Games />}></Route>
        <Route path="/games/:gameIdParam" element={<GameDetail />} />
        <Route path="/pitcher" element={<Pitcher />}></Route>
        <Route path="/batter" element={<Batter />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  );
};

export default App;
