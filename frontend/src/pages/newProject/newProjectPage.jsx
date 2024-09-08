import React from "react";
import NewProjectForm from "../../components/newProjectForm/newProjectForm";
import Cookies from "js-cookie";

const NewProjectPage = () => {
    const token = Cookies.get("token")
    return ( 
        <NewProjectForm token={token}/>
     );
}
 
export default NewProjectPage;