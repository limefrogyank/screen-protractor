import { FASTElement, customElement, attr, html, ref, css, observable, ViewTemplate } from '@microsoft/fast-element';
import { Button, buttonTemplate, ElementDefinitionContext, startSlotTemplate, endSlotTemplate } from '@microsoft/fast-foundation';
import { buttonStyles } from '@fluentui/web-components';
import { } from '@microsoft/fast-components';


export const roundButtonStyles = 
    css`
     
     :host{
        
      }

      
    `;

 export const template : ViewTemplate<RoundButton> = html<RoundButton>`
    <fluent-button style="border-radius: 50%"><slot></slot></fluent-button>
`;



@customElement({ name: 'fluent-round-button', shadowOptions: {delegatesFocus: true}, template,  styles: roundButtonStyles})
export class RoundButton extends FASTElement {


    connectedCallback(): void {
        super.connectedCallback();
        
    }



}



