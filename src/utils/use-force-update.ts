import { useState } from 'react';
import { useConstant } from './use-constant';

export function useForceUpdate() {
  const [, setValue] = useState(0);
  const forceUpdate = useConstant(() => () => setValue(value => value + 1));
  return forceUpdate;
}
