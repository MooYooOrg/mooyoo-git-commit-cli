const combineTypeScope = (type, scope) => {
  let thisType = type;

  const thisScope = scope || '';
  const excludeScopes = ['(none)', 'no scope']

  // add scope correctly if ':' is at the end
  if (thisScope.length > 0 && !excludeScopes.includes(thisScope.toLowerCase())) {
    if (thisType.charAt(thisType.length - 1) === ':') {
      thisType = thisType.slice(0, thisType.length - 1);
      thisType = `${thisType}${thisScope.toLowerCase()}:`;
    } else {
      thisType += thisScope;
    }
  }

  return thisType;
};

export default combineTypeScope;
