// Son las acciones que disparan lo que tenemos en el reducer
import React, { useReducer } from 'react'
import authContext from './authContext'
import authReducer from './authReducer'
import clienteAxios from '../../config/axios'

import {
  REGISTRO_EXITOSO,
  REGISTRO_ERROR,
  LIMPIAR_ALERTA
} from '../../types'

const AuthState = ({ children }) => {

  // Difinir un STATE inicial
  const initialState = {
    token: '',
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

  // Usuario autenticado
  const usuarioAutenticado = nombre => {
    dispatch({
      type: USUARIO_AUTENTICADO,
      payload: nombre
    })
  }

  return (
    <authContext.Provider
      value={{
        token: state.token,
        autenticado: state.autenticado,
        usuario: state.usuario,
        mensaje: state.mensaje,
        registrarUsuario,
        usuarioAutenticado
      }}
    >
      { children}
    </authContext.Provider>
  )
}

export default AuthState;