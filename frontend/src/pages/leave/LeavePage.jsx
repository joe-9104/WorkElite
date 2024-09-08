import LeaveForm from "../../components/LeaveForm/LeaveForm";
import Cookies from "js-cookie";

const  LeavePage = () => {
  const token = Cookies.get("token")
  return ( 
      <LeaveForm token={token}/>
   );
}

export default LeavePage;