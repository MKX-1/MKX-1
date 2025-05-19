import { useState } from "react";//封装获取标签列表的逻辑
function useChannel() {
   const [channelList,setChannelList]=useState([]);
   useEffect(()=>{
      request.get('/channel/selectChannel')
      .then(res=>{setChannelList(res.data.data)})},[])
}
export {useChannel}