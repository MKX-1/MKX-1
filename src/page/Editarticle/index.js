import React from "react";
import { useState,useEffect } from "react";
import"./index.scss"
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {UploadOutlined} from '@ant-design/icons';
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  Select,
  Breadcrumb,
  message,
  Upload,
} from 'antd';
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import dayjs from "dayjs";
import { getToken } from "@/utils/token";
const Editarticle = () => {
    const navigator = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [tagOptions,setTagOptions] = useState([])
    const [searchParams] = useSearchParams();
    const articleId = searchParams.get('id');
    const now = dayjs();
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
    const handleChange = async () => {
        axios({
         url:'http://10.236.174.189:8087/posts/posts/updatePost',
         method:'put',
         headers:{
          'Authorization':getToken()
         },
         data:{
          postId:articleId,
          title:form.getFieldValue('title'),
          labelId:form.getFieldValue('tag'),
          content:form.getFieldValue('content'),
         },
         headers:{
          'Authorization':getToken() 
         } 
        })
        .then(res=>{
        console.log(res)
        messageApi.open({
            type: 'success',
            content: '修改成功',
            duration: 1,
        });
        setTimeout(() => {
            navigator('/article/home'); // 重定向到指定页面
          }, 1000);
        console.log('编辑成功')
        })
        .catch(err=>{
        console.log(err)
        message.error('Error')
        console.log('出错了')
        })
    }
    const fetchEditData = async () =>{
      try{
        const res = await axios({
          method:'get',
          url:'http://10.236.174.189:8087/posts/posts/readPostByConditions',
          headers:{
            'Authorization':getToken()
          },
          params:{
            postId:articleId,
          }
        })
      const articleData = res.data.data.records[0];
      form.setFieldsValue({
        postId:articleData.postId,
        title:articleData.title,
        tag:articleData.labelId,
        content:articleData.content,
      });
     } catch (error) {
      console.error('数据获取失败', error);
     }
    }
    // const handleUpload = async (file)=>{
    //   console.log(file)
    //   if (!file) {
    //     messageApi.open({
    //         type: 'error',
    //         content: '请选择文件',
    //         duration: 1,
    //     }); 
    //   }
    //   const formData = new FormData();
    //   formData.append('picture', file);
    //   formData.append('postId', articleId);
    //   try {
    //       const response = await axios({
    //           url: 'http://10.236.174.189:8087/posts/posts/uploadPicture',
    //           method: 'post',
    //           headers: {
    //               'Authorization': getToken(),
    //               'Content-Type': 'multipart/form-data'
    //           },
    //           data: formData
    //       });
    //       console.log('文件上传成功', response);
    //       messageApi.open({
    //           type: 'success',
    //           content: '图片上传成功',
    //           duration: 1,
    //       });
    //   } catch (error) {
    //       console.error('文件上传失败', error);
    //       messageApi.open({
    //           type: 'error',
    //           content: '图片上传失败',
    //           duration: 1,
    //       });
    //   }
    // }
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
        fetchEditData()
      },[])
    return (
    <>
    {contextHolder} 
    <div className="edit-wrapper">
        <Breadcrumb
            items={[
                {
                    title:"帖子"
                },
                {
                    title:"编辑帖子"
                }
            ]}
        />
      <Form
      {...formItemLayout}
      form={form}
      onFinish={handleChange} 
      className="personal-info-box"
      >
      <Form.Item label="帖子Id">
        <span className="ant-form-text">{articleId}</span>
      </Form.Item>  
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
      <Form.Item label="上传帖子图片" name="picture">
        <Upload 
        accept=".png,.jpg,.jpeg"
        action={'http://10.236.174.189:8087/posts/posts/uploadPicture'}
        headers={{'Authorization':getToken()}}
        data={{postId:articleId}}
        name='picture'
        // beforeUpload={false}
        // onChange={(file)=>handleUpload(file)}
        >
            <Button icon={<UploadOutlined />}>点击上传</Button>
        </Upload>    
      </Form.Item>
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
          修改
        </Button>
      </Form.Item>  
      </Form>
    </div>
    </>
)}
export default Editarticle;