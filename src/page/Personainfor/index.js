import React from "react";
import"./index.scss"
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Breadcrumb,
  Upload,
  message,
} from 'antd';
import { useState, useEffect } from "react";
import { request } from "@/utils/request";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken, removeToken } from "@/utils/token";
const normFile = e => {
  if (Array.isArray(e)) {
    return e;
  }
  return e === null || e === void 0 ? void 0 : e.fileList;
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const Personainfor = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm()
  const navigator = useNavigate();
  const [data,setdata] = useState([])
  useEffect(()=>{
    fetchData()
  },[])
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
  const handleChange = async (values) => {
    await form.validateFields();
    axios({
      method:'post',
      url:'http://10.236.174.189:8087/user/edit',
      data:{
        nickName:values.nickname,
        phone:values.phone,
        password:values.password,
        sex:values.sex,
        email:values.email,
      },
      headers:{
        'Authorization':getToken() 
      }
    })
    .then(res=>{console.log(res)
      messageApi.open({
        type:'success',
        content: '修改成功',
        duration: 1,
      })
      navigator('/article/mineinfo')  
    })
    .catch(err=>{console.log(err)}) 
  }
  return (
    <>
    {contextHolder}
    <div className="info-wrapper">
      <Breadcrumb
        items={[
            {
              title:"设置"
            },
            {
              title:"编辑个人信息"
            }
        ]}
      />
      <Form
      {...formItemLayout}
      form={form}
      onFinish={handleChange} 
      className="personal-info-box"
      >
      <Form.Item label="昵称" name="nickname">
        <Input />
      </Form.Item>
      <Form.Item
        label="手机号"
        name="phone"
      >
        <Input/>
      </Form.Item>
      <Form.Item
        label="密码"
        name="password"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="性别"
        name="sex"
      >
        <Select
        defaultValue={data.sex} 
        options={[
        { value: '1', label: '男' },
        { value: '2', label: '女' },
        ]}/>
      </Form.Item>
      <Form.Item
        label="邮箱/账号"
        name="email"
      >
        <Input/>
      </Form.Item>
      <Form.Item  label="头像" name="avatar" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload
          name="picture"  
          action="http://10.236.174.189:8087/user/uploadAvatar"  
          headers={
            {'Authorization': getToken()}
          } 
          listType="picture-card">
            <button style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none',width: 20,height: 20,display: 'flex',flexDirection:'column',alignItems: 'center',justifyContent: 'center'}} type="button">
            <div style={{fontSize:8, display:'flex',width:40,height:30,textAlign:'center'}}>点这里上传头像</div>
            </button>
          </Upload>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          提交修改
        </Button>
      </Form.Item>  
      </Form>
    </div>
    </>
  )
}
export default Personainfor;