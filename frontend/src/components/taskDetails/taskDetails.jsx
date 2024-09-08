import styles from './taskDetails.module.css';
//import icons
import priorityIcon from '../../assets/tags-icon.svg'
import statusIcon from '../../assets/check-mark-circle-icon.svg'
import dateIcon from '../../assets/date-icon.svg'
import userIcon from '../../assets/user-icon-black.svg'
import deleteIcon from '../../assets/delete-icon.svg'
import modifyIcon from '../../assets/edit-icon.svg'
import title from '../../assets/title-icon.svg'
import date from '../../assets/date-icon-white.svg'
import complete from '../../assets/done-all-alt-round-icon.svg'
import inProgress from '../../assets/in-progress-icon.svg'
//import necessities
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import React,{ useState } from 'react';
import { format } from 'date-fns'
import useFetch from '../../hooks/useFetch';
//import compoenents
import InputField from '../inputField/inputField'
import Status from '../statusLabel/statusLabel';
import Select from 'react-select';
import Submit from '../submitButton/submitButton';
import Reset from '../restButton/resetButton'
import UserTag from '../userTag/userTag';
import { BeatLoader } from 'react-spinners';

const TaskDetails = ({task,onDelete,onUpdate}) => {

    const token = Cookies.get("token")
    const navigate = useNavigate()
    const [edit,setEdit] = useState(false)
    const [newTask,setNewTask]=useState({
        description : task.description,
        title :task.title,
        status : task.status,
        priority : task.priority,
        assignedTo : task.assignedTo,
        dueDate : task.dueDate
    })

    //get user from session storage
    const user = JSON.parse(sessionStorage.getItem("user"))

    const handleDelete = () => {
        fetch("http://localhost:4000/api/task/tasks/"+task._id,
            {   method : "DELETE" ,
                headers : {
                    Authorization: `Bearer ${token}`,
                }
            }
        ).then( result => {
            if (result){
                onDelete()
                navigate(0)
            }
        }).catch(error => {
            console.log(error)
        })
    }

    //get project
    const project = JSON.parse(sessionStorage.getItem("project"))

    const handleUpdate = () => {

        // Verify wether the task's dueDate is posterior to the project's dueDate
        if (new Date(newTask.dueDate) > new Date(project.dueDate)) {
            alert("Choose a date before the project's due date");
            return;
        }

        fetch("http://localhost:4000/api/task/tasks/"+task._id,
            {  method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newTask)
            }
        ).then( result => {
            if (result){
               console.log('task updated')
               onUpdate()
               navigate(0)
            }
        }).catch(error => {
            console.log(error)
        })
    }

    const handleUpdateStatus = (status) => {
        fetch("http://localhost:4000/api/task/tasks/"+task._id,
            {  method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status : status})
            }
        ).then( result => {
            if (result){
               console.log('task updated')
               onUpdate()
               navigate(0)
            }
        }).catch(error => {
            console.log(error)
        })
    }


    const handleSelectChange = (selectedOption) => {
        setNewTask({...newTask, assignedTo: selectedOption.map(option => option.value._id)});
    }
    
    //fetch users from db
    const {data: users, isPending, error} = useFetch('http://localhost:4000/api/projects/projusers/'+task.project)

    //store users in an array
    const userlist = users? users.map(user => (
       {value:user, label: `${user.firstName} ${user.lastName}`}
    )) : [];
    //get the assigned to users 
    const {data: assignedTo, isPending2, error2} = useFetch('http://localhost:4000/api/auth/taskusers/'+task._id)
    //store them in an array
    const defaultUsers = assignedTo? assignedTo.map(user => (
        {value:user, label: `${user.firstName} ${user.lastName}`}
     )) : [];

    //custom style for <Select/> component
    const customStyles = {
        control: (provided) => ({
            ...provided,
            maxWidth: '270px',
            cursor: 'pointer',
        }),
    }

    return (<>
    
        {!edit && <div className={styles.container}>
            <div className={styles.flex}>
                <span className={styles.title}>{task.title}</span>
                {user.role==="leader" && <button className={styles.bttn} title='Edit Task'>
                    <img alt='modify' src={modifyIcon} className={styles.icon} onClick={() => setEdit(true)}/>
                </button>}
                {user.role==="leader" && <button className={styles.bttn}>
                    <img alt='delete' src={deleteIcon} className={styles.icon} onClick={handleDelete} title='Delete Task'/>
                </button>}
                {user.role==="member" && assignedTo && assignedTo.find(u => u._id === user._id) && <button className={styles.bttn}>
                    <img alt='complete' src={complete} className={styles.icon} onClick={() => {handleUpdateStatus('completed')}} title='mark as complete'/>
                </button>}
                {user.role==="member" && assignedTo && assignedTo.find(u => u._id === user._id) && <button className={styles.bttn}>
                    <img alt='in progress' src={inProgress} className={styles.icon} onClick={() => {handleUpdateStatus('in-progress')}} title='mark as in progress'/>
                </button>}
            </div>
            <div className={styles.flex}>
                <img alt='icon' className={styles.icon} src={priorityIcon} />
                <span className={styles.text}>priority</span>
                <Status status={task.priority}/>
            </div>
            <div className={styles.flex}>
                <img alt='icon' className={styles.icon} src={statusIcon} />
                <span className={styles.text}>status</span>
                <Status status={task.status}/>
            </div>
            <div className={styles.flex}>
                <img alt='icon' className={styles.icon} src={dateIcon} />
                <span className={styles.text}>Due date : </span><span>{format(new Date(task.dueDate), 'dd/MM/yyyy')}</span>
            </div>
            <div className={styles.flex}>
                <img alt='icon' className={styles.icon} src={userIcon} />
                <span className={styles.text}>assigned to : </span>
                {isPending && <BeatLoader color="#08639C" />}
                {assignedTo && <div className={styles.assignedTo}>
                    {assignedTo?.map(user => <UserTag user={user}/>)}
                </div>}
            </div>
            <div className={styles.flex2}>
                <span className={styles.title}>Description</span>
                <span>{task.description}</span>
            </div>
        </div>}
        {edit && <div className={styles.editContainer}>
            <form className={styles.editForm}>
                <label className={styles.label}>Title</label>
                <InputField
                    icon={title}
                    value={newTask.title}
                    onChange={(e) => {setNewTask({...newTask , title : e.target.value})}}
                />
                <label className={styles.label}>Title</label>
                <InputField
                    
                    type='date'
                    required
                    value={newTask.dueDate}
                    onChange={(e) => {setNewTask({...newTask , dueDate : e.target.value})}}
                    icon={date} 
                />
                <label className={styles.label}>Description</label>
                <textarea 
                    className={styles.textArea} 
                    value={newTask.description}
                    onChange={(e) => {setNewTask({...newTask , description : e.target.value})}}
                ></textarea>
                <label className={styles.label}>Status</label>
                <select name="status" 
                    value={newTask.status} 
                    onChange={(e) => {setNewTask({...newTask , status : e.target.value})}}
                    className={styles.select}
                >
                    <option value='in-progress'>In Progress</option>
                    <option value='completed'>Completed</option>
                    <option value='pending'>Pending</option>
                </select>
                <label className={styles.label}>Priority</label>
                <select name="priority" 
                    value={newTask.priority}
                    onChange={(e) => {setNewTask({...newTask , priority : e.target.value})}}
                    className={styles.select}
                >
                    <option value='high'>High</option>
                    <option value='medium'>Medium</option>
                    <option value='low'>Low</option>
                </select>
                <label className={styles.label}>Assigned to</label>
                {(error || error2) && <div>{error}, please try again later!</div>}
                {isPending && isPending2 && <BeatLoader color="#08639C" />}
                {users && defaultUsers  && <Select
                            defaultValue={defaultUsers}
                            options={userlist}
                            placeholder='Select collaborators...'
                            isMulti
                            styles={customStyles}
                            onChange={handleSelectChange}
                />} 
                <div className={styles.formButtns}>
                    <Reset handleSubmit={(e) => {
                        e.preventDefault()
                        setNewTask({description : task.description,
                            title :task.title,
                            status : task.status,
                            priority : task.priority,
                            assignedTo : task.assignedTo,
                            dueDate : task.dueDate})
                    }}></Reset>
                    <Submit handleSubmit={(e) => {
                        e.preventDefault()
                        let arr = newTask.assignedTo
                        let arr2 = arr.filter((item,
                            index) => arr.indexOf(item) === index)
                        setNewTask({...newTask, assignedTo: arr2})
                        console.log(newTask)
                        handleUpdate()
                    }}></Submit>  
                </div>
            </form>
        </div>}
    </> );
}
 
export default TaskDetails;