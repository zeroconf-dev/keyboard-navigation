import { useState, useCallback } from 'react';

export const useForceRender = () => {
    const [, setUpdater] = useState(0);
    return useCallback(() => setUpdater((s) => s + 1), []);
};
