import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { DashboardLayout } from '../../components/dashboard-layout';
import { Box, Typography } from '@mui/material';

import { useState } from 'react';

const Quizzes = ({ usuario, usuarios, cargos }) => {
  const [filtroNome, setFiltroNome] = useState('')
  const [idsUsuariosSelecionados, setIdsUsuariosSelecionados] = useState([]);
  const [usuariosTable, setUsuariosTable] = useState(usuarios)

  const variaveis = {
    usuarios,
    cargos,
    usuariosTable,
    filtroNome,
    idsUsuariosSelecionados
  }

  const funcoes = {
    setUsuariosTable,
    setIdsUsuariosSelecionados,
    setFiltroNome
  }

  return (
    <DashboardLayout
      avatarLink={usuario.avatar_link}
      isAdmin={false}
      usuarioLogadoEmail={usuario.perfil.email_empresarial}
    >
      <Head>
        <title>
          {`Desafios | Orange Juice`}
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['nextauth.token']: token } = parseCookies(ctx)
  let usuario = {
    id_usuario: 0,
    cargo: ''
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
      .catch(error => {
        console.log("Error -> ", error)
      })

    await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/buscar?id_usuario=${usuario.id_usuario}`)
      .then(res => {
        usuario = res.data
      })

  }

  return {
    props: {
      usuario,
    }
  }
}

export default Quizzes
