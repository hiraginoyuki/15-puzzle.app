import { useState } from 'react';
export function useForceUpdate() {
    var _a = useState(0), setValue = _a[1];
    return function () { return setValue(function (value) { return value + 1; }); };
}
//# sourceMappingURL=use-force-update.js.map