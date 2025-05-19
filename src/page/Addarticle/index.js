import React from "react";
import { useState,useEffect } from "react";
import"./index.scss"
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  Button,
  Form,
  Input,
  Select,
  Breadcrumb,
  message,
} from 'antd';
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { getToken } from "@/utils/token";
const Addarticle = () => {
    const [content,setContent] = useState('')
    const navigator = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [tagOptions,setTagOptions] = useState([])
    const [form] = Form.useForm()
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
    const handlePlus = () => {
        axios({
         method:'post',
         url:'http://10.236.174.189:8087/posts/posts/createLabel',
         data:{
          labelName:content,
         },
         headers:{
          'Authorization':getToken() 
         } 
        })
        .then(res=>{console.log(res)
        messageApi.open({
            type:'success',
            content: '标签创建成功',
            duration: 1,
        })
        setContent('')
        fetchTags()  
        })
        .catch(err=>{console.log(err)})
      } 
    const handleChange = async () => {
        axios({
         url:'http://10.236.174.189:8087/posts/posts/createPost',
         method:'post',
         headers:{
          'Authorization':getToken()
         },
         data:{
          title:form.getFieldValue('title'),
          labelId:form.getFieldValue('tag'),
          content:form.getFieldValue('content'),
          scheduledTime:form.getFieldValue('scheduledTime')
         },
         headers:{
          'Authorization':getToken() 
         } 
        })
        .then(res=>{
        console.log(res)
        messageApi.open({
            type: 'success',
            content: '发布成功',
            duration: 1,
        });
        setTimeout(() => {
            navigator('/article/push'); // 重定向到指定页面
          }, 1000);
        console.log('发布成功')
        })
        .catch(err=>{
        console.log(err)
        message.error('Error')
        console.log('出错了')
        })
    }
    const fetchTags = async () => {
      axios({
        method:'get',
        url:'http://10.236.174.189:8087/posts/posts/readAllLabels',
        headers:{
          'Authorization':getToken()
        } 
      })
      .then(
        res=>{
          console.log(res)
          const options = res.data.data.map(tag => ({
            value: tag.labelId,
            label: tag.labelContent,
          }))
          setTagOptions(options)
        }
      )
      .catch(
        err=>{console.log(err)},
      ) 
    }
    useEffect(()=>{
        fetchTags()
      },[])
    return (
    <>
    {contextHolder} 
    <div className="add-wrapper">
        <Breadcrumb
            items={[
                {
                    title:"帖子"
                },
                {
                    title:"新建帖子"
                }
            ]}
        />
      <Form
      {...formItemLayout}
      form={form}
      onFinish={handleChange} 
      className="personal-info-box"
      >
      <Form.Item
        label="标题"
        name="title"
        rules={
          [
            { required: true, message: '标题不能为空' },
            { min: 5, message: '标题长度不能小于5' },
            { max: 10, message: '标题长度不能大于10' } 
          ]
        }
      >
        <Input  placeholder="输入帖子标题"/>
      </Form.Item>
      <Form.Item
        label="标签TAG"
        name="tag"
        rules={[{required:true, message:'标签不能为空'}]}
      >
        <Select 
        options={tagOptions}
        placeholder="请选择标签"
        />
      </Form.Item>
      <Form.Item label="点这里创建新的标签">
        <Input placeholder="输入标签内容" name="labelContent" onChange={(e)=>setContent(e.target.value)} className="labelAdd-box"/> 
        <Button type="primary" onClick={()=>handlePlus()}>标签+</Button>
      </Form.Item>
      {/* <Form.Item label="定时发送（选填）" name="scheduledTime">
        <Input placeholder="格式： xxxx-xx-xx xx:xx:xx" />
      </Form.Item>  */}
      <Form.Item
        label="正文"
        name="content"
        rules={[{required:true, message:'正文不能为空'}]}
      >
        <ReactQuill
         className="publish-quill"
         theme="snow"
         placeholder="请输入正文"
        />
      </Form.Item>  
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          发布
        </Button>
      </Form.Item>  
      </Form>
    </div>
    </>
    )
}
export default Addarticle;