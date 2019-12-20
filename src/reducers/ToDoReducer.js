const INITIAL_STATE = {
  task: '',
  tasks: {},
  fetchingTasks: true
}

export default (state = INITIAL_STATE, action) => {
  if (action.type === 'tasks_fetch_success')
    console.log('todo reducer fetch success')
  switch (action.type) {
    case 'add_pressed':
      return { ...state, task: '' }
    case 'task_changed':
      return { ...state, task: action.payload }
    case 'fetching_tasks':
      return { ...state, fetchingTasks: true }
    case 'tasks_fetch_success':
      return { ...state, tasks: action.payload, fetchingTasks: false }
    case 'logout_tasks_reset':
      return { ...INITIAL_STATE }
    default:
      return state
  }
}