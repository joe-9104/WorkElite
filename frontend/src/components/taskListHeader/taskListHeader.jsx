import styles from './taskListHeader.module.css'
import plusIcon from '../../assets/plus-icon.svg'

const ListHeader = ({title,handleClick}) => {
    return ( 
        <div className={styles.container}>
            <span>{title}</span>
            <button className={styles.plus} onClick={handleClick}>
                <img className={styles.icon} src={plusIcon} alt='icon'></img>
            </button>
        </div>
     );
}
 
export default ListHeader;