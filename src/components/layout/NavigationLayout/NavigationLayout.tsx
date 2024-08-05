import { experimentalStyled } from '@material-ui/core/styles';
// import NavigationNavbar from './NavigationNavbar';

const NavigationSidebar = require('./NavigationSidebar').default;
const NavigationSidebarRight = require('./NavigationSidebarRight').default;

const NavigationLayoutRoot = experimentalStyled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%',
}));

const NavigationLayoutWrapper = experimentalStyled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  // paddingTop: '64px',
  paddingLeft: '280px',
  paddingRight: '80px',
  // [theme.breakpoints.up('lg')]: {
  // },
}));

const NavigationLayoutContainer = experimentalStyled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
});

const NavigationLayoutContent = experimentalStyled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
  position: 'relative',
  WebkitOverflowScrolling: 'touch',
});

const NavigationLayout = ({ children }) => {
  return (
    <NavigationLayoutRoot>
      {/* <NavigationNavbar /> */}
      <NavigationSidebar />
      <NavigationSidebarRight />
      <NavigationLayoutWrapper>
        <NavigationLayoutContainer>
          <NavigationLayoutContent>{children}</NavigationLayoutContent>
        </NavigationLayoutContainer>
      </NavigationLayoutWrapper>
    </NavigationLayoutRoot>
  );
};

export default NavigationLayout;
