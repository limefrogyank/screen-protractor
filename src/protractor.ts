import { FASTElement, customElement, attr, html, ref, css, observable } from '@microsoft/fast-element';

import type { ViewTemplate } from '@microsoft/fast-element';
import { createDrawing } from './protractorStyleB';
import { RoundButton } from './roundButton';
import ScaleIcon from "@fluentui/svg-icons/icons/scale_fill_20_regular.svg";
import RotateIcon from "@fluentui/svg-icons/icons/arrows_bidirectional_20_regular.svg";

const template: ViewTemplate<Protractor> = html<Protractor>`
    <div tabindex="0" ${ref('div')} aria-label="Protractor. Arrow keys move protractor on screen."
        style="top: ${x => x.y}px; left: ${x => x.x}px; transform-origin: 50% 322.5px; rotate: ${x => x.rotate}deg; scale: ${x => x.scale};">
        <canvas width="641.5" height="346" ${ref('canvas')} ></canvas>
        <fluent-button aria-label="Button drag or use left/right arrows to rotate protractor."
            style=" position:absolute; top: 80px; left: 307px;" ${ref('rotateButton')}>${RotateIcon}</fluent-button>
        <fluent-button aria-label="Button drag or use up/down arrow keys to scale protractor." 
            style="position:absolute; bottom: -10px; right: -10px;" ${ref('scaleButton')}>${ScaleIcon}</fluent-button> 
    </div>
`;

const styles = css`
:host{
    position:absolute;
    top:0;
    left:0;
    z-index:99999;

}
div {
    position: absolute;
    border-radius: 350px 350px 0px 0px;
    touch-action:none;
}
canvas {    
    border-radius: 350px 350px 0px 0px;
}
`;

@customElement({ name: 'screen-protractor', template: template, styles: styles })
export class Protractor extends FASTElement {
    
    @attr top: number = 0;
    @attr left: number = 0;
    @attr scale: number=1;

    div!: HTMLDivElement;
    canvas!: HTMLCanvasElement;
    rotateButton!: RoundButton;
    scaleButton!: RoundButton;

    pointerIds: number[] = [];
    isDragging: boolean = false;
    startPoints: Record<number, [number, number]> = [];

    isRotating: boolean = false;
    rotateStartPoint: [number, number] = [0, 0];
    moveHandle: any;
    upHandle: any;

    isScaling: boolean=false;
    scaleStartPoint: [number, number] = [0,0];
    oldScale:number= 1;
    moveScaleHandle:any;
    upScaleHandle:any;

    @observable x: number = 0;
    @observable y: number = 0;
    @observable rotate: number = 0;
    //@observable scale: number = 1;

    connectedCallback(): void {
        super.connectedCallback();
        let ctx = this.canvas.getContext('2d');
        if (ctx != null) {
            createDrawing(ctx);
        }

        this.x = this.left;
        this.y = this.top;

        this.div.addEventListener('keydown', this.divKeydown.bind(this),false);

        this.canvas.addEventListener('pointerdown', this.pointerDown.bind(this), false);
        this.canvas.addEventListener('pointerup', this.pointerUp.bind(this), false);
        this.canvas.addEventListener('pointermove', this.pointerMove.bind(this), false);
        this.canvas.addEventListener('wheel', this.mouseWheel.bind(this), false);

        this.rotateButton.addEventListener('pointerdown', this.rotateButtonDown.bind(this), false);
        this.rotateButton.addEventListener('keydown', this.rotateButtonKeydown.bind(this), false);
        this.moveHandle = this.rotateButtonMove.bind(this);
        this.upHandle = this.rotateButtonUp.bind(this);

        this.scaleButton.addEventListener('pointerdown', this.scaleButtonDown.bind(this),false);
        this.scaleButton.addEventListener('keydown', this.scaleButtonKeydown.bind(this), false);
        this.moveScaleHandle = this.scaleButtonMove.bind(this);
        this.upScaleHandle = this.scaleButtonUp.bind(this);
    }

  
    
    divKeydown(e:KeyboardEvent){
        const shiftAmount = 5;
        switch (e.key) {
            case 'ArrowLeft':
                this.x -= shiftAmount;
                break;
            case 'ArrowRight':
                this.x += shiftAmount;
                break;
            case 'ArrowUp':
                this.y -= shiftAmount;
                break;
            case 'ArrowDown':
                this.y += shiftAmount;
                break;
            default:
                break;
        }
    }

