import { FASTElement, customElement, attr, html, ref, css, observable } from '@microsoft/fast-element';

import type { ViewTemplate } from '@microsoft/fast-element';
import { Protractor } from './protractor';
import { Button } from '@microsoft/fast-components';

const template: ViewTemplate<ProtractorButton> = html<ProtractorButton>`
    <fluent-button ${ref("button")} @click="${x => x.clicked()}" appearance="${x=>x.accent ? 'accent' : 'neutral'}">Toggle Protractor</fluent-button>
    
    <screen-protractor scale="${x=>x.scale}" style="display: ${x=>x.showProtractor ? 'block' : 'none'}" ${ref('protractor')}></screen-protractor>
`;



@customElement({ name: 'screen-protractor-button', template: template })
export class ProtractorButton extends FASTElement {

    @attr accent:boolean = false;
    @attr scale:number = 1.0;

    @observable showProtractor:boolean = false;

    protractor!: Protractor;
    button!: Button;

    connectedCallback(): void {
        super.connectedCallback();

    }

    clicked(){
        this.showProtractor = !this.showProtractor;
        console.log(this.button);
        this.protractor.x = this.button.offsetLeft;
        this.protractor.y = this.button.offsetTop;
    }


}