/* Structural signature helpers shared by the parity tests.

   A "shape" is the recursive key structure of a value with all leaf strings
   erased. Two language blocks with the same shape are guaranteed to be
   index-aligned and key-aligned, which is the only property the components
   actually rely on. */

export function shape(value, path = '') {
  if (Array.isArray(value)) {
    return value.map((item, i) => shape(item, `${path}[${i}]`));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, shape(value[k], `${path}.${k}`)])
    );
  }
  return typeof value;
}

/* Every leaf string in the tree, with its path, so tests can assert on copy
   itself (non-empty, no forbidden characters) rather than just structure. */
export function leaves(value, path = '', out = []) {
  if (Array.isArray(value)) {
    value.forEach((item, i) => leaves(item, `${path}[${i}]`, out));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) leaves(v, path ? `${path}.${k}` : k, out);
  } else if (typeof value === 'string') {
    out.push({ path, text: value });
  }
  return out;
}
