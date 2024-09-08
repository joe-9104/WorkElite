import styles from './register.module.css' //import the css module 
//import images 
import logo from '../../assets/logo.png'
import image from '../../assets/loginPageImage.jpg'
//import components
import OrDivider from '../../components/orDivider/orDivider'
import RegisterForm from '../../components/registerForm/registerForm'

import {useNavigate} from 'react-router-dom'


const RegisterPage = () => {
    const navigator = useNavigate()
    return (  
        <>
            <div className={styles.container}>
                <div className={styles.formContainer}> 
                    <img className={styles.logo} src={logo} alt="logo"  />
                    <h3>Create a new account</h3>
                    <RegisterForm/>
                    <OrDivider></OrDivider>
                    <button 
                        className={styles.signInButton}
                        onClick={()=>navigator('/login')}
                    >Sign In</button>
                </div>
                <figure>
                    <img className={styles.image} src={image} alt="zina"/>
                </figure>
            </div>
        </>
    );
}
 
export default RegisterPage;