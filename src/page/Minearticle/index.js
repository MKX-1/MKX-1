import React from "react";
import"./index.scss"
import { Breadcrumb,Table,Space,Tag,Pagination, Button, Popconfirm, Divider} from "antd";
import { DeleteOutlined,EditOutlined} from '@ant-design/icons';
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { request } from "@/utils/request";
import { getToken } from "@/utils/token";
import axios from "axios";
const Minearticle = () => {
  const navigator = useNavigate();
  const [count,setcount] = useState(0)
  const [page,setpage] = useState('')
  const [labelMap,setlabelMap] = useState([])
  const [data,setdata] = useState([])
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
      key: 'creadtedAt',
    },
    {
      title: '标签',
      key: 'label',
      dataIndex: 'label',
      render: (labelId) => labelMap[labelId],
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>handleEdit(record.postId)}/>
          <Popconfirm
          title="确定要删除吗"
          description="删除后无法恢复"
          okText="确定"
          cancelText="取消"
          onConfirm={() => handleDelete(record.postId)}>
          <Button 
          type="primary"
          danger
          shape="circle"
          icon={<DeleteOutlined />}
          ></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
    const handleEdit = (postId) => {
        navigator(`/article/editArticle?id=${postId}`)
    }
    const fetchTagsMap = async ()=>{
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
    const fetchMyAriticles = async ()=>{
      axios({
        method:'get',
        url:'http://10.236.174.189:8087/posts/posts/readPostByAuthor',
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
            postId:String(item.postId),
            title:item.title,
            label: item.labelId,
            createdAt:item.createdAt,
            }
          })
          setcount(res.data.data.total)
          console.log("data",data);
          setdata(data)
        } 
      )
      .catch(
        err=>{console.log(err)},
      )
    }
    const handleDelete = (postId) => {
      axios({
        method:'delete',
        url:`http://10.236.174.189:8087/posts/posts/deletePost/${postId}`,
        headers:{
          'Authorization':getToken()
        },
      })
      .then(
        res=>{
          console.log(res)
          fetchMyAriticles()
        } 
      )
      .catch(
        err=>{console.log(err)},
      )
      //setdata(data.filter(item=>item.creadtedAt!==creadtedAt))
      console.log('删除成功')
      console.log(data)
    }
    useEffect(()=>{
      fetchTagsMap()
    },[])
    useEffect(()=>{
      fetchMyAriticles()
    },[page])
  return (
    <div className="minearticle-wrapper">
      <Breadcrumb
        items={[
          {
            title: "个人",
          },
          {
            title: "我的帖子",
          }  
        ]}
      />
      <h1>下边是你发的帖子</h1>
      <Divider />
      <Table columns={columns} dataSource={data} className="mineArticle-list" pagination={{position:['none']}}/>
      <Pagination
            className='pagination-mine'
            defaultCurrent={1}
            total={count}
            pageSize={5}
            pageSizeOptions={['5']}
            showTotal={(total,range)=>`共${total}条数据，当前显示${range[0]}-${range[1]}条`}
            onChange={(page)=>setpage(page)} 
      />
    </div>
  );
}
export default Minearticle;