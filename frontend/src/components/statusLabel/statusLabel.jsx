import styles from './statusLabel.module.css'


const Status = ({status}) => {
   if(status === 'high'){
    return(<div className={`${styles.container} ${styles.high}`}>{status}</div>);
   }
   if(status === 'medium'){
    return(<div className={`${styles.container} ${styles.medium}`}>{status}</div>);
   }
   if(status === 'low' || status==='completed'){
    return(<div className={`${styles.container} ${styles.low}`}>{status}</div>);
   }
   if(status === 'in-progress'){
    return(<div className={`${styles.container} ${styles.inProgress}`}>{status}</div>);
   }
   if(status === 'pending'){
      return(<div className={`${styles.container} ${styles.pending}`}>{status}</div>);
     }
}
 
export default Status;