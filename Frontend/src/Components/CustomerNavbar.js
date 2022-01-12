import React from 'react'
import '../App.css'
import 'bootstrap/dist/css/bootstrap.css'


import { Navbar,Nav} from 'react-bootstrap';
const CustomerNavbar = () => {
    return (
        <div>
            <Navbar bg="dark" variant="dark" sticky="top">
                <Navbar.Brand>Techies Airline</Navbar.Brand>
                <Nav>
                    <Nav.Link href="/customer"> Home </Nav.Link>
                    <Nav.Link href="/customer/bookings"> My Bookings  </Nav.Link>
                    <Nav.Link href="/customer/profile"> My Profile </Nav.Link>
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

export default CustomerNavbar
