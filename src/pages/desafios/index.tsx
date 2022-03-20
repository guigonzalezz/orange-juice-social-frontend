import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { DashboardLayout } from '../../components/dashboard-layout';
import { Box, Container } from '@mui/material';

import { DesafioListResults } from '../../components/tabela/desafio-list-results';
import { DesafioListToolbar } from '../../components/tabela/desafio-list-toolbar';
import { useState } from 'react';

const Desafios = ({ usuario, desafios }) => {
  const [filtroNome, setFiltroNome] = useState('')
  const [desafiosTable, setDesafiosTable] = useState(desafios)

  const [handleAlteraDesafioInfo, setHandleAlteraDesafioInfo] = useState({});
  const [openEnviaFeedback, setOpenEnviaFeedback] = useState(false);
  const handleEnviaFeedbackOpen = () => { setOpenEnviaFeedback(true) }
  const handleEnviaFeedbackClose = () => { setOpenEnviaFeedback(false) }

  const variaveis = {
    desafios,
    desafiosTable,
    filtroNome,
    openEnviaFeedback,
    handleAlteraDesafioInfo
  }

  const funcoes = {
    setDesafiosTable,
    setFiltroNome,
    setHandleAlteraDesafioInfo,
    setOpenEnviaFeedback,
    handleEnviaFeedbackOpen,
    handleEnviaFeedbackClose,
  }

  return (
    <DashboardLayout
      avatarLink={usuario.avatar_link}
      isAdmin={usuario.cargo == 'admin'}
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
          py: 8
        }}
      >
        <Container maxWidth={false} >
          <DesafioListToolbar
            variaveis={variaveis}
            funcoes={funcoes}
          />
          <Box sx={{ mt: 3 }}>
            <DesafioListResults
              variaveis={variaveis}
              funcoes={funcoes}
            />
          </Box>
        </Container>
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
  let desafios = []
  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
  else {
    await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/auth/usuario`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
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

    if (usuario.cargo != 'admin') {
      return {
        redirect: {
          destination: '/home',
          permanent: false,
        }
      }
    } else {
      await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/desafios`)
        .then(res => {
          desafios = res.data
        })
    }
  }

  return {
    props: {
      usuario,
      desafios
    }
  }
}

export default Desafios
