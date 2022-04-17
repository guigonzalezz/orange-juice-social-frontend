import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { DashboardLayout } from '../../components/dashboard-layout';
import { Box, Container } from '@mui/material';

import { UsuarioListResults } from '../../components/tabela/usuario-list-results';
import { UsuarioListToolbar } from '../../components/tabela/usuario-list-toolbar';
import { useState } from 'react';
import { theme } from '../../styles/theme';

const Usuarios = ({ usuario, usuarios, cargos }) => {
  const isAdmin = usuario.cargo == 'admin'
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
      usuarioLogadoEmail={usuario.perfil.email_empresarial}
      avatarLink={usuario.avatar_link}
      isAdmin={isAdmin}
    >
      <Head>
        <title>
          {`Usuarios | Orange Juice`}
        </title>
      </Head>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          ml: -10,
          [theme.breakpoints.down(1200)]: { ml: 0 }
        }}
      >
        <Container maxWidth={false}>
          <UsuarioListToolbar
            variaveis={variaveis}
            funcoes={funcoes}
          />
          <Box sx={{ mt: 3 }}>
            <UsuarioListResults
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
  let usuarios = []
  let cargos = []
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

    if(usuario.cargo != 'admin'){
      return {
        redirect: {
          destination: '/home',
          permanent: false,
        }
      }
    } else {
      await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/listar`)
      .then(res => {
        usuarios = res.data
      })

      await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/cargo/listar`)
      .then(res => {
        cargos = res.data
      })
    }
  }

  return {
    props: {
      usuario,
      usuarios,
      cargos
    }
  }
}

export default Usuarios
