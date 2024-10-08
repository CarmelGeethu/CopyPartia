import { LightningElement, api } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import GLOBAL_STYLES from '@salesforce/resourceUrl/common';
import { PCRSCHOOLSEARCH} from 'c/constants';

export default class YaAccordingPcrRequestSearchRows extends LightningElement {
    @api rowData;

    head = PCRSCHOOLSEARCH.HEAD;
    note = PCRSCHOOLSEARCH.NOTE;
    note1 = PCRSCHOOLSEARCH.NOTE1;
    note2 = PCRSCHOOLSEARCH.NOTE2;
    note3 = PCRSCHOOLSEARCH.NOTE3;
    note4 = PCRSCHOOLSEARCH.NOTE4;
    note5 = PCRSCHOOLSEARCH.NOTE5;
    note6 = PCRSCHOOLSEARCH.NOTE6;
    note7 = PCRSCHOOLSEARCH.NOTE7;
    note8= PCRSCHOOLSEARCH.NOTE8;
    note9 = PCRSCHOOLSEARCH.NOTE9;
    note10 = PCRSCHOOLSEARCH.NOTE10;
    get showMessage() {//string.includes(substring);

        if (this.rowData.OtherLocation.includes('<br>')) {
            // Split using a regex to handle both <br> and commas
            let textWithNewLines = this.rowData.OtherLocation.replace('<br>','\n');
this.formattedText = textWithNewLines.replace(/\n/g, '<br>');
            
            console.log(otherLoc);
        }
        // Show the message if any of the required fields (Facebook, Instagram, Website) are null or empty
        return !this.rowData.schoolName && !this.rowData.PrimaryLocation && !this.rowData.PrimaryLocationAddress && !this.rowData.affiliates && !this.rowData.affiliates&& this.rowData.OtherLocation&& this.rowData.isButtonDisabled;
    }
    renderedCallback() {

        loadStyle(this, GLOBAL_STYLES)
        .then(() => {
            console.log('Global CSS loaded successfully');
        })
        .catch(error => {
            console.error('Error loading global CSS', error);
        });
     }
}