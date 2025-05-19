import React, { useRef, useState, useEffect } from "react";
import { Breadcrumb, Divider, message, Avatar, Statistic, Popconfirm } from "antd";
import './index.scss'
import axios from "axios";
import { getToken } from "@/utils/token";
import { LikeOutlined, CommentOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
const Articlecontainer = () => {
    const [searchParams] = useSearchParams()
    const [messageApi, contextHolder] = message.useMessage();
    const [content,setContent] = useState('')
    const [time,settime] = useState('')
    const [label,setlabel] = useState('')
    const [labelMap,setlabelMap] = useState([])
    const [replyingTo,setreplyingTo] = useState(null)//设置一个回复状态，当我点击父评论的ADD按钮时，这个状态会改变，从而影响点击发布按钮时调用的函数
    const [commentsCount,setcommentsCount] = useState(0)
    const title = searchParams.get('title');
    const id = searchParams.get('id');
    const textareaRef = useRef(null);
    const [comments,setcomments] = useState([]);
    const [avatarMap, setAvatarMap] = useState({}); // 用于存储 userId 对应的头像数据
    const [userData, setUserData] = useState([]); // 用于存储 userId 对应的用户数据
    const [postPicture, setPostPicture] = useState('');
    const handlePic = () => {
        axios({
            method: 'get',
            url: 'http://10.236.174.189:8087/posts/posts/postPicture',
            headers: {
                'Authorization': getToken()
            },
            params: {
                postId: id,
                _t: new Date().getTime()
            },
            responseType: 'arraybuffer' // 设置响应类型为 arraybuffer
        })
        .then(
                res => {
                    console.log(res);
                    const buffer = res.data;
                    const binary = [];
                    const bytes = new Uint8Array(buffer);
                    const len = bytes.byteLength;
                    for (let i = 0; i < len; i++) {
                        binary.push(String.fromCharCode(bytes[i]));
                    }
                    const base64 = btoa(binary.join(''));
                    setPostPicture(`data:image/png;base64,${base64}`);
                }
            )
        .catch(
                err => { console.log(err) }
            );
    };
    const renderComment = (comment) =>{
        const childComments = comments.filter(child => child.commentsPO.parentId === comment.commentsPO.commentId);
        return(
        <div key={comment.commentsPO.commentId} className="comment-item">
            <div className={ comment.commentsPO.parentId === 0 ? "Father-comment" : "child-comment"}> 
              <div className="comment-avatar-box">
                  <Avatar
                      size={comment.commentsPO.parentId === 0 ? 40:20}
                      src={avatarMap[comment.commentsPO.userId] 
                          ? `data:image/png;base64,${avatarMap[comment.commentsPO.userId]}` 
                          : null}
                  />
              </div>
              <div className="comment-mainWrapper">
                  <div className="commentHeader"><p>{comment.sendUsername}</p>{comment.commentsPO.parentId !== 0 && (
                      <><p className="replyToBox-01">回复给:</p><p>{comment.parentUsername}</p></>
                  )}</div>
                  <div className="commentContent"><p>{comment.commentsPO.content}</p></div>
                  <div className={comment.commentsPO.parentId === 0 ? "commentTooltable" : "childcomment-ToolTable"}>
                      {comment.commentsPO.parentId === 0 && <span className="commentLike-box">
                          <Statistic value={comment.commentsPO.likes} prefix={<LikeOutlined onClick={()=>handleLike(comment.commentsPO.commentId)}/>}  className="LikeBox"/>
                      </span>}
                      <span className="child-comment-add"><CommentOutlined onClick={()=>handleReplyIcon(comment.commentsPO.commentId)}/></span>
                      <span className={comment.commentsPO.parentId === 0 ? "comment-delete" : "child-comment-delete"}><Popconfirm title="确定要删除这个吗" okText="是的" cancelText="再说" onConfirm={()=>handleDeleteComment(comment.commentsPO.commentId)}><DeleteOutlined/></Popconfirm></span>
                      <span className={comment.commentsPO.parentId === 0 ? "comment-createTime" : "childcomment-createTime"}>发表于{comment.commentsPO.createTime}</span>
                  </div>
              </div>
            </div>  
            {childComments.length > 0 && (
            <div className="child-box">
                {childComments.map(childComment => renderComment(childComment))}
            </div> 
            )}   
          </div>
        )
    }//为了实现多级评论同时渲染，从ai那里学到了递归调用函数的方法。
    //首先是filter下来的根级评论，即为父级评论，然后使用map去遍历，同时呢吧父级评论传入render函数，在其中会进行两件事情，一呢就是筛选当前map遍历的这条父评论的子评论
    //二呢就是渲染，根级评论正常渲染，子级评论再一次的调用render即为<childcomments.map(childComment=>renderComment(childComment))>
    //所以呢一级子评论成了下一级的父评论，而当进入了子评论渲染阶段，样式也应该发生变化，比如是没有点赞按钮，头像变小，以及评论框应该往右挪一挪
    const fetchTagsMap = async () => {
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
            const map = {};
            res.data.data.forEach(tag => {
              map[tag.labelId] = tag.labelContent;
            });
            setlabelMap(map);
          }
        )
        .catch(
          err=>{console.log(err)},
        ) 
    }
    const GetAllComments = async () => {
        try {
            const res = await axios({
                method: 'get',
                url: 'http://10.236.174.189:8087/comments/selectComments',
                headers: {
                    'Authorization': getToken()
                },
                params: {
                    postId: id,
                    _t: new Date().getTime()
                }
            });
            const allComments = res.data.data;
            setcomments(allComments);
            setcommentsCount(res.data.data.length);

            // 初始化一个新的头像映射对象
            const newAvatarMap = { ...avatarMap };
            // 遍历评论列表，为每个未获取头像的用户发起请求
            for (const comment of allComments) {
                const userId = comment.commentsPO.userId;
                if (!newAvatarMap[userId]) {
                    const avatar = await GetAvatarAPI(userId);
                    newAvatarMap[userId] = avatar;
                }
            }
            // 更新头像映射状态
            setAvatarMap(newAvatarMap);
        } catch (err) {
            console.log(err);
        }
    };
    const GetAvatarAPI = async (userId) => {
        try {
            const res = await axios({
                method: 'get',
                url: 'http://10.236.174.189:8087/user/selectUserMessage',
                headers: {
                    'Authorization': getToken()
                },
                params: {
                    userId: userId
                }
            });
            // 返回头像数据
            return res.data.data.avatar;
        } catch (err) {
            console.log(err);
            return null;
        }
    };
    const handleOrderbyTime = ()=>{
        axios({
            method:'get',
            url:'http://10.236.174.189:8087/comments/selectByTime',
            headers:{
                'Authorization':getToken()
            },
            params:{
                postId:id,
                _t:new Date().getTime() 
            } 
        })
        .then(
            res=>{
                console.log(res)
                const allComments = res.data.data//.flatMap(comment => comment.commentsPO||[]);
                console.log(allComments)
                setcomments(allComments)
                console.log(comments)
            },
        ) 
        .catch(
            err=>{console.log(err)}, 
        )
    }
    const handleOrderbyHeat = ()=>{
        axios({
            method:'get',
            url:'http://10.236.174.189:8087/comments/selectByLike',
            headers:{
                'Authorization':getToken() 
            },
            params:{
                postId:id,
                _t:new Date().getTime()
            } 
        })
        .then(
            res=>{
                console.log(res)
                const allComments = res.data.data//.flatMap(comment => comment.commentsPO||[]);
                console.log(allComments)
                setcomments(allComments)
                console.log(comments)
            },
        ) 
        .catch(
            err=>{console.log(err)},
        ) 
    }
    const handleReplyIcon = (commentId)=>{
        setreplyingTo(commentId)
        textareaRef.current.focus();
        console.log(replyingTo)
    }
    const handleReply = (parentid)=>{
        axios({
           method:'post',
           url:'http://10.236.174.189:8087/comments/replyComment',
           headers:{
               'Authorization':getToken()
           },
           params:{
               parentId:parentid,
               postId:id,
               content:document.getElementById('tx').value,
               _t:new Date().getTime()
           } 
        })
        .then(
            res=>{console.log(res)},
            document.getElementById('tx').value = '',
            setreplyingTo(null),
            GetAllComments(),
        ) 
        .catch(
            err=>{console.log(err)},
        )
    }
    const handleComment = (id)=>{
        const content = document.getElementById('tx').value;
        if(content === ''){
            messageApi.open({
                type:'error',
                content:'评论不能为空',
            })
            return;
        }
        axios({
            method:'post',
            url:'http://10.236.174.189:8087/comments/replyPost',
            headers:{
                'Authorization':getToken()
            },
            params:{
                postId:id,
                content:content,
                _t:new Date().getTime()
            } 
        })
       .then(
            res=>{console.log(res)},
            document.getElementById('tx').value = '',
            GetAllComments(),
        ) 
       .catch(
            err=>{console.log(err)},
        ) 
    }
    const handleDeleteComment = (commentId) =>{
        axios({
           method:'post',
           url:'http://10.236.174.189:8087/comments/delete',
           headers:{
               'Authorization':getToken()  
           },
           params:{
               commentId:commentId,
               _t:new Date().getTime()
           } 
        })
        .then(
            res=>{console.log(res)},
            GetAllComments(),
        ) 
        .catch(
            err=>{console.log(err)},
        )
    }
    const handleLike =(commentId)=>{
        axios({
            method:'post',
            url:'http://10.236.174.189:8087/comments/like',
            params:{
                commentId:commentId,
                _t:new Date().getTime()
            },
            headers:{
                'Authorization':getToken()  
            }
        })
        .then(
            res=>{console.log(res)},
            GetAllComments(),
        ) 
        .catch(
            err=>{console.log(err)}, 
        )
    }
    const fetchArticlesCurrentData = async ()=>{
        try{
            const res = await axios({
                method:'get',
                url:'http://10.236.174.189:8087/posts/posts/readPostByConditions',
                headers:{
                  'Authorization':getToken()
                },
                params:{
                  postId:id,
                }
            })
            const articleData = res.data.data.records[0];
            setContent(articleData.content);
            settime(articleData.createdAt);
            setlabel(articleData.labelId);
        } catch (error) {
            console.error('Error fetching article data:', error);
        }
    }
    const fetchuserdata = async ()=>{
        axios({
          method:'get',
          url:'http://10.236.174.189:8087/user/selectUserMessage',
          headers:{
            'Authorization':getToken()
          }
        })
        .then(res=>{console.log(res);setUserData(res.data.data)})
        .catch(err=>{console.log(err)})
      }
    useEffect(()=>{
        fetchArticlesCurrentData()
        GetAllComments()
        fetchTagsMap()
        fetchuserdata()
        handlePic()
    },[])
    const labelContent = labelMap[label];
    return(
       <>
       {contextHolder} 
        <div className="Articlecontainer-wrapper">
            <Breadcrumb
             items={[
                 {
                     title:"帖子"
                 },
                 {
                     title:`${title}` 
                 }
             ]}
            />
            <h1>{title}</h1>
            <h2 className="tagTitle">{labelContent}</h2>
            <h5>{userData.nickName}</h5>
            <h5>创建于{time}</h5>
            <div className="likeButton-box">
                <Statistic title="评论数" value={commentsCount} prefix={<CommentOutlined/>} className="LikeBox"/>
            </div>
            <Divider/>
            {postPicture && <img src={postPicture} alt="Post Picture" className="postPic" />}
            <div className="Articlecontainer-content">
               <div dangerouslySetInnerHTML={{__html:content}}> 
               </div> 
            </div>
            <Divider plain>评论区</Divider>
            <div className="Articlecontainer-comment">
            <textarea id="tx" ref={textareaRef} placeholder="发一条友善的评论" rows="2" maxlength="200" className="comment_input_area"></textarea>
            <button 
            id="publishButton"
            onClick={()=>replyingTo ? handleReply(replyingTo):handleComment(id)}
            >
             {replyingTo? '回复' : '发布'}
            </button>
            </div>
            <div className="Reorder-box">
                <p className="text01">排序方式：</p>
                <div className="OrderBytime" onClick={()=>handleOrderbyTime(id)}>
                    <span>时间</span>
                </div>
                <Divider type="vertical" className="diviborder"/>
                <div className="OrderByheat" onClick={()=>handleOrderbyHeat(id)}>
                    <span>热度</span>
                </div>
            </div>
            <div className="comment-list">
                {
                    Array.from(comments)
                        .filter(comment => comment.commentsPO.parentId === 0) // 过滤出父级评论
                        .map(comment => renderComment(comment))
                }
            </div>
        </div>
       </>
    )
}

export default Articlecontainer;