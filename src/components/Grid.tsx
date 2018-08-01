import * as React from 'react';
import { TabRegistry } from '../TabRegistry';
import { ArrowKey } from './Focuser';
import { Section } from './Section';
import { TabBoundary } from './TabBoundary';

function findFieldCoordinates(fieldMap: (string | null)[][], label: string): [number, number] | null {
    for (let y = 0; y < fieldMap.length; y++) {
        for (let x = 0; x < 2; x++) {
            if (label === fieldMap[y][x]) {
                return [x, y];
            }
        }
    }
    return null;
}

interface Props {
    fieldMap: (string | null)[][];
}
interface State {}

export class Grid extends React.Component<Props, State> {
    public static readonly contextTypes = TabBoundary.childContextTypes;
    public readonly context!: {
        tabRegistry?: TabRegistry<string>;
    };

    private get tabRegistry() {
        if (this.context.tabRegistry == null) {
            return null;
        }

        const detailsRegistry = this.context.tabRegistry.get('company-details');

        if (detailsRegistry instanceof TabRegistry) {
            return detailsRegistry.get('section-container') as TabRegistry<string> | null;
        }

        return null;
    }

    private focusDown(x: number, y: number): boolean {
        if (y === this.props.fieldMap.length - 1 || this.tabRegistry == null) {
            return false;
        }

        const yCandidate = y + 1;
        const nextField = this.props.fieldMap[yCandidate][x];

        if (nextField == null || !this.tabRegistry.focus(nextField)) {
            return this.focusDown(x, yCandidate);
        }
        return false;
    }

    private focusLeft(x: number, y: number): boolean {
        if (x === 0 || this.tabRegistry == null) {
            return false;
        }

        const xCandidate = 0;
        const nextField = this.props.fieldMap[y][xCandidate];

        if (nextField == null || !this.tabRegistry.focus(nextField)) {
            return this.focusUp(xCandidate, y) || this.focusDown(xCandidate, y);
        }

        return true;
    }

    private focusRight(x: number, y: number): boolean {
        if (x === 1 || this.tabRegistry == null) {
            return false;
        }

        const xCandidate = 1;
        const nextField = this.props.fieldMap[y][xCandidate];

        if (nextField == null || !this.tabRegistry.focus(nextField)) {
            return this.focusUp(xCandidate, y) || this.focusDown(xCandidate, y);
        }

        return true;
    }

    private focusUp(x: number, y: number): boolean {
        if (y === 0 || this.tabRegistry == null) {
            return false;
        }

        const yCandidate = y - 1;
        const nextField = this.props.fieldMap[yCandidate][x];

        if (nextField == null || !this.tabRegistry.focus(nextField)) {
            return this.focusUp(x, yCandidate);
        }

        return false;
    }

    private onArrowKeys = (label: string, arrowKey: ArrowKey) => {
        const coordinates = findFieldCoordinates(this.props.fieldMap, label);
        if (coordinates == null) {
            return;
        }

        const x = coordinates[0];
        const y = coordinates[1];

        switch (arrowKey) {
            case 'ArrowUp':
                return this.focusUp(x, y);
            case 'ArrowDown':
                return this.focusDown(x, y);
            case 'ArrowLeft':
                return this.focusLeft(x, y);
            case 'ArrowRight':
                return this.focusRight(x, y);
            default:
                throw new Error(`Unknown arrowKey: ${arrowKey}`);
        }
    };

    public render() {
        return <Section focusKey={this.props.focusKey} />;
    }
}
