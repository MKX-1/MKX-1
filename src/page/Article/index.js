import {Button,Menu, Avatar, Popconfirm,Switch} from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import { UserOutlined, SettingOutlined, PlusCircleOutlined, HomeOutlined } from '@ant-design/icons';
import "@/page/Article/index2.scss";
import { useNavigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from "axios";
import React from'react'
import { getToken, removeToken } from '@/utils/token';
const items = [
    {
        label: '帖子',
        key: 'context',
        icon: <PlusCircleOutlined />,
        children: [
            { label: '新建帖子', key: 'addArticle', navigator: { to: 'addArticle' } },
        ],
    },
    {
        label: '首页',
        key: 'home',
        icon: <HomeOutlined />,
        children: [
            { label: '推荐', key: 'pushArticle', navigator: { to: 'push' } },
            { label: '列表筛选', key: 'home', navigator: { to: 'home' } },
        ],
    },
    {
        label: '我的',
        key: 'mine',
        icon: <UserOutlined />,
        children: [
            { label: "我的帖子", key: 'mineArticle', navigator: { to: 'mineArticle' } },
            { label: "我的信息", key: 'mineInfo', navigator: { to: 'mineInfo' } },
        ]
    },
    {
        label: '设置',
        key: 'Setting',
        icon: <SettingOutlined />,
        children: [
            {
                label: '编辑个人信息',
                key: 'personainfor',
                navigator: { to: 'persona' }
            },
        ],
    }
];
const Article = () => {
    const navigator = useNavigate();
    const [current, setCurrent] = useState('');
    const [data,setdata] = useState([])
    const fetchAvatar = async () =>{
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
                const data = res.data.data;
                setdata(data);
                console.log(data);
            } 
        )
       .catch(
            err=>{console.log(err)} 
        )
    }
    const confirm = () => {
    removeToken();
        axios({
            url: 'http://10.236.174.189:8087/user/logout',
            method: 'delete',
            headers: {
                'Authorization': getToken()
            }
        })
           .then((result) => {
                console.log(result);
            })
           .catch((err) => {
                console.log(err);
            });
        navigator('/');
    };

    const cancel = () => {
        console.log('Cancel');
    };
    const onClick = (e) => {
        console.log('click ', e);
        if (e.key!== 'Setting' && e.key!== 'context') {
            setCurrent(e.key);
        }
        items.map((item) => {
             if (item.children) {
                item.children.map((child) => {
                    if (child.key === e.key) {
                        navigator(child.navigator.to);
                    }
                });
            }
        });
    };
    useEffect(() => {
        fetchAvatar(); 
     },[])
    return (
          <div className='article-container'>
              <div className='header-nav'>
                    <div className='logo'>
                        文馨一言
                    </div>
                    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
                    <Avatar src={`data:image/png;base64,${data.avatar}`} className='avatar-box' />
                    <h3 className='userId-box'>{data.nickName}</h3>
                    <Popconfirm
                        title="登出"
                        description="你确定要登出吗？"
                        onConfirm={confirm}
                        onCancel={cancel}
                        okText="是的"
                        cancelText="我再想想"
                    >
                        <Button type='primary' className='logOut-button'>登出 <PoweroffOutlined /></Button>
                    </Popconfirm>
                </div>
                <div className='main-content'>
                    <div className='main-wrapper'>
                        <div className='content-card'>
                            <Outlet />
                        </div>
                    </div>
                </div>
          </div>
    );
};
export default Article;