    rotateButtonKeydown(e: KeyboardEvent) {
        
        const shiftAmount = 2;
        switch (e.key) {
            case 'ArrowLeft':
                this.rotate -= shiftAmount;
                break;
            case 'ArrowRight':
                this.rotate += shiftAmount;
                break;
            default:
                break;
        }
        e.stopPropagation();
    }

    scaleButtonKeydown(e: KeyboardEvent) {
        
        const shiftAmount = 0.02;
        switch (e.key) {
            case 'ArrowUp':
                this.scale *= 1+ shiftAmount;
                break;
            case 'ArrowDown':
                this.scale *= 1-shiftAmount;
                break;
            default:
                break;
        }
        e.stopPropagation();
    }

    scaleButtonDown(e:PointerEvent){
        this.isScaling = true;
        this.scaleStartPoint = [e.clientX, e.clientY];
        this.oldScale = +this.scale; //force it to be a number, sometimes treated as string
        
        window.addEventListener('pointermove', this.moveScaleHandle, false);
        window.addEventListener('pointerup', this.upScaleHandle, false);
    }

    scaleButtonMove(e: PointerEvent) {
        if (this.isScaling) {
            const change = Math.max((e.clientX - this.scaleStartPoint[0])/this.canvas.width, (e.clientY - this.scaleStartPoint[1])/this.canvas.height);
            this.scale = +(this.oldScale + change);
        }
    }

    scaleButtonUp(e: PointerEvent) {
        this.isScaling = false;
        window.removeEventListener('pointermove', this.moveScaleHandle);
        window.removeEventListener('pointerup', this.upScaleHandle);
    }


    rotateButtonDown(e: PointerEvent) {
        this.isRotating = true;
        this.rotateStartPoint = [e.clientX, e.clientY];

        window.addEventListener('pointermove', this.moveHandle, false);
        window.addEventListener('pointerup', this.upHandle, false);
    }

    rotateButtonMove(e: PointerEvent) {
        if (this.isRotating) {

            const scale = 0.4;
            this.rotate += (e.clientX - this.rotateStartPoint[0]) * scale;
            this.rotateStartPoint = [e.clientX, e.clientY];
        }
    }

    rotateButtonUp(e: PointerEvent) {
        this.isRotating = false;
        window.removeEventListener('pointermove', this.moveHandle);
        window.removeEventListener('pointerup', this.upHandle);
    }

    pointerDown(e: PointerEvent) {
        e.preventDefault();
        const x = e.offsetX;
        const y = this.canvas.height - e.offsetY;
        const centerAndRadius = this.canvas.width / 2; //approx
        const centerY = 30;
        const inside = Math.pow(x - centerAndRadius, 2) + Math.pow(y - centerY, 2) < Math.pow(centerAndRadius, 2);
        if (inside) {
            
            this.pointerIds.push(e.pointerId);
            //this.div.setPointerCapture(e.pointerId);

            // console.log('click inside canvas: ' + x + ', ' + y);
            this.isDragging = true;
            this.startPoints[e.pointerId] = [e.clientX, e.clientY];
            //
        } else {
            // this.div.releasePointerCapture(e.pointerId);
            // console.log('click outside canvas: ' + x + ', ' + y);
        }
    }

    pointerUp(e: PointerEvent) {
        this.isDragging = false;
        this.div.releasePointerCapture(e.pointerId);
        this.pointerIds.splice(this.pointerIds.indexOf(e.pointerId),1);
        delete this.startPoints[e.pointerId];
    }


    pointerMove(e: PointerEvent) {
        if (this.isDragging) {
            e.preventDefault();
            e.stopPropagation();
            console.log('moving: ');
            this.x += e.clientX - this.startPoints[e.pointerId][0];
            this.y += e.clientY - this.startPoints[e.pointerId][1];
            this.startPoints[e.pointerId] = [e.clientX, e.clientY];
        }
    }

    mouseWheel(e: WheelEvent) {
        e.preventDefault();
        console.log(e.deltaX);
        const scaleDelta = 0.02
        const scaleDir = Math.sign(e.deltaY);
        if (scaleDir < 0) {
            this.scale *= (1 - scaleDelta);
        } else if (scaleDir > 0) {
            this.scale *= (1 + scaleDelta);
        }
        const rotateDir = Math.sign(e.deltaX);
        if (rotateDir < 0) {
            this.rotate += -0.5;
        } else if (rotateDir > 0) {
            this.rotate += 0.5;
        }

        // }
    }





}