import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import Router from 'next/router'

import axios from "axios";

type Usuario = {
  id_usuario: number;
  ativo_SN: string;
  colaborador_SN: string;
  stamp_created: string;
  cargo: string;
  pontos: number;
  social: any;
  perfil: any;
  feedback: null;
  avatar_link: string;
  banner_link: string;
}

type UsuarioContextType = {
  user: Usuario;
  setUser: (obj: Object) => void;
}

const recoverUserInformation = async () => {
  const { 'nextauth.token': token } = parseCookies()
  axios.defaults.headers['Authorization'] = `Bearer ${token}`;
  return {
    user: await axios.get('http://localhost:8080/auth/usuario')
  }
}

export const UsuarioContext = createContext({} as UsuarioContextType)

export function UsuarioProvider({ children }) {
  const [user, setUser] = useState<Usuario>()

  return (
    <UsuarioContext.Provider value={{ user, setUser }}>
      {children}
    </UsuarioContext.Provider>
  )
}
