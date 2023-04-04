
// Name: Maor Mohav , ID: 316142363
// Name: Ariel Epshtein , ID: 316509504
// Name: Omer Ben David , ID: 316344449

import React from 'react';
import { Link } from 'react-router-dom';
import "./Distributions.css";
import { collection,addDoc, getDocs,Timestamp,where,query, setDoc } from "firebase/firestore";
import { db } from '../firebase';
import { writeBatch ,doc} from 'firebase/firestore';
import json2csv from 'json2csv';

class Distributions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hospital: '',
      bloodType: '',
      servings: 1,
      situation: '',
      donationArray: [],
      formError:''
    };
  }
  componentDidMount() {
    this.fetchDonations();
  }
  handleExportMetaData = async () => {
    const csvOptions = {
      fields: ['Blood Type', 'Quantity'],
      delimiter: ',',
      eol: '\r\n',
    };
    
    // Update the Meta_data collection in Firebase with the new quantities

    //const metaRef = collection(db, 'Meta_Data');
    
    const newMeta = {
      A_plus: this.state.donationArray['A+'] === undefined ? 0 : this.state.donationArray['A+'],
      O_plus: this.state.donationArray['O+'] === undefined ? 0 : this.state.donationArray['O+'],
      B_plus: this.state.donationArray['B+'] === undefined ? 0 : this.state.donationArray['B+'],
      AB_plus: this.state.donationArray['AB+'] === undefined ? 0 : this.state.donationArray['AB+'],
      O_minus: this.state.donationArray['O-'] === undefined ? 0 : this.state.donationArray['O-'],
      A_minus: this.state.donationArray['A-'] === undefined ? 0 : this.state.donationArray['A-'],
      B_minus: this.state.donationArray['B-'] === undefined ? 0 : this.state.donationArray['B-'],
      AB_minus: this.state.donationArray['AB-'] === undefined ? 0 : this.state.donationArray['AB-'],
    };
    console.log(newMeta.O_minus);
    // Update the Meta_Data document with the new blood type quantities
    await setDoc(doc(db, "Meta_Data", "Meta_Data"), newMeta);
 
  
    // Export the updated data as a CSV file
    const bloodTypeData = [
      { 'Blood Type': 'A+', 'Quantity': newMeta.A_plus },
      { 'Blood Type': 'O+', 'Quantity': newMeta.O_plus },
      { 'Blood Type': 'B+', 'Quantity': newMeta.B_plus },
      { 'Blood Type': 'AB+', 'Quantity': newMeta.AB_plus },
      { 'Blood Type': 'O-', 'Quantity': newMeta.O_minus },
      { 'Blood Type': 'A-', 'Quantity': newMeta.A_minus },
      { 'Blood Type': 'B-', 'Quantity': newMeta.B_minus },
      { 'Blood Type': 'AB-', 'Quantity': newMeta.AB_minus },
    ];
  
    const csv = json2csv.parse(bloodTypeData, csvOptions);
    const filename = 'meta_data.csv';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };
  
 // Fetch the actions data from the "actions" collection
async fetchActionsData() {
  try {
    const actionsRef = collection(db, 'actions');
    const querySnapshot = await getDocs(actionsRef);
    const actions = [];
    querySnapshot.forEach((doc) => {
      actions.push(doc.data());
    });
    return actions;
  } catch (error) {
    console.error('Error fetching actions data:', error);
    return null;
  }
}

// Handle exporting the actions data to a CSV file
handleExportActionsData = async () => {
  const csvOptions = {
    fields: ['user', 'hospital', 'servings', 'bloodType', 'situation', 'date'],
    delimiter: ',',
    eol: '\r\n',
  };
  
  
  const actions = await this.fetchActionsData();
  if (actions) {
    try {
      const csvData = [];
      // Push header row with field names
      csvData.push(['user', 'hospital', 'servings', 'bloodType', 'situation', 'date']);
      // Push data rows with field values
      actions.forEach((action) => {
        const row = {
          user: action.user,
          hospital: action.hospital,
          servings: action.servings,
          bloodType: action.bloodType,
          situation: action.situation,
          date: action.date.toDate().toLocaleString()
        };
        csvData.push(row);
      });

      console.log(csvData)
      const csv = json2csv.parse(csvData, csvOptions);
   
      const filename = 'actions.csv';
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, filename);
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
          // feature detection
          // Browsers that support HTML5 download attribute
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (error) {
      console.error('Error exporting actions data to CSV:', error);
    }
  }
};
  async fetchDonations() {
    const querySnapshot = await getDocs(collection(db, 'donations'));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
  
    const groupedDonations = data.reduce((acc, donation) => {
      const { bloodType, used } = donation;
      if (!used) {
        acc[bloodType] = (acc[bloodType] || 0) + 1;
      }
      return acc;
    }, {});
  
    console.log(groupedDonations);
  
    this.setState({ donationArray: groupedDonations });
  }

