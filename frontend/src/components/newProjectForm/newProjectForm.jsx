//importing libraries and components
import React, { useState } from 'react';
import styles from './newProjectForm.module.css'
import useFetch from '../../hooks/useFetch';
import Select from 'react-select';
import InputField from '../inputField/inputField';
//importing icons
import titleIcon from '../../assets/title-icon.svg'
import whiteDateIcon from '../../assets/date-icon-white.svg'
import Submit from '../submitButton/submitButton';
import { useNavigate } from 'react-router';
import Modal from '../modal/Modal';
import Error from '../Error/Error';



const NewProjectForm = ({token}) => {
    
    //initializing navigate
    const navigate = useNavigate();

    //send form to db
    const [form, setForm] = useState({
        name: '',
        description: '',
        startDate: '',
        dueDate: '',
        team: [],
        manager: localStorage.getItem("user_id"),
    })
    const [err,setErr] = useState(null)
    const [isOpen , setIsOpen] = useState(false)

    const vadidateForm = () => {
        return form.name && form.startDate && form.dueDate && form.team
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!vadidateForm){
            setErr('All fields must be filled in')
            setIsOpen(true)
            return null;
        }else{
            try {
                const response = await fetch('http://localhost:4000/api/projects',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                });
                const data = await response.json();
                if(!response.ok){
                    setErr('Registration unsuccessful!please try again')
                    setIsOpen(true)
                }
                if(response.ok){
                    console.log("project added" , data)
                    navigate('/')
                }
            } catch (error) {
                setErr(error);
                setIsOpen(true)
            }
        }
        
    }

    const handleSelectChange = (selectedOption) => {
        setForm({...form, team: selectedOption.map(option => option.value)});
    }

    //fetch users from db
    const {data: users, isPending, error} = useFetch('http://localhost:4000/api/auth/users')

    //store users in an array
    const members = users?.filter(user => user.role === 'member')
    const userlist = members? members?.map(user => (
       {value:user, label: `${user.firstName} ${user.lastName}`}
    )) : [];
    /*console.log all users fetched from db
    console.log(users)*/

    //custom style for <Select/> component
    const customStyles = {
        control: (provided) => ({
            ...provided,
            marginTop: '5%',
            cursor: 'pointer',
            width : '90%'
        }),
    }
    
    //project form
    return (
        <div className={styles.maindiv}>
            <h2 className={styles.divhead}>New Project</h2>
            <form className={styles.middlediv}>
                <div className={styles.submiddlediv}>
                    <div className={styles.projectinfo}>
                        <label className={styles.inputtitle}>Title</label>
                        <InputField
                            className={styles.entree}
                            type='text'
                            placeholder='Title...'
                            required
                            icon = {titleIcon}
                            value={form.name}
                            onChange={(e) => {setForm({...form, name: e.target.value})}}
                        />
                        
                        <label className={styles.inputtitle}>Description</label>
                        <textarea className={styles.grandentree} 
                            placeholder="Description..." 
                            value={form.description}
                            onChange={(e) => {setForm({...form, description: e.target.value})}}/>

                        <label className={styles.inputtitle}>Start Date</label>
                        <InputField
                            className={styles.entree}
                            type='date'
                            placeholder={Date.now}
                            required
                            icon = {whiteDateIcon}
                            value={form.startDate}
                            onChange={(e) => {setForm({...form, startDate: e.target.value})}}
                        />
                        <label className={styles.inputtitle}>Due Date</label>
                        <InputField
                            className={styles.entree}
                            type='date'
                            placeholder={Date.now.toString}
                            required
                            icon = {whiteDateIcon}
                            value={form.dueDate}
                            onChange={(e) => {setForm({...form, dueDate: e.target.value})}}
                        />                    
                    </div>
                    <div className={styles.divider}></div>
                    <div className={styles.projectcollaborators}>
                        <div className={styles.subsubdiv}>
                            <label styles={{
                                 marginTop: '15px',
                                 alignSelf: 'flex-start',
                                 fontSize: '30px',
                            }}>Project collaborators</label>
                            {error && <div>{error}, please try again later!</div>}
                            {users && <Select
                                options={userlist}
                                placeholder='Select collaborators...'
                                isMulti
                                styles={customStyles}
                                onChange={handleSelectChange}
                            />} 
                        </div>  
                        <Submit handleSubmit={e => {handleSubmit(e)}}></Submit> 
                    </div>
                </div>
            </form>
            <Modal title="error" open={isOpen} onClose={() => {
                setIsOpen(false);setErr(null)
            }}>
                <Error text={err}></Error>
            </Modal>
         </div>
        
     );
}
 
export default NewProjectForm;
