import dynamic from 'next/dynamic'

const VCRoom = dynamic(() => import('@/components/VCRoom'), { ssr: false });

export default function vctest() {
  return (
    <div><VCRoom roomId={"room1"}  roomName={"DNAME"}/>
    </div>
  )
}
