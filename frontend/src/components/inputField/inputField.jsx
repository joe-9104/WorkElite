import styles from './input.module.css'
//import icon from '../../assets/email-icon.svg'
import PropTypes from 'prop-types'



const InputField = (props) => {
    return ( 
        <div className={styles.container}>
            {props.required && <input 
                className={styles.input} 
                type={props.type} 
                placeholder={props.placeholder} 
                onChange={props.onChange} 
                value={props.value}
                required
            />}
            {!props.required && <input 
                className={styles.input} 
                type={props.type} 
                placeholder={props.placeholder} 
                onChange={props.onChange} 
                value={props.value}
            />}
            <div className={styles.iconContainer}>
                <img className={styles.image} src={props.icon} alt='icon'></img>
            </div>
        </div>
     );
}
InputField.propTypes= {
    type: PropTypes.string,
    placeholder : PropTypes.string,
    onChange : PropTypes.func,
    value : PropTypes.string,
    required : PropTypes.bool
};
 
export default InputField;

