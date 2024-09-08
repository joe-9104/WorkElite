import styles from './sidemenu.module.css'
//importing components 
import ListItem from "../listItem/listItem";
import CreateButton from '../createButton/createButton';
//importing icons
import logo from '../../assets/logo.png'
import logout from '../../assets/logout-icon.svg'
import project from '../../assets/project-icon.svg'
import setting from '../../assets/settings-icon.svg'
import leave from '../../assets/leave-icon.svg'
import tasks from '../../assets/tasks-icon.svg'
import meet from '../../assets/meet-icon.svg'
import profile from '../../assets/profile-icon.svg'
import chat from '../../assets/chat-icon.svg'
import members from '../../assets/team-icon.svg'
import horn from '../../assets/horn-icon.svg'

import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';

const SideMenu = ( {path,user} ) => {

    const navigate = useNavigate()

    const handleLogOut = () => {
        Cookies.remove("token")
        localStorage.removeItem("user_id")
        navigate('/')
    }

    const menuItems = [
        {key: 1 ,text : "Projects" , icon: project , path:"/projects"},
        {key: 2 ,text : "Tasks", icon: tasks, path:"/tasks"},
        {key: 3 ,text :  "Chat", icon: chat, path:"/chat"},
        {key: 4 ,text :  "Meet", icon: meet, path:"/meet"},
        {key: 5 ,text : "Profile" , icon: profile, path:"/profile"},
        {key: 6 ,text :  "Leave", icon: leave, path:"/leave"},
        {key: 7 ,text :  "Settings", icon: setting, path:"/setting"} ]

    const menuItems2 = [
        {key:1 ,text : "Members" , icon:members, path:"/admin/members"},
        {key:2 ,text : "Leave requests" , icon: horn, path:"/admin/leaveRequest"},
        {key:3 ,text : "Profile" , icon: profile, path:"/admin/profile"}, 
        {key: 4 ,text :  "Settings", icon: setting, path:"/admin/setting"}
    ]

    return ( 
        <aside className={styles.SideMenu}>
            <img className={styles.logo} src={logo} alt="logo"  />
            {user.role === 'leader' && <CreateButton text='create a new project' path='/newProject' />}
            {user.role === 'admin' && <CreateButton text='create a new user' path='/admin/newUser'/>}
            {user.role!=='admin' ? menuItems.map(item => <ListItem icon={item.icon} 
                text={item.text} 
                active={item.path === path} 
                key={item.key} 
                onClick={()=>navigate(item.path)} 
            /> ) : menuItems2.map(item => <ListItem icon={item.icon} 
                text={item.text} 
                active={item.path === path} 
                key={item.key} 
                onClick={()=>navigate(item.path)} 
            /> )  } 
            <button className={styles.logoutButton} onClick={handleLogOut}>
                <img className={styles.icone} src={logout} alt='icon2'/>
                <span className={styles.texte}>Logout</span>
            </button>
        </aside>
     );
}

export default SideMenu;

//           
//<SideMenuButton className={styles.CreateMenuButton} text={'Create new project'} icon={logo}/>