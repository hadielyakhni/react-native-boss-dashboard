const getAuthError = (nativeError, isFromForget) => {
  switch (nativeError) {
    case 'Error: CONNECTION_FAILURE: CONNECTION_FAILURE':
    case 'Error: [auth/unknown] A network error (such as timeout, interrupted connection or unreachable host) has occurred.':
      return 'Connection not available. Check your internet connection and try again!'
    case 'Error: [auth/invalid-email] The email address is badly formatted.':
      return 'Please enter a valid email!'
    case 'Error: [auth/weak-password] The given password is invalid. [ Password should be at least 6 characters ]':
      return 'Password should at least be 6 characters!'
    case 'Error: [auth/wrong-password] The password is invalid or the user does not have a password.':
      return 'Invalid email or password! Try again or click on Forgot Password link to reset your password.'
    case 'Error: [auth/user-not-found] There is no user record corresponding to this identifier. The user may have been deleted.':
      return 'No user found with this email address.'
    case 'Error: [auth/account-exists-with-different-credential] An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.':
      return 'An account with the same email address already exists! Try signin with email and password, or click on the Forgot Password link to reset your password.'
    case 'Error: [auth/email-already-in-use] The email address is already in use by another account.':
      return 'The email address is already in use by another account! You can click on the Forgot Password link to reset your password.'
    case 'Error: [auth/unknown] We have blocked all requests from this device due to unusual activity. Try again later.':
      return 'We have blocked all requests from this device due to unusual activity. Try again later.'
    default:
      return nativeError
  }
}

export default getAuthError