
import InputField from '../../components/inputField/inputField'
import DropDownList from '../../components/dropDownList/DropDownList'; 
import LoadingModal from '../../components/loadingModal/LoadingModal'
import emailIcon from '../../assets/email-icon.svg';
import userIcon from '../../assets/user-icon.svg';
import pwdIcon from '../../assets/password-icon.svg'
import styles from './profilePage.module.css';
import { useEffect, useState  } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import useConnect from '../../hooks/useConnect';


const ProfilePage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState("");

    const Navigate = useNavigate();

    /*const {data:user,isPending,error} = useFetch(`http://localhost:4000/api/auth/users/${userId}`);*/
    const [user,isPending,error] = useConnect()
    if (error){
        throw new Error(error);
    }
    //fill the inputs with users data after fetching them
    useEffect(()=>{
        if(!isPending && user){
            const userData = user
            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
            setEmail(userData.email || "");
        }
        
    },[user,isPending])
    const handleProfilePictureChange = (e) => {
        /*  This function handles the change event of a file input field and updates
            the profilePicture state with the selected file's data URL
        */
        const file = e.target.files[0];
        const reader = new FileReader(); // The FileReader object is used to read the file as a data URL, which is then set as the new profile picture
        reader.onloadend = () => {
            setProfilePicture(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const saveChangesHandler = async () => {
        try {
            const userId = localStorage.getItem('user_id');
    
            if (!userId) {
                throw new Error('User ID is not found . Please log in again');
            }
            if (newPassword!== confirmNewPassword){
                throw new Error('New password does not match . Please check your password again');
            }
            const token = Cookies.get('token');
            if (!token){
                throw new Error('You are not logged in . Please log in again');
            }
            const updatedUserData = {
                firstName: firstName !== ''? firstName:user.firstName,
                lastName: lastName !== '' ? lastName:user.lastName,
                email: email !== '' ? email : user.email,
            };
            if (newPassword) {
                updatedUserData.currentPassword = currentPassword;
                updatedUserData.password = newPassword;
            }
            const url = `http://localhost:4000/api/auth/users/${userId}`;
            const response = await fetch(url,{
                method : 'PUT',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body : JSON.stringify(updatedUserData),
            });
    
            if (!response.ok) {
                //handle all different server errors based on scenarios status
                if(response.status === 400){
                    throw new Error('Invalid request . Please check your informations again');
                }else if (response.status === 401){
                    throw new Error('You are not authorized');
                }else if (response.status === 404){
                    throw new Error('User not found');
                }else{
                    throw new Error('An expected error occured');
                }
            }
            // Redirect the user after saving changes
            Cookies.remove('token');
            Navigate('/');
        } catch (error) {
            // Log and handle the error
            alert(error.message);
            
        }
    };
   
    return (
    
        <div className={styles.profilePageContainer}>
            <LoadingModal open={isPending}></LoadingModal>
            <div className={styles.profilePictureContainer}>
                {/* Display profile picture fl mosta9bel */}
                {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className={styles.profilePicture} />
                ) : (
                    <div className={styles.defaultProfilePicture}>Default Pic</div>
                )}
                {/* Input field to upload profile picture ya men 7ye */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className={styles.profilePictureInput}
                />
            </div>
            <div className={styles.inputRow}>
                <div className={styles.inputContainer}>
                    <span className={styles.label}>FIRST NAME</span>
                    <InputField 
                        icon={userIcon} 
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <span className={styles.label}>LAST NAME</span>
                    <InputField 
                        icon={userIcon} 
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.inputRow}> 
                <div className={styles.inputContainer}>
                    <span className={styles.label}>EMAIL</span>
                    <InputField 
                        icon={emailIcon} 
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={styles.inputContainer}>
                    &nbsp;
                </div>
            </div>
            <div className={styles.inputContainer}>
                <span className={styles.label}>GENDER</span>
                <DropDownList 
                    options={[{ value: 'male', label: 'Male' },{ value: 'female', label: 'Female' }]} 
                    placeholder='Select your gender'
                />
            </div>
            <hr style={{width:'90%',margin:'30px'}}/>
            <div className={styles.inputRow}>
                <div className={styles.inputContainer} >
                    <span className={styles.label}>CURRENT PASSWORD</span>
                    <InputField 
                        icon={pwdIcon} 
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        
                    />
                </div>
                <div className={styles.inputContainer}>
                    &nbsp;
                </div>
            </div>    
            
            <div className={styles.inputRow}>
                <div className={styles.inputContainer}>
                    <span className={styles.label}>NEW PASSWORD</span>
                    <InputField 
                        icon={pwdIcon} 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <span className={styles.label}>CONFIRM NEW PASSWORD</span>
                    <InputField 
                        icon={pwdIcon} 
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                </div>
            </div>
            <button className={styles.saveChanges} onClick={saveChangesHandler}>
                SAVE CHAGNES
            </button><br/>
            <span className={styles.label}>You will be asked to log in again with your new password after you save your changes</span>    
        </div>
    );
}

export default ProfilePage;
