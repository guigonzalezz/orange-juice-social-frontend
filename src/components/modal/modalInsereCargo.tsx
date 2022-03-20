import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import FormInsereCargo from '../form/formInsereCargo';

const ModalInsereCargo = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEnforceFocus
    >
      <FormInsereCargo handleClose={handleClose} />
    </Dialog>
  );
};

export default ModalInsereCargo;
