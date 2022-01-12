import React from 'react'
import CustomerNavbar from './CustomerNavbar'
import '../CSS/PurchaseSeats.css';
import {useState,useEffect} from "react";
import Axios from 'axios'
import { baseUrl } from '../Constants/url';
const UserProfile = () => {
    const userDetails = [{
        "email":"sameerjoshi42@gmail.com",
        "first_name":"Sameer",
        "last_name":"Joshi",
        "mileage_points":10.00
    }]

    const[userInfo,setUserInfo] = useState([]);

    useEffect(()=>{
        const url =baseUrl+"/user";
        const token = localStorage.getItem('token');
       // Axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
        Axios.get(url,{headers: {"Authorization" : `Bearer ${token}`}})
        .then((response)=>{
            console.log(response)
            setUserInfo(response.data);
        }).catch(()=>{
            console.log('some error occurred!')
        })
    },[])
    return (
        <div style={{backgroundImage: "linear-gradient(45deg, #bad1d5, white)", height:750}}>
            <CustomerNavbar/>
            
                    <div>
                        <h3 style={{paddingTop: 20}} className="text-style-user"><strong> Profile</strong></h3>
            <div style={{paddingTop:"20px"}}>
                <img src="../../profile_202.jpg"></img>
            </div>
            <div style={{paddingTop:"20px"}}>
            <h4 className="text-style-user"><strong> First Name : </strong></h4>
            </div>
            
            <div>
            <h4 className="text-style-user">{userInfo.first_name}</h4>
            </div>
            <div style={{paddingTop:"20px"}}>
            <h4 className="text-style-user"><strong> Last Name : </strong></h4>
            </div>

            <div>
            <h4 className="text-style-user"> {userInfo.last_name}</h4>
            </div>

            <div style={{paddingTop:"20px"}}>
            <h4 className="text-style-user"><strong> Email : </strong></h4>
            </div>

            <div>
            <h4 className="text-style-user"> {userInfo.email}</h4>
            </div>

            <div style={{paddingTop:"20px"}}>
            <h4 className="text-style-user"><strong> Reward Points : </strong></h4>
            </div>

            <div>
            <h4 className="text-style-user"> {userInfo.mileage_points}</h4>
            </div>
                    </div>    
             
            
        </div>
    )
}

export default UserProfile
