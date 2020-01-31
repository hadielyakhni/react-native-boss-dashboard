const INITIAL_STATE = {
    name: '',
    status: 'ME',
    amount: 0,
    amount1: 0,
    amount2: 0,
    amount3: 0,
    fetchingAccounts: true,
    deletingAccount: false,
    addindAccount: false,
    updatingAccount: false
}

export default (state = INITIAL_STATE, action) => {
    if (action.type === 'accounts_fetch_success')
        console.log('moneyss reducer fetch success')
    switch (action.type) {
        case 'fetching_accounts':
            return { ...state, fetchingAccounts: true }
        case 'accounts_fetch_success':
            return { ...state, allAccounts: action.payload, fetchingAccounts: false }
        case 'account_updated':
            return { ...state, [action.payload.prop]: action.payload.value }
        case 'account_deleting_started':
            return { ...state, deletingAccount: true }
        case 'account_deleting_finished':
            return { ...state, deletingAccount: false }
        case 'account_adding_started':
            return { ...state, addingAccount: true }
        case 'account_adding_finished':
            return { ...state, addingAccount: false }
        case 'account_updating_started':
            return { ...state, updatingAccount: true }
        case 'account_updating_finished':
            return { ...state, updatingAccount: false }
        case 'logout_accounts_reset':
            return { ...state, ...INITIAL_STATE }
        default:
            return state
    }
}