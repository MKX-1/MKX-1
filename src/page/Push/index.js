import React from "react";
import { Breadcrumb,Divider,Table,Tag,Pagination} from "antd";
import { useEffect,useState} from "react";
import { Link } from "react-router-dom";
import { getToken } from "@/utils/token";
import "./index.scss";
import dayjs from "dayjs";
import axios from "axios";
const Push = () => {
    const [count,setcount] = useState(0)
    const [page,setpage] = useState(1)
    const [labelMap,setlabelMap] = useState([])
    const [data,setdata] = useState([])
    const [userdata,setuserdata] = useState([])
    const fetchuserdata = async ()=>{
      axios({
        method:'get',
        url:'http://10.236.174.189:8087/user/selectUserMessage',
        headers:{
          'Authorization':getToken()
        }
      })
      .then(res=>{console.log(res);setuserdata(res.data.data)})
      .catch(err=>{console.log(err)})
    }
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
          render: (labelId) => labelMap[labelId],
        },
    ];
    const now = dayjs();
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
          const options = res.data.data.map(tag => ({
            value: tag.labelId,
            label: tag.labelContent,
          }))
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
    const fetchpushs = async ()=>{
      axios({
        method:'get',
        url:'http://10.236.174.189:8087/posts/posts/push',
        headers:{
         'Authorization':getToken() 
        },
        params:{
         pageNo:page, 
        } 
     })
     .then(res=>{console.log(res.data.data.records)
       const data = res.data.data.records.map(item=>{
         return {
           postId:item.postId,
           title:item.title,
           label: item.labelId,
           createdAt:item.createdAt,
         } 
       })
       setcount(res.data.data.total)
       setdata(data)
     })
    .catch(err=>{console.log(err)})
    }
    useEffect(()=>{
      fetchTagsMap()
      fetchuserdata()
    },[])
    useEffect(()=>{fetchpushs()},[page])
    return (
        <div className="push-wrapper">
          <Breadcrumb
            items={[
                {
                    title:"首页"
                },
                {
                    title:"推荐"
                }
            ]}
          />
          <h1 className="welcome-title">Welcome,{userdata.nickName}</h1>
          <p>现在是：{now.format('YYYY-MM-DD')}</p>
        <Divider className='border-box' plain></Divider>
        <Table columns={columns} dataSource={data} pagination={{position:['none']}}/>
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
    )

}
export default Push;