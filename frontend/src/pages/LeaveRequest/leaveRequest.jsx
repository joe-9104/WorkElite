import styles from './leaveRequest.module.css'

import { CompactTable } from '@table-library/react-table-library/compact';
import { BeatLoader } from "react-spinners";
import ProgressBar from '@ramonak/react-progress-bar';
import LoadingModal from '../../components/loadingModal/LoadingModal';
import Modal from '../../components/modal/Modal';
import fromIcon from '../../assets/form-icon.svg'

import { useTheme } from '@table-library/react-table-library/theme';
import { DEFAULT_OPTIONS, getTheme } from '@table-library/react-table-library/material-ui';
import React, { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { format } from 'date-fns';
import Cookies from 'js-cookie';

const LeaveRequest = () => {
  const token = Cookies.get("token");
  
  const [isOpen , setIsOpen] = useState(false)
  const[selectedLeave,setSelectedLeave]=useState(null)
  const handleclick=(item)=>{
      setIsOpen(true); 
      setSelectedLeave(item)
      }

      


      const handleAccept=async ()=>{
        try{
          const response=await fetch(`http://localhost:4000/api/leave/leaves/${selectedLeave._id}`,
            {
              method:"PUT",
              body: JSON.stringify({status:'confirmed'}),
              headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
              },
              credentials: 'include'
            }
          )

          if (! response.ok)
          {
            console.log("status update is unsuccessful");
            
          }
          else{
            console.log("status updated successfully");
          }
        }catch(error){
          console.log(error);
        }
      }
      const handleRefuse=async()=>{
        try{
        const response=await fetch(`http://localhost:4000/api/leave/leaves/${selectedLeave._id}`,
            {
              method:"PUT",
              body: JSON.stringify({status:'declined'}),
              headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
              },
              credentials: 'include'
            }
          )

          if (! response.ok)
          {
            console.log("status update is unsuccessful");
            
          }
          else{
            console.log("status updated successfully");
          }
        }catch(error){
          console.log(error);
        }
      }

  

  const { data: nodes, isPending, error } = useFetch('http://localhost:4000/api/leave/leaves/');
  let data
  if(nodes){
    
    data={nodes}
  
  }
 
  const materialTheme = getTheme(DEFAULT_OPTIONS);
  const theme = useTheme([materialTheme , {
    Table: `
      --data-table-library_grid-template-columns:  20% 32% 10% 30% 8%;
    `,
}]);

  const columns = [
    { label: 'Name', renderCell: (leave) => `${leave.concernedUser.firstName} ${leave.concernedUser.lastName}` },
    { label: 'Email', renderCell: (leave) => leave.concernedUser.email },
    {label: 'Request Date' , renderCell: (leave)=>format(new Date(leave.createdAt), 'dd/MM/yyyy') },
    {label :'leave Count' , renderCell :(leave => <ProgressBar 
        completed={leave.concernedUser.leaveCount.toString()} 
        maxCompleted="90"
        bgColor='#08639c'
        ></ProgressBar>)},
    {label : 'details' , renderCell : leave => <button title='show details' className={styles.buttn} onClick={()=>{handleclick(leave)}}>
      <img className={styles.icon} alt='details' src={fromIcon}></img>
    </button>}
    
  ];

  return (
    <div className={styles.container}>
      {data && <CompactTable columns={columns} data={data} theme={theme} layout={{ fixedHeader: true , custom :true}}/>}
      {isPending && <BeatLoader color="#08639c"></BeatLoader>}
      
      <LoadingModal open={data === null} />

      <Modal open={isOpen} >
        { selectedLeave && 
      <div className={styles.modal}>
        
          <h2>Leave Application Form</h2>
          <form className={styles.form}>
            <label className={styles.label}>
              User Name:
              <input
                type="text"
                value={selectedLeave?.concernedUser.firstName}
                disabled={true}
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              Leave Type:
              <input
                type="text"
                value={selectedLeave?.type}
                disabled={true}
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              Start Date:   </label>
              <span className={styles.span}>{format(new Date (selectedLeave?.startDate),'dd/MM/yyyy')}</span>
              
          
            <label className={styles.label}>
              End Date:  </label>
              <span className={styles.span}>{format(new Date (selectedLeave?.endDate),'dd/MM/yyyy')}</span>
           
            <label className={styles.label}>
              Reason:   </label>
              <textarea className={styles.textarea} value={selectedLeave?.reason} disabled={true} />
           
        </form>
        <div className={styles.buttns}>
            <button onClick={handleAccept} className={styles.buttn1} >Accept Request</button>
            <button onClick={handleRefuse} className={styles.buttn2} >Refuse Request</button>
        </div>
        
        </div>
         }
      </Modal>
    </div>
  );
};

export default LeaveRequest;