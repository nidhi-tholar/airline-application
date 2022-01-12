import React from 'react'
import { Link,useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'
import '../App.css'
import Axios from 'axios'
import { Navbar,Nav,NavItem,Form,FormControl,Button,Modal} from 'react-bootstrap';
import {useState } from "react";
import { baseUrl } from '../Constants/url';

const Landing = () => {
    let history=useHistory();
    const[login,setLogin]=useState(false);
    const[email,setEmail] = useState("");
    const[password,setPassword]=useState("");
    const[userInfo,setUserInfo]=useState([]);

    const mockData = [
        {
            "message": "User - nidhi@gmail.com login successfully",
            "user": {
                "first_name": "nidhi",
                "user_type": "admin"
            }
        }
    ]

    const mockuserlogin = (e)=>{
        setLogin(false);
        console.log(mockData[0].user.user_type);
        mockData.map((loginuser)=>{
            if(loginuser.user.user_type=="admin"){
               history.push("/employee");
               //window.location.href="http://localhost:3000/employee"
            }
            if(loginuser.user.user_type=="customer"){
                history.push("/customer");
                //window.location.href="http://localhost:3000/customer"
            }
        })
        

    }
    const userLogin = (e)=>{
        setLogin(false);
        e.preventDefault();
        const url=baseUrl+"/user";
        
        Axios.post( url,{email:email,password:password
    
    }).then(async(response)=>{
        var userResponseData = await response.data;
        console.log(userResponseData.user.user_type);
      //  console.log(response.headers['authorization'])
        setUserInfo(response.data);
        var enitreToken = response.headers['authorization'];
        var mainToken = enitreToken.split(" ");
        var token = mainToken[1];
        localStorage.setItem('token',token);

        
            if(userResponseData.user.user_type=="admin"){
               history.push("/employee");
               //window.location.href="http://localhost:3000/employee"
            }
            if(userResponseData.user.user_type=="customer"){
                history.push("/customer");
                //window.location.href="http://localhost:3000/customer"
            }
       
        
       
    }

    ).catch((response)=>{
        console.log(response);
    }

    )

    }
    

    return (
        <div>
            <Navbar bg="dark" variant="dark" sticky="top">
                <Navbar.Brand>Techies Airline</Navbar.Brand>
                <Nav>
                    <Nav.Link href="/"> Home </Nav.Link>
                    <Nav.Link href=""> About  </Nav.Link>
                    <Nav.Link href=""> Contact </Nav.Link>
                </Nav>
                <Nav >
                  <Nav.Link onClick={()=>{setLogin(true)}}> Login</Nav.Link > 
                </Nav>

                <Nav >
                  <Nav.Link href="/signup"> Sign up</Nav.Link > 
                </Nav>
               
                </Navbar>
                <Modal show={login} onHide={()=>{setLogin(false)}}>
                    <Modal.Header closeButton>

                    </Modal.Header>
                    <Modal.Body>
                    <div >
                         <div className="login-form">
                            <div className="main-div-login">
                                <div >
                                    <h2 className="text-style-user">Login</h2>
                                    <p className="text-style-user">Please enter your email and password</p>
                                </div>
                        
                            <div className="form-group">
                                <input onChange = {(e)=>setEmail(e.target.value)} type="email" className="form-control"
                                       name="useremail" value ={email} placeholder="email" required={true}
                                      />
                            </div>
                            <div className="form-group">
                                <input onChange = {(e)=>setPassword(e.target.value)} type="password" className="form-control"
                                       name="password" value={password} placeholder="Password" required={true}
                                       />
                            </div>
                            
                            <button onClick={(e)=>userLogin(e)} className="login-btn">Login</button> 
                            
                            
                            
                    </div>
                </div>
            </div>
                    </Modal.Body>
                    <Modal.Footer>
                    
                    </Modal.Footer>
                    

                </Modal>
            
           
            
   
        </div>
    )
}

export default Landing


