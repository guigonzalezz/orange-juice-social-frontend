import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

import { DashboardLayout } from '../../components/dashboard-layout'
import { Box,Typography } from '@mui/material'



const Perfil = ({ usuarioLogado, usuarioTerceiro, meuPerfil }) => {

  return (
    <DashboardLayout
      avatarLink={usuarioLogado.avatar_link}
      isAdmin={usuarioLogado.cargo == 'admin'}
    >
      <Head>
        <title>
          {`Perfil | ${usuarioLogado.perfil.nome}`}
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center',
          flexDirection: 'column'
        }}
      >
        <Typography>
          Perfil do usuario: {usuarioTerceiro.perfil.nome}
        </Typography>
        <Typography>
          Usuario logado eh o do perfil ? {meuPerfil ? 'Sim' : 'Nao'}
        </Typography>
      </Box>

    </DashboardLayout>
  )
}

//Pega o token e valida se esta valido para acessar a tela, apos isso, busca informacoes
//do usuario, se nao for admin, noa deixa entrar na tela.
//Isso sera feito nas telas que nao tem acesso para aquele usuario
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { params } = ctx

  const { ['nextauth.token']: token } = parseCookies(ctx)
  let usuarioLogado = { id_usuario: 0 }
  let usuarioTerceiro = { id_usuario: 0 }
  let meuPerfil = false

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
  else{
    await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/auth/usuario`, {headers:{
      "Authorization": `Bearer ${token}`
    }})
      .then(res => {
        usuarioLogado = res.data
      })

    await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/buscar?id_usuario=${usuarioLogado.id_usuario}`)
      .then(res => {
        usuarioLogado = res.data
      })

    await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/buscar_por_email?email_empresarial=${params.usuario}`)
      .then(res => {
        usuarioTerceiro = res.data
      })
    meuPerfil = usuarioLogado.id_usuario == usuarioTerceiro.id_usuario ? true : false
  }

  return {
    props: {
      usuarioLogado,
      usuarioTerceiro,
      meuPerfil
    }
  }
}

export default Perfil

