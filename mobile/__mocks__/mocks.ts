export const navigation = {
  setParams: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  replace: jest.fn(),
  popToTop: jest.fn(),
  isFocused: () => true,
  dangerouslyGetParent: jest.fn(),
  state: {
    index: 0,
    routeName: 'login',
    routes: [],
    isTransitioning: false,
    key: 'login',
    params: {}
  },
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  closeDrawer: jest.fn(),
  openDrawer: jest.fn(),
  toggleDrawer: jest.fn(),
  getParam: jest.fn(),
  dismiss: jest.fn(),
  addListener: jest.fn()
};
