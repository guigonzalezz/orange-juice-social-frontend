import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

import { DashboardLayout } from '../../components/dashboard-layout';
import { UsuarioContext } from '../../contexts/UsuarioContext';



const Perfil = (props) => {
  const { logout } = useContext(AuthContext)
  const { setUser } = useContext(UsuarioContext)
  const {
    usuario,
    noticias,
    blogs,
    eventos
  } = props
  const isAdmin = usuario.cargo == 'admin'//exibe opcoes do menu diferente

  useEffect(()=>{
    setUser(usuario)
  },[])

  const logoutUser = async  () => {
    await logout();
  }

  return (
    <DashboardLayout avatarLink={usuario.avatar_link}>
      <Head>
        <title>
          {`Perfil | ${usuario.perfil.nome}`}
        </title>
      </Head>

    </DashboardLayout>
  )
}

//Pega o token e valida se esta valido para acessar a tela, apos isso, busca informacoes
//do usuario, se nao for admin, noa deixa entrar na tela.
//Isso sera feito nas telas que nao tem acesso para aquele usuario
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['nextauth.token']: token } = parseCookies(ctx)
  let usuario = {
    id_usuario: 0
  }

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
  else{
    await axios.get('http://localhost:8080/auth/usuario', {headers:{
      "Authorization": `Bearer ${token}`
    }})
      .then(res => {
        usuario = res.data
      })

    await axios.get(`http://localhost:8080/usuario/buscar?id_usuario=${usuario.id_usuario}`)
      .then(res => {
        usuario = res.data
      })

  }

  return {
    props: {
      usuario
    }
  }
}

export default Perfil
