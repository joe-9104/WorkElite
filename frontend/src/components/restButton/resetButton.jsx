import styles from './resetButton.module.css'

const Reset = ({handleSubmit}) => {
    return ( <div className={styles.submitbutton} onClick={handleSubmit}>Reset</div> );
}
export default Reset;