export default (state = { exitCount: 0 }, action) => {
  switch (action.type) {
    case 'increment_exit_count':
      return { exitCount: state.exitCount + 1 }
    case 'reset_exit_count':
      return { exitCount: 0 }
    default:
      return state
  }
}