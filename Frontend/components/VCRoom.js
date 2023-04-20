import AgoraRTC from 'agora-rtc-sdk-ng'
import AgoraRTM from 'agora-rtm-sdk'
import { useAuth } from '@/context/AuthContext'
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
    
  }

const initRtm = async (name) => {

  rtmClient = AgoraRTM.createInstance(appid)
  await rtmClient.login({'uid':rtmUid, 'token':token})

  channel = rtmClient.createChannel(roomId)
  await channel.join()

  await rtmClient.addOrUpdateLocalUserAttributes({'name':name, 'userRtcUid':rtcUid.toString()})
  console.log(channel.getMembers())
  getChannelMembers()

  channel.on('MemberJoined', handleMemberJoined)
  channel.on('MemberLeft', handleMemberLeft)
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
    console.log(channel)

  AgoraRTC.setParameter('AUDIO_VOLUME_INDICATION_INTERVAL', 200);
  rtcClient.enableAudioVolumeIndicator();
  

  rtcClient.on("volume-indicator", volumes => {
    volumes.forEach((volume) => {
        console.log(volume)
      try{
         if (volume.level >= 70){
            document.getElementById('volumn-'+volume.uid).className = 'text-green-700'
         }else if(volume.level >= 50){
            document.getElementById('volumn-'+volume.uid).className = 'text-green-500'
         }else if(volume.level >= 30){
            document.getElementById('volumn-'+volume.uid).className = 'text-green-300'
         }else{
            document.getElementById('volumn-'+volume.uid).className = 'text-white'
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
let handleMemberJoined = async (MemberId) => {

    let {name, userRtcUid} = await rtmClient.getUserAttributesByKeys(MemberId, ['name', 'userRtcUid'])

    let newMember = `
    <div class="speaker user-rtc-${userRtcUid}" id="${MemberId}">
        <p>${name}</p>
    </div>`

    document.getElementById("members").insertAdjacentHTML('beforeend', newMember)
}
  
let handleMemberLeft = async (MemberId) => {
document.getElementById(MemberId).remove()
}

const toggleMic = async (e) => {
    console.log(e.target.className)
  if (micMuted){
    micMuted = false
    document.getElementById('mic').className = 'flex h-8 w-8 rounded-lg hover:bg-gray-700 items-center text-white'
    
  }else{
    
    micMuted = true
    document.getElementById('mic').className = 'flex h-8 w-8 rounded-lg hover:bg-gray-700 items-center text-red-600'
    
    
  }
  audioTracks.localAudioTrack.setMuted(micMuted)
 
}
let getChannelMembers = async () => {
    let members = await channel.getMembers()
  
    for (let i = 0; members.length > i; i++){
  
      let {name, userRtcUid} = await rtmClient.getUserAttributesByKeys(members[i], ['name', 'userRtcUid'])
  
      let newMember = `
      <div class="speaker user-rtc-${userRtcUid}" id="${members[i]}">
          <p class="text-white" id="volumn-${userRtcUid}">${name}</p>
      </div>`
    
      document.getElementById("members").insertAdjacentHTML('beforeend', newMember)
    }
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
      <div id="members">
        </div>

      <div id = "volumn-control" className='hidden '>
              <span id="volumn" className='mx-1 text-white text-sm'>VOICE CONNECTED</span>
              <span id ="mic" className='flex h-8 w-8 rounded-lg hover:bg-gray-700 items-center text-red-600 '> {<MicrophoneIcon  onClick={toggleMic} className='ml-1.5  h-5 w-5 '/>}</span>
              <span className='flex h-8 w-8 rounded-lg hover:bg-gray-700 items-center'
              onClick={leaveRoom}><PhoneXMarkIcon className='ml-1.5 text-white h-5 w-5'/></span>
            </div>
    </div>
  )
  
}

export default VCRoom