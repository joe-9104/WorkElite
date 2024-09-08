import styles from './divider.module.css'

const OrDivider = () => {
    return ( 
        <div className={styles.dividerContainer}>
            <hr></hr>
            <span>OR</span>
            <hr></hr>
        </div>
     );
}
 
export default OrDivider;