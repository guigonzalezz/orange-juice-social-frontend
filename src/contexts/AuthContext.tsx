import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import Router from 'next/router'

import axios from "axios";


type SignInData = {
  email: string;
  senha: string;
}

type AuthContextType = {
  isAuthenticated: boolean;
  user: Object;
  signIn: (data: SignInData) => Promise<void>;
  logout: () => Promise<void>;
}

const recoverUserInformation = async () => {
  const { 'nextauth.token': token } = parseCookies()
  axios.defaults.headers['Authorization'] = `Bearer ${token}`;
  return {
    user: await axios.get('http://localhost:8080/auth/usuario')
  }
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }) {
  const [user, setUser] = useState<Object>({})

  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies()
    if (token) {
      recoverUserInformation().then(response => {
        setUser(response.user)
      })
    }
  }, [])

  async function signIn({ email, senha }: SignInData) {
    let token = undefined;
    let message = undefined;
    await axios.post('http://localhost:8080/auth/login',{ email, senha })
    .then(async res => {
      token = res.data;
    })
    .catch(({ response }) => {
      message = response.data
    })

    if(token) {
      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 1, // 1 hour
      })

      axios.defaults.headers['Authorization'] = `Bearer ${token}`;

      recoverUserInformation().then(response => {
        setUser(response.user)
      })

      Router.push('/home');
    }
    else if(message) {
      return message
    }
  }

  async function logout() {
    destroyCookie({ res: undefined }, 'nextauth.token')
    Router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
