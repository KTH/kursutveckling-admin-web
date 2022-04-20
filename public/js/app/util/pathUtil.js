function _addParamToPath (path, param, value) {
  var paramToReplace = ':' + param
  return path.replace(paramToReplace, value)
}

export {
  addParamToPath: _addParamToPath
}
