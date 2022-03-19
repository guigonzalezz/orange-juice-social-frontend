import {
  Box,
  TextField,
  InputAdornment,
  SvgIcon, Typography
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import ModalEnviaFeedbackDesafio from '../modal/modalEnviaFeedbackDesafio';

export const DesafioListToolbar = (props) => {
  const { setFiltroNome, handleEnviaFeedbackClose } = props.funcoes
  const { openEnviaFeedback,handleAlteraDesafioInfo } = props.variaveis

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
          Desafios
        </Typography>
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
            placeholder="Procurar desafio"
            variant="outlined"
            onChange={(e)=>{
              setFiltroNome(e.target.value)
            }}
          />
        </Box>
      </Box>
      <ModalEnviaFeedbackDesafio open={openEnviaFeedback} handleClose={handleEnviaFeedbackClose} info={handleAlteraDesafioInfo} />
    </Box>
  )
};
