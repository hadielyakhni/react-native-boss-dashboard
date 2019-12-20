const INITIAL_STATE = {
  email: '',
  password: '',
  error: '',
  loading: false,
  user: null
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'email_changed':
      return { ...state, email: action.payload }
    case 'password_changed':
      return { ...state, password: action.payload }
    case 'auth_attempt_started':
      return { ...state, error: '', loading: true }
    case 'user_signedin':
      return { ...INITIAL_STATE, user: action.payload }
    case 'user_signedup':
      return { ...INITIAL_STATE, user: action.payload }
    case 'auth_error':
      return { ...INITIAL_STATE, error: action.payload }
    case 'auth_reset':
      return { ...INITIAL_STATE }
    default:
      return state
  }
}