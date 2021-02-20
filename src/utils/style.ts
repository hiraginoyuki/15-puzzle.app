import { CSSProperties } from "react";
import { kebab } from 'case';

function convertKeyCase(variables: {}, converter: (original: string) => string): {} {
  return Object.fromEntries(
    Object.entries(variables).map(([key, value]) => [converter(key), value])
  );
}
const converter = (s: string) => `--${kebab(s)}`;
const styleObjProto = {
  var(variables: {}) {
    return Object.assign(style, variable(variables));
  }
};

export const variable = (variables: {}) => convertKeyCase(variables, converter) as CSSProperties;
export function style(style: CSSProperties) {
  return Object.assign(
    Object.create(styleObjProto), style
  ) as CSSProperties & { var(variables: {}): CSSProperties; };
}

style.var = variable;
