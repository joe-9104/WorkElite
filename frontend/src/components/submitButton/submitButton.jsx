import styles from './submitButton.module.css'

const STYLES = {
    margin : '0px auto'
}
const Submit = ({handleSubmit,center}) => {
    return ( <div className={styles.submitbutton} onClick={handleSubmit} style={ center ? STYLES : null}>Submit</div> );
}
 
export default Submit;