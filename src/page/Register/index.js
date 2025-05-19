import './index.scss'
import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, Form, Input, Select, Space,Upload,message} from 'antd';
import axios from 'axios';
import '@ant-design/v5-patch-for-react-19'
import { request } from '@/utils/request';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e === null || e === void 0 ? void 0 : e.fileList;
};
const Register = () =>{
    useEffect(() => {
     axios.get('http://10.236.174.189:8087/code')
     .then(res=>{
      const data = res.data.data;
      setBase64Image(data.img);
      setuuid(data.uuid)
      console.log(uuid) 
     }).catch(err=>{
      console.log('出错了',err)
     }) 
    },[])
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [nickname, setnickname] = useState('')
    const [account, setaccount] = useState('')
    const [password, setpassword] = useState('')
    const [gender, setgender] = useState('')
    const [code, setcode] = useState('')
    const [uuid,setuuid] = useState('')
    const [type, settype] = useState('error')
    const [base64Image, setBase64Image] = useState('');
    const handleForm = async () => {
      try {
        await form.validateFields()
        console.log(nickname,account,password,gender)
        // 所有验证通过后执行
        axios({
          url:'http://10.236.174.189:8087/user/register',
          method:'post',
          data:{
            email:account,
            password:password,
            code:code,
            uuid:uuid
          }
          }).then(res=>{
            settype('success')
            console.log(res)
            handletips()
          }).catch(err=>{
            console.log('出错了',err)
            settype('error')
          })
        } 
        catch (error) {
          settype('error')
        }
    };
    const handletips = () => {
      if (type === 'success') {
          messageApi.open({
              type: type,
              content: '注册成功',
              duration: 1,
          });
          setTimeout(() => {
              navigate('/')
          }, 1000);
      }
    }
    const onReset = () => {
      form.resetFields();
    };
    return (
    <>
    {contextHolder}
    <div className='container1'>
      <div className='form-box-reg'>
        <h1 className='reg-title'>Register<br></br>由此开始
        </h1>
     <Form
      {...layout}
      className='reg-section'
      form={form}
      name="control-hooks"
      onFinish={handleForm}
      style={{ maxWidth: 600 }}
     >
      <Form.Item hasFeedback className='name-box'  validateTrigger="onBlur" name="name" rules={[{ required: true, message:'请输入昵称',max:5,message:'昵称最多不过五个字' }]}>
        <Input className='name-input' onChange={(e)=>setnickname(e.target.value)} placeholder='这里是昵称，不要太长'/>
      </Form.Item>
      <Form.Item hasFeedback className='account-box' validateTrigger='onBlur' name="account" rules={[{ required: true, message:'请输入邮箱' }]}>
        <Input className='account-input' onChange={(e)=>setaccount(e.target.value)} placeholder='邮箱'/>
      </Form.Item>
      <Form.Item className='password-box' name="password" rules={[{ required: true, message:'请输入密码' }]}>
        <Input className='password-input1' onChange={(e)=>setpassword(e.target.value)} placeholder='密码'/>
      </Form.Item>
      <Form.Item name="gender" className='select-box'  rules={[{ required: true, message:'请输入性别' }]}>
      <Select
        onChange={(value)=>setgender(value)}
        placeholder="性别"
        className='select-gender'
        options={[
          { value: 'male', label: '男' },
          { value: 'female', label: '女' },
        ]}
      />
      </Form.Item>
      <Form.Item  className='avatar-box' valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload className='avatar-upload' action="http://10.236.174.189:8087/user/uploadAvatar" listType="picture-card" style={{height:24,flexWrap:'nowrap'}}>
            <button style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none',width: 20,height: 20,display: 'flex',flexDirection:'column',alignItems: 'center',justifyContent: 'center'}} type="button">
            <div style={{fontSize:8, display:'flex',width:40,height:30,textAlign:'center'}}>点这里上传头像</div>
            </button>
          </Upload>
      </Form.Item>
      <Form.Item className='testCode' name="code" rules={[{ required: true, message:'请输入验证码' }]}>
        <Input className='code-input' onChange={(e)=>setcode(e.target.value)} placeholder='请输入验证码'/>
      </Form.Item>
      {base64Image && <img className='testPic' src={`data:image/png;base64,${base64Image}`} alt="Base64 Image" />}    
      <Form.Item {...tailLayout}  className='reg-buttons'>
        <Space>
          <Button type="primary" htmlType="submit" /*onClick={()=>handleForm()}*/ className='reg-button'>
            注册
          </Button>
          <Button htmlType="button" onClick={onReset} className='reset-button'>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
         <div className='form-box-trans-reg'>
            <h1 className='trans-title-reg'>Here to register</h1>
            <Button type='primary' size='small' className='trans-button' onClick={()=>navigate('/login')}>已有账号？</Button>
         </div>
        </div>
    </div>
    </>
    )
}
export default Register