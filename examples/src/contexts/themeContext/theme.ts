import { createTheme, alpha } from '@mui/material/styles';

const primaryMain = '#6C65B0';
const secondaryMain = '#41D9E1';
const backgroundDefault = '#0E151B';
const backgroundPaper = '#1A2230';
const textPrimary = '#FFFFFF';
const textSecondary = '#A1A6B2';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',

    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: primaryMain,
      light: alpha(primaryMain, 0.7),
      dark: alpha(primaryMain, 0.3),
    },
    secondary: {
      main: secondaryMain,
      light: alpha(secondaryMain, 0.7),
      dark: alpha(secondaryMain, 0.3),
    },
    background: {
      default: backgroundDefault,
      paper: backgroundPaper,
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
    },
    mode: 'dark',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: textPrimary,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: `linear-gradient(135deg, ${primaryMain} 0%, ${alpha(primaryMain, 0.7)} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${alpha(primaryMain, 0.3)} 0%, ${primaryMain} 100%)`,
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${secondaryMain} 0%, ${alpha(secondaryMain, 0.7)} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${alpha(secondaryMain, 0.3)} 0%, ${secondaryMain} 100%)`,
          },
        },
        startIcon: {
          color: textPrimary,
        },
        endIcon: {
          color: textPrimary,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: backgroundPaper,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 3px 6px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            opacity: 0.8,
          },
        },
        colorSecondary: {
          color: textPrimary,
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: backgroundPaper,
          color: textPrimary,
        },
        action: {
          '& button': {
            color: secondaryMain,
          },
        },
      },
    },
  },
});

export default theme;
