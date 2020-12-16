import React, { PropsWithChildren, HTMLAttributes } from 'react';
import { joinClassNames } from '..';
import styles from './style.module.scss';

export function FlexCenteringContainer(props: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} className={joinClassNames(styles.flexCenteringContainer, props.className)}> {props.children} </div>;
}
