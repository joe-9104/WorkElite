import styles from './taskCard.module.css'
import icon from '../../assets/up-arrow-icon.svg'
import {format} from 'date-fns';
import { useState } from 'react';
import Modal from '../modal/Modal'
import TaskDetails from '../taskDetails/taskDetails';

const TaskCard = ({task}) => {

    const [isOpen,setIsOpen] = useState(false)


    const handleClick = () => {
        setIsOpen(true)
    }

    return ( 
        <>
            {task.priority === "low" && <div className={`${styles.container} ${styles.low}`}>
                <button className={styles.expand} onClick={handleClick}>
                    <img className={styles.icon} src={icon} alt='icon'></img>
                </button>
                <span className={styles.text1}>{task.title}</span>
                <span className={styles.text2}>Due date: {format(new Date(task.dueDate), 'dd/MM/yyyy')}</span>
            </div>}

            {task.priority === "medium" && <div className={`${styles.container} ${styles.medium}`}>
                <button className={styles.expand} onClick={handleClick}>
                    <img className={styles.icon} src={icon} alt='icon'></img>
                </button>
                <span className={styles.text1}>{task.title}</span>
                <span className={styles.text2}>Due date: {format(new Date(task.dueDate), 'dd/MM/yyyy')}</span>
            </div>}
            {task.priority === "high" && <div className={`${styles.container} ${styles.high}`}>
                <button className={styles.expand} onClick={handleClick}>
                    <img className={styles.icon} src={icon} alt='icon' ></img>
                </button>
                <span className={styles.text1}>{task.title}</span>
                <span className={styles.text2}>Due date: {format(new Date(task.dueDate), 'dd/MM/yyyy')}</span>
            </div>}

            {!task.priority && <div className={styles.container}>
                <button className={styles.expand} onClick={handleClick}>
                    <img className={styles.icon} src={icon} alt='icon' ></img>
                </button>
                <span className={styles.text1}>{task.title}</span>
                <span className={styles.text2}>Due date: {format(new Date(task.dueDate), 'dd/MM/yyyy')}</span>
            </div>}

            <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Details">
                <TaskDetails task={task} onDelete={() => setIsOpen(false)} onUpdate={() => setIsOpen(false)}/>
            </Modal>
    </>);
}
 
export default TaskCard;