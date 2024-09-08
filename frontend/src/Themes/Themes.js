const themes = {
  colors: {
  background: '#08639C',
  primary: '#FFFFFF',
  primaryBlue:'#08639C',
  primary : '#FFFFFF',
  buttons:'#1F2733',
  notif:'#D9E9F0',
  create:'#E1DEDE',
  gradient:'linear-gradient(to bottom , #08639C,#9FD4FA)',
  streamControls:'#000000',
  sentMessage:'#97C8FF',
  receivedMessage:'#C6C2C2',
  links:'#1E2772',
  documentAttach:'#0974C6',
  acceptReq:'#63BA71',
  refuseReq:'#EE0C0C',
  inputBg:'#F1F3F6',
  placeholder : '#555555',
  divider : '#C2C2C2',
  },
  fonts: {
  primary: 'marrywether sans,poppins,calibri,Arial, sans-serif',
  },
}
function setCSSVariables(theme) {
  const root = document.documentElement; // This targets the :root element
  Object.keys(theme.colors).forEach(key => {
    root.style.setProperty(`--color-${key}`, theme.colors[key]);
    
  });
  Object.keys(theme.fonts).forEach(key => {
      root.style.setProperty(`--fonts-${key}`,theme.fonts[key])
  });
}

setCSSVariables(themes);