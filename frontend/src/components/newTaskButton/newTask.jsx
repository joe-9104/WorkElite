import styles from './newTask.module.css'
import plusIcon from '../../assets/plus-icon.svg'
import { useState } from 'react';
import Modal from '../modal/Modal';
import TaskForm from '../newTaskForm/taskForm';

const NewTask = ({project}) => {

    const [isOpen,setIsOpen] = useState(false)

    return ( <>
        
        <button className={styles.bttn}
            onClick={() => {setIsOpen(true)}}
        >
            <img src={plusIcon} className={styles.icon} alt='icon'/>
            <span className={styles.text}>New Task</span>
        </button> 
        <Modal 
            open={isOpen}
            onClose={() => {setIsOpen(false)}}
            title="Add a new task"
            >
            <TaskForm project={project} onSubmit={() => {setIsOpen(false);}}/>
        </Modal>
    </>);
}
 
export default NewTask;