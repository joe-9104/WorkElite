import React from 'react'
import ReactDom from 'react-dom'
import styles from './Modal.module.css'
import { HashLoader } from 'react-spinners'


export default function LoadingModal({ open}) {
  if (!open) return null

  return ReactDom.createPortal(
    <>
      <div className={styles.overlay}/>
      <div className={styles.modal} >
            <HashLoader color='#08639C'/>
      </div>
    </>,
    document.getElementById('loading')
  )
}
