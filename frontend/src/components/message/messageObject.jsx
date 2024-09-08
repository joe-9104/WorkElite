import React, { useEffect, useState } from 'react'
import styles from './messageObject.module.css'
import useConnect from '../../hooks/useConnect';

const MessageObject = ({message}) => {
  const formattedTime = new Date(message.sentAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12 : true,

  });
  
  if(message.sender === 'self' ){
    return (

      <div className={styles.selfMessage}>
        <div className={styles.sender}>{message.who}</div>
        <div className={styles.senderIdentity}>{message.sender}</div>
        <div className={styles.messageContent}>{message.content}</div>
        <div className={styles.sendAt}>{formattedTime}</div>
      </div>
    )
  }else{
    return (
      
      <div className={styles.otherMessage}>
        <div className={styles.sender}>{message.who}</div>
        <div className={styles.senderIdentity}>{message.sender}</div>
        <div className={styles.messageContent}>{message.content}</div>
        <div className={styles.sendAt}>{formattedTime}</div>
      </div>
    )
  }
}

export default MessageObject
