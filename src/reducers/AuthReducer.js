const INITIAL_STATE = {
  email: '',
  password: '',
  error: '',
  loading: false,
  user: null
}

export default (state = INITIAL_STATE, action) => {
  console.log('auth reducer', action.type)
  switch (action.type) {
    case 'auth_attempt_started':
      return { ...state, error: '', loading: true }
    case 'user_signedin':
      return { ...INITIAL_STATE }
    case 'user_signedup':
      return { ...INITIAL_STATE }
    case 'auth_error':
      return { ...INITIAL_STATE, error: action.payload }
    default:
      return state
  }
}