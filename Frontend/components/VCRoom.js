import AgoraRTC from 'agora-rtc-sdk-ng'
import AgoraRTM from 'agora-rtm-sdk'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import { 
    PhoneXMarkIcon,
    MicrophoneIcon,

  } from '@heroicons/react/20/solid'
function VCRoom({roomId, setJoined, setChannel}) 
{
    const{user, userInfo} = useAuth()
    const name = "room10"
    const appid = "cbe38fe4d8f3419793086c6b2cf42312"
    const token = null

    const rtcUid =  user.uid
    const rtmUid =  String(user.uid)


let audioTracks = {
  localAudioTrack: null,
  remoteAudioTracks: {},
};

let micMuted = true
let joined = false
let rtcClient;
let rtmClient;
let channel;


const enterRoom = async (e) => {
    e.preventDefault()
    

    document.getElementById('enter').style.display = 'none'
    document.getElementById('volumn-control').className ='flex items-center bg-gray-800 h-[calc(50px)]'
    initRtc()
  
    let userName = userInfo.name;
    initRtm(userName)
    joined = true
    
  }

const initRtm = async (name) => {

  rtmClient = AgoraRTM.createInstance(appid)
  await rtmClient.login({'uid':rtmUid, 'token':token})

  channel = rtmClient.createChannel(roomId)
  await channel.join()

  await rtmClient.addOrUpdateLocalUserAttributes({'name':name, 'userRtcUid':rtcUid.toString()})

  window.addEventListener('beforeunload', leaveRtmChannel)
}



const initRtc = async () => {
  rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  rtcClient.on("user-published", handleUserPublished)
  rtcClient.on("user-left", handleUserLeft);
  

  await rtcClient.join(appid, roomId, token, rtcUid)
  audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  audioTracks.localAudioTrack.setMuted(true)
  await rtcClient.publish(audioTracks.localAudioTrack);


  initVolumeIndicator()
}


let initVolumeIndicator = async () => {

  //1
  AgoraRTC.setParameter('AUDIO_VOLUME_INDICATION_INTERVAL', 200);
  rtcClient.enableAudioVolumeIndicator();
  
  //2
  rtcClient.on("volume-indicator", volumes => {
    volumes.forEach((volume) => {
      console.log(`UID ${volume.uid} Level ${volume.level}`);

      //3
      try{
        //   let item = document.getElementsByClassName(`avatar-${volume.uid}`)[0]

         if (volume.level >= 50){
        //    item.style.borderColor = '#00ff00'
         }else{
        //    item.style.borderColor = "#fff"
         }
      }catch(error){
        console.error(error)
      }


    });
  })
}




let handleUserPublished = async (user, mediaType) => {
  await  rtcClient.subscribe(user, mediaType);

  if (mediaType == "audio"){
    audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack]
    user.audioTrack.play();
  }
}

let handleUserLeft = async (user) => {
  delete audioTracks.remoteAudioTracks[user.uid]

}


const toggleMic = async (e) => {
    console.log(e.target)
  if (micMuted){
    micMuted = false
  }else{
    micMuted = true
    
  }
  audioTracks.localAudioTrack.setMuted(micMuted)
 
}




let leaveRtmChannel = async () => {
  await channel.leave()
  await rtmClient.logout()
}

let leaveRoom = async () => {
  audioTracks.localAudioTrack.stop()
  audioTracks.localAudioTrack.close()
  rtcClient.unpublish()
  rtcClient.leave()
  document.getElementById('volumn-control').className ='hidden'
  leaveRtmChannel()
  setJoined(false)&&setChannel("")
}

return (
    <div id="container">
    
      <button id ="enter" onClick={enterRoom}>Enter</button>

      <div id = "volumn-control" className='hidden '>
              <span className='mx-1 text-green-700 text-sm'>VOICE CONNECTED</span>
              <span className='flex h-8 w-8 rounded-lg hover:bg-gray-700 items-center'> {micMuted?<MicrophoneIcon onClick={toggleMic} className='ml-1.5 text-white h-5 w-5 '/>:<MicrophoneIcon onClick={toggleMic}  className='ml-1.5 text-red-800 h-5 w-5 '/>}</span>
              <span className='flex h-8 w-8 rounded-lg hover:bg-gray-700 items-center'
              onClick={leaveRoom}><PhoneXMarkIcon className='ml-1.5 text-white h-5 w-5'/></span>
            </div>
    </div>
  )
  
}

export default VCRoom