import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import SignIn from './screens/SignIn';

function App() {
  
  return (
    <Router>
      <Routes>

        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path='/home' element={<Home />} />

      </Routes>
    </Router>
  );
}

export default App;
