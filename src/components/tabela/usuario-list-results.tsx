import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Box,
  Card,
  Checkbox,
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
import { EventNote, LegendToggle, MoreVert } from '@mui/icons-material';
import axios from 'axios';
import { StyledMenuAnchor } from '../shared/StyledAnchorMenu'
import Swal from 'sweetalert2';

const similarCustomSA = {
  width: 600,
  padding: '2em',
  color: '#fff',
  background: '#343434',
  backdrop: `
    #00000066
    left top
    no-repeat
  `,
  confirmButtonColor: '#F96400',
  confirmButtonText: 'Fechar'
}

export const UsuarioListResults = ({ variaveis, funcoes, ...rest }) => {
  const { usuarios,usuariosTable, filtroNome, idsUsuariosSelecionados } = variaveis
  const { setUsuariosTable, setIdsUsuariosSelecionados} = funcoes
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [actualId, setActualId] = useState(0)
  const [actualEmail, setActualEmail] = useState('')

  useEffect(()=>{
    if(filtroNome == '') setUsuariosTable(usuarios)
    else setUsuariosTable(usuarios.filter(usuario => usuario.perfil.nome.includes(filtroNome)))
  },[filtroNome])

  const handleSelectAll = (event) => {
    let newSelectedUsuarioIds;

    if (event.target.checked) {
      newSelectedUsuarioIds = usuariosTable.map((usuario) => usuario.id_usuario);
    } else {
      newSelectedUsuarioIds = [];
    }

    setIdsUsuariosSelecionados(newSelectedUsuarioIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = idsUsuariosSelecionados.indexOf(id);
    let newSelectedUsuarioIds = [];

    if (selectedIndex === -1) {
      newSelectedUsuarioIds = newSelectedUsuarioIds.concat(idsUsuariosSelecionados, id);
    } else if (selectedIndex === 0) {
      newSelectedUsuarioIds = newSelectedUsuarioIds.concat(idsUsuariosSelecionados.slice(1));
    } else if (selectedIndex === idsUsuariosSelecionados.length - 1) {
      newSelectedUsuarioIds = newSelectedUsuarioIds.concat(idsUsuariosSelecionados.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsuarioIds = newSelectedUsuarioIds.concat(
        idsUsuariosSelecionados.slice(0, selectedIndex),
        idsUsuariosSelecionados.slice(selectedIndex + 1)
      );
    }

    setIdsUsuariosSelecionados(newSelectedUsuarioIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActualId = (id) => {
    setActualId(id)
  }

  const handleActualEmail = (email) => {
    setActualEmail(email)
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusUsuario = async (id:any) => {
    await axios.patch(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/toggle_ativo_inativo?id_usuario=${id}`)
      .then(async res=> {
        if(res.data) {
          await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/listar`)
            .then(res => {
              setUsuariosTable(res.data)
            })
        }
      })
  }

  const handleFichaCompleta = async (email:any) => {
    await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/relatorio/usuario_ficha?email_empresarial=${email}`)
      .then(async res => {
        Swal.fire({
          ...similarCustomSA,
          title: 'Ficha completa!',
          html: `
            <p><strong>Nome: </strong>${res.data.nome}</p>
            <p><strong>CPF: </strong>${res.data.cpf}</p>
            <p><strong>Email empresarial: </strong>${res.data.email_empresarial}</p>
            <p><strong>Email pessoal: </strong>${res.data.email_pessoal}</p>
            <p><strong>Contato: </strong>${res.data.contato}</p>
            <p><strong>Cargo: </strong>${res.data.cargo}</p>
            <p><strong>Qtd desafios concluidos: </strong>${res.data.qtd_desafios_completos}</p>
            <p><strong>Qtd cursos concluidos: </strong>${res.data.qtd_cursos_completos}</p>
            <p><strong>Qtd trilhas concluidos: </strong>${res.data.qtd_trilhas_completos}</p>
            <p><strong>Qtd quizzes concluidos: </strong>${res.data.qtd_quizzes_completos}</p>
            <p><strong>Linkedin: </strong>${res.data.linkedin}</p>
          `,
          // text:  'Modal with a custom image.\nOla\,Ola',
        })
      })

    //   {
    //     nome:  "Guilherme Gonzalez",
    //     cpf: "00704620123",
    //     email_empresarial: "guilhermego@fcamara.com.br",
    //     email_pessoal: "guilhermego@fcamara.com.br",
    //     contato: "18981045128",
    //     cargo: "Desenvolvedor Fullstack",
    //     qtd_desafios_completos: 0,
    //     qtd_cursos_completos: 0,
    //     qtd_trilhas_completos: 0,
    //     qtd_quizzes_completos: 0,
    //     linkedin: "http://www.linkedin.com/in/guilherme-c-gonzalez-342bb4158/"
    // }
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
              <TableCell padding="checkbox">
                <Checkbox
                  checked={idsUsuariosSelecionados.length === usuariosTable.length}
                  color="primary"
                  indeterminate={
                    idsUsuariosSelecionados.length > 0
                    && idsUsuariosSelecionados.length < usuariosTable.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>
                <Typography sx={{color:'white', fontSize: 12}}>Nome</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{color:'white', fontSize: 12}}>Status</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{color:'white', fontSize: 12}}>Localização</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{color:'white', fontSize: 12}}>Contato</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{color:'white', fontSize: 12}}>Cargo</Typography>
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
              },
            }}
          >
            {(limit > 0
              ? usuariosTable.slice(page * limit, page * limit + limit)
              : usuariosTable).map((usuario, key) =>  (
                <TableRow
                  key={key}
                  selected={idsUsuariosSelecionados.indexOf(usuario.id_usuario) !== -1}
                  sx={{
                    background: '#1c1c1c',
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={idsUsuariosSelecionados.indexOf(usuario.id_usuario) !== -1}
                      onChange={(event) => handleSelectOne(event, usuario.id_usuario)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{alignItems: 'center',display: 'flex'}}>
                      <Box>
                        <Typography
                          sx={{ fontSize: 14}}
                          variant="body1"
                        >{usuario.perfil.nome}</Typography>
                        <Typography
                          sx={{ fontSize: 14}}
                          color='#8C8C8C'
                          variant="body1"
                        >{usuario.perfil.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      {usuario.ativo_SN == 'S' ?
                        <Chip
                          size="small"
                          label="Ativo"
                          color="primary"
                        />
                        :

                        <Chip
                          size="small"
                          label="Inativo" // @ts-ignore:
                          color="inative"
                        />
                      }
                      <Typography
                        color='#8C8C8C'
                        sx={{fontSize: 12}}
                      >Criado em:{format(new Date(usuario.stamp_created), 'dd/MM/yyyy')}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography >{`${usuario.perfil.cidade}, ${usuario.perfil.estado}, ${usuario.perfil.pais}`}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography >{usuario.perfil.contato}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography >{usuario.cargo.nome}</Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={open ? 'long-menu' : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={(e)=>{
                        handleActualId(usuario.id_usuario)
                        handleActualEmail(usuario.perfil.email_empresarial)
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
                      <MenuItem onClick={()=>{handleStatusUsuario(actualId)}}>
                        <ListItemIcon>
                          <LegendToggle fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{usuario.ativo_SN == 'S' ? 'Desativar':'Ativar'}</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={()=>{handleFichaCompleta(actualEmail)}}>
                        <ListItemIcon>
                          <EventNote fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Ficha Completa</ListItemText>
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
        count={usuariosTable.length}
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


