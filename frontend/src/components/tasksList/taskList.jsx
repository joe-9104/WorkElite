import { useState } from 'react';
import TaskCard from '../taskCard/taskCard';
import ListHeader from '../taskListHeader/taskListHeader';
import styles from './tasksList.module.css'

const TaskList = ( {title,type,tasks} ) => {

    const [toggleTasks,setToggleTasks] = useState(true)

    const hideTasks = () => {
        if(toggleTasks){
            setToggleTasks(false)
        }else{
            setToggleTasks(true)
        }
    }

    return ( 
        <div className={styles.container}>
            <ListHeader title={title} handleClick={hideTasks} />
            {toggleTasks && <div className={styles.list}>
                {tasks.filter((task) => task.status === type).map(task => (<TaskCard task={task} key={task._id}/>))}
            </div>}  
        </div>
     );
}
 
export default TaskList

/*<TaskCard task={{title : "create the front en design ",dueDate:"22/10/2024" ,priority : "low"}} />
                <TaskCard task={{title : "create the front en design ",dueDate:"22/10/2024" ,priority : "high"}} />
                <TaskCard task={{title : "create the front en design ",dueDate:"22/10/2024" ,priority : "medium"}} />*/