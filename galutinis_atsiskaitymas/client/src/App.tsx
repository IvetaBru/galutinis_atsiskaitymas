import { Routes, Route } from 'react-router';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Questions from './pages/Questions';
import SpecificQuestion from './pages/SpecificQuestion';
import UserInfo from './pages/UserInfo';
import MainOutlet from './components/outlets/MainOutlet';

const App = () => {
  
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='' element={<MainOutlet/>}>
          <Route index element={<Home/>}/>
          <Route path='/questions' element={<Questions/>}/>
          <Route path='/questions/:_id' element={<SpecificQuestion/>}/>
          <Route path='/user' element={<UserInfo/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App;
