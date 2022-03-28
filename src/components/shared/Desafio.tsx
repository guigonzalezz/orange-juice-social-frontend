import { styled, alpha } from '@mui/material/styles';
import { BoxProps, Box, Typography, Checkbox, TextField, MenuItem, ListItemIcon, ListItemText, Menu, Button, Chip } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { ExpandMore, OpenInNew, Send } from '@mui/icons-material';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { theme } from '../../styles/theme';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { Curso } from './Curso'
import { StyledMenuAnchor } from './StyledAnchorMenu';
import ModalEnviaDesafio from '../modal/modalEnviaDesafio';

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



export const Desafio = ({idUsuario ,desafio, setExpanded, expanded, similarCustomSA}) => {
  const [desafioConcluido, setDesafioConcluido] = useState(desafio.conclusao.desafio_url)
  const [feedbackRecebido, setFeedbackRecebido] = useState(desafio.conclusao.feedback_recebido_SN == 'S')
  const [openDesafio, setOpenDesafio] = useState(false);
  const router = useRouter();
  const handleChange = (panel: string) => {setExpanded(panel == expanded ? false : panel)}

  const handleVisualizarFeedback = () => {
    Swal.fire({
      ...similarCustomSA,
      title: 'Feedback',
      icon: 'info',
      iconColor: '#F96400',
      html:
        `<p><strong>Nota: </strong>${desafio.conclusao.feedback.nota}</p> ` +
        `<p><strong>Feedback: </strong>${desafio.conclusao.feedback.feedback}</p> `,
      showConfirmButton: false,
      showCloseButton: true,
    })

  }

  const handleDesafioClose = () => {
    setOpenDesafio(false)
  }

  return(
    <>
      <Accordion
        expanded={expanded === desafio.titulo}
        onChange={()=>{handleChange(desafio.titulo)}}
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
            borderLeftColor: `${desafioConcluido ? 'success.main' : 'secondary.main'}`,
            borderLeftStyle: 'solid',
            borderLeftWidth: 2,
            height: 100
          }}
        >
          <Typography sx={{ color:'white', width: '50%', [theme.breakpoints.down(500)]: { width: 200 }, display:'flex',alignItems:'center',textAlign:'center', justifyContent:'center',flexShrink: 0 }}>
            {desafio.titulo}
          </Typography>

        </AccordionSummary>

        <AccordionDetails sx={{backgroundColor:'#232323'}}>
          <Box sx={{display:'flex', justifyContent:'space-between'}}>
            {desafioConcluido ?
              feedbackRecebido ?
                <Chip
                  size="small"
                  label="Feedback realizado"
                  color="primary"
                />
              :
              <Chip
                size="small"
                label="Aguardando feedback" // @ts-ignore:
                color="inative"
              />
              :
              <Chip
                size="small"
                label="Desafio nao foi enviado" // @ts-ignore:
                color="inative"
              />
            }
            <Box>
              {feedbackRecebido && <Button onClick={()=>{handleVisualizarFeedback()}}>Visualizar Feedback</Button>}
              <Button
                color="primary"
                size="small"
                type="submit"
                variant="outlined"
                onClick={()=>{setOpenDesafio(true)}}
              >{desafioConcluido ? 'Reenviar desafio': 'Enviar desafio'}</Button>
            </Box>
          </Box>
          <Typography
            sx={{ my: 1 }}
            variant="h6"
            color="white"
          >
            Descricao
          </Typography>
          {desafio.descricao.split("\n").map((i, key) => {
            return <Typography fontSize={14} color="white" key={key}>{i}</Typography>;
          })}
        </AccordionDetails>
      </Accordion>
      <ModalEnviaDesafio
        open={openDesafio}
        handleClose={handleDesafioClose}
        desafio={desafio}
        idUsuario={idUsuario}
      />
    </>
  )
}
