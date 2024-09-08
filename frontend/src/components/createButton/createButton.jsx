import styles from './createButton.module.css'
import icon from '../../assets/plus-icon.svg'
import { useNavigate } from 'react-router-dom';

const CreateButton = ({text , path}) => {

    const navigate = useNavigate()

    return ( 
        <button className={styles.create}
        onClick={() => {
            navigate(path)
        }}>
            <figure className={styles.iconContainer}>
                <img className={styles.icon} src={icon}alt='taswira'></img>
            </figure>
            <span className={styles.text}>{text}</span>
        </button>
     );
}
 
export default CreateButton;
