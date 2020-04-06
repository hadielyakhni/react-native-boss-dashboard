const INITIAL_STATE = {
  name: '',
  role: '',
  salary: '',
  phone: '',
  email: '',
  sortBy: '',
  sortOrder: '',
  fetchingEmployees: true
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'employees_sort_data_change':
      return { ...state, sortBy: action.payload.sortBy, sortOrder: action.payload.sortOrder }
    case 'fetching_employees':
      return { ...state, fetchingEmployees: true }
    case 'employees_fetch_success':
      return { ...state, allEmployees: action.payload, fetchingEmployees: false }
    case 'logout_employees_reset':
      return { ...INITIAL_STATE, sortBy: state.sortBy, sortOrder: state.sortOrder }
    default:
      return state
  }
}