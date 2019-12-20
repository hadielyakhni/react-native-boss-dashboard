const INITIAL_STATE = {
  name: '',
  phone: '',
  role: '',
  salary: '',
  fetchingEmployees: true,
  deletingEmployee: false,
  addingEmployee: false,
  updatingEmployee: false
}

export default (state = INITIAL_STATE, action) => {
  if (action.type === 'employees_fetch_success')
    console.log('employees reducer fetch success')
  switch (action.type) {
    case 'employee_updated':
      return { ...state, [action.payload.prop]: action.payload.value }
    case 'fetching_employees':
      return { ...state, fetchingEmployees: true }
    case 'employees_fetch_success':
      return { ...state, allEmployees: action.payload, fetchingEmployees: false }
    case 'employee_reset':
      return { ...state, ...INITIAL_STATE, fetchingEmployees: false }
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
      return { ...INITIAL_STATE }
    default:
      return state
  }
}