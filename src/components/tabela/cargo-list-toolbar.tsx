import {
  Box,
  Button,
  TextField,
  InputAdornment,
  SvgIcon, Typography
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import { Add, Delete, ManageAccounts } from '@mui/icons-material';
import Swal from 'sweetalert2'
import axios from 'axios';
import { useRouter } from 'next/router';
import ModalInsereCargo from '../modal/modalInsereCargo';
import { useState } from 'react';
import ModalAlteraCargo from '../modal/modalAlteraCargo';

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


export const CargoListToolbar = (props) => {
  const { idsCargosSelecionados, cargos } = props.variaveis
  const { setFiltroNome, setCargosTable } = props.funcoes
  const [openInsere, setOpenInsere] = useState(false);
  const [openAltera, setOpenAltera] = useState(false);

  const [handleAlteraCargoInfo, setHandleAlteraCargoInfo] = useState({});

  const router = useRouter()
  const forceReload = () => {
    router.reload()
  }


  const handleDeletarCargo = async (ids) => {
    if(ids.length == 0) {
      Swal.fire({
        ...similarCustomSA,
        icon: 'error',
        title: 'Oops...',
        text: 'Selecione um cargo!',
        confirmButtonText:'OK',
      })
    }
    else if(ids.length == 1) {
      Swal.fire({
        ...similarCustomSA,
        title: 'Deseja realmente deletar o cargo selecionado?',
        showDenyButton: true,
        confirmButtonText: 'Remover',
        denyButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.get(`http://localhost:8080/usuario/verificaCargoEmUso?id_cargo=${ids[0]}`)
            .then(async res => {
              if(res.status == 400) {
                Swal.fire({
                  ...similarCustomSA,
                  icon: 'error',
                  title: 'O cargo precisa nao estar vinculado a um usuario, para que seja possivel deleta-lo.',
                  showConfirmButton: false,
                  timer: 2200
                })
              }
              else {
                Swal.fire({
                  ...similarCustomSA,
                  icon: 'success',
                  title: 'Cargo deletado com sucesso',
                  showConfirmButton: false,
                  timer: 1500
                })
                await axios.get(`http://localhost:8080/cargo/listarTodos`)
                  .then(res => {
                    setCargosTable(res.data)
                    forceReload()
                  })
              }
            })
            .catch(error => {
              Swal.fire({
                ...similarCustomSA,
                icon: 'error',
                title: 'Houve um erro ao tentar deletar o cargo',
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
        icon: 'error',
        title: 'Oops...',
        text: 'Selecione apenas um cargo!',
        confirmButtonText:'OK',
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
    if(idsCargosSelecionados.length == 0) {
      Swal.fire({
        ...similarCustomSA,
        icon: 'error',
        title: 'Oops...',
        text: 'Selecione um cargo!',
        confirmButtonText:'OK',
      })
    }
    else if(idsCargosSelecionados.length == 1) {
      await axios.get(`http://localhost:8080/cargo/buscarId?id_cargo=${idsCargosSelecionados[0]}`)
        .then(async res => {
          setHandleAlteraCargoInfo({
            nome: res.data.nome,
            id_cargo: res.data.id_cargo
          })
        })
      setOpenAltera(true);
    }
    else if(idsCargosSelecionados.length > 1) {
      Swal.fire({
        ...similarCustomSA,
        icon: 'error',
        title: 'Oops...',
        text: 'Selecione apenas um cargo!',
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
          Cargos
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
            onClick={()=>{handleDeletarCargo(idsCargosSelecionados)}}
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
                    <SearchIcon />
                  </SvgIcon>
                </InputAdornment>
              )
            }}
            placeholder="Procurar cargo"
            variant="outlined"
            onChange={(e)=>{
              setFiltroNome(e.target.value)
            }}
          />
        </Box>
      </Box>
      <ModalInsereCargo open={openInsere} handleClose={handleInsereClose} />
      <ModalAlteraCargo open={openAltera} handleClose={handleAlteraClose} cargo={handleAlteraCargoInfo} />
    </Box>
  )
};
