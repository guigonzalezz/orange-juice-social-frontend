import {
  Box,
  Button,
  TextField,
  InputAdornment,
  SvgIcon, Typography
} from '@mui/material';
import { Add, Delete, ManageAccounts, Search } from '@mui/icons-material';
import Swal from 'sweetalert2'
import axios from 'axios';
import { useRouter } from 'next/router';
import ModalInsereUsuario from '../modal/modalInsereUsuario';
import { useState } from 'react';
import ModalAlteraUsuario from '../modal/modalAlteraUsuario';

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


export const UsuarioListToolbar = (props) => {
  const { idsUsuariosSelecionados, cargos } = props.variaveis
  const { setFiltroNome, setUsuariosTable } = props.funcoes
  const [openInsere, setOpenInsere] = useState(false);
  const [openAltera, setOpenAltera] = useState(false);

  const [handleAlteraUsuarioInfo, setHandleAlteraUsuarioInfo] = useState({});

  const router = useRouter()
  const forceReload = () => {
    router.reload()
  }


  const handleDeletarUsuario = async (ids) => {
    if(ids.length == 0) {
      Swal.fire({
        ...similarCustomSA,
        icon: 'error',
        title: 'Oops...',
        text: 'Selecione pelo menos um usuario!',
        confirmButtonText:'OK',
      })
    }
    else if(ids.length == 1) {
      Swal.fire({
        ...similarCustomSA,
        title: 'Deseja realmente deletar o usuario selecionado?',
        showDenyButton: true,
        confirmButtonText: 'Remover',
        denyButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/deletar?id_usuario=${ids[0]}`)
          .then(async res => {
            Swal.fire({
              ...similarCustomSA,
              icon: 'success',
              title: 'Usuario deletado com sucesso',
              showConfirmButton: false,
              timer: 1500
            })
            await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/listar`)
            .then(res => {
              setUsuariosTable(res.data)
              forceReload()
            })
          })
          .catch(error => {
            Swal.fire({
              ...similarCustomSA,
              icon: 'error',
              title: 'Houve um erro ao tentar deletar o usuario',
              showConfirmButton: false,
              timer: 1500
            })
          })
        }
      })


    }
    else if(ids.length > 1) {
      Swal.fire({
        ...similarCustomSA,
        title: 'Deseja realmente deletar os usuarios selecionados?',
        showDenyButton: true,
        confirmButtonText: 'Remover',
        denyButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/deletarVarios?ids=${ids.join(',')}`)
          .then(async res => {
            Swal.fire({
              ...similarCustomSA,
              icon: 'success',
              title: 'Usuarios deletado com sucesso',
              showConfirmButton: false,
              timer: 1500
            })
            await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/listar`)
            .then(res => {
              setUsuariosTable(res.data)
              forceReload()
            })
          })
          .catch(error => {
            Swal.fire({
              ...similarCustomSA,
              icon: 'error',
              title: 'Houve um erro ao tentar deletar os usuarios',
              showConfirmButton: false,
              timer: 1500
            })
          })
        }
      })
    }
  }

  const handleInsereOpen = () => {
    setOpenInsere(true);
  }

  const handleInsereClose = () => {
    setOpenInsere(false);
  }

  const handleAlteraOpen = async () => {
    if(idsUsuariosSelecionados.length == 0) {
      Swal.fire({
        ...similarCustomSA,
        icon: 'error',
        title: 'Oops...',
        text: 'Selecione um usuario!',
        confirmButtonText:'OK',
      })
    }
    else if(idsUsuariosSelecionados.length == 1) {
      await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/buscarPerfil?id_usuario=${idsUsuariosSelecionados[0]}`)
        .then(async res => {
          setHandleAlteraUsuarioInfo({
            nome: res.data.nome,
            email_pessoal: res.data.email,
            contato: res.data.contato,
            data_nasc: res.data.data_nasc,
            cidade: res.data.cidade,
            estado: res.data.estado,
            id_usuario: res.data.id_usuario,
            id_cargo: (await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/buscarCargo?id_usuario=${idsUsuariosSelecionados[0]}`)).data.id_cargo
          })
        })
      setOpenAltera(true);
    }
    else if(idsUsuariosSelecionados.length > 1) {
      Swal.fire({
        ...similarCustomSA,
        icon: 'error',
        title: 'Oops...',
        text: 'Selecione apenas um usuario!',
        confirmButtonText:'OK',
      })
    }
  }

  const handleAlteraClose = () => {
    setOpenAltera(false);
  }

  return (
    <Box {...props}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1
        }}
      >
        <Typography
          sx={{ m: 1 }}
          variant="h4"
        >
          Usuarios
        </Typography>
        <Box sx={{ m: 1, display: 'flex', justifyContent: 'space-between', }}>
          <Button
            color="warning"
            variant="contained"
            startIcon={(<ManageAccounts fontSize="small" />)}
            sx={{ mr: 1 }}
            onClick={()=>{handleAlteraOpen()}}
          >
            Alterar
          </Button>
          <Button
            color="error"
            variant="contained"
            startIcon={(<Delete fontSize="small" />)}
            sx={{ mr: 1 }}
            onClick={()=>{handleDeletarUsuario(idsUsuariosSelecionados)}}
          >
            Deletar
          </Button>
          <Button
            color="primary"
            variant="contained"
            startIcon={(<Add fontSize="small" />)}
            sx={{ mr: 1 }}
            onClick={()=>{handleInsereOpen()}}
          >
            Adicionar
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box sx={{ maxWidth: '100%' }}>
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon
                    color="action"
                    fontSize="small"
                  >
                    <Search />
                  </SvgIcon>
                </InputAdornment>
              )
            }}
            placeholder="Procurar usuario"
            variant="outlined"
            onChange={(e)=>{
              setFiltroNome(e.target.value)
            }}
          />
        </Box>
      </Box>
      <ModalInsereUsuario
        open={openInsere}
        handleClose={handleInsereClose}
        cargos={cargos}
      />
      <ModalAlteraUsuario
        open={openAltera}
        handleClose={handleAlteraClose}
        cargos={cargos}
        usuario={handleAlteraUsuarioInfo}
      />
    </Box>
  )
};
