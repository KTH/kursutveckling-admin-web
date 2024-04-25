function addParamToPath(path, param, value) {
  const paramToReplace = ':' + param
  return path.replace(paramToReplace, value)
}

export { addParamToPath }
