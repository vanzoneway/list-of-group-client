import './App.css';
import MainPage from './components/MainPage';
import {Toaster} from 'react-hot-toast'
import Group from './components/Group'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Employees from './components/Employees';
function App() {
  return (
    <div className="App">
      <Toaster/>
      <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/group/:id" element={<Group/>}/>
                        <Route path="/employees" element={<Employees/>}/>
                    </Routes>
                </BrowserRouter>
    </div>
  );
}

export default App;
