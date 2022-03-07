import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { DashboardLayout } from '../../components/dashboard-layout';

const Usuarios = (props) => {
  const { usuario } = props
  const isAdmin = usuario.cargo == 'admin'
  return (
    <DashboardLayout avatarLink={usuario.avatar_link} isAdmin={isAdmin}>
      <Head>
        <title>
          {`Usuarios | Orange Juice`}
        </title>
      </Head>

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

    if(usuario.cargo != 'admin'){
      return {
        redirect: {
          destination: '/home',
          permanent: false,
        }
      }
    }
  }

  return {
    props: {
      usuario
    }
  }
}

export default Usuarios
