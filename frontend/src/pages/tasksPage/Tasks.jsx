import Header from "../../components/projectHeader/projectHeader";
import TaskList from "../../components/tasksList/taskList";
import LoadingModal from '../../components/loadingModal/LoadingModal'
import styles from './tasks.module.css'
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


const Tasks = () => {
    const navigate = useNavigate()
    const project = JSON.parse(sessionStorage.getItem("project"))    
    // Check if project is null or undefined
    useEffect(() => {
        // Check if project is null or undefined
        if (!project) {
            // Redirect to the home page)
            navigate('/')
        }
    }, [project,navigate]); // Run this effect whenever project changes

    const {data : tasks , isPending, error} = useFetch('http://localhost:4000/api/task/projtasks/'+project?._id)

    return ( 
        <div className={styles.taskpage}>
            <Header project={project}/>
            {error && <div>error fetching tasks</div>}
            {tasks && <div className={styles.taskContainer}> 
                <TaskList title="Todo" type="pending" tasks={tasks}/>
                <TaskList title="In Progress" type="in-progress" tasks={tasks}/>
                <TaskList title="Completed" type="completed" tasks={tasks}/>
                <TaskList title="Overdue" type="overdue" tasks={tasks}/>
            </div>}
            <LoadingModal open={isPending}/>
        </div>
     );
}
 
export default Tasks;