import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { DashboardLayout } from '../../components/dashboard-layout';
import { Box, Container } from '@mui/material';

import { UsuarioListResults } from '../../components/usuario/usuario-list-results';
import { UsuarioListToolbar } from '../../components/usuario/usuario-list-toolbar';
import { useState } from 'react';

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
    <DashboardLayout avatarLink={usuario.avatar_link} isAdmin={isAdmin}>
      <Head>
        <title>
          {`Usuarios | Orange Juice`}
        </title>
      </Head>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
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

    await axios.get('http://localhost:8080/auth/usuario', {headers:{
      "Authorization": `Bearer ${token}`
    }})
      .then(res => {
        console.log(usuario)
        usuario = res.data
      })
      .catch(error => {
        console.log("Error -> ", error)
      })

    await axios.get(`http://localhost:8080/usuario/buscar?id_usuario=${usuario.id_usuario}`)
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
      await axios.get(`http://localhost:8080/usuario/listar`)
      .then(res => {
        usuarios = res.data
      })

      await axios.get(`http://localhost:8080/cargo/listar`)
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
