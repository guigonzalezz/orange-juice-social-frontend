import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import FormAlteraUsuario from '../form/formAlteraUsuario';
import FormEnviaDesafio from '../form/formEnviaDesafio';

const ModalEnviaDesafio = ({ open, handleClose, desafio, idUsuario}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEnforceFocus
    >
      <FormEnviaDesafio
        handleClose={handleClose}
        desafio={desafio}
        idUsuario={idUsuario}
      />
    </Dialog>
  );
};

export default ModalEnviaDesafio;
