import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import FormEnviaFeedback from '../form/formEnviaFeedback';

const ModalEnviaFeedbackDesafio = ({ open, handleClose, info}) => {

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEnforceFocus
    >
      <FormEnviaFeedback
        handleClose={handleClose}
        info={info}
      />
    </Dialog>
  );
};

export default ModalEnviaFeedbackDesafio;
