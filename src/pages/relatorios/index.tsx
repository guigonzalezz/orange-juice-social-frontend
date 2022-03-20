import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Box, Typography } from '@mui/material';

import { DashboardLayout } from '../../components/dashboard-layout';



const Relatorios = (props) => {
  const { logout } = useContext(AuthContext)
  const {
    usuario,
    noticias,
    blogs,
    eventos
  } = props

  return (
    <DashboardLayout
      avatarLink={usuario.avatar_link}
      isAdmin={usuario.cargo == 'admin'}
      usuarioLogadoEmail={usuario.perfil.email_empresarial}
    >
      <Head>
        <title>
          {`Relatorios | Orange Juice`}
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
          Em construção...
        </Typography>
      </Box>

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
    await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/auth/usuario`, {headers:{
      "Authorization": `Bearer ${token}`
    }})
      .then(res => {
        usuario = res.data
      })

    await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/buscar?id_usuario=${usuario.id_usuario}`)
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

export default Relatorios
