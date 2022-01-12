import React from 'react'

import CustomerNavbar from './CustomerNavbar'
import {useState,useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import '../App.css'
import Table from 'react-bootstrap/Table'
import Axios from 'axios'
import { baseUrl } from '../Constants/url';
import { Link,useHistory } from 'react-router-dom';

const Booking = (props) => {
  let history=useHistory();
  const[userInfo,setUserInfo] = useState([]);
  const[maxRewards,setMaxRewards] = useState("")
  const[firstName,setFirstName] = useState("");
  const[lastName,setLastName] = useState("");
  const[email,setEmail] = useState("");
  const[success,setSuccess]=useState('');
  
  const flightInfo = props.location.flight;
  const depart_date = flightInfo.departure_date.slice(0,16);
  const arrival_date = flightInfo.arrival_date.slice(0,16);
  useEffect(()=>{
    const url =baseUrl+"/user";
    const token = localStorage.getItem('token');
   // Axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    Axios.get(url,{headers: {"Authorization" : `Bearer ${token}`}})
    .then(async(response)=>{
      var res = await response.data;
        console.log(response)
        setUserInfo(response.data);
        if(res.mileage_points>0.6*flightInfo.price){
          setMaxRewards(0.6*flightInfo.price);
        }
        else{
          setMaxRewards(res.mileage_points)
        }

    }).catch(()=>{
        console.log('some error occurred!')
    })
},[])

const bookFlight = (e)=>{
  e.preventDefault();
  const url =baseUrl+"/booking";
  const token = localStorage.getItem('token');
 // Axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
  Axios.post(url,{flight_oid:flightInfo.id,traveler_details:{
    name:firstName+" "+lastName,
    email:email
  },
payment:{
  reward_points_used:maxRewards,
  cash:flightInfo.price - maxRewards
}},
    {headers: {"Authorization" : `Bearer ${token}`}})
  .then((response)=>{
      console.log(response)
      setSuccess('Flight booked successfully!!');
      history.push("/customer/bookings");

  }).catch(()=>{
      console.log('some error occurred!')
  })
}
 

  return (
    <div style={{backgroundColor:"lightblue",height:1000}}>
      <CustomerNavbar/>
      <div>
        <h2>Book your flight</h2>
      </div>
      <div>
        <h3>Iternary:</h3>
      </div>
      <div style={{paddingTop:"30px",backgroundColor:"lightblue"}} >
            <Table >
                <thead>
                    <tr>
                        
                        <th>Flight Details</th>
                        <th>Departure Airport</th>
                        <th>Arrival Airport</th>
                        <th>Departure Details</th>
                        <th>Arrival Details</th>
                        <th>Price </th>
                        
                        
                    </tr>
                </thead>
                <tbody>
                  <tr>
                        <td>{flightInfo.flight_num+"  "+flightInfo.aircraft.name}</td>
                        <td>{flightInfo.departure_airport.code +" - "+ flightInfo.departure_airport.name}</td>
                        <td>{flightInfo.arrival_airport.code +" - "+ flightInfo.arrival_airport.name}</td>
                        <td>{depart_date +" "+ flightInfo.departure_time}</td>
                        <td>{arrival_date + " "+ flightInfo.arrival_time}</td>
                        <td>{"$ "+flightInfo.price}</td>
                        
                    </tr>
                    
              </tbody>
            </Table>
        </div>
     
      
                         <div className="login-form">
                            <div className="booking-div">
                                <div >
                                    <h2 className="text-style-bold">Enter passenger details </h2>
                                    
                                </div>
                        
                            <div className="form-group">
                                <input onChange = {(e)=>setFirstName(e.target.value)} type="text" className="form-control"
                                       name="firstName" value ={firstName} placeholder="First Name" required={true}
                                      />
                            </div>
                            <div className="form-group">
                                <input onChange = {(e)=>setLastName(e.target.value)} type="text" className="form-control"
                                       name="lastName" value={lastName} placeholder="LastName" required={true}
                                       />
                            </div>
                            <div className="form-group">
                                <input onChange = {(e)=>setEmail(e.target.value)} type="email" className="form-control"
                                       name="email" value={email} placeholder="Email" required={true}
                                       />
                            </div>
                            
                            {/* <button className="btn btn-primary sm-5">Login</button>  */}
                            
                            <div>
                                <h4 className="text-style-user">Your current Rewards points:  {userInfo.mileage_points}</h4>
                            </div>
                            <div>
                                <h4 className="text-style-user"> Allowed points to redeem:  {maxRewards} </h4>
   
                            </div>
                            <div>
                                <h4 className="text-style-user">Effective price: </h4>
                                <h4 className="text-style-bold">$ {flightInfo.price - maxRewards}</h4>
                            </div>
                            <button onClick={(e)=>bookFlight(e)} className="btn btn-primary sm-5">Book</button> 
                            
                    </div>
                </div>
           
                <div style={{width: "100%",float: "center",color:'green'}}>
                <h3>{success}</h3>
            </div>
      
      
    </div>
  )
}

export default Booking
