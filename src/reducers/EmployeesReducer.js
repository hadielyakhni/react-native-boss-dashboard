const INITIAL_STATE = {
  name: '',
  role: '',
  salary: '',
  phone: '',
  email: '',
  sortBy: '',
  sortOrder: '',
  fetchingEmployees: true,
  deletingEmployee: false,
  addingEmployee: false,
  updatingEmployee: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'employees_sort_data_change':
      return { ...state, sortBy: action.payload.sortBy, sortOrder: action.payload.sortOrder }
    case 'fetching_employees':
      return { ...state, fetchingEmployees: true }
    case 'employees_fetch_success':
      return { ...state, allEmployees: action.payload, fetchingEmployees: false }
    case 'employee_deleting_started':
      return { ...state, deletingEmployee: true }
    case 'employee_deleting_finished':
      return { ...state, deletingEmployee: false }
    case 'employee_adding_started':
      return { ...state, addingEmployee: true }
    case 'employee_adding_finished':
      return { ...state, addingEmployee: false }
    case 'employee_updating_started':
      return { ...state, updatingEmployee: true }
    case 'employee_updating_finished':
      return { ...state, updatingEmployee: false }
    case 'logout_employees_reset':
      return { ...INITIAL_STATE, sortBy: state.sortBy, sortOrder: state.sortOrder }
    default:
      return state
  }
}