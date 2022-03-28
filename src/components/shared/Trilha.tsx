import { styled, alpha } from '@mui/material/styles';
import { BoxProps, Box, Typography, Checkbox } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { ExpandMore, OpenInNew } from '@mui/icons-material';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { theme } from '../../styles/theme';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { Curso } from './Curso'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({

  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:'rgba(255, 255, 255, .05)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(180deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid #5c4b4b1f',
}));



export const Trilha = ({idUsuario ,trilha, setExpanded, expanded, similarCustomSA}) => {
  const [trilhaConcluida, setTrilhaConcluida] = useState(trilha.concluido_SN == 'S')
  const [cursos, setCursos] = useState(trilha.cursos)
  const router = useRouter();

  const handleChange = (panel: string) => {setExpanded(panel == expanded ? false : panel)}

  const handleConcluirTrilha = () => {
    Swal.fire({
      ...similarCustomSA,
      title: 'Voce tem certeza que deseja concluir esta trilha ?',
      text: 'Nao sera possivel voltar a tras.',
      showDenyButton: true,
      confirmButtonText: 'Concluir',
      denyButtonText: `Cancelar`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.post(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/concluir/trilha`, {
          id_usuario: idUsuario,
          nome: trilha.titulo,
          anotacao: ""
        }).then(res => {
          setTrilhaConcluida(true)
          cursos.map(async curso => {
            if(curso.concluido_SN == 'N') {
              await axios.post(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/concluir/curso`, {
                id_usuario: idUsuario,
                nome: cursos.titulo,
                anotacao: ""
              })
            }
          })
          router.reload()
        })
      }
    })
  }

  const verificaSeTodosCursosForamConcluidos = async () => {
    const trilhaFoiConcluida = cursos.every(curso => curso.concluido_SN == 'S')
    if(trilhaFoiConcluida) {
      await axios.post(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/concluir/trilha`, {
        id_usuario: idUsuario,
        nome: trilha.titulo,
        anotacao: ""
      }).then(res => {
        setTrilhaConcluida(true)
      })
      router.reload()
    }
  }

  const handleConcluirCurso = async (key) => {
    if(cursos[key].concluido_SN == 'N') {
      Swal.fire({
        ...similarCustomSA,
        title: 'Voce tem certeza que deseja concluir este curso ?',
        text: 'Nao sera possivel voltar a tras.',
        showDenyButton: true,
        confirmButtonText: 'Concluir',
        denyButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.post(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/concluir/curso`, {
            id_usuario: idUsuario,
            nome: cursos[key].titulo,
            anotacao: ""
          }).then(async res=>{
            cursos[key].concluido_SN = cursos[key].concluido_SN == 'S' ? 'N' : 'S'
            const trilhaFoiConcluida = cursos.every(curso => curso.concluido_SN == 'S')
            if(trilhaFoiConcluida) {
              await axios.post(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/concluir/trilha`, {
                id_usuario: idUsuario,
                nome: trilha.titulo,
                anotacao: ""
              }).then(res => {
                setTrilhaConcluida(true)
              })
            }
            router.reload()
          })
        }
      })
    }
  }

  return(
    <Accordion
      expanded={expanded === trilha.titulo}
      onChange={()=>{handleChange(trilha.titulo)}}
      sx={{
        minHeight:100,
        my: 1,
        mx: 3,
        borderRadius: 2,
        backgroundColor: '#232323'
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore  />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        sx={{
          backgroundColor: '#232323',
          borderLeftColor: `${trilhaConcluida ? 'success.main' : 'secondary.main'}`,
          borderLeftStyle: 'solid',
          borderLeftWidth: 2,
          height: 100
        }}
      >
        <Typography sx={{ color:'white', width: '50%', [theme.breakpoints.down(500)]: { width: 200 }, display:'flex',alignItems:'center',textAlign:'center', justifyContent:'center',flexShrink: 0 }}>
          {trilha.titulo}
        </Typography>
        <Typography fontSize={12} sx={{ color: 'text.secondary', width: '40%', [theme.breakpoints.down(500)]: { display: 'none' } }}>{trilha.descricao}</Typography>
        <Checkbox
          checked={trilhaConcluida}
          disabled={trilhaConcluida}
          onClick={()=>{ handleConcluirTrilha()}}
          inputProps={{ 'aria-label': 'controlled' }}
          sx={{width: '10%', [theme.breakpoints.down(500)]: { width: '50%' }}}
        />

      </AccordionSummary>
      <AccordionDetails sx={{backgroundColor:'#232323'}}>
        {
          cursos.map((curso, key) => (
            <Curso
              idUsuario={idUsuario}
              curso={curso}
              similarCustomSA={similarCustomSA}
              verificaSeTodosCursosForamConcluidos={verificaSeTodosCursosForamConcluidos}
            />
          ))
        }

      </AccordionDetails>
    </Accordion>
  )
}
