const INITIAL_STATE = {
  exitCount: 0,
  theme: '',
  isSystemTheme: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'change_theme':
      return { ...state, theme: action.payload.theme, isSystemTheme: !!action.payload.isSystem }
    case 'increment_exit_count':
      return { ...state, exitCount: state.exitCount + 1 }
    case 'reset_exit_count':
      return { ...state, exitCount: 0 }
    default:
      return state
  }
}