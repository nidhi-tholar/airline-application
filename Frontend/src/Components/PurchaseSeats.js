import { React, Component, useState,useEffect } from 'react';
import '../CSS/PurchaseSeats.css';
import Axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
import Popup from './Popup'
import { baseUrl } from '../Constants/url';
import CustomerNavbar from './CustomerNavbar'

const PurchaseSeats = (props) => {
    let history=useHistory();
    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const booking = props.location.bookingid;

    const[seatPriceData,setseatPriceData]=useState([]);
    const[seatNumDictData,setseatNumData]=useState([]);
    const[seatTypeData,setSeatTypeData]=useState([]);
    const tempseatTypeData = [];
    const[selectedSeatType,setSelectedSeatType] = useState("");
    const[selectedSeatNum,setSelectedSeatNum] = useState("");
    

    useEffect(()=>{
        const url =baseUrl+"/booking/purchase_seat/" +booking;
        // Axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
        const token = localStorage.getItem('token');
        Axios.get(url, {headers: {"Authorization" : `Bearer ${token}`}})
        .then((response)=>{
            console.log(response.data);
            for (const [key, value] of Object.entries(response.data['num_of_seats'])) {
                if (value > 0){
                    tempseatTypeData.push(key)
                }
            }
            console.log("seat type:", seatTypeData)
            setSeatTypeData(tempseatTypeData)
            setseatPriceData(response.data['price']);
            setseatNumData(response.data['seat_num']);

        }).catch(()=>{
            console.log('some error occurred!')
        })
    },[])



    const purchaseSeat = (e)=>{
        e.preventDefault();
        setSelectedSeatNum(e.target.value)
        const token = localStorage.getItem('token');
        const url=baseUrl+"/booking/purchase_seat";
       // Axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
        Axios.post( url,{
            booking_id:booking,  
            seat_type:selectedSeatType,
            seat_num:selectedSeatNum
      
    },{headers: {"Authorization" : `Bearer ${token}`}}).then((response)=>{
        //window.location.href="http://localhost:3000/customer/bookings"
        history.push("/customer/bookings");
        console.log(response)
    }

    ).catch(()=>{
        console.log('some error occurred!')
        }
    )
    }

    return (


        <div style={{backgroundImage: "linear-gradient(45deg, #bad1d5, white)"}}>
            <CustomerNavbar/>
            <div className="purchase-seats-box">
                    <h1 className="book-seats-h">Book Seats</h1>
            </div>

            {/* <div id="seat-type-box" className="seat-selection">
                <h3>Seat Price</h3>
            
                <ul>
                    {
                        Object.entries(seatPriceData)
                        .map( ([key, value]) => <li>{key}: $ {value}</li> )
                    }
                    
                </ul>
            </div> */}
            
            <div id="seat-type-box" className="seat-selection">
                <h3>Seat Type</h3>
            
                {/* <select id="seatType" value={selectedSeatType} onChange={(e)=>{handleSeatTypeSelection(e);}} */}
                <select id="seatType" value={selectedSeatType} onChange={(e)=>{setSelectedSeatType(e.target.value)}}
                    style={{ width: "280px",height:"38px",border:"1px solid black" }}>

                    <option value="" disabled selected hidden>Select Seat Type</option>
                    {seatTypeData.map((seatType)=>{
                        return <option value={seatType}>{seatType}</option>
                })}
                </select>
            </div>

            <div id="seat-type-box" className="seat-selection">
                <h3>Seat Number</h3>
            
                <select id="seatNum" value={selectedSeatNum} onChange={(e)=>{purchaseSeat(e);}}
                    style={{ width: "280px",height:"38px",border:"1px solid black" }}>

                    <option value="" disabled selected hidden>Select Seat Number</option>
                    {seatNumDictData[selectedSeatType]?.map((seatNum)=>{
                        return <option value={seatNum}>{seatNum}</option>
                })}
                </select>
            </div>

            <button style= {{margin:"20px"}} className="book-seat-btn" onClick={(e)=>{
                                purchaseSeat(e);
                            }}>Book Seat</button> 

        {/* <input
      type="button"
      value="Click to Open Popup"
      onClick={togglePopup}
    />
    
    {isOpen && <Popup
      content={<>
        <b>Design your Popup</b>
        <p></p>
        <button>Test button</button>
      </>}
      handleClose={togglePopup}
    />} */}
    
        </div>
        
    )


}



// class PurchaseSeats extends Component {
    
//     constructor(props) {
//         super();

//         var seatTypeData = [];
//         var seatPriceData = {};
//         var seatNumberData = [];

//         const url ="http://localhost:5000/booking/purchase_seat/61a276afea9044c96dd4c200";
//         Axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
//         Axios.get(url)
//         .then((response)=>{
//             console.log(response.data);
//             for (const [key, value] of Object.entries(response.data['num_of_seats'])) {
//                 if (value > 0){
//                     seatTypeData.push(key)
//                 }
//             }
//             console.log(seatTypeData)
//             seatPriceData = response.data['price']
//             seatNumberData = response.data['seat_num']

//         }).catch(()=>{
//             console.log('some error occurred!')
//         })

//         this.state = {
//             seatTypeData: [],
            
//             booking_id: '',
//             seatTypeSelected: '',
//             seatNumberSelected: '',
//         }

//         this.seatTypeSelectHandler = this.seatTypeSelectHandler.bind(this);
//         this.seatNumberSelectHandler = this.seatNumberSelectHandler.bind(this);
//         this.seatSelectSubmission = this.seatSelectSubmission.bind(this);
//     }

    

//     componentDidMount = () => {
//         this.setState({
//             seatTypeSelected: document.getElementById('seat-type-selection').value,
//             // seatNumberSelected: document.getElementById('seat-number-selection').value
//         });
//     }

//     seatTypeSelectHandler = (e) => {
//         console.log('DROPDOWN VALUE: ', e.target.value);
//         this.setState({
//             seatTypeSelected: e.target.value
//         });
//         if (e.target.value == 'window') {
//             this.setState({
//                 seatNumberSelected: "1A"
//             });
//         } else if (e.target.value == 'middle') {
//             this.setState({
//                 seatNumberSelected: "1B"
//             });
//         } if (e.target.value == 'aisle') {
//             this.setState({
//                 seatNumberSelected: "1C"
//             });
//         }
//     }

//     seatNumberSelectHandler = (e) => {
//         console.log('DROPDOWN VALUE for seat number: ', e.target.value);
//         this.setState({
//             seatNumberSelected: e.target.value
//         });
//     }

//     seatSelectSubmission = (e) => {
//         console.log('Seat data finalized: ', this.state);

//         let data = {
//             booking_id: this.state.booking_id,
//             seat_type: this.state.seatTypeSelected,
//             // seat_number: this.state.seatNumberSelected
//         }

//         Axios.get('http://localhost:5000/booking/purchase_seat', data).
//             then((response)=>{
//             console.log('User get api response: ', response)
//             if (response.status === 200) {
//                 console.log('purchase_seat successfully executed!');
//             }
//             }).catch(

//                 this.props.history.push('/'),
//             console.log('Something went wrong in purchase_seat API for api input data: ', data)
//             )
//     }
    
//     render() {
//         let seatArr = [];
//         for (let i = 1; i <= 30; i++) {
//             if (this.state.seatTypeSelected == 'window') {
//                 seatArr.push(i + "A");
//             } else if (this.state.seatTypeSelected == 'middle') {
//                 seatArr.push(i + "B");
//             } if (this.state.seatTypeSelected == 'aisle') {
//                 seatArr.push(i + "C");
//             }
//         }

//         console.log("Abs",seatArr)

//         let dropdown = (
//             seatArr.map((num) => {
//                 return (
//                     <option value={num}>{num}</option>
//                 );
//             })
//         );
        
//         console.log('$$$$$$$ ', this.state.seatTypeSelected, '   ', this.state.seatNumberSelected);

//         return (
//             <div className="purchase-seats-box">
//                 <h1 style={{fontWeight: "bold"}}>Purchase Seats</h1>

                

//                 <div id="seat-type-box" className="seat-selection">
//                     <h3>Seat Type</h3>

//                     <select onChange={this.seatTypeSelectHandler} name="seat-type-selection" id="seat-type-selection">
//                         <option value="window">Window</option>
//                         <option value="middle">Middle</option>
//                         <option value="aisle">Aisle</option>
//                     </select>
//                 </div>

//                 <div id="seat-number-box" className="seat-selection">
//                     <h3>Seat Number</h3>
//                     <select onChange={this.seatNumberSelectHandler} name="seat-number-selection" id="seat-number-selection">
//                         {dropdown}
//                     </select>
//                 </div>

//                 <button onClick={this.seatSelectSubmission} className="purchase-btns">Puchase Now</button>
//                 <button className="purchase-btns">Purchase Later</button>


//             </div>
//         );
//     }
// }

export default PurchaseSeats;