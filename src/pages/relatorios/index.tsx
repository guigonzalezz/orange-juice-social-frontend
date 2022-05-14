import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Box, Typography } from '@mui/material';

import { DashboardLayout } from '../../components/dashboard-layout';
import { Report } from '../../components/shared/Report';
import { theme } from '../../styles/theme';

const relatorios = [
  {
    nome: 'Listagem Usuários',
    descricao: "Este relatório nos mostra todos os usuários ativos.",
    tipo: 'usuarios_ativos'
  },
  {
    nome: 'Ranqueamento Usuários',
    descricao: "Este relatório nos mostra o ranqueamento de todos os usuários.",
    tipo: 'ranqueamento_usuarios'
  },
  {
    nome: 'Notas desafios dos Usuários',
    descricao: "Este relatório nos mostra os desafios e as respectivas notas dos usuários.",
    tipo: 'notas_desafios_usuarios'
  },
  {
    nome: 'Cursos concluidos e suas quantidades',
    descricao: "Este relatório nos mostra os cursos e a quantidade concluida.",
    tipo: 'qtd_conclusao_cursos'
  },
  {
    nome: 'Quizzes concluidos e suas quantidadees',
    descricao: "Este relatório nos mostra os quizzes e a quantidade concluida.",
    tipo: 'qtd_conclusao_quizzes'
  },
  {
    nome: 'Desafios concluidos e suas quantidades',
    descricao: "Este relatório nos mostra os desafios e a quantidade concluida.",
    tipo: 'qtd_conclusao_desafios'
  },
];


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

      {relatorios.length > 0 ?
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
            Relatórios
          </Typography>
          {
            relatorios.map((report,key) =>
              <Report
                key={key}
                nome={report.nome}
                descricao={report.descricao}
                tipo={report.tipo}
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
            justifyContent: 'center'
          }}>
            <Typography sx={{ color: '#454B50', fontSize: 24}}>Nenhum relatorio disponivel...</Typography>
          </Box>
      }

    </DashboardLayout>
  )
}

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
