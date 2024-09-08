import React, { useRef, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import attach from '../../assets/attach.png';
import sendImage from '../../assets/sendImage.png';
import send from '../../assets/send.png';
import MessageObject from '../../components/message/messageObject';
import styles from './Chat.module.css';
import useFetch from '../../hooks/useFetch';
import useConnect from '../../hooks/useConnect';
import { MoonLoader } from 'react-spinners';


const SERVER_URL = 'http://localhost:4000';
const socket = io(SERVER_URL);

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [usersProject, setUsersProject] = useState([]);
    const [userName , setUserName] = useState('');
    const messageAreaRef = useRef();
    const {user, isPending,error} = useConnect();
    const userId = localStorage.getItem('user_id');
    const userNameinSession = JSON.parse((sessionStorage.getItem('user')));
    const { data: projectsData, isPending: isPendingProjects ,error:errorProjects } = useFetch(`http://localhost:4000/api/projects/myprojects/${userId}`);
    const { data: UsersAssignedToaProject, isPending: isPendingUsers , error:errorUsers } = useFetch(`http://localhost:4000/api/projects/projusers/${selectedProject}`);
    const { data: allMessagesData, isPending: isPendingMessages , error : errorMessages} = useFetch(`http://localhost:4000/api/messages/allMessage/${selectedProject}`);
    
    const sendMessage = () => {
        if (message !== '' && selectedProject) {
            const messageObj = {
                content: message,
                sender: userId,
                sentTo: usersProject, 
                project: selectedProject,
                sentAt: Date.now(),
                who: userName
            };
            socket.emit('chat message', messageObj);
            setMessage('');
        }
    };

    const scrollToBottom = () => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
    };

    const handleSelectedProject = (projectId) => {
        setSelectedProject(projectId);
    };

    useEffect(()=>{
        if(!isPending){
          setUserName(userNameinSession.firstName + ' ' +userNameinSession.lastName)
        }
      },[user , isPending])

    useEffect(() => {
        if (!isPendingProjects && projectsData) {
            setProjects(projectsData);
            
        }
    }, [projectsData, isPendingProjects]);

    useEffect(() => {
        if (!isPendingUsers && UsersAssignedToaProject) {
            const newUsersProject = UsersAssignedToaProject.map(user => user._id);
            setUsersProject(newUsersProject);
        }
    }, [UsersAssignedToaProject, isPendingUsers]);

    useEffect(() => {
        if (!isPendingMessages && allMessagesData) {
            const formattedMessages = allMessagesData.map(mssg => ({
                ...mssg,
                sender: mssg.sender === userId ? 'self' : 'other',
                who : mssg.who
            }));
            setMessages(formattedMessages);
        }
    }, [allMessagesData, isPendingMessages, userId]);

    useEffect(() => {
        const newMessageHandler = (newMessage) => {
            setMessages(prevMessages => [
                ...prevMessages,
                { ...newMessage, sender: newMessage.sender === userId ? 'self' : 'other' }
            ]);
        };

        socket.on('chat message', newMessageHandler);

        return () => {
            socket.off('chat message', newMessageHandler);
        };
    }, [userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleEnterKeyUp = (e) => {
            if (e.keyCode === 13) {
                sendMessage();
            }
        };
        const inputElement = document.getElementById('inputMessage');
        inputElement.addEventListener('keyup', handleEnterKeyUp);
        return () => {
            inputElement.removeEventListener('keyup', handleEnterKeyUp);
        };
    }, [sendMessage]);

    useEffect(() => {
        if (projectsData && projectsData.length > 0 && !selectedProject) {
            setSelectedProject(projectsData[0]._id);
            setProjects(projectsData);
        }
    }, [projectsData, selectedProject]);
    
    return (
        <div className={styles.chatContainer}>
            <aside className={styles.userProjectsGroupsContainer}>
                <h3>
                    Select a Project Group
                </h3>
                <ul>
                    {projects.map((project)=>{
                        return(
                            <li className={`${project._id !== selectedProject ? styles.project : styles.selectedProject}`} key = {project._id} onClick={()=>{handleSelectedProject(project._id)}}>
                                {project.name}
                            </li>
                        )
                    })}
                </ul>
            </aside>
            <section className={styles.messagesSection}>
                <div className={styles.headerContainer}>
                        Group Chat
                </div>
                <div className={styles.messagesArea} ref={messageAreaRef}>
                {(isPendingMessages||isPendingUsers)&&(
                    <div className={styles.loaderContainer}> <MoonLoader size={50}/> </div>
                    
                )}
                    {messages.map((mssg,index)=>{
                        return(
                            <MessageObject key={index} message={mssg} />
                        )
                    })}
                </div>
                <div id={styles.sendMessageContainer}>    
                    <input 
                        id='inputMessage'
                        className={styles.inputMessage}
                        type='text' 
                        placeholder='Type your message here ...'
                        value={message}
                        onChange={(e)=>setMessage(e.target.value)}
                    />
                <button className={styles.attachButton}> <img alt='icon' src={attach} className={styles.attach}/></button>
                <button className={styles.sendImageButton}><img alt='icon' src={sendImage} className={styles.sendImage}/></button>
                    <button 
                    id='sendMessageButton'
                    className={styles.sendMessageButton}
                    onClick={sendMessage}
                    type='submit'
                    >
                        <img alt='icon' src={send} className={styles.sendMessage}/>
                        Send message
                    </button>
                </div>
            </section>
        </div>
  )
}

export default Chat
