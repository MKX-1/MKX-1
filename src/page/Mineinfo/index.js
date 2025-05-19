import React from "react";
import"./index.scss"
import { useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import { Form,Input,Breadcrumb,Button, Divider} from "antd";
import { getToken } from "@/utils/token";
import axios from "axios";
const Mineinfo = () => {
    const navigator = useNavigate();
    const [data,setdata] = useState([])
    const map = {
        1:'男',
        2:'女',
        3:'未知'
    }
    const fetchData = async () =>{
      axios({
         method:'get',
         url:'http://10.236.174.189:8087/user/selectUserMessage',
         headers:{
           'Authorization':getToken()
         },
       })
      .then(
         res=>{
          console.log(res);
          const data = res.data.data
          setdata(data)
          console.log(data)
        }
      )
      .catch(
        err=>{console.log(err)}
      ) 
    }
    useEffect(()=>{
        fetchData() 
    },[])
    return (
      <div className="personal-wrapper">
        <Breadcrumb
          items={[
            {
              title: "我的",
            },
            {
              title: "个人信息",
            },
        ]}>
        </Breadcrumb>
        <Form className="Mineinfo-box">
          <Form.Item label="昵称">
            <span>{data.nickName}</span>
          </Form.Item>
          <Divider/>
          <Form.Item label="账号">
            <span>{data.email}</span>
          </Form.Item>
          <Divider/>
          <Form.Item label="头像">
            <img className="Mineinfo-pic" src={`data:image/png;base64,${data.avatar}`} />
          </Form.Item>
          <Divider/>
          <Form.Item label="电话号码">
            <span>{data.phone}</span>
          </Form.Item>
          <Divider/>
          <Form.Item label="性别">
            <span>{map[data.sex]}</span>
          </Form.Item>
          <Divider/> 
          <Form.Item label="用户Id">
            <span>{data.userId}</span>
          </Form.Item>  
        </Form>
        <Button type="primary" className="Editinfo-button" onClick={()=>navigator('/article/persona')}>修改信息</Button>
      </div>
    )
}
export default Mineinfo;