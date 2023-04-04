import React from 'react';
import { Link } from 'react-router-dom';

import './Home.css';

class Home extends React.Component {

  render() {
    return (
      <div className="start-screen-container">
        <div className="start-screen">
          <h1 className="system-title">Welcome to Israel's Blood Bank System</h1>
          <p className="system-description">
            Introducing the ultimate solution for managing Israel's blood bank: a state-of-the-art platform designed to streamline the blood donation process and ensure that hospitals and trauma centers have a constant supply of blood units for emergency situations.
          </p>
          <p className="system-description">
            Our platform allows for seamless reception of blood units from donors across Israel and efficient distribution to surgery and trauma rooms, both in routine and emergency situations. With advanced tracking and monitoring features, our system ensures the highest levels of quality control and patient safety. Join us in our mission to <span className="system-description-bold">save lives</span> and make a meaningful impact on the healthcare industry!
          </p>
          <p className="system-description">
            Please select the requested service:
          </p>
          <div className="system-links">
            <Link to="/donors" className="btn btn-primary">Blood Donation</Link>
            <Link to="/distributions" className="btn btn-primary">Blood Distribution</Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;