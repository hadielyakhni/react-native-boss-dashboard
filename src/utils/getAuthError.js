const getAuthError = (nativeError) => {
  switch (nativeError) {
    case 'Error: NETWORK_ERROR':
    case 'Error: CONNECTION_FAILURE: CONNECTION_FAILURE':
    case 'Error: [auth/unknown] A network error (such as timeout, interrupted connection or unreachable host) has occurred.':
      return 'err1'
    case 'Error: [auth/invalid-email] The email address is badly formatted.':
      return 'err2'
    case 'Error: [auth/weak-password] The given password is invalid. [ Password should be at least 6 characters ]':
      return 'err3'
    case 'Error: [auth/wrong-password] The password is invalid or the user does not have a password.':
      return 'err4'
    case 'Error: [auth/user-not-found] There is no user record corresponding to this identifier. The user may have been deleted.':
      return 'err5'
    case 'Error: [auth/account-exists-with-different-credential] An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.':
      return 'err6'
    case 'Error: [auth/email-already-in-use] The email address is already in use by another account.':
      return 'err7'
    case 'Error: [auth/unknown] We have blocked all requests from this device due to unusual activity. Try again later.':
      return 'err8'
    case 'Time out error! Check your internet connection and try again later.':
      return 'err9'
    default:
      return 'err10'
  }
}

export default getAuthError