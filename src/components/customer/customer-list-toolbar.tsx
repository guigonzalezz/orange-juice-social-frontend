import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon, Typography
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import { Upload as UploadIcon } from '../../icons/upload';
import { Download as DownloadIcon } from '../../icons/download';
import { Add, Delete, ManageAccounts } from '@mui/icons-material';
import Swal from 'sweetalert2'
import axios from 'axios';
import { useRouter } from 'next/router';

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
const similarInputSA = {
  maxlength: '10',
  autocapitalize: 'off',
  autocorrect: 'off'
}


export const CustomerListToolbar = (props) => {
  const { idsUsuariosSelecionados } = props.variaveis
  const { setFiltroNome, setUsuariosTable } = props.funcoes
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
          await axios.delete(`http://localhost:8080/usuario/deletar?id_usuario=${ids[0]}`)
          .then(async res => {
            Swal.fire({
              ...similarCustomSA,
              icon: 'success',
              title: 'Usuario deletado com sucesso',
              showConfirmButton: false,
              timer: 1500
            })
            await axios.get(`http://localhost:8080/usuario/listar`)
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
          await axios.delete(`http://localhost:8080/usuario/deletar_varios?ids=${ids.join(',')}`)
          .then(async res => {
            Swal.fire({
              ...similarCustomSA,
              icon: 'success',
              title: 'Usuarios deletado com sucesso',
              showConfirmButton: false,
              timer: 1500
            })
            await axios.get(`http://localhost:8080/usuario/listar`)
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
        <Box sx={{ m: 1 }}>
          <Button
            color="warning"
            variant="contained"
            startIcon={(<ManageAccounts fontSize="small" />)}
            sx={{ mr: 1 }}
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
                    <SearchIcon />
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
    </Box>
  )
};
