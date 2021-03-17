/* import styles from '../styles/Home.module.css' */
import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout'
import authContext from '../context/auth/authContext'

export default function Home() {

  // Extraer el Usuario autenticado del Storage
  const AuthContext = useContext(authContext);
  const { usuarioAutenticado } = AuthContext;


  useEffect(() => {
    usuarioAutenticado();
  }, [])

  return (
    <Layout>
      <h1>Home</h1>
    </Layout>
  )
}
