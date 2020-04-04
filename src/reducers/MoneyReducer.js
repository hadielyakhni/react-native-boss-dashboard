const INITIAL_STATE = {
  name: '',
  status: 'ME',
  amount: 0,
  amount1: 0,
  amount2: 0,
  amount3: 0,
  sortBy: '',
  sortOrder: '',
  fetchingAccounts: true,
  deletingAccount: false,
  addingAccount: false,
  updatingAccount: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'accounts_sort_data_change':
      return { ...state, sortBy: action.payload.sortBy, sortOrder: action.payload.sortOrder }
    case 'fetching_accounts':
      return { ...state, fetchingAccounts: true }
    case 'accounts_fetch_success':
      return { ...state, allAccounts: action.payload, fetchingAccounts: false }
    case 'account_deleting_started':
      return { ...state, deletingAccount: true }
    case 'account_deleting_finished':
      return { ...state, deletingAccount: false }
    case 'account_adding_started':
      return { ...state, addingAccount: true }
    case 'account_adding_finished':
      return { ...state, addingAccount: false }
    case 'logout_accounts_reset':
      return { ...INITIAL_STATE, sortBy: state.sortBy, sortOrder: state.sortOrder }
    default:
      return state
  }
}