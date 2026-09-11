import React from 'react';

import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import { useTranslation } from 'react-i18next';
import githubLogo from '../../assets/GhIcon.svg';

// styling
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  githubButton: {
    textTransform: 'none',
    background: '#161614',
    color: '#FFFFFF',
    borderRadius: '0.25rem',
    padding: 0,
    height: '3.125rem',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#161614',
      boxShadow: 'none'
    }
  },
  googleButton: {
    textTransform: 'none',
    background: '#FFFFFF',
    color: '#52637A',
    borderRadius: '0.25rem',
    border: '1px solid #52637A',
    padding: 0,
    height: '3.125rem',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#FFFFFF',
      boxShadow: 'none'
    }
  },
  buttonsText: {
    lineHeight: '2.125rem',
    height: '2.125rem',
    fontSize: '1.438rem',
    fontWeight: '600',
    letterSpacing: '0.01rem'
  }
}));

function GithubLoginButton({ handleClick }) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Button
      fullWidth
      variant="contained"
      className={classes.githubButton}
      endIcon={<SvgIcon fontSize="medium">{githubLogo}</SvgIcon>}
      onClick={(e) => handleClick(e, 'github')}
    >
      <span className={classes.buttonsText}>{t('Continue with Github')}</span>
    </Button>
  );
}

function GoogleLoginButton({ handleClick }) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Button fullWidth variant="contained" className={classes.googleButton} onClick={(e) => handleClick(e, 'google')}>
      <span className={classes.buttonsText}>{t('Continue with Google')}</span>
    </Button>
  );
}

function GitlabLoginButton({ handleClick }) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Button fullWidth variant="contained" className={classes.button} onClick={(e) => handleClick(e, 'gitlab')}>
      {t('Sign in with Gitlab')}
    </Button>
  );
}

function OIDCLoginButton({ handleClick, oidcName }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const loginWithName = oidcName || 'OIDC';

  return (
    <Button fullWidth variant="contained" className={classes.button} onClick={(e) => handleClick(e, 'oidc')}>
      {t('Sign in with {{name}}', { name: loginWithName })}
    </Button>
  );
}

export { GithubLoginButton, GoogleLoginButton, GitlabLoginButton, OIDCLoginButton };
