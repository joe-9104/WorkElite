import React from 'react';
import useFetch from '../../hooks/useFetch';
import Project from '../../components/project/project';
import styles from './dashboardPage.module.css'
import LoadingModal from '../../components/loadingModal/LoadingModal';

const ProjectPage = ({ token}) => {
  const userId = localStorage.getItem("user_id")
  const { data: projects, isPending, error } = useFetch(`http://localhost:4000/api/projects/myprojects/${userId}`, token);

  return (
    <div className={styles.allProjects}>
      {error && <div>{error}</div>}
      {projects && projects.map(project => (
        <Project data={project} key={project._id}/>
      ))}
      <LoadingModal open={isPending}></LoadingModal>
    </div>
  );
}

export default ProjectPage;
