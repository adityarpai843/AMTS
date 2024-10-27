import Signal from './components/signal';
import {Container,Navbar, Row} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';

function App() {
  let [locations, setLocations] = useState([]);

  const fetchLocations = async () => {
    try{ 
      let locationResp,jsonResp,locationData;
      locationResp = await fetch('http://localhost:3000/api/v1/locations')
      jsonResp = await locationResp.json()
      locationData = jsonResp.map(location => location.name);
      setLocations(locationData);
    }
    catch(err){
      console.log(err);
    }}

  useEffect(() => {
    fetchLocations();
    },[]);
  return (
    <div className="App">
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">AMTS</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
      <Row md={4} className="mt-4 g-4">
      {locations.map(location =>{return <Signal name={location}/>})}
      </Row>
      </Container>
    </div>
  );
}

export default App;
