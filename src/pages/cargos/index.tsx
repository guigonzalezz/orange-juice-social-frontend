import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { DashboardLayout } from '../../components/dashboard-layout';
import { Box, Container } from '@mui/material';

import { CargoListResults } from '../../components/tabela/cargo-list-results';
import { CargoListToolbar } from '../../components/tabela/cargo-list-toolbar';
import { useState } from 'react';
import { theme } from '../../styles/theme';

const Cargos = ({ usuario, cargos }) => {
  const [filtroNome, setFiltroNome] = useState('')
  const [idsCargosSelecionados, setIdsCargosSelecionados] = useState([]);
  const [cargosTable, setCargosTable] = useState(cargos)

  const variaveis = {
    cargos,
    cargosTable,
    filtroNome,
    idsCargosSelecionados
  }

  const funcoes = {
    setCargosTable,
    setIdsCargosSelecionados,
    setFiltroNome
  }

  return (
    <DashboardLayout
      avatarLink={usuario.avatar_link}
      isAdmin={usuario.cargo == 'admin'}
      usuarioLogadoEmail={usuario.perfil.email_empresarial}
    >
      <Head>
        <title>
          {`Cargos | Orange Juice`}
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
          <CargoListToolbar
            variaveis={variaveis}
            funcoes={funcoes}
          />
          <Box sx={{ mt: 3 }}>
            <CargoListResults
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
      await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/cargo/listar_todos`)
      .then(res => {
        cargos = res.data
      })
    }
  }

  return {
    props: {
      usuario,
      cargos
    }
  }
}

export default Cargos
