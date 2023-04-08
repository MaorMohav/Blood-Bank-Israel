import React from 'react';
import { Link } from 'react-router-dom';
import "./Donors.css";
import { collection, addDoc ,Timestamp} from "firebase/firestore";
import {db} from '../firebase';

class Donors extends React.Component {

  
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      personID:'',
      city: '',
      gender: '',
      bloodType: '',
      healthStatus: '',
      agreedToTerms: false,
      formError:null
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { firstName, lastName,personID,bloodType, city,gender,healthStatus } = this.state;
    
    try {
      
      this.setState({ firstName: '', lastName: '',personID:'', bloodType: '', city: '',gender:'',healthStatus:'',formError:'' });

   
    const docRef = await addDoc(collection(db, "donations"), {
      firstName:firstName,
      lastName:lastName,
      personID:personID,
      bloodType:bloodType,
      city:city,
      gender: gender,
      healthStatus: healthStatus,
      used:false ,
      donate_date: Timestamp.fromDate(new Date())
    });
    console.log(docRef)
      // Optionally show a success message to the user
      alert('Form submitted successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    console.log(event)
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;


    this.setState({
      [name]: value,
      formError:name === 'healthStatus' ? value === 'not normal'?'Please select "Normal" to proceed.' : ''  : ''
    });

  };

  render() {
    return (
      <div className="donors-container">
        <form onSubmit={this.handleSubmit} className="donor-form">
          <h2 className="donor-form-title">Donor Information Form</h2>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              value={this.state.firstName}
              onChange={this.handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              value={this.state.lastName}
              onChange={this.handleInputChange}
              required
            />
          </div>
          <div className="form-group">
          <label htmlFor="personID">ID:</label>
          <input
            type="text"
            className="form-control"
            id="personID"
            name="personID"
            value={this.state.personID}
            onChange={this.handleInputChange}
            required
          />
          </div>
          <div className="form-group">
            <label htmlFor="city">City of Residence:</label>
            <select
              className="form-control"
              id="city"
              name="city"
              value={this.state.city}
              onChange={this.handleInputChange}
              required
            > 
              <option value="">Select a city</option>
              <option value="Afula">Afula</option>
              <option value="Arad">Arad</option>
              <option value="Ashdod">Ashdod</option>
              <option value="Ashkelon">Ashkelon</option>
              <option value="Bat Yam">Bat Yam</option>
              <option value="Be'er Sheva">Be'er Sheva</option>
              <option value="Bnei Brak">Bnei Brak</option>
              <option value="Dimona">Dimona</option>
              <option value="Eilat">Eilat</option>
              <option value="El'ad">El'ad</option>
              <option value="Giv'atayim">Giv'atayim</option>
              <option value="Hadera">Hadera</option>
              <option value="Haifa">Haifa</option>
              <option value="Herzliya">Herzliya</option>
              <option value="Hod HaSharon">Hod HaSharon</option>
              <option value="Holon">Holon</option>
              <option value="Jerusalem">Jerusalem</option>
              <option value="Karmiel">Karmiel</option>
              <option value="Kfar Saba">Kfar Saba</option>
              <option value="Kiryat Ata">Kiryat Ata</option>
              <option value="Kiryat Bialik">Kiryat Bialik</option>
              <option value="Kiryat Gat">Kiryat Gat</option>
              <option value="Kiryat Malakhi">Kiryat Malakhi</option>
              <option value="Kiryat Motzkin">Kiryat Motzkin</option>
              <option value="Kiryat Ono">Kiryat Ono</option>
              <option value="Kiryat Shmona">Kiryat Shmona</option>
              <option value="Kiryat Yam">Kiryat Yam</option>
              <option value="Lod">Lod</option>
              <option value="Ma'alot-Tarshiha">Ma'alot-Tarshiha</option>
              <option value="Migdal HaEmek">Migdal HaEmek</option>
              <option value="Modi'in-Maccabim-Re'ut">Modi'in-Maccabim-Re'ut</option>
              <option value="Nahariya">Nahariya</option>
              <option value="Nazareth">Nazareth</option>
              <option value="Nesher">Nesher</option>
              <option value="Ness Ziona">Ness Ziona</option>
              <option value="Netanya">Netanya</option>
              <option value="Netivot">Netivot</option>
              <option value="Ofakim">Ofakim</option>
              <option value="Or Akiva">Or Akiva</option>
              <option value="Or Yehuda">Or Yehuda</option>
              <option value="Petah Tikva">Petah Tikva</option>
              <option value="Qiryat Ata">Qiryat Ata</option>
              <option value="Qiryat Bialik">Qiryat Bialik</option>
              <option value="Qiryat Gat">Qiryat Gat</option>
              <option value="Qiryat Malakhi">Qiryat Malakhi</option>
              <option value="Qiryat Motzkin">Qiryat Motzkin</option>
              <option value="Qiryat Ono">Qiryat Ono</option>
              <option value="Qiryat Shemona">Qiryat Shemona</option>
              <option value="Ra'anana">Ra'anana</option>
              <option value="Rahat">Rahat</option>
              <option value="Ramat Gan">Ramat Gan</option>
              <option value="Ramat HaSharon">Ramat HaSharon</option>
              <option value="Ramla">Ramla</option>
              <option value="Rehovot">Rehovot</option>
              <option value="Rishon LeZion">Rishon LeZion</option>
              <option value="Rosh HaAyin">Rosh HaAyin</option>
              <option value="Sakhnin">Sakhnin</option>
              <option value="Sderot">Sderot</option>
              <option value="Shefayim">Shefayim</option>
              <option value="Tamra">Tamra</option>
              <option value="Tayibe">Tayibe</option>
              <option value="Tel Aviv-Yafo">Tel Aviv-Yafo</option>
              <option value="Tiberias">Tiberias</option>
              <option value="Tira">Tira</option>
              <option value="Tirat Carmel">Tirat Carmel</option>
              <option value="Umm al-Fahm">Umm al-Fahm</option>
              <option value="Yavne">Yavne</option>
              <option value="Yehud">Yehud</option>
              <option value="Yokneam">Yokneam</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={this.state.gender === "male"}
                  onChange={this.handleInputChange}
                  required
                />
                <label className="form-check-label" htmlFor="male">
                  Male
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={this.state.gender === "female"}
                  onChange={this.handleInputChange}
                  required
                />
                <label className="form-check-label" htmlFor="female">
                    Female
                </label>
             </div>

            </div>
        </div>

        <div className="form-group">
        <label htmlFor="bloodType">Blood Type:</label>
        <select
            className="form-control"
            id="bloodType"
            name="bloodType"
            value={this.state.bloodType}
            onChange={this.handleInputChange}
            required
        >
            <option value="">Select a blood type</option>
            <option value="A+">A+</option>
            <option value="O+">O+</option>
            <option value="B+">B+</option>
            <option value="AB+">AB+</option>
            <option value="A-">A-</option>
            <option value="O-">O-</option>
            <option value="B-">B-</option>
            <option value="AB-">AB-</option>
        </select>
        </div>

        <div className="form-group">
        <label htmlFor="healthStatus">Health Status:</label>
        <div>
            <div className="form-check form-check-inline">
            <input
                className="form-check-input"
                type="radio"
                id="normal"
                name="healthStatus"
                value="normal"
                checked={this.state.healthStatus === "normal"}
                onChange={this.handleInputChange}
                required
            />
            <label className="form-check-label" htmlFor="normal">
                Normal
            </label>
            </div>
            <div className="form-check form-check-inline">
            <input
                className="form-check-input"
                type="radio"
                id="not-normal"
                name="healthStatus"
                value="not normal"
                checked={this.state.healthStatus === "not normal"}
                onChange={this.handleInputChange}
                required
            />
            <label className="form-check-label" htmlFor="not-normal">
                Not Normal
            </label>
            </div>
        </div>

        </div>
        {this.state.formError  && <p style={{ color: 'red' }}>{this.state.formError }</p>} {/* Display the error message if it exists */}
          <button type="submit" className="submit-btn" disabled={this.state.formError || this.state.healthStatus === "not normal"}>
             Confirm and Agree to Terms
          </button>
          <Link to="/" className="back-btn">
              Back to Home
          </Link>

        </form>
     </div>

)
}
}

export default Donors;
