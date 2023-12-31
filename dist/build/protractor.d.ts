import { FASTElement } from '@microsoft/fast-element';
import { RoundButton } from './roundButton';
export declare class Protractor extends FASTElement {
    top: number;
    left: number;
    scale: number;
    div: HTMLDivElement;
    canvas: HTMLCanvasElement;
    rotateButton: RoundButton;
    scaleButton: RoundButton;
    pointerIds: number[];
    isDragging: boolean;
    startPoints: Record<number, [number, number]>;
    isRotating: boolean;
    rotateStartPoint: [number, number];
    moveHandle: any;
    upHandle: any;
    isScaling: boolean;
    scaleStartPoint: [number, number];
    oldScale: number;
    moveScaleHandle: any;
    upScaleHandle: any;
    x: number;
    y: number;
    rotate: number;
    connectedCallback(): void;
    divKeydown(e: KeyboardEvent): void;
    rotateButtonKeydown(e: KeyboardEvent): void;
    scaleButtonKeydown(e: KeyboardEvent): void;
    scaleButtonDown(e: PointerEvent): void;
    scaleButtonMove(e: PointerEvent): void;
    scaleButtonUp(e: PointerEvent): void;
    rotateButtonDown(e: PointerEvent): void;
    rotateButtonMove(e: PointerEvent): void;
    rotateButtonUp(e: PointerEvent): void;
    pointerDown(e: PointerEvent): void;
    pointerUp(e: PointerEvent): void;
    pointerMove(e: PointerEvent): void;
    mouseWheel(e: WheelEvent): void;
}
//# sourceMappingURL=protractor.d.ts.map