import React, { useReducer } from 'react'
import appContext from './appContext'
import appReducer from './appReducer'
import clienteAxios from '../../config/axios'
import {
  MOSTRAR_ALERTA,
  LIMPIAR_ALERTA,
  SUBIR_ARCHIVO,
  SUBIR_ARCHIVO_EXITO,
  SUBIR_ARCHIVO_ERROR,
  CREAR_ENLACE_EXITO,
  CREAR_ENLACE_ERROR
} from '../../types'


const AppState = ({ children }) => {

  const initialState = {
    mensaje_archivo: '',
    nombre: '',
    nombre_original: '',
    cargando: null,
    descargas: 1,
    password: '',
    autor: null,
    url: ''
  }

  // Crear dispatch y state
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Muestra una alerta
  const mostrarAlerta = msg => {

    dispatch({
      type: MOSTRAR_ALERTA,
      payload: msg
    })
    setTimeout(() => {
      dispatch({
        type: LIMPIAR_ALERTA,
        payload: null
      })
    }, 3000);
  }

  // Sube archivos al Servidor (?)
  const subirArchivo = async (formData, nombreArchivo) => {

    dispatch({
      type: SUBIR_ARCHIVO
    })

    try {
      const resultado = await clienteAxios.post('/api/archivos', formData);
      console.log(resultado.data);

      dispatch({
        type: SUBIR_ARCHIVO_EXITO,
        payload: {
          nombre: resultado.data.archivo,
          nombre_original: nombreArchivo
        }
      })

    } catch (error) {

      dispatch({
        type: SUBIR_ARCHIVO_ERROR,
        payload: error.response.data.msg
      })
    }
  }

  // Crea enlace una vez que se subió el archivo
  const crearEnlace = async () => {
    const data = {
      nombre: state.nombre,
      nombre_original: state.nombre_original,
      descargas: state.descargas,
      password: state.password,
      autor: state.autor
    }

    try {
      const respuesta = await clienteAxios.post('/api/enlaces', data);
      console.log(respuesta.data.msg);

      dispatch({
        type: CREAR_ENLACE_EXITO,
        payload: respuesta.data.msg
      })
    } catch (error) {
      dispatch({
        type: CREAR_ENLACE_ERROR,
        payload: error.response.data.msg
      })
    }
  }

  return (
    <appContext.Provider
      value={{
        mensaje_archivo: state.mensaje_archivo,
        nombre: state.nombre,
        nombre_original: state.nombre_original,
        cargando: state.cargando,
        descargas: state.descargas,
        password: state.password,
        autor: state.autor,
        url: state.url,
        mostrarAlerta,
        subirArchivo,
        crearEnlace
      }}
    >
      { children}
    </appContext.Provider>
  )
}

export default AppState;