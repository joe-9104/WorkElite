//import components
import NavBar from "../navBar/navBar";
import SideMenu from "../sideMenu/sideMenu"
import Modal from "../modal/Modal";
//import styles
import styles from './layout.module.css'
//import custom hook
import useConnect from "../../hooks/useConnect";
import { useNavigate } from "react-router-dom";



  const Layout = ({children ,title ,path}) => {
    const navigate = useNavigate()
    //provide user for the components 
    const [user,isPending,error] = useConnect()

    return ( 
        <div className={styles.layout}>
            <SideMenu path={path} user={user}></SideMenu>
            <div className={styles.content}>
                <NavBar title={title} user={user} isLoading={isPending} error={error}></NavBar>
                {(!isPending && !error) && <div>{children} </div>}
            </div>
            <Modal open={error !== null} title="Authentification error" onClose={() => window.location.reload()}>
                <div className={styles.errorDiv}>
                    <span className={styles.error}>{error}</span>
                    <button className={styles.login} onClick={() => navigate('/')}>Go to login</button>
                </div>
            </Modal>
        </div>
     );
  }
   
  export default Layout;