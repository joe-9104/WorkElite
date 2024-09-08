import styles from './projectHeader.module.css'
import dropDown from '../../assets/arrow-drop-down-icon.svg'
import NewTask from '../newTaskButton/newTask';
import { useState } from 'react';
import {format} from 'date-fns'
import useFetch from '../../hooks/useFetch';
import UserTag from '../userTag/userTag';


const Header = ({project}) => {

    const [showDetails,setShowDetails]=useState(false)

    //get user from session storage
    const user = JSON.parse(sessionStorage.getItem("user"))

    const {data : users , isPending,error} = useFetch("http://localhost:4000/api/projects/projusers/"+project?._id)

    return ( <>
        
        {!showDetails && <div className={styles.container}>
            <span className={styles.text1}>{"Projects/"+project?.name}</span>
            <div className={styles.flex1}>
                <div className={styles.flex2}>
                    <span className={styles.text2}>{project?.name}</span>
                    <button className={styles.dropDown} onClick={() => {setShowDetails(true)}}>
                        <img src={dropDown} className={styles.icon} alt='icon' />
                    </button>
                </div>
                { user.role==="leader" && <NewTask project={project}/>}
            </div>
        </div> }
        
        {showDetails && <div className={`${styles.container} ${styles.containerDetails}`}>
            <span className={styles.text1}>{"Projects/"+project?.name}</span>
            <div className={styles.flex1}>
                <div className={styles.flex2}>
                    <span className={styles.text2}>{project?.name}</span>
                    <button className={styles.dropDown} onClick={() => {setShowDetails(false)}}>
                        <img src={dropDown} className={`${styles.icon} ${styles.iconFlipped}`}  alt='icon' />
                    </button>
                </div>
                { user.role==="leader" && <NewTask project={project}/>}
            </div>
            <div className={styles.flex3}>
                <span className={styles.text1}> { "Status : " + project?.status}</span>
                <span className={styles.text1}> Due Date :  {format(new Date(project?.dueDate), 'dd/MM/yyyy')}</span>
                <span className={styles.text1}> Assigned to : </span>
                <div className={styles.users}>{users.map(user => <UserTag user={user}></UserTag>)}</div>
            </div>
        </div> }
        
        </>);
}
 
export default Header;