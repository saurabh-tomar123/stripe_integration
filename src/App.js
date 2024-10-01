import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, Link } from "react-router-dom"
import { VideoCall } from './VideoCall';
import { authenticate, provider } from './Firebase';
import {signInWithPopup, getAuth} from "firebase/auth"


function App() {
  const [email,setEmail] =useState('')
  const auth = getAuth();

  // const handleOnclick = () =>{
  //   signInWithPopup(authenticate,provider).then((data)=> {
  
  //     // setEmail(data.user.email)
  //     // console.log("======>data",data)
  //   })
  // }

  const handleOnclick = async () => {
    try {
      const result = await signInWithPopup(authenticate, provider);
      // auth.signInWithPopup(provider);
      console.log(result.user);
    } catch (error) {
      console.error(error);
    }
  };
  // const SignOut = () =>  {
  //   return authenticate.currentUser && (
  //     <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  //   )
  // }
  

  const GoogleLogin = () => {
    return <>
    <h1>welcome to google login</h1>
    <button style={{border: "1px solid red", width:"100px", borderRadius:"10px" }}
    onClick={()=> handleOnclick()}
    >Google Login</button>
    
    </>
  }
  
  return (
    <div className="App">
       <Routes>
         <Route path="/call" element={<VideoCall />} />
         <Route path="/" element={<BluetoothComponent />} />
         <Route path="/sign" element={<><button onClick = {()=>handleOnclick()}>signIn</button> <button className="sign-out" onClick={() => authenticate.signOut()}>Sign Out</button></>} />
         <Route path="/login/:params" element={<GoogleLogin />} />
       </Routes>
    </div>
  );
}

export default App;




function BluetoothComponent() {
  const [device, setDevice] = useState(null);
  const [status, setStatus] = useState(false);
  const [list, connectedList] = useState([])
  let  heartRate;

  useEffect(()=>{
    getconnectedList()
  },[])

 const getconnectedList = ()=> {
    const connectedDevices = JSON.parse(localStorage.getItem('connectedDevices')) || []; 
    console.log("localstoragge",localStorage.getItem('connectedDevices'))
    connectedList(connectedDevices)
  }

  const connectToDevice = async () => {
    try {
     
      const bluetoothDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices:true    
        //  filters: [{ services: ['heart_rate'] }]
      });

      setDevice(bluetoothDevice);
      console.log('Connected to GATT server:',bluetoothDevice);

      const gattServer = await bluetoothDevice.gatt.connect();

      // const service = await gattServer.getPrimaryService('heart_rate');
      console.log("====>",gattServer.connected)
      if(gattServer.connected){
        getconnectedList()
        setpreviousData(bluetoothDevice?.name)
        alert("Connected successfully")
        // const server = await bluetoothDevice.gatt.connect();
        // const service = await server.getPrimaryService("heart_rate");
      
        // heartRate = await service.getCharacteristic("heart_rate_measurement");
        // console.log("connected",heartRate);

        // heartRate.addEventListener("characteristicvaluechanged", handleRateChange);
       
      }else{
        alert("Failed to connect")
      }

      // const characteristic = await service.getCharacteristic("apparent_wind_direction");

      // console.log('Characteristic value:', characteristic);
      // const value = await characteristic.readValue();

      // setServiceValue(new TextDecoder().decode(value));
    } catch (error) {
      console.error('Bluetooth connection error:', error);
    }
  };

  function handleRateChange(event) {
    let data = parseHeartRate(event.target.value);
    console.log("dat",data)
  }
  function parseHeartRate(value) {
    let is16Bits = value.getUint8(0) & 0x1;
    if (is16Bits) return value.getUint16(1, true);
    return value.getUint8(1);
  }
  const disconnect = async() => {
    const gattServer = await device.gatt.connect();
    if(gattServer.connected){
    await gattServer.disconnect();
    setStatus(true)
    }
  }
  async function getBattery() {
      // Request a Bluetooth device
      const device = await navigator.bluetooth.requestDevice({
        // acceptAllDevices: true,
        // filters: [
        //   { services: ['battery_service'] },  // Battery Service UUID: 0x180F
          // Optionally, you can include additional filters for other services
          // { services: ['service_uuid'] }
        // ],
        filters: [{ services: ['battery_service'] }] // Filter devices that support the Battery Service
      });
      device.gatt.connect()
.then(server => {
  return server.getPrimaryService('battery_service');
})
.then(service => {
  return service.getCharacteristic('battery_level');
})
.then(characteristic => {
  // Now you can read the battery level from the characteristic
  return characteristic.readValue();
})
.then(value => {
  // Process the battery level value
  console.log('Battery level:', value.getUint8(0));
})
.catch(error => {
  console.error('Error accessing battery service:', error);
});
  
    
  }
  
 const setpreviousData = async(value) => {
  const connectedDevices = JSON.parse(localStorage.getItem('connectedDevices')) || []; 
  // localStorage.setItem('connectedDevices', JSON.stringify(connectedDevices));
  const isNameExists = connectedDevices.some(user => user.name === value);

  if(!isNameExists){
    connectedDevices.push({ name: value, id: connectedDevices.length+1 }); 
  }
 localStorage.setItem('connectedDevices', JSON.stringify(connectedDevices));
  }

const getOwnBattery = async() => {
 const data=await navigator.getBattery()
 console.log("battery Percentage", data)
}

  return (
    <div style={{    display: "flex",
      flexDirection: "column",
      border:"1px solid tomato",
      margin:"300px",
      marginTop:"100px",
      borderRadius:"10px",
      alignItems: "center"}}>
      <button onClick={connectToDevice} > Connect to Bluetooth Device</button>
     {!status ? <p>Connected Device: {device ? device.name : 'None'}</p>: <p>Connected Device:</p>}
      <button onClick={()=>disconnect()}>Disconnect</button>
      {
        list && list.map((item,i)=>
          <div key={i} style={{border:"1px solid tomato", width:"150px", borderRadius:"10px",margin:"10px"}}>
            <p>{item.name}</p>
          </div>
        )
      }
 <button onClick={()=>getBattery()}>getConnectedDeviceBattery</button>
      <button onClick={()=>getOwnBattery()}>getOwnBattery</button>
      <Link to={`/login/${2}`}>navigate</Link>
    </div>
  );
}
