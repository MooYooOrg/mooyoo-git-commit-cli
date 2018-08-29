const combineTypeScope = (type, scope) => {
  let thisType = type;

  const thisScope = scope || '';

  // add scope correctly if ':' is at the end
  if (thisScope.length > 0 && thisScope !== '(None)' && thisScope !== '(none)') {
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
