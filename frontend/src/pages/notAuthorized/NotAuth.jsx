import React from 'react';
import styles from "./errorPage.module.css";
import { Link } from 'react-router-dom'; 

export default function NotAuthorized() {

  let path = '/projects'
  

  return (
    <div className={styles.notFound}>
        <h1>401 Not Authorizated</h1>
        <p>Oops! You don't have the privileges to access to this page!</p>
        <Link to={path} className={styles.homeLink}>Go to Homepage</Link>
    </div>
  );
}