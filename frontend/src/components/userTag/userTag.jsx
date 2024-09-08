import styles from './userTag.module.css'
import userIcon from '../../assets/user.png'

const UserTag = ({user}) => {
    return ( <div className={styles.container}>
        <img src={userIcon} alt='palceholder' className={styles.image}></img>
        <span className={styles.text}>{user.firstName+' '+user.lastName}</span>
    </div> );
}
 
export default UserTag;