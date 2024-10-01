import React,{useState} from "react"
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { Link } from "react-router-dom";


export function VideoCall() {
    const [roomID,setRoomId] = useState("3Abc")
        // const roomID = getUrlParams().get('roomID') || randomID(5);
        let myMeeting = async (element) => {
      
       // generate Kit Token
       const appID =254546334 ;
       const serverSecret = "262b710f869e9d11d84a726dd11b44b0";
       const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, Date.now().toString(),"Saurabhhhh");
      
       // Create instance object from Kit Token.
       const zp = ZegoUIKitPrebuilt.create(kitToken);
       zp.joinRoom({
        container: element,
        scenario:{
            mode: ZegoUIKitPrebuilt.VideoConference
        }
       })
    }
    return(<>
    <button onClick={()=> setRoomId("")}>joinVideoCall</button>
    <div ref={myMeeting()}/>
    </>
    )
  }