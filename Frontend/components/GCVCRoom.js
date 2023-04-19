import AgoraRTC from "agora-rtc-sdk-ng"
import AgoraRTM from "agora-rtm-sdk"
import { useEffect } from "react"
import { useAuth } from "@/context/AuthContext"


function GCVCRoom({roomId, avatar}) {
    const appid = "cbe38fe4d8f3419793086c6b2cf42312"
    const [user, userInfo] = useAuth()
const token = null

const rtcUid =  Math.floor(Math.random() * 2032)
const rtmUid =  String(Math.floor(Math.random() * 2032))



let audioTracks = {
  localAudioTrack: null,
  remoteAudioTracks: {},
};

let micMuted = true

let rtcClient;
let rtmClient;
let channel;
useEffect(() => {
    enterRoom(userInfo.name, roomId)
  }, [roomId]);

const initRtm = async (name) => {

  rtmClient = AgoraRTM.createInstance(appid)
  await rtmClient.login({'uid':rtmUid, 'token':token})

  channel = rtmClient.createChannel(roomId)
  await channel.join()

  await rtmClient.addOrUpdateLocalUserAttributes({'name':name, 'userRtcUid':rtcUid.toString(), 'userAvatar':avatar})

  getChannelMembers()

  window.addEventListener('beforeunload', leaveRtmChannel)

  channel.on('MemberJoined', handleMemberJoined)
  channel.on('MemberLeft', handleMemberLeft)
}



const initRtc = async () => {
  rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  rtcClient.on("user-published", handleUserPublished)
  rtcClient.on("user-left", handleUserLeft);
  

  await rtcClient.join(appid, roomId, token, rtcUid)
  audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  audioTracks.localAudioTrack.setMuted(micMuted)
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
        console.log("has volume")
         }else{
        //    item.style.borderColor = "#fff"
        console.log("no volume")
         }
      }catch(error){
        console.error(error)
      }


    });
  })
}


// let handleUserJoined = async (user) => {
//   document.getElementById('members').insertAdjacentHTML('beforeend', `<div class="speaker user-rtc-${user.uid}" id="${user.uid}"><p>${user.uid}</p></div>`)
// } 

let handleUserPublished = async (user, mediaType) => {
  await  rtcClient.subscribe(user, mediaType);

  if (mediaType == "audio"){
    audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack]
    user.audioTrack.play();
  }
}

let handleUserLeft = async (user) => {
  delete audioTracks.remoteAudioTracks[user.uid]
  //document.getElementById(user.uid).remove()
}

let handleMemberJoined = async (MemberId) => {

  let {name, userRtcUid} = await rtmClient.getUserAttributesByKeys(MemberId, ['name', 'userRtcUid'])

//   let newMember = `
//   <div class="speaker user-rtc-${userRtcUid}" id="${MemberId}">
//     <img class="user-avatar avatar-${userRtcUid}" src="${userAvatar}"/>
//       <p>${name}</p>
//   </div>`
  let newMember = `
  <div class="speaker user-rtc-${userRtcUid}" id="${MemberId}">
      <p>${name}</p>
  </div>`

  document.getElementById("members").insertAdjacentHTML('beforeend', newMember)
}

let handleMemberLeft = async (MemberId) => {
  document.getElementById(MemberId).remove()
}

let getChannelMembers = async () => {
  let members = await channel.getMembers()

  for (let i = 0; members.length > i; i++){

    // let {name, userRtcUid, userAvatar} = await rtmClient.getUserAttributesByKeys(members[i], ['name', 'userRtcUid', 'userAvatar'])
    let {name, userRtcUid} = await rtmClient.getUserAttributesByKeys(members[i], ['name', 'userRtcUid'])

    // let newMember = `
    // <div class="speaker user-rtc-${userRtcUid}" id="${members[i]}">
    //     <img class="user-avatar avatar-${userRtcUid}" src="${userAvatar}"/>
    //     <p>${name}</p>
    // </div>`
    let newMember = `
    <div class="speaker user-rtc-${userRtcUid}" id="${members[i]}">
        <p>${name}</p>
    </div>`
  
  
    document.getElementById("members").insertAdjacentHTML('beforeend', newMember)
  }
}

const toggleMic = async (e) => {
  if (micMuted){
    // e.target.src = 'icons/mic.svg'
    // e.target.style.backgroundColor = 'ivory'
    micMuted = false
  }else{
    // e.target.src = 'icons/mic-off.svg'
    // e.target.style.backgroundColor = 'indianred'
    
    micMuted = true
  }
  audioTracks.localAudioTrack.setMuted(micMuted)
}


// let lobbyForm = document.getElementById('form')

const enterRoom = async (userName,roomId) => {
//   e.preventDefault()

//   if (!avatar){
//     alert('Please select an avatar')
//     return
//   }


  window.history.replaceState(null, null, `?room=${roomId}`);

  initRtc()

//   let displayName = e.target.displayname.value;
  initRtm(userName)

//   lobbyForm.style.display = 'none'
  document.getElementById('room-header').style.display = "flex"
  document.getElementById('room-name').innerText = roomId
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

  leaveRtmChannel()

//   document.getElementById('form').style.display = 'block'
  document.getElementById('room-header').style.display = 'none'
  document.getElementById('members').innerHTML = ''
}

// lobbyForm.addEventListener('submit', enterRoom)
document.getElementById('leave-icon').addEventListener('click', leaveRoom)
document.getElementById('mic-icon').addEventListener('click', toggleMic)


// const avatars = document.getElementsByClassName('avatar-selection')

// for (let i=0; avatars.length > i; i++){
  
//   avatars[i].addEventListener('click', ()=> {
//     for (let i=0; avatars.length > i; i++){
//       avatars[i].style.borderColor = "#fff"
//       avatars[i].style.opacity = .5
//     }

//       avatar = avatars[i].src
//       avatars[i].style.borderColor = "#00ff00"
//       avatars[i].style.opacity = 1
//   })
// }
  return (
    <div id="container">

        <div id="room-header">

        <h1 id="room-name"></h1>

        <div id="room-header-controls">
            <img id="mic-icon" class="control-icon" src="../icons/mic-off.svg" />
            <img id="leave-icon" class="control-icon" src="../icons/leave.svg" />
        </div>
        </div>
        <div id="members">
        
        </div>
    </div>
  )
}

export default GCVCRoom