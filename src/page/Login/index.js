import './index1.scss'
import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, Form, Input, message } from 'antd'
import { removeToken, setToken,getToken } from '@/utils/token'
const Login = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm()
    const [type, settype] = useState('error')
    const navigate = useNavigate()
    const [uuid, setuuid] = useState('')
    const [base64Image, setBase64Image] = useState('');

    useEffect(() => {
        axios.get('http://10.236.174.189:8087/code')
           .then(res => {
                const data = res.data.data;
                setuuid(data.uuid);
                setBase64Image(data.img);
            })
           .catch(err => {
                console.log('出错了', err)
            })
    }, [])

    const handleSubmit = async (values) => {
        try {
            // 直接使用表单提交的值
            const result = await axios({
                url: 'http://10.236.174.189:8087/user/login',
                method: 'post',
                data: {
                    email: values.username,
                    password: values.password,
                    code: values.code,
                    uuid: uuid
                }
            });
            console.log(values);
            console.log(result);
            if (result.data.data.token) {
                console.log(result.data.data.token);
                setToken(result.data.data.token);
                settype('success');
                messageApi.open({
                    type: 'success',
                    content: '登录成功',
                    duration: 1,
                });
                setInterval(() => {
                    axios({
                       method:'post',
                       url:'http://10.236.174.189:8087/user/refresh',
                       headers:{
                        'Authorization':getToken() 
                       } 
                    })
                    .then(res => 
                    {
                     console.log(res);
                     //removeToken();
                    }
                    )
                }, 72000);
                setTimeout(() => {
                    navigate('/article/home')
                }, 1000);
            }
        } catch (error) {
            settype('error');
            console.log(error);
            messageApi.open({
                type: 'error',
                content: '登录失败，请检查输入的各项是否正确',
                duration: 1,
            });
        }
    }

    return (
        <>
            {contextHolder}
            <div className='container'>
                <div className='form-box-login'>
                    <Form form={form} className='login-section' onFinish={handleSubmit}>
                        <h1 className='login-title'>Login<br></br></h1>
                        <Form.Item
                            className='login-section-upper'
                            name='username'
                            rules={[
                                { required: true, message: '请输入邮箱' }
                            ]}>
                            <Input className='login-input' placeholder='你的邮箱/账号' />
                        </Form.Item>
                        <Form.Item
                            className='login-section-lower'
                            name='password'
                            rules={[{ required: true, message: '请输入密码' }]}>
                            <Input.Password className='password-input' placeholder='你的密码' />
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary' size='small' htmlType='submit' className='login-button'>登录</Button>
                        </Form.Item>
                        <Form.Item className='testCode-L' name="code" rules={[{ required: true, message: '请输入验证码' }]}>
                            <Input className='code-input-L' placeholder='请输入验证码' />
                        </Form.Item>
                        {base64Image && <img className='testPic-L' src={`data:image/png;base64,${base64Image}`} alt="Base64 Image" />}
                    </Form>
                    <div className='form-box-trans'>
                        <h1 className='trans-title'>Welcome</h1>
                        <Button type='primary' size='small' className='trans-button' onClick={() => navigate('/register')}>还没注册？</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login