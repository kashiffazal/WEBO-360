const mapStateToProps = (state) => {
  return({
    store_values : state.rootReducer
  })
}
export default mapStateToProps;
