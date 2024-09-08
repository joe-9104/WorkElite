import noitfbell from '../../assets/notificationbell.svg'
import styles from './notifButton.module.css'

const NotifButton = () => {
    return ( 
        <div className={styles.Main}>
            <img className={styles.Photo} src={noitfbell} alt='profil'/>
        </div>
     );
}

export default NotifButton;