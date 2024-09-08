import React from 'react'
import ReactDom from 'react-dom'
import styles from './Modal.module.css'
import closeIcon from '../../assets/close-circle-icon.svg'

export default function Modal({ open, children, onClose,title }) {
  if (!open) return null

  return ReactDom.createPortal(
    <>
      <div className={styles.overlay}/>
      <div className={styles.modal} >
        <div className={styles.head}>
            <span>{title}</span>
            <button onClick={onClose} className={styles.closeButtn}>
                <img alt='close' src={closeIcon} className={styles.icon} />
            </button>
        </div>
        
        {children}
      </div>
    </>,
    document.getElementById('portal')
  )
}
