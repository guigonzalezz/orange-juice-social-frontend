import { styled } from '@mui/material/styles';
import { Box, Typography, Button, Stepper, Step, StepButton, FormGroup, Checkbox, FormControlLabel, FormControl, RadioGroup, Radio } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ExpandMore } from '@mui/icons-material';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { theme } from '../../styles/theme';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

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



export const Quiz = ({idUsuario ,quiz, setExpanded, expanded, similarCustomSA}) => {
  const router = useRouter();
  const [quizConcluido, setQuizConcluido] = useState(quiz.conclusao)
  const [quizJaFoiConcluido, setQuizJaFoiConcluido] = useState(quiz.conclusao.length > 0)
  const qtdQuestoes = quiz.questoes.length

  const [ultimaConclusao, setUltimaConclusao] = useState({nota:0})
  const handleChange = (panel: string) => {setExpanded(panel == expanded ? false : panel)}

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{
    [k: number]: boolean;
  }>({});

  const [quizFinalizacao, setQuizFinalizacao] = useState({
    id_usuario: idUsuario,
    quiz_nome: quiz.titulo,
    tempo_realizado: "00:00:00",
    anotacao: "",
    nota: 0,
    questoes: [
        // {
        //     pergunta: "Qual desses é um gerenciador de pacote do Javascript ?",
        //     acertou: true,
        //     resposta: "npm"
        // },
    ]
  })

  useEffect(()=>{
    if(quizConcluido.length > 0) { setUltimaConclusao(quizConcluido.reduce((prev, current) => (prev.stamp_created > current.stamp_created) ? prev : current)) }
  },[])

  const totalSteps = () => {
    return quiz.questoes.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          quiz.questoes.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = async () => {
    if(!quizFinalizacao.questoes[activeStep]) {
      Swal.fire({
        ...similarCustomSA,
        icon: 'warning',
        title: 'Selecione uma alternativa',
        showConfirmButton: false,
        timer: 1500
      })
    }
    else {
      const newCompleted = completed;
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      if(completedSteps() === totalSteps()) {
        await axios.post(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/concluir/quiz`,{
          ...quizFinalizacao,
          nota: quizFinalizacao.questoes.filter(obj => obj.acertou).length * (10 / qtdQuestoes)
        })
        .then(res => {
          Swal.fire({
            ...similarCustomSA,
            icon: 'success',
            title: 'Parabéns por concluir o Quiz.',
            text: quizFinalizacao.nota < 6 ? `Porem sua nota ficou abaixo da nossa média, apos estudar um pouco mais tente novamente.` : 'Sua nota atingiu nossa média, parabéns.',
            showConfirmButton: false,
            timer: 1500
          })
          router.reload()
        })
        .catch(error => {
          Swal.fire({
            ...similarCustomSA,
            icon: 'error',
            title: 'Algo aconteceu',
            text: 'Por favor tentar novamente daqui alguns minutos.',
            showConfirmButton: false,
            timer: 1700
          })
        })

        setQuizJaFoiConcluido(true)
      }
      handleNext();
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setQuizJaFoiConcluido(false)
    setQuizFinalizacao({
      ...quizFinalizacao,
      questoes: []
    })
    setCompleted({});
  };

  const handleSelecionaResposta = (resp,perg) => {
    const questoesAlterada = quizFinalizacao.questoes
    questoesAlterada[activeStep] = {
      pergunta: perg,
      acertou: resp.correta,
      resposta: resp.resposta
    }
    setQuizFinalizacao({
      ...quizFinalizacao,
      questoes: questoesAlterada
    })
  }

  return(
    <>
      <Accordion
        expanded={expanded === quiz.titulo}
        onChange={()=>{handleChange(quiz.titulo)}}
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
            borderLeftColor: `${quizConcluido.length > 0 ? 'success.main' : 'secondary.main'}`,
            borderLeftStyle: 'solid',
            borderLeftWidth: 2,
            height: 100
          }}
        >
          <Typography sx={{ color:'white', width: '50%', [theme.breakpoints.down(500)]: { width: 200 }, display:'flex',alignItems:'center',textAlign:'center', justifyContent:'center',flexShrink: 0 }}>
            {quiz.titulo}
          </Typography>

          {quizConcluido.length > 0 &&
            <Typography sx={{ color:'white', width: '50%', [theme.breakpoints.down(500)]: { width: 200 }, display:'flex',alignItems:'center',textAlign:'center', justifyContent:'center',flexShrink: 0 }}>
              Nota: {ultimaConclusao.nota}
            </Typography>
          }

        </AccordionSummary>

        <AccordionDetails sx={{backgroundColor:'#232323'}}>
          <Box sx={{ width: '100%' }}>
          <Stepper nonLinear activeStep={activeStep}>
            {
              quiz.questoes.map((questao, index) => (
                <Step key={index} completed={quizJaFoiConcluido ? true : completed[index]}>
                  <StepButton color="inherit" onClick={handleStep(index)}></StepButton>
                </Step>))
            }
          </Stepper>
          <div>
            {allStepsCompleted() || quizJaFoiConcluido ? (
              <Box sx={{}}>
                <Typography sx={{ mt: 4, mb: 1,  textAlign:'center', fontSize: 24 }}>
                  Este quiz ja foi finalizado!
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleReset}>Recomeçar</Button>
                </Box>
              </Box>
            ) : (
              <>

                {/* Pergunta */}
                <Typography sx={{ mt: 2, mb: 1 }}>
                  {quiz.questoes[activeStep].pergunta}
                </Typography>


                {/* Opcoes de resposta */}
                {
                  !completed[activeStep] ?
                  <FormControl>
                    <RadioGroup
                      name="radio-buttons-group"
                      value={quizFinalizacao.questoes[activeStep] && quizFinalizacao.questoes[activeStep].resposta}
                    >
                      {
                        quiz.questoes[activeStep].respostas.map((resp, index)=> (
                          <FormControlLabel key={index} value={resp.resposta} control={<Radio />} onClick={()=>{handleSelecionaResposta(resp, quiz.questoes[activeStep].pergunta)}} label={resp.resposta} />
                        ))
                      }
                    </RadioGroup>
                  </FormControl>
                  :
                  <Typography>
                    {`Resposta escolhida foi "${quizFinalizacao.questoes[activeStep].resposta}"`}
                  </Typography>
                }


                {/* Botoes */}
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Voltar
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleNext} sx={{ mr: 1 }}>
                    Próximo
                  </Button>
                  {activeStep !== quiz.questoes.length &&
                    (!completed[activeStep] && (
                      <Button onClick={handleComplete}>
                        {completedSteps() === totalSteps() - 1
                          ? 'Finalizar'
                          : 'Confirmar resposta'}
                      </Button>
                    ))}
                </Box>
              </>
            )}
          </div>
        </Box>
        </AccordionDetails>
      </Accordion>
    </>
  )
}
