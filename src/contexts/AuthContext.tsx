import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import Router from 'next/router'

import { recoverUserInformation, signInRequest } from "../services/auth";
import { api } from "../services/api";


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
    const { token, message } = await signInRequest({
      email,
      senha,
    })
    if(token) {
      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 1, // 1 hour
      })
  
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
  
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
    destroyCookie({}, 'nextauth.token')
    Router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  )
}