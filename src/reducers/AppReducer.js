const INITIAL_STATE = {
  theme: '',
  isSystemTheme: false,
  activeScreenName: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'change_theme':
      return { ...state, theme: action.payload.theme, isSystemTheme: !!action.payload.isSystem }
    case 'set_active_screen_name':
      return { ...state, activeScreenName: action.payload }
    default:
      return state
  }
}