import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import theme from './theme';

interface IProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: IProps) => {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
