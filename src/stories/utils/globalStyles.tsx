import { Global } from '@emotion/core';
import React from 'react';

export const globalStyles = (
    <Global
        styles={{
            '*': {
                boxSizing: 'border-box',
            },
            'html,body,#root': {
                display: 'flex',
                height: '100%',
                margin: 0,
                padding: 0,
                width: '100%',
            },
            'body, #root': {
                flex: '1 1 auto',
            },
            '#root': {
                flexDirection: 'column',
                padding: 15,
            },
        }}
    />
);
