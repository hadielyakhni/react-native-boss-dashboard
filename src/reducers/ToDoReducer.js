const INITIAL_STATE = {
  task: '',
  tasks: {},
  sortBy: '',
  sortOrder: '',
  fetchingTasks: true,
  showUndoDelete: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'tasks_sort_data_change':
      return { ...state, sortBy: action.payload.sortBy, sortOrder: action.payload.sortOrder }
    case 'add_pressed':
      return { ...state, task: '' }
    case 'fetching_tasks':
      return { ...state, fetchingTasks: true }
    case 'tasks_fetch_success':
      return { ...state, tasks: action.payload, fetchingTasks: false }
    case 'logout_tasks_reset':
      return { ...INITIAL_STATE, sortBy: state.sortBy, sortOrder: state.sortOrder }
    case 'show_undo_task_message':
      return { ...state, showUndoDelete: true }
    case 'hide_undo_task_message': {
      if (!state.showUndoDelete)
        return { ...state }
      return { ...state, showUndoDelete: false }
    }
    default:
      return state
  }
}