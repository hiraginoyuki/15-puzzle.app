var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import { joinClassNames } from '..';
import styles from './style.scss';
export function FlexCenteringContainer(props) {
    return React.createElement("div", __assign({}, props, { className: joinClassNames(styles.flexCenteringContainer, props.className) }),
        " ",
        props.children,
        " ");
}
//# sourceMappingURL=flex-centering-container.js.map