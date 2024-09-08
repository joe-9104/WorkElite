import styles from './error.module.css'
import icon from '../../assets/error-close-icon.svg'

const Error = ({text}) => {
    return ( <div className={styles.container}>
        <span className={styles.errorText}> {text} </span>
        <img alt='error' className={styles.icon} src={icon} ></img>
    </div> );
}
 
export default Error;