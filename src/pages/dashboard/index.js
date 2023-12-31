import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import Vendors from '../../components/vendors/vendors'
import AddVendor from '../../components/vendors/add'
import {  useEffect, useState } from 'react';
import styles from './dashboard.module.css';

function Dashboard({ user }) {
  const [flag, setFlag] = useState(true); 
  const [userData, setUserData] = useState({})
  const handleLogout = () => {
    signOut();
  };

  useEffect(()=>{
    const fetchData = async () => {
      const data = await getUserData(user);
      setUserData(data);
    };
  
    fetchData();
  }, [flag])

  const vendors = userData?.vendors || []

  return (
    <div className={styles.dashboard}>
      <h1>Welcome to the Dashboard</h1>
      <img className={styles.profileImage} src={userData.image} alt="Profile" />
      <p className={styles.userInfo}>Name: {userData?.name}</p>
      <p className={styles.userInfo}>Email: {userData?.email}</p>
      <button className={styles.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
      <AddVendor email={userData?.email} setFlag={setFlag} />
      <Vendors vendors={vendors} email={userData?.email} setFlag={setFlag} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {user: session.user},
  };
}

async function getUserData(user) {
  const requestBody = {
    ...user
  };
  
  try {
    const response = await axios.post(`/api/user`, requestBody);
    const userData = response.data;
    return userData; 
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export default Dashboard;
