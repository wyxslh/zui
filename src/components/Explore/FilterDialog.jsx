import React from 'react';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Select,
  MenuItem,
  DialogActions,
  Button
} from '@mui/material';
import { sortByCriteria } from 'utilities/sortCriteria.js';

const useStyles = makeStyles(() => ({}));

function FilterDialog(props) {
  const { t } = useTranslation();
  const { open, setOpen, sortValue, setSortValue, renderFilterCards } = props;

  const classes = useStyles();

  const handleSortChange = (event) => {
    setSortValue(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <DialogTitle>{t('Filter')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('Sort results')}</DialogContentText>
        <FormControl sx={{ m: '1', width: '80%' }} className={`${classes.sortForm}`} size="small">
          <Select label={t('Sort')} value={sortValue} onChange={handleSortChange} MenuProps={{ disableScrollLock: true }}>
            {Object.values(sortByCriteria).map((el) => (
              <MenuItem key={el.value} value={el.value}>
                {t(el.label)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {renderFilterCards()}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('Confirm')}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FilterDialog;
