import { 
    provideFASTDesignSystem, 
    // fastCard, 
     fastButton
  } from '@microsoft/fast-components';
import { provideFluentDesignSystem, fluentButton } from '@fluentui/web-components';
import { Protractor } from './protractor';
import { ProtractorButton } from './protractorButton';
import { RoundButton } from './roundButton';
  
   provideFluentDesignSystem()
       .register(
//           fastCard(),
fluentButton(),

       );

Protractor;
ProtractorButton;
RoundButton;
