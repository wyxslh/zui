import React from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Typography, Grid } from '@mui/material';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  gridWrapper: {
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  apiKeyDisplay: {
    boxSizing: 'border-box',
    color: '#52637A',
    fontSize: '1rem',
    fontWeight: '400',
    padding: '0.75rem',
    backgroundColor: '#F7F7F7',
    borderRadius: '0.9rem',
    overflowWrap: 'break-word'
  }
}));

function ApiKeyConfirmDialog(props) {
  const { t } = useTranslation();
  const { open, setOpen, apiKey } = props;

  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('Api Key "{{label}}" Created', { label: apiKey?.label || '' })}</DialogTitle>
      <DialogContent className={classes.apiKeyForm}>
        <Grid container className={classes.gridWrapper}>
          <Grid item xs={12}>
            <Typography>
              {t('Please copy the api key, you will not be able to see it once the page is refreshed')}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" align="center" className={classes.apiKeyDisplay}>
              {apiKey?.apiKey}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          {t('Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ApiKeyConfirmDialog;
