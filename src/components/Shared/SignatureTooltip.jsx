import React, { useMemo } from 'react';
import { Typography, Stack } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { getStrongestSignature, getAllAuthorsOfSignatures } from 'utilities/vulnerabilityAndSignatureCheck';

function SignatureTooltip({ signatureInfo }) {
  const { t } = useTranslation();
  const strongestSignature = useMemo(() => getStrongestSignature(signatureInfo));

  return isEmpty(strongestSignature) ? (
    <Typography>{t('Not signed')}</Typography>
  ) : (
    <Stack direction="column">
      <Typography>{t('Tool: {{tool}}', { tool: strongestSignature?.tool || t('Unknown') })}</Typography>
      <Typography>{t('Signed-by: {{author}}', { author: getAllAuthorsOfSignatures(signatureInfo) || t('Unknown') })}</Typography>
    </Stack>
  );
}

export default SignatureTooltip;
