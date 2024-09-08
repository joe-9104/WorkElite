import styles from './leave.module.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Submit from '../submitButton/submitButton';
import Modal from '../modal/Modal'
import Error from '../Error/Error'



const LeavePage = ({token}) => {
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate()

  const id = localStorage.getItem('user_id')
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error,setError] = useState(null)
  const [isOpen,setIsOpen] = useState(false)

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const allowedFileTypes = ['application/pdf', 'image/png', 'image/jpeg'];

    if (file && allowedFileTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      alert('Invalid file type. Please select a PDF, PNG, or JPG file.');
    }
  };
  const isFormValid = () => {
    return leaveType && startDate && endDate && reason ;
    
  };
  
   
    const handleSubmit =async (e) => {
      e.preventDefault();

      if(new Date(endDate) < new Date(startDate)){
        setError('Invalid End Date')
        setIsOpen(true)
        return;
      }
      if (!isFormValid()) {
        setError('All fields must be filled')
        setIsOpen(true)
        return;
      }
    
      const form = {
        type: leaveType,
        startDate: startDate,
        endDate: endDate,
        reason: reason,
        concernedUser:userId,
        //file: selectedFile
      };

    
      try {
        const response = await fetch('http://localhost:4000/api/leave/createleave', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form)
        });
    
        if (!response.ok) {
          setError('Submission unsuccessful. Please try again.')
          setIsOpen(true)
        } else {
          const data = await response.json();
          console.log('Form submitted successfully:', data);
          setError('Submission successful')
          setIsOpen(true)
          // Redirect or perform other actions upon successful submission
        }
      } catch (error) {
        setError('Failed to connect to the api')
        setIsOpen(true)
        // Handle error accordingly
      }
    };
    
  

  return (
    
    <div className={styles.form}>
        <h1>Leave Application Form</h1>
        <h3>Please provide information about your leave</h3>
        <form>
            <label htmlFor="leaveType" className={styles.label}>Leave Type:</label>
            <select
              className={styles.input}
              id="leaveType"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value="">Choose leave type...</option>
              <option value="sick leave">Sick Leave</option>
              <option value="annual">Annual Leave</option>
              <option value="normal">Normal Leave</option>
            </select>

          
          
            <label htmlFor="startDate" className={styles.label}>Start Date:</label>
            <input
              className={styles.input}
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          
            <label htmlFor="endDate" className={styles.label}>End Date:</label>
            <input
              className={styles.input}
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
        
            <label htmlFor="reason"  className={styles.label}>Reason:</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
        
            <div className={styles.container}>
              <input
                type="file"
                id="fileInput"
                accept=".pdf,.png,.jpg"
                onChange={handleFileInputChange}
                style={{ display: 'none' }} // Hide the default file input
              
              />
              <label htmlFor="fileInput" className={styles.customButton}>
                Upload
              </label>
              <div
                  className={styles.placeholder}
                  contentEditable={false}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  {selectedFile ? selectedFile.name : 'Attach Pdf, Png, Jpg files:'}
              </div>
          </div>
         
        </form>
        <Submit handleSubmit={handleSubmit} className={styles.buttn} center={true}></Submit>
        <Modal title='warning' open={isOpen} onClose={() => {setIsOpen(false) ; navigate(0)}}>
          <Error text={error}></Error>
        </Modal>
    </div>
   
  );
};

export default LeavePage;
