import type { Preview } from '@storybook/react';
import '@zeroconf/keyboard-navigation/stories/tailwind.css';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
