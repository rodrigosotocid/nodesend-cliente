// Son las acciones que disparan lo que tenemos en el reducer
import React, { useReducer } from 'react'
import authContext from './authContext'
import authReducer from './authReducer'
import clienteAxios from '../../config/axios'
import tokenAuth from '../../config/tokenAuth'

import {
  REGISTRO_EXITOSO,
  REGISTRO_ERROR,
  LIMPIAR_ALERTA,
  LOGIN_EXITOSO,
  LOGIN_ERROR,
  USUARIO_AUTENTICADO,
  CERRAR_SESION
} from '../../types'

const AuthState = ({ children }) => {

  // Difinir un STATE inicial
  const initialState = {
    token: typeof window !== 'undefined' ? localStorage.getItem('ns_token') : '',
    autenticado: null,
    usuario: null,
    mensaje: null
  }

  // Definir el Reducer (el dispatch se comunica con el reducer por medio de los types)
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Registrar nuevos usuarios
  const registrarUsuario = async datos => {

    try {
      const respuesta = await clienteAxios.post('/api/usuarios', datos);

      dispatch({
        type: REGISTRO_EXITOSO,
        payload: respuesta.data.msg
      })

    } catch (error) {

      dispatch({
        type: REGISTRO_ERROR,
        payload: error.response.data.msg
      })
    }

    // Limpia la alerta después de 3 segundos
    setTimeout(() => {
      dispatch({
        type: LIMPIAR_ALERTA
      })
    }, 3000);
  }

  // Autenticar Usuarios
  const iniciarSesion = async datos => {
    console.log(datos);

    try {
      const respuesta = await clienteAxios.post('/api/auth', datos);

      dispatch({
        type: LOGIN_EXITOSO,
        payload: respuesta.data.token
      })
    } catch (error) {

      dispatch({
        type: LOGIN_ERROR,
        payload: error.response.data.msg
      })
    }

    setTimeout(() => {
      dispatch({
        type: LIMPIAR_ALERTA
      })
    }, 3000);
  }

  // Retorne el Usuario autenticado en base al JWT
  const usuarioAutenticado = async () => {
    const token = localStorage.getItem('ns_token');
    if (token) {
      tokenAuth(token);
    }

    try {
      const resultado = await clienteAxios.get('/api/auth');
      dispatch({
        type: USUARIO_AUTENTICADO,
        payload: resultado.data.usuario
      })
    } catch (error) {
      dispatch({
        type: LOGIN_ERROR,
        payload: error.response.data.msg
      })
    }
    setTimeout(() => {
      dispatch({
        type: LIMPIAR_ALERTA
      })
    }, 3000);
  }

  // Cerrar la sesión
  const cerrarSesion = () => {
    console.log('Cerrando sesión');
    dispatch({
      type: CERRAR_SESION
    })
  }

  return (
    <authContext.Provider
      value={{
        token: state.token,
        autenticado: state.autenticado,
        usuario: state.usuario,
        mensaje: state.mensaje,
        cerrarSesion,
        iniciarSesion,
        registrarUsuario,
        usuarioAutenticado
      }}
    >
      { children}
    </authContext.Provider>
  )
}

export default AuthState;