import { useCallback, useState } from 'react';

export const useForceRender = () => {
    const [, setUpdater] = useState(0);
    return useCallback(() => setUpdater((s) => s + 1), []);
};