handleSubmit = async (event) => {


    event.preventDefault();
    const { hospital, bloodType, servings,situation } = this.state;


// Get a reference to the donor collection
const donorCollectionRef = collection(db, 'donations');

// Create a query to find donors with the same blood type and unused donations
const Query = query(donorCollectionRef, where('bloodType', '==', bloodType), where('used', '==', false));

// Execute the query
const querySnapshot = await getDocs(Query);

// Check if there are enough donors with unused donations
if (querySnapshot.size >= servings) {
  // Get the first 'servings' number of donors from the query results
  const donorsToUpdate = querySnapshot.docs.slice(0, servings).map(doc => ({
    id: doc.id,
    data: doc.data(),
  }));

  // Update the 'used' field to true for each of the donors
  const batch = writeBatch(db);
  donorsToUpdate.forEach(donor => {
    const donorRef = doc(donorCollectionRef, donor.id);
    batch.update(donorRef, { used: true });
  });
  await batch.commit();

  // Add a new served donation to the served_donations collection
  await addDoc(collection(db, "served_donations"), {
    hospital: hospital,
    servings: servings,
    bloodType: bloodType,
    situation: situation,
    date: Timestamp.fromDate(new Date())
  });

  await addDoc(collection(db, "actions"), {
    user: this.props.user,
    hospital: hospital,
    servings: servings,
    bloodType: bloodType,
    situation: situation,
    date: Timestamp.fromDate(new Date())
  });
   
   
  // Show success message to the user
  alert('Blood transfer successful!');
} else {
  // Show error message to the user
  this.setState({formError: 'Not enough blood units with the same blood type.'});
}

 };

 handleLogout = () => {
  this.props.handleLogout();
};


  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      formError:''
    });
    if (name === 'situation' && value === 'emergency') {
      this.setState({
        [name]: value,
        bloodType: 'O-'
      });
    } else {
      this.setState({
        [name]: value
      });
    }
    
    if (name==='servings'){
      if(value > this.state.donationArray[this.state.bloodType]){
        this.setState({
          formError:'Insufficient servings please choose the maximum available amount'
        });
      }
    }
  };

  render() {
    //  const showBloodType = this.state.situation !== 'emergency';
    return (
      <div className="distributions-container">
          <button onClick={this.handleExportMetaData} className="buttonB" >
              Export Meta Data
      </button>    
      <br></br>
      <table>
      <thead>
        <tr>
          <th>Blood Type</th>
          <th>A+</th>
          <th>O+</th>
          <th>B+</th>
          <th>AB+</th>
          <th>O-</th>
          <th>A-</th>
          <th>B-</th>
          <th>AB-</th>
        </tr>
      </thead>
      <tbody>
       
          <tr>
            <th>Amount</th>
            <td>{this.state.donationArray['A+'] === undefined ? 0 : this.state.donationArray['A+']}</td>
            <td>{this.state.donationArray['O+'] === undefined ? 0 : this.state.donationArray['O+']}</td>
            <td>{this.state.donationArray['B+'] === undefined ? 0 : this.state.donationArray['B+']}</td>
            <td>{this.state.donationArray['AB+'] === undefined ? 0 : this.state.donationArray['AB+']}</td>
            <td>{this.state.donationArray['O-'] === undefined ? 0 : this.state.donationArray['O-']}</td>
            <td>{this.state.donationArray['A-'] === undefined ? 0 : this.state.donationArray['A-']}</td>
            <td>{this.state.donationArray['B-'] === undefined ? 0 : this.state.donationArray['B-']}</td>
            <td>{this.state.donationArray['AB-'] === undefined ? 0 : this.state.donationArray['AB-']}</td>
          
          </tr>
      
      </tbody>
      </table>
      
    
        <form onSubmit={this.handleSubmit} className="distribution-form">
          <h2 className="distribution-form-title">Blood Distributions Form</h2>
          
          <div class="form-group">
            <label for="hospital">Hospital:</label>
            <select
              class="form-control"
              id="hospital"
              name="hospital"
              value={this.state.hospital}
              onChange={this.handleInputChange}
              required
            >
              <option value="">Select a hospital</option>
              <option value="Hadassah Medical Center">Hadassah Medical Center</option>
              <option value="Sheba Medical Center">Sheba Medical Center</option>
              <option value="Assuta Medical Center">Assuta Medical Center</option>
              <option value="Rambam Health Care Campus">Rambam Health Care Campus</option>
              <option value="Sourasky Medical Center">Sourasky Medical Center</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="situation">Situation:</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="routine"
                  name="situation"
                  value="routine"
                  checked={this.state.situation === "routine"}
                  onChange={this.handleInputChange}
                  required
                />
                <label className="form-check-label" htmlFor="routine">
                  Routine
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="emergency"
                  name="situation"
                  value="emergency"
                  checked={this.state.situation === "emergency"}
                  onChange={this.handleInputChange}
                  required
                />
                <label className="form-check-label" htmlFor="emergency">
                  Emergency
                </label>
              </div>
            </div>
          </div>

          {this.state.situation === "emergency" ? (
            <div className="form-group">
              <label htmlFor="bloodType">Blood Type:</label>
              <select
                className="form-control"
                id="bloodType"
                name="bloodType"
                value="O-"
                disabled={true}
                required
              >
                <option value="O-">O-</option>
              </select>
            </div>) : (
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
          )}
          <div className="form-group">
            <label htmlFor="servings">Amount of Servings:</label>
            <input
             min="1"
              type="number"
              className="form-control"
              id="servings"
              name="servings"
              value={this.state.servings}
              onChange={this.handleInputChange}
              required
            />
          </div>
          {this.state.formError  && <p style={{ color: 'red' }}>{this.state.formError }</p>} {/* Display the error message if it exists */}
          <button type="submit" className="submit-btn" disabled={this.state.formError !== ''}>
            Confirm
          </button>
         

          <nav>
            <Link to="/" className="back-btn">
              Back
            </Link>
            <Link to="/login" className="back-btn" onClick={this.handleLogout}>
              Logout
            </Link>
            <button onClick={this.handleExportActionsData} className="buttonA" >
              Export Actions Data
            </button>       
         </nav>

        </form>
      </div>
    );
  }
}

export default Distributions;