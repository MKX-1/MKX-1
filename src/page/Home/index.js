import React from 'react'
import './index.scss'
import { useState,useEffect } from 'react';
import { Input,Breadcrumb,Form,Button,Select,Divider,Table,Pagination} from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getToken } from '@/utils/token';
import { Link } from 'react-router-dom';
//得从后端拿到标签列表的数据和整个所有文章的列表数据，在这里我先进行一个模拟
const Home = () => {
  const [tagOptions,setTagOptions] = useState([])
  const [reqData,setreqData] = useState({
    postId: '',
    title: '',
    labelId: '',
    content: '',
  }) 
  const [count,setcount] = useState('')
  const [page,setpage] = useState(1)
  const [labelMap,setlabelMap] = useState([])
  const [form] = Form.useForm()
  //labelid和labelContent存在映射关系，先用state来存储
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (_,record) => <Link to={`/article/articlecontainer?id=${record.postId}&title=${record.title}&pageNo=${page}`}>{record.title}</Link>,
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '标签',
      key: 'label',
      dataIndex: 'label',
      render:(labelId)=> labelMap[labelId]
    },
  ];
    //const handlePage = (page) =>{
      //request.get('/posts/posts/GetAllarticle',{page:page})
    //}
    const handleFitler = () => {
      axios({
        method:'get',
        url:'http://10.236.174.189:8087/posts/posts/readPostByConditions',
        headers:{
          'Authorization':getToken()  
        },
        params:{
          postContent:form.getFieldValue('Content'),
          labelId
          :form.getFieldValue('labelId'),
          postId:form.getFieldValue('id'),
        }
      })
      .then(res=>{
        console.log(res)
        const data = res.data.data.records.map(item=>{
          return {
            postId:item.postId,
            title:item.title,
            label: item.labelId,
            createdAt:item.createdAt,
          }
        })
        setcount(res.data.data.total)
        console.log("data",data);
        setdata(data) 
      })
     .catch(err=>{console.log(err)})
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
          //从后端获取tag之后，同时也要生成一个总体的，id和content的映射关系，把他存储到state里边然后再用组件的render来渲染、
          const map = {};
          res.data.data.forEach(tag => {
            map[tag.labelId] = tag.labelContent;
          });//map[a]=b 这里就生成了一种映射关系，用foreach遍历传回来数组中的所有映射关系，然后赋值给已经设定好的map容器，从而实现效果
          setlabelMap(map);
        }
      )
      .catch(
        err=>{console.log(err)},
      ) 
    }
    const fetchArticles = async () =>{
      axios({
        method:'get',
        url:'http://10.236.174.189:8087/posts/posts/showAllPosts',
        headers:{
          'Authorization':getToken()
        }, 
        params:{
          pageNo:page,
        }
      })
      .then(
        res=>{
          console.log(res.data.data.records)
          const data = res.data.data.records.map(item=>{
           return {
            postId:item.postId,
            title:item.title,
            label: item.labelId,
            createdAt:item.createdAt,
           }
          })
          setcount(res.data.data.total)
          console.log("data",data);
          setdata(data)
          form.resetFields()
        } 
      )
     .catch(
        err=>{console.log(err)},
      ) 
    }
    const [data, setdata] = useState([])
    useEffect(()=>{
      fetchTags() 
    },[])
    useEffect(()=>{
      fetchArticles()
    },[page]);
    const handleRefresh = () =>{
      setreqData({
        postId: '',
        title: '',
        commentsCount: '',
        likesCount: '',
        publishTime: '',
        label: '',
      })
    }
    return (
       <div className='home-wrapper'>
         <Breadcrumb
            items={[
                {
                    title:"首页"
                },
                {
                    title:"列表"
                }
            ]}
         />
        <div className='search-area'>
            <Form 
            className='searchSetting'
            onFinish={handleFitler}
            form={form}
            >
                <Form.Item label="标签筛选" name="labelId">
                <Select 
                style={{width:150}}
                options={tagOptions}
                placeholder="请选择标签" 
                />
                </Form.Item>
                <Form.Item label="内容查询" name="Content">
                  <Input placeholder="输入文章内容来查询" style={{width:300}}/>
                </Form.Item>
                <Form.Item label="根据帖子的id查询" name="id">
                  <Input placeholder="输入帖子id来查询" style={{width:300}}/>
                </Form.Item>
                <Form.Item>
                <Button type='primary' htmlType='submit'>
                    查询
                </Button>
                </Form.Item>
                <Button className='reset-search-box' onClick={fetchArticles}>
                    <RedoOutlined/>重置
                </Button> 
            </Form>
            <Divider className='border-box' plain>下边是{count}条结果</Divider>
            <Table columns={columns} dataSource={data} pagination={{
                position:['none']
            }}/>
            <Pagination
            className='pagination-search'
            defaultCurrent={1}
            pageSize={5}
            total={count}
            pageSizeOptions={['5']}
            showTotal={(total,range)=>`共${total}条，当前显示${range[0]}-${range[1]}条`}
            onChange={(page)=>setpage(page)} 
            />
        </div>
       </div> 
    )
}
export default Home;