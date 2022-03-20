import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import FormAlteraCargo from '../form/formAlteraCargo';

const ModalAlteraCargo = ({ open, handleClose, cargo}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEnforceFocus
    >
      <FormAlteraCargo
        handleClose={handleClose}
        cargo={cargo}
      />
    </Dialog>
  );
};

export default ModalAlteraCargo;
