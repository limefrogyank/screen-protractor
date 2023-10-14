import { FASTElement, customElement, attr, html, ref, css, observable } from '@microsoft/fast-element';

import type { ViewTemplate } from '@microsoft/fast-element';
import { Protractor } from './protractor';

const template: ViewTemplate<ProtractorButton> = html<ProtractorButton>`
    <fluent-button @click="${x => x.clicked()}" appearance="${x=>x.accent ? 'accent' : 'neutral'}">Toggle Protractor</fluent-button>
    
    <screen-protractor style="display: ${x=>x.showProtractor ? 'block' : 'none'}" ${ref('protractor')}></screen-protractor>
`;



@customElement({ name: 'screen-protractor-button', template: template })
export class ProtractorButton extends FASTElement {

    @attr accent:boolean = false;

    @observable showProtractor:boolean = false;

    protractor!: Protractor;

    connectedCallback(): void {
        super.connectedCallback();

    }

    clicked(){
        this.showProtractor = !this.showProtractor;
        this.protractor.x = 0;
        this.protractor.y = 0;
    }


}