import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import React from 'react';
import { Box, Typography } from '@mui/material';

import { DashboardLayout } from '../../components/dashboard-layout';
import { Trilha } from '../../components/shared/Trilha';
import { theme } from '../../styles/theme';

const similarCustomSA = {
  width: 600,
  padding: '3em',
  color: '#fff',
  background: '#343434',
  backdrop: `
    #00000066
    left top
    no-repeat
  `,
  confirmButtonColor: '#F96400',
  confirmButtonText: 'Continuar'
}

const Trilhas = (props) => {
  const {
    usuario,
    trilhas
  } = props

  const [expanded, setExpanded] = React.useState<string | false>(false);

  return (
    <DashboardLayout
      avatarLink={usuario.avatar_link}
      isAdmin={false}
      usuarioLogadoEmail={usuario.perfil.email_empresarial}
    >
      <Head>
        <title>
          {`Trilhas | Orange Juice`}
        </title>
      </Head>

      {trilhas.length > 0 ?
        <Box
          component="div"
          sx={{
            backgroundColor: 'transparent',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: 2,
            mt: 2,
            ml: -10,
            [theme.breakpoints.down(1200)]: { ml: 0 }
          }}
        >
          <Typography
            sx={{ m: 1 }}
            variant="h4"
          >
            Trilhas
          </Typography>
          {
            trilhas.map((trilha, key) =>
              <Trilha
                key={key}
                idUsuario={usuario.id_usuario}
                trilha={trilha}
                setExpanded={setExpanded}
                expanded={expanded}
                similarCustomSA={similarCustomSA}
              />
            )
          }

        </Box>
        :
          <Box sx={{
            width: '100%',
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ml: -10,
            [theme.breakpoints.down(1200)]: { ml: 0 }
          }}>
            <Typography sx={{ color: '#454B50', fontSize: 24}}>Nenhuma trilha disponivel no momento...</Typography>
          </Box>
      }

    </DashboardLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['nextauth.token']: token } = parseCookies(ctx)
  let usuario = {
    id_usuario: 0,
    cargo: ''
  }
  let trilhas = []
  let trilhas_usuario = []
  let cursos_usuario = []

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

    await Promise.all([
      await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/buscar?id_usuario=${usuario.id_usuario}`)
        .then(res => {
          usuario = res.data
        }),
      await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/contentful/entries/trilhas?cargo=${usuario.cargo}`)
        .then(res => {
          trilhas = res.data
        }),
      await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/trilhas?id_usuario=${usuario.id_usuario}`)
        .then(res => {
          trilhas_usuario = res.data
        }),
      await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/cursos?id_usuario=${usuario.id_usuario}`)
        .then(res => {
          cursos_usuario = res.data
        })
    ]).then(()=>{
      trilhas = trilhas.map(trilha=>{
        const acheiTrilha = trilhas_usuario.find(elemTrilha => elemTrilha.trilha_nome == trilha.titulo)
        return {
          ...trilha,
          cursos: trilha.cursos.map(curso => {
            const acheiCurso = cursos_usuario.find(elemCurso => elemCurso.curso_nome == curso.titulo)
            return {
              ...curso,
              concluido_SN: acheiCurso ? acheiCurso.concluido_SN : 'N',
              anotacao: acheiCurso ? acheiCurso.anotacao : ''
            }
          }),
          concluido_SN: acheiTrilha ? acheiTrilha.concluido_SN : 'N',
          anotacao: acheiTrilha ? acheiTrilha.anotacao : ''
        }
      })
    })

  }

  return {
    props: {
      usuario,
      trilhas
    }
  }
}

export default Trilhas
