//import necessities
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import Select from 'react-select';
//import styles
import styles from './project.module.css';
import styles1 from '../newProjectForm/newProjectForm.module.css'
//import date format ('format' library to adjust the wierd date format in mongodb)
import {format} from 'date-fns';
//import custom hook & components
import useFetch from '../../hooks/useFetch';
import InputField from '../inputField/inputField';
import { BeatLoader } from 'react-spinners';
import Submit from '../submitButton/submitButton';
//import icons
import deleteIcon from '../../assets/delete-icon.svg'
import editIcon from '../../assets/edit-icon.svg'
import Modal from '../modal/Modal'
import titleIcon from '../../assets/title-icon.svg'
import whiteDateIcon from '../../assets/date-icon-white.svg'



const Project = ({ data }) => {

    //initializing useNavigate
    const navigate = useNavigate()

    //importing token
    const token = Cookies.get("token")

    //getting user from session storage
    const user = JSON.parse(sessionStorage.getItem("user"))

    //DELETE PROJECT
    const [isOpen1,  setIsOpen1] = useState(false)
    const [isOpen2,  setIsOpen2] = useState(false)

    const handleDelete = () => {
        fetch("http://localhost:4000/api/projects/"+data._id,
            {   method : "DELETE" ,
                headers : {
                    Authorization: `Bearer ${token}`,
                }
            }
        ).then( result => {
            console.log(result.json())
            if (result){
                navigate(0)
            }
        }).catch(error => {
            console.log(error)
        })
    }
    
    //UPDATE PROJECT
    //fetch users from db: all users & users assigned to the project
    const {data: users, isPending, error} = useFetch('http://localhost:4000/api/auth/users', token)
    const {data: projusers} = useFetch('http://localhost:4000/api/projects/projusers/'+data._id)
    
    //store users in arrays : userlist for all users & projuserlist for users assigned to a project
    const members = users?.filter(user => user.role === 'member')
    const userlist = members? members?.map(user => (
       {value:user, label: `${user.firstName} ${user.lastName}`}
    )) : [];

     const projuserlist = projusers? projusers.map(projuser => (
         {value:projuser, label: `${projuser?.firstName} ${projuser?.lastName}`}
     )): []; 

    //update form to db:
    //  initializing useState() hook for the whole form
    const [form, setForm] = useState({
        name: '',
        description: '',
        startDate: '',
        dueDate: '',
        team: [],
        manager: localStorage.getItem("user_id"),
    })

    //  function to handle the selected changes on project collaborators
    const handleSelectChange = (selectedOption) => {
        const selectedValues = selectedOption.map((option) => option.value._id);
        setForm((prevForm) => ({
          ...prevForm,
          team: selectedValues,
        }));
      };
      
      //  initializing useEffect() hook to change the default values when opening the form into those of the project
      useEffect(() => {
        if (!isPending && users) {
          setForm((prevForm) => ({
            ...prevForm,
            name: prevForm.name || data.name,
            description: prevForm.description || data.description,
            startDate: prevForm.startDate || formatDate(data.startDate),
            dueDate: prevForm.dueDate || formatDate(data.dueDate),
          }));
        }
      }, [data, isPending, users]);
      
      //  function to format the date value
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'yyyy-MM-dd');
      };

      //  function to fetch the changes to backend
      const updateHandler = async (e) => {
        e.preventDefault();
        console.log('Token: ', token)
        try {
            const response = await fetch(`http://localhost:4000/api/projects/${data._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            const datas = await response.json();
            if(!response.ok){
                alert('Update unsuccessful! Please try again')
            }
            if(response.ok){
                console.log("Project updated" , datas)
                navigate(0)
                setIsOpen1(false)
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    //custom style for <Select/> component
    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: '200px',
            maxWidth: '270px',
            marginTop: '5%',
            cursor: 'pointer',
        }),
    }

    return (
        <>
        <div className={styles.Project}>
            <div className={styles.ProjectHeader}>
                <h2 className={styles.Name}>{data.name}</h2>
                {user.role==="leader" && <button 
                    className={styles.button} 
                    title='edit Project'
                    onClick={() => setIsOpen1(true)}>
                        <img className={styles.icon} src={editIcon} alt='icon'></img>
                </button>}
                {user.role==="leader" && <button 
                    className={styles.button} 
                    title='Delete Project'
                    onClick={() => setIsOpen2(true)}><img className={styles.icon} src={deleteIcon} alt='icon'></img>
                </button>}
            </div>
            <div className={styles.ProjectSeparator}></div>
            <div className={styles.ProjetInfo} 
                onClick={() => {
                    sessionStorage.setItem("project",JSON.stringify(data))
                    navigate('/tasks');
                    console.log(data);}}>
                <p className={styles.Details}>{data.description}</p>
                <p className={styles.Details}>Start date: {format(new Date(data.startDate), 'dd/MM/yyyy')}</p>
                <p className={styles.Details}>Due date: {format(new Date(data.dueDate), 'dd/MM/yyyy')}</p>
            </div>
        </div>
        <Modal className={styles.deletemodal} open={isOpen2} onClose={() => setIsOpen2(false)} title='Delete project'>
                <div className={styles.msg}>Are you sure you want to delete the project ?</div>
                <div className={styles.buttons}>
                    <button className={styles.deletebutton} onClick={handleDelete}>Delete</button>
                    <button className={styles.cancelbutton} onClick={() => setIsOpen2(false)}>Cancel</button>
                </div>
        </Modal>
        <Modal open={isOpen1} onClose={() => setIsOpen1(false)} title='Update project'>
        <div className={styles.updatemodal}>
            <form className={styles1.middlediv}>
                <div className={styles1.submiddlediv}>
                    <div className={styles1.projectinfo}>
                        <label className={styles1.inputtitle}>Title</label>
                        <InputField
                            className={styles1.entree}
                            required
                            icon = {titleIcon}
                            value={form.name}
                            onChange={(e) => {setForm({...form, name: e.target.value})}}
                        />
                        <label className={styles1.inputtitle}>Description</label>
                        <textarea className={styles1.grandentree} 
                            value={form.description}
                            onChange={(e) => {setForm({...form, description: e.target.value})}}/>

                        <label className={styles1.inputtitle}>Start Date</label>
                        <InputField
                            className={styles1.entree}
                            type='date'
                            required
                            icon = {whiteDateIcon}
                            value={form.startDate}
                            onChange={(e) => {setForm({...form, startDate: e.target.value})}}
                        />
                        <label className={styles1.inputtitle}>Due Date</label>
                        <InputField
                            className={styles1.entree}
                            type='date'
                            required
                            icon = {whiteDateIcon}
                            value={form.dueDate}
                            onChange={(e) => {setForm({...form, dueDate: e.target.value})}}
                        />                    
                    </div>
                    <div className={styles1.projectcollaborators}>
                        <label className={styles1.inputtitle}>Project collaborators</label>
                        {error && <div>{error}, please try again later!</div>}
                        {isPending && <BeatLoader color="#08639C" />}
                        {users && <Select
                            defaultValue={projuserlist}
                            options={userlist}
                            isMulti
                            styles={customStyles}
                            onChange={handleSelectChange}
                        />}   
                            
                    </div>
                </div>
                <Submit handleSubmit={e => {updateHandler(e)}}></Submit>
            </form>
        </div>
        
        </Modal>
        </>
    );
}

export default Project;

/* <p className={styles.Details}>Assigned tasks: {assignedTasks}</p> */