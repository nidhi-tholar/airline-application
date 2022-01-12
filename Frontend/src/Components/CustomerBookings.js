import React from 'react'
import { Link } from 'react-router-dom';
import CustomerNavbar from './CustomerNavbar'
import {useState,useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import '../App.css'
import Table from 'react-bootstrap/Table'
import Axios from 'axios'
import { baseUrl } from '../Constants/url';

const CustomerBookings = () => {
    const[bookingData,setBookingData] = useState([]);
    useEffect(()=>{
        const url =baseUrl+"/booking";
        const token = localStorage.getItem('token');
     //   Axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
        Axios.get(url,{headers: {"Authorization" : `Bearer ${token}`}})
        .then((response)=>{
            console.log(response.data)
            setBookingData(response.data);
        }).catch(()=>{
            console.log('some error occurred!')
        })
    },[])

    const cancelBooking = (e,booking_id)=>{
        e.preventDefault();
        const url =baseUrl+"/booking/"+booking_id;
        const token = localStorage.getItem('token');
        //Axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
        Axios.delete(url,{headers: {"Authorization" : `Bearer ${token}`}})
        .then((response)=>{
            console.log(response.data);
            window.location.reload();
        }).catch(()=>{
            console.log('some error occurred!')
        })
    }

    const updatedData=[
        {
            "_id": {
                "$oid": "61a276afea9044c96dd4c200"
            },
            "booked_price": 40,
            "booking_history": "booked",
            "booking_num": "#UWJH25G7UTCE",
            "customer_oid": {
                "$oid": "618176b53dc26f93f1129a9d"
            },
            "flight_oid": {
                "_id": {
                    "$oid": "61a26d7d500dc3da968da8f1"
                },
                "aircraft": {
                    "$oid": "6184a9d1c2bf805a6ec5164a",
                    "name": "Boeing 737"
                },
                "arrival_airport": {
                    "$oid": "61849d3f4367d925b16ff24b",
                    "city": "San Jose",
                    "code": "SJC",
                    "name": "San Jose International Airport"
                },
                "arrival_date": {
                    "$date": 1641686400000
                },
                "arrival_time": "08:00",
                "departure_airport": {
                    "$oid": "61849d5f4367d925b16ff24c",
                    "city": "San Francisco",
                    "code": "SFO",
                    "name": "San Francisco International Airport"
                },
                "departure_date": {
                    "$date": 1641686400000
                },
                "departure_time": "07:00",
                "flight_num": "AA3457",
                "flight_status": "scheduled",
                "modified_at": {
                    "$date": 1638019405576
                },
                "price": 40.0,
                "remaining_seats": 59,
                "seat_chart": {
                    "aisle": [
                        "1A"
                    ],
                    "middle": [
                        "1B"
                    ],
                    "window": []
                },
                "seat_price": {
                    "aisle": 3,
                    "middle": 0,
                    "window": 5
                },
                "seats": {
                    "aisle": 20,
                    "middle": 20,
                    "window": 16
                }
            },
            "flight_status": "scheduled",
            "mileage_points_earned": 6.0,
            "modified_at": {
                "$date": 1638019405581
            },
            "payment": {
                "cash": 30,
                "reward_points_used": 10
            },
            "seat_num": "1C",
            "seat_price": 5,
            "seat_type": "window",
            "traveller_details": {
                "name": "xyz"
            }
        },

        {
            "_id": {
                "$oid": "61a276afea9044c96dd4c200"
            },
            "booked_price": 40,
            "booking_history": "booked",
            "booking_num": "#UWJH25G7UTCE",
            "customer_oid": {
                "$oid": "618176b53dc26f93f1129a9d"
            },
            "flight_oid": {
                "_id": {
                    "$oid": "61a26d7d500dc3da968da8f1"
                },
                "aircraft": {
                    "$oid": "6184a9d1c2bf805a6ec5164a",
                    "name": "Boeing 737"
                },
                "arrival_airport": {
                    "$oid": "61849d3f4367d925b16ff24b",
                    "city": "San Jose",
                    "code": "SJC",
                    "name": "San Jose International Airport"
                },
                "arrival_date": {
                    "$date": 1641686400000
                },
                "arrival_time": "08:00",
                "departure_airport": {
                    "$oid": "61849d5f4367d925b16ff24c",
                    "city": "San Francisco",
                    "code": "SFO",
                    "name": "San Francisco International Airport"
                },
                "departure_date": {
                    "$date": 1641686400000
                },
                "departure_time": "07:00",
                "flight_num": "AA3457",
                "flight_status": "scheduled",
                "modified_at": {
                    "$date": 1638019405576
                },
                "price": 40.0,
                "remaining_seats": 59,
                "seat_chart": {
                    "aisle": [
                        "1A"
                    ],
                    "middle": [
                        "1B"
                    ],
                    "window": []
                },
                "seat_price": {
                    "aisle": 3,
                    "middle": 0,
                    "window": 5
                },
                "seats": {
                    "aisle": 20,
                    "middle": 20,
                    "window": 16
                }
            },
            "flight_status": "scheduled",
            "mileage_points_earned": 6.0,
            "modified_at": {
                "$date": 1638019405581
            },
            "payment": {
                "cash": 30,
                "reward_points_used": 10
            },
            "seat_num": "",
            "seat_price": '',
            "seat_type": "",
            "traveller_details": {
                "name": "xyz"
            }
        }
    ]
    return (
        <div style={{ backgroundImage: "linear-gradient(45deg, #bad1d5, white)",height:650}}>
            <CustomerNavbar/>
            <h4>My Bookings</h4>
            <div style={{paddingTop:"30px"}} >
            <Table >
                <thead>
                    <tr>
                        <th>Booking_Id</th>
                        <th>Aircraft Type</th>
                        
                        <th>Departure Airport</th>
                        <th>Arrival Airport</th>
                        <th>Departure Date</th>
                        <th>Arrival Date</th>
                        <th>Departure Time</th>
                        <th>Arrival Time</th>
                        <th>Reward Points Earned</th>
                        <th>Status</th>
                        <th>Seat</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {bookingData
                .map((val,idx)=>{
                return(
                    
                    <tr>
                        <td>{val.booking_num}</td>
                        <td>{val.flight_oid.aircraft.name}</td>
                    
                        <td>{val.flight_oid.departure_airport.code}</td>
                        <td>{val.flight_oid.arrival_airport.code}</td>
                        <td>{(val.flight_oid.departure_date).slice(0,-12)}</td>
                        <td>{(val.flight_oid.arrival_date).slice(0,-12)}</td>
                       
                        <td>{val.flight_oid.departure_time}</td>
                        <td>{val.flight_oid.arrival_time}</td>
                        <td>{val.mileage_points_earned}</td>
                        <td>{val.booking_history}</td>
                        {val.seat_num==null && val.booking_history!='canceled' && <td><Link  to={{
                            pathname: "/customer/purchase-seats",
                            bookingid:val.id
                            }}><button className="book-seat-btn" >Book Seat</button></Link></td>}
                        {val.seat_num!=null && val.booking_history!='canceled' && <div>{val.seat_num}</div>}
                        {val.booking_history=='booked' && <td><button onClick = {(e)=>cancelBooking(e,val.id)}className= "book-seat-btn" >Cancel</button></td>}
                        {val.booking_history=='canceled' && <div></div>}
                        

                    </tr>
                    
                )
            })}
                </tbody>
            </Table>
            </div>
        </div>
    )
}

export default CustomerBookings
