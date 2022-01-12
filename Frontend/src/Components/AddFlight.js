import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import {useState,useEffect} from "react";
import '../App.css'
import Employee_Landing from './Employee_Landing';
import Axios from 'axios'
import { baseUrl } from '../Constants/url';

const AddFlight = () => {
    
    const[price,setPrice]=useState("");
    const[flightNumber,setFlightNumber]=useState("");
    const[windowPrice,setWindowPrice]=useState("");
    const[middlePrice,setMiddlePrice]=useState("");
    const[aislePrice,setAislePrice]=useState("");
    const[aircraft,setAircraft] = useState("");
    const[aircraftData,setAircraftData] = useState([]);
    const[depDate,setDepDate]=useState("");
    const[arrDate,setArrDate]=useState("");
    const[depTime,setDepTime]=useState("");
    const[arrTime,setArrTime]=useState("");
    const[depAirport,setDepAirport]=useState("");
    const[airportData,setAirportData]=useState([]);
    const[arrAirport,setArrAirport]=useState("");
    const[success,setSuccess]=useState('');



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
  
    
    const aircrafts = [{
    "name" : "Airbus A380",
    },
    {
    "name" : "Boeing 737",
    },
    {
    "name" : "DreamLiner 787",
    },
]

    const addNewFlight = (e)=>{
        e.preventDefault();
        const url= baseUrl+"/flight";
        const token = localStorage.getItem('token');
        //Axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
        Axios.post( url,{
        flight_num:flightNumber,  
        aircraft:aircraft,
        departure_airport:depAirport,
        arrival_airport:arrAirport,
        departure_date:depDate,
        arrival_date:arrDate,
        departure_time:depTime,
        arrival_time:arrTime,
        price:parseFloat(price),
        seat_price:{window:parseFloat(windowPrice),
        middle:parseFloat(middlePrice),
        aisle:parseFloat(aislePrice)
    }

    
    },{headers: {"Authorization" : `Bearer ${token}`}}).then((response)=>{
        setSuccess('Flight added successfully!!');
        console.log(response)
    }

    ).catch(()=>{
        console.log('some error occurred!')
    }

    )

    }
    
    useEffect(()=>{
        const url =baseUrl+"/aircraft";
       // Axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
       const token = localStorage.getItem('token');
        Axios.get(url,{headers: {"Authorization" : `Bearer ${token}`}})
        .then((response)=>{
            console.log(response)
            setAircraftData(response.data);
        }).catch(()=>{
            console.log('some error occurred!')
        })
    },[])

    useEffect(()=>{
        const url =baseUrl+"/airport";
        //Axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
        const token = localStorage.getItem('token');
        Axios.get(url,{headers: {"Authorization" : `Bearer ${token}`}})
        .then((response)=>{
            console.log(response)
            setAirportData(response.data);
        }).catch(()=>{
            console.log('some error occurred!')
        })
    },[])
    return (
        <div style={{backgroundImage: "linear-gradient(45deg, #bad1d5, white)",height:1250}}>
            <Employee_Landing/>
            <div className="container">
            <div className="login-form">
                    <div className="main-div">
                        <div className="panel">
                            <h2 className="text-style-user">Add a Flight</h2>
                            
                        </div>

                        <div className="form-group">
                                <input onChange = {(e)=>setFlightNumber(e.target.value)} type="text" className="form-control"
                                       name="flight number" value ={flightNumber} placeholder="Flight Number" required={true}
                                      />
                            </div>
                        <div >
                        <select id="aircraft" value={aircraft} onChange={(e)=>{
                            setAircraft(e.target.value);
                        }} style={{ width: "280px",height:"38px",border:"1px solid black" }}>
                            <option value="" disabled selected hidden>Select Aircraft</option>
                            {aircraftData.map((aircraft)=>{
                                return <option value={aircraft.id}>{aircraft.name}</option>
                            })}
                        </select>
                        </div>
                        <br></br>

                        <div >
                        <select id="departure airport" value={depAirport} onChange={(e)=>{
                            setDepAirport(e.target.value);
                        }} style={{ width: "280px",height:"38px",border:"1px solid black" }}>
                            <option value="" disabled selected hidden>Select Departure Airport</option>
                            {airportData.map((airport)=>{
                                return <option value={airport.id}>{airport.code + " ("+ airport.name + ")"}</option>
                            })}
                        </select>
                        </div>
                        <br></br>

                        <div >
                        <select id="arrival airport" value={arrAirport} onChange={(e)=>{
                            setArrAirport(e.target.value)
                        }} style={{ width: "280px",height:"38px",border:"1px solid black" }}>
                            <option value="" disabled selected hidden>Select Arrival Airport</option>
                            {airportData.filter((value)=>{
                                if(depAirport!=value.id){
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
                                       name="date" value ={depDate} placeholder="Departure Date" required={true}
                                      />
                        </div>

                        <div className="form-group">
                                <input onChange = {(e)=>setArrDate(e.target.value)} type="date" className="form-control"
                                       name="date" value ={arrDate} placeholder="Arrival Date" required={true}
                                      />
                        </div>
                        
                        
                            <div className="form-group">
                                <input onChange = {(e)=>setDepTime(e.target.value)} type="time" className="form-control"
                                       name="dep time" value ={depTime} placeholder="Departure Time" required={true}
                                      />
                            </div>

                            <div className="form-group">
                                <input onChange = {(e)=>setArrTime(e.target.value)} type="time" className="form-control"
                                       name="arr time" value ={arrTime} placeholder="Arrival Time" required={true}
                                      />
                            </div>

                            <div className="form-group">
                                <input onChange = {(e)=>setPrice(e.target.value)} type="text" className="form-control"
                                       name="price" value ={price} placeholder="Price" required={true}
                                       />
                            </div>
                            <div className="form-group">
                                <input onChange = {(e)=>setWindowPrice(e.target.value)} type="text" className="form-control"
                                       name="windowprice" value ={windowPrice} placeholder="Window Seat Price" required={true}
                                       />
                            </div>
                            <div className="form-group">
                                <input onChange = {(e)=>setMiddlePrice(e.target.value)} type="text" className="form-control"
                                       name="middleprice" value ={middlePrice} placeholder="Middle Seat Price" required={true}
                                       />
                            </div>
                            <div className="form-group">
                                <input onChange = {(e)=>setAislePrice(e.target.value)} type="text" className="form-control"
                                       name="aisleprice" value ={aislePrice} placeholder="Aisle Seat Price" required={true}
                                       />
                            </div>
                            
                            <button onClick={(e)=>{
                                addNewFlight(e);
                            }}className="add-flight-btn">Add</button> 
                            
                            
                            
                    </div>
                </div>
            </div>
            <div style={{width: "100%",float: "center",color:'green'}}>
                <h3>{success}</h3>
            </div>
        </div>
    )
}

export default AddFlight
