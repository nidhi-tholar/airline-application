import React from 'react'
import '../CSS/PurchaseSeats.css';
import CustomerNavbar from './CustomerNavbar'
import {useState,useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import '../App.css'
import Table from 'react-bootstrap/Table'
import { Link } from 'react-router-dom';
import Axios from 'axios'
import { baseUrl } from '../Constants/url';

const CustomerLanding = () => {
    
    const[depDate,setDepDate]=useState("");
    const[origin,setOrigin] = useState("");
    const[destination,setDestination] = useState("");
    const[airportData,setAirportData]=useState([]);
    const[flightSearch,setFlightSearch]=useState([]);

    const mockData=[
        {
            "_id": {
                "$oid": "6192c60e35480dcd64335f6c"
            },
            "aircraft": {
                "$oid": "6184a9d1c2bf805a6ec5164a",
                "name": "Boeing 737"
            },
            "arrival_airport": {
                "$oid": "61849d5f4367d925b16ff24c",
                "city": "San Francisco",
                "code": "SFO",
                "name": "San Francisco International Airport"
            },
            "arrival_date": {
                "$date": 1641427200000
            },
            "arrival_time": "11:00",
            "departure_airport": {
                "$oid": "61849d3f4367d925b16ff24b",
                "city": "San Jose",
                "code": "SJC",
                "name": "San Jose International Airport"
            },
            "departure_date": {
                "$date": 1641427200000
            },
            "departure_time": "10:00",
            "flight_num": "AA1234",
            "flight_status": "scheduled",
            "mileage_points": 4,
            "modified_at": {
                "$date": 1637159368425
            },
            "price": 50.0,
            "remaining_seats": 54,
            "seats": {
                "aisle": 20,
                "middle": 20,
                "window": 20
            }
        }
    ]

    const searchFlight = (e)=>{

        e.preventDefault();
        const url =baseUrl+"/flight";
        const token = localStorage.getItem('token');
        Axios.get(url,{
            params: {
              depart_date:depDate,
              airport1:origin,
              airport2:destination
            }},{headers: {"Authorization" : `Bearer ${token}`}})
        .then((response)=>{
            setFlightSearch(response.data);
        }).catch(()=>{
            console.log('some error occurred!')
        })
    
    }

    useEffect(()=>{
        console.log(localStorage.getItem('token'))
        const url =baseUrl+"/airport";
        const token = localStorage.getItem('token');
      
        Axios.get(url,{headers: {"Authorization" : `Bearer ${token}`}})
        .then((response)=>{
            setAirportData(response.data);
        }).catch(()=>{
            console.log('some error occurred!')
        })
    },[])

    const airports=[{
        "code" : "SJC",
        "name" : "San Jose International Airport",
        "city" : "San Jose"
        },
        {
        "code" : "SFO",
        "name" : "San Francisco International Airport",
        "city" : "San Francisco"
        },
      
                
    ]
      

    return (
        <div style={{backgroundImage: "linear-gradient(110deg, #bad1d5, white)",height:"1700px"}}>
            <CustomerNavbar/>
            <div style={{paddingTop:"20px",color:"black"}}>
                <h2>You are now free to move about the country...</h2>
            </div>
            <div className="container" >
            <div className="login-form">
                    <div className="search-main-div">
                        <div>
                            <h4 class="search-flight-h">
                                Search Flight
                            </h4>
                        </div>
                        <div>
                        <select id="arrival airport" value={origin} onChange={(e)=>{
                            setOrigin(e.target.value);
                        }} style={{ width: "280px",height:"38px",border:"1px solid black" }}>
                            <option value="" disabled selected hidden>Origin City</option>
                            {airportData.map((airport)=>{
                                return <option value={airport.id}>{airport.code + " ("+ airport.name + ")"}</option>
                            })}
                           
                        </select>
                        </div>
                       
                        
                          
                        <br></br>

                        <div>
                        <select id="departure airport" value={destination} onChange={(e)=>{
                            setDestination(e.target.value)
                        }} style={{ width: "280px",height:"38px",border:"1px solid black" }}>
                            <option value="" disabled selected hidden>Destination City</option>
                            {airportData.filter((value)=>{
                                if(origin!=value.id){
                                    return value;
                                }

                            }).map((airport)=>{
                                return <option value={airport.id}>{airport.code + " ("+ airport.name + ")"}</option>
                            })}
                           
                        </select>
                        </div>
                        <br></br>

                        <div className="form-group">
                                <input onChange = {(e)=>setDepDate(e.target.value)} type="date" className="form-control"
                                       name="date" value ={depDate} placeholder="Date" required={true}
                                      />
                        </div>
                        <br></br>
                        <button onClick={(e)=>searchFlight(e)} className="flight-search-btn">Search</button> 
                        </div>
                </div>

               
            </div>
            {flightSearch.length>0 && <div>
                <h4>Flight search results....</h4>
            <div style={{paddingTop:"30px",backgroundColor:"lightblue"}} >
            <Table >
                <thead>
                    <tr>
                        
                        <th>Flight Number</th>
                        <th>AirCraft</th>
                        <th>Departure Airport</th>
                        <th>Arrival Airport</th>
                        <th>Departure Date</th>
                        <th>Arrival Date</th>
                        <th>Departure Time</th>
                        <th>Arrival Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {flightSearch
                .map((val,idx)=>{
                return(
                    
                    <tr>
                        <td>{val.flight_num}</td>
                        <td>{val.aircraft.name}</td>
                        <td>{val.departure_airport.code}</td>
                        <td>{val.arrival_airport.code}</td>
                        <td>{val.departure_date.slice(0,16)}</td>
                        <td>{val.arrival_date.slice(0,16)}</td>
                        <td>{val.departure_time}</td>
                        <td>{val.arrival_time}</td>
                       
                        <td>
                        <Link  to={{
                            pathname: "/booking",
                            flight:val
                            }}><button className="btn btn-primary" >Book</button></Link></td>
                        

                    </tr>
                    
                )
            })}
                </tbody>
            </Table>
            </div>
                
                </div>}    

         
            
        </div>
    )
}

export default CustomerLanding
