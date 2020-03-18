const INITIAL_STATE = {
  task: '',
  tasks: {},
  fetchingTasks: true,
  deletingTask: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'add_pressed':
      return { ...state, task: '' }
    case 'fetching_tasks':
      return { ...state, fetchingTasks: true }
    case 'tasks_fetch_success':
      return { ...state, tasks: action.payload, fetchingTasks: false }
    case 'deleting_task_started':
      return { ...state, deletingTask: true }
    case 'deleting_task_finished':
      return { ...state, deletingTask: false }
    case 'logout_tasks_reset':
      return { ...INITIAL_STATE }
    default:
      return state
  }
}