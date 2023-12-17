import { useCallback, useEffect, useState } from 'react';
import styles from './ApiKeyManager.module.css';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import useConfig from '@/hooks/useConfig';
import cx from 'classnames';

function ApiKeyManager() {
  const { config, modifyConfig } = useConfig();
  const [open, setOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(config.apiKey);

  const saveApiKey = useCallback(() => {
    modifyConfig('apiKey', apiKeyInput);
    setOpen(false);
  }, [apiKeyInput, modifyConfig]);

  const removeApiKey = useCallback(() => {
    modifyConfig('apiKey', '');
    setOpen(false);
  }, [modifyConfig]);

  useEffect(() => {
    setApiKeyInput(config.apiKey);
  }, [config.apiKey]);

  const hasApiKey = config.apiKey !== '';
  const hiddenApiKey = hasApiKey ? '🗝️ ' + config.apiKey.slice(0, 4) + ' ... ' + config.apiKey.slice(-4) : '';

  return (
    <div className={styles.ApiKeyManager}>
      <div className={cx(styles.keyManagerButton, {
        [styles.warning]: !hasApiKey
      })} onClick={() => setOpen(true)}>
        {hasApiKey ? hiddenApiKey : 'Set your OpenAI API key ⚠️'}
      </div>

      <Dialog className={styles.apiKeyDialog} open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Set your OpenAI API key</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Paste your <a href="https://platform.openai.com/account/api-keys">OpenAI API Key</a> to work with the examples. Your API key will be stored in your browser's local storage.
          </DialogContentText>
          <TextField
            className={styles.apiKeyInput}
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            autoFocus
            id="name"
            margin='dense'
            label="API Key"
            type="text"
            fullWidth
            inputProps={{ style: { fontFamily: 'monospace' } }}
            spellCheck={false}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button
            type='submit'
            onClick={() => removeApiKey()}
          >
            Remove API Key
          </Button>
          <Button
            type='submit'
            variant="contained"
            onClick={() => saveApiKey()}
          >
            Set API Key
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ApiKeyManager;
