import React from 'react'
import styles from './spinner.module.css'
const Spinner = () => {
  return (
    <div className={styles.spinnerConainter}>
        <div className={styles.spinner}></div>
    </div>
  )
}

export default Spinner
