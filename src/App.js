
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom";
import Home from './components/Home';
import "./components/Home.css";
import Donors from './components/Donors';
import "./components/Donors.css";
import Distributions from './components/Distributions';
import "./components/Distributions.css";
import Login from "./components/Login";
import { collection, getDocs } from "firebase/firestore";
import { db } from './firebase';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async (username, password) => {
    try {
      const usersRef = collection(db, 'Users_with_access');
      const querySnapshot = await getDocs(usersRef);
      querySnapshot.forEach((doc) => {
        if (doc.data().UserName === username && doc.data().Password === password) {
          setUser(username);
        }
      });
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/donors" element={<Donors />} />
          <Route
            path="/distributions"
            element={
              user ? (
                <Distributions handleLogout={handleLogout}  user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<Login handleLogin={handleLogin} user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
