import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Box,
  Card,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Send, MoreVert, Preview } from '@mui/icons-material';
import { StyledMenuAnchor } from '../shared/StyledAnchorMenu'
import axios from 'axios';
import Swal from 'sweetalert2'
import { useRouter } from 'next/router';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

export const DesafioListResults = ({ variaveis, funcoes, ...rest }) => {
  const router = useRouter();
  const { desafios,desafiosTable, filtroNome } = variaveis
  const { setDesafiosTable } = funcoes
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(()=>{
    if(filtroNome == '') setDesafiosTable(desafios)
    else setDesafiosTable(desafios.filter(desafio => desafio.desafio_nome.includes(filtroNome)))
  },[filtroNome])

  const handleLimitChange = (event) => { setLimit(event.target.value) }
  const handlePageChange = (event, newPage) => { setPage(newPage) }
  const handleClick= (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget) }
  const handleClose= () => { setAnchorEl(null) }

  const [handleDesafioInfo, setHandleDesafioInfo] = useState({})

  const handleEnviaFeedback = async (desafio) => {
    Swal.fire({
      ...similarCustomSA,
      title: 'Feedback',
      text: 'O feedback é muito importante para o acolhimento do colaborador.',
      inputLabel: 'Digite a nota de 0 a 10 do desafio:',
      input: 'number',
      inputAttributes: { autocapitalize: 'off' },
      inputValidator: (value) => {
        return (parseFloat(value) < 0 || parseFloat(value) > 10) && 'Valor precisa ser entre 0 e 10'
      },
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Proximo',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      const nota = result.value;
      if(result.isConfirmed) {
        Swal.fire({
          ...similarCustomSA,
          title: 'Feedback',
          text: 'O feedback é muito importante para o acolhimento do colaborador.',
          inputLabel: 'Deseja adicionar um feedback ? Digite abaixo:',
          input: 'text',
          inputAttributes: { autocapitalize: 'off' },
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Enviar',
          showLoaderOnConfirm: true
        }).then(async res => {
          const feedback = res.value;
          await axios.post(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/feedback/desafio`,{
            nota: nota,
            feedback: feedback,
            id_usuario: desafio.id_usuario,
            id_desafio: desafio.id_usuario_desafio_conclusao,
            id_responsavel: 11
          }).then(res => {
            Swal.fire({
              ...similarCustomSA,
              icon: 'success',
              title: 'Feedback enviado com sucesso',
              showConfirmButton: false,
              timer: 1700
            })
            router.reload();
          }).catch(error => {
            Swal.fire({
              ...similarCustomSA,
              icon: 'error',
              title: 'Erro ao enviar o feedback!',
              showConfirmButton: false,
              timer: 1700
            })
          })
        }).catch(error => {
          Swal.fire({
            ...similarCustomSA,
            icon: 'error',
            title: 'Erro ao enviar o feedback!',
            showConfirmButton: false,
            timer: 1700
          })
        })
      }
    }).catch(error => {
      Swal.fire({
        ...similarCustomSA,
        icon: 'error',
        title: 'Erro ao enviar o feedback!',
        showConfirmButton: false,
        timer: 1700
      })
    })
  }

  const handleMostraFeedback = (desafio) => {
    if(desafio.feedback) {
      Swal.fire({
        ...similarCustomSA,
        title: 'Feedback',
        icon: 'info',
        iconColor: '#F96400',
        html:
          `<p><strong>Nota: </strong>${desafio.feedback.nota}</p> ` +
          `<p><strong>Feedback: </strong>${desafio.feedback.feedback}</p> `,
        showConfirmButton: false,
        showCloseButton: true,
      })
    } else {
      Swal.fire({
        ...similarCustomSA,
        icon: 'error',
        title: 'O feedback ainda nao foi enviado!',
        showConfirmButton: false,
        timer: 1700
      })
    }
  }

  const handleMostraDesafioEnviado = (desafio) => {
    Swal.fire({
      ...similarCustomSA,
      title: 'Desafio enviado',
      icon: 'info',
      iconColor: '#F96400',
      html:
        `<p><strong>Link: </strong><a target="_blank" rel="noopener noreferrer" style="text-decoration:none; color: #F96400; cursor:pointer;" href="${desafio.desafio_url}">${desafio.desafio_url}</a></p> ` +
        `<p><strong>Anotação: </strong>${desafio.anotacao ? desafio.anotacao : 'Nenhuma anotação foi feita.'}</p> `,
      showConfirmButton: false,
      showCloseButton: true,
    })
  }

  return (
    <Card
      {...rest}
      sx={{ width: '100%', overflow: 'hidden'}}
    >
      <Box >
        <Table >
          <TableHead>
            <TableRow sx={{background:'#232323'}}>
              <TableCell>
                <Typography sx={{color:'white', fontSize: 12}}>Nome</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{color:'white', fontSize: 12}}>Status</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{color:'white', fontSize: 12}}>Desafio</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{color:'white', fontSize: 12}}>Categoria</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{color:'white', fontSize: 12}}>Ações</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              overflow: 'hidden',
              overflowX: 'hidden',
              overflowY: 'scroll',
              '&::-webkit-scrollbar': {
                height: '0.4em',
                width: 8
              },
              '&::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(16,16,16,.9)',
                borderRadius: 25,
              }
            }}
          >
            {(limit > 0
              ? desafiosTable.slice(page * limit, page * limit + limit)
              : desafiosTable).map((desafio, key) =>  (
                <TableRow
                  key={key}
                  sx={{
                    background: '#1c1c1c',
                  }}
                >
                  <TableCell>
                    <Box sx={{alignItems: 'center',display: 'flex'}}>
                      <Box>
                        <Typography
                          sx={{ fontSize: 14}}
                          variant="body1"
                        >{desafio.usuario.nome}</Typography>
                        <Typography
                          sx={{ fontSize: 14}}
                          color='#8C8C8C'
                          variant="body1"
                        >{desafio.usuario.email_empresarial}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      {desafio.feedback_recebido_SN == 'S' ?
                        <Chip
                          size="small"
                          label="OK"
                          color="primary"
                        />
                        :
                        <Chip
                          size="small"
                          label="Aguardando" // @ts-ignore:
                          color="inative"
                        />
                      }
                      <Typography
                        color='#8C8C8C'
                        sx={{fontSize: 12}}
                      >Enviado em: {format(new Date(desafio.stamp_enviado), 'dd/MM/yyyy')}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography >{desafio.desafio_nome}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography >{desafio.categoria}</Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={open ? 'long-menu' : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={(e)=>{
                        setHandleDesafioInfo(desafio)
                        handleClick(e)
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                    <StyledMenuAnchor
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      <MenuItem onClick={()=>{ handleEnviaFeedback(handleDesafioInfo) }}>
                        <ListItemIcon>
                          <Send fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Enviar feedback</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={()=>{ handleMostraDesafioEnviado(handleDesafioInfo) }}>
                        <ListItemIcon>
                          <Preview fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Visualizar desafio</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={()=>{ handleMostraFeedback(handleDesafioInfo) }}>
                        <ListItemIcon>
                          <VisibilityIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Visualizar feedback</ListItemText>
                      </MenuItem>
                    </StyledMenuAnchor>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={desafiosTable.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          background:'#F96400',
        }}
      />
    </Card>
  );
};


