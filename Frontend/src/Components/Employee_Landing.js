import React from 'react'

import 'bootstrap/dist/css/bootstrap.css'
import '../App.css'

import { Navbar,Nav} from 'react-bootstrap';

const Employee_Landing = () => {


    return (
        <div>
            <Navbar bg="dark" variant="dark" sticky="top">
                <Navbar.Brand>Techies Airline</Navbar.Brand>
                <Nav>
                    <Nav.Link href="/employee"> Home </Nav.Link>
                    <Nav.Link href="/employee/addflight"> Add Flights  </Nav.Link>
                    <Nav.Link href="/employee/viewflights"> View Flights </Nav.Link>
                    <Nav.Link onClick ={()=>{
                        var token=localStorage.getItem('token');
                        token="";
                        localStorage.setItem('token',token);
                    }} href="/"> Logout </Nav.Link>
                    
                </Nav>
                </Navbar>
                
            
        </div>
    )
}

export default Employee_Landing
