export function objectDeepValue(obj, path) {
  const pathArray = path.split('.');
  for (let i = 0; i < pathArray.length; i++) {
    obj = obj[pathArray[i]];
  }
  return obj;
}
