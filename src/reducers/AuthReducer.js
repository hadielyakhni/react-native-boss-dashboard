const INITIAL_STATE = {
  email: '',
  password: '',
  error: '',
  loading: false,
  user: null,
  facebookButtonDisabled: false,
  googleButtonDisabled: false,
  sendingPasswordResetEmail: false,
  showPasswordResetSuccess: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'auth_attempt_started':
      return { ...state, error: '', loading: true }
    case 'user_signedin':
      return { ...INITIAL_STATE, user: action.payload }
    case 'user_signedup':
      return { ...INITIAL_STATE, user: action.payload }
    case 'auth_error':
      return { ...INITIAL_STATE, error: action.payload }
    case 'reset_error':
      return { ...state, error: '' }
    case 'hide_password_reset_success_modal':
      return { ...state, showPasswordResetSuccess: false }
    case 'disable_facebook_button':
      return { ...state, facebookButtonDisabled: true }
    case 'facebook_auth_error':
      return { ...state, facebookButtonDisabled: false, error: action.payload }
    case 'user_cancel_facebook_auth':
      return { ...state, facebookButtonDisabled: false }
    case 'disable_google_button':
      return { ...state, googleButtonDisabled: true }
    case 'user_cancel_google_auth':
      return { ...state, googleButtonDisabled: false }
    case 'send_password_reset_email_start':
      return { ...state, sendingPasswordResetEmail: true }
    case 'password_reset_done':
      return { ...state, sendingPasswordResetEmail: false, showPasswordResetSuccess: true }
    default:
      return state
  }
}