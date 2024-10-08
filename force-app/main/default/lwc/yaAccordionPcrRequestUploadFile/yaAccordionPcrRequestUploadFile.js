import { LightningElement, wire, track ,api} from 'lwc';
import yaCommunicationSettings from '@salesforce/apex/yaCommunicationSettingsController.yaCommunicationSettings';
import userId from '@salesforce/user/Id';
import { loadStyle } from 'lightning/platformResourceLoader';
import GLOBAL_STYLES from '@salesforce/resourceUrl/common';
import { PCRUPLOAD} from 'c/constants';

export default class YaAccordionPcrRequestUploadFile extends LightningElement {
    head = PCRUPLOAD.HEAD;
    head1 = PCRUPLOAD.HEADNAME;
    pgmDate = PCRUPLOAD.PGMDATE;
    rys = PCRUPLOAD.RYS;
    note = PCRUPLOAD.NOTE;
    note1 = PCRUPLOAD.NOTE1;
    note2 = PCRUPLOAD.NOTE2;
    note3 = PCRUPLOAD.NOTE3;
    head = PCRUPLOAD.HEAD;
    

    @api isUploadCertificateActive;
    @api rbValue;
    @api formattedstartDate;
    @api formattedendDate;
    @api receivedValue;
    @api credentialName;
    @track sValue;
    @track sformattedStartDate;
    @track sformattedEndDate;
    @track sreceivedValue;
    @track scredentialName;
    @track fileData;
    @track isUploadCertificateActived=false;
    @track isProgramDetailsActive=false;
    @track isOpenInsideAccordionCourseCertificate=false;
    @track isFinishedInsideAccordionCourseCertificate=false;
    @track isGetConfirmationActive=false;
    @track flag = false; // Initialize the flag
    @track designation;
    ContactId;
    userId = userId; // Sample userId, replace as needed
    @wire(yaCommunicationSettings, { userId: '$userId' })
    wiredContact({ error, data }) {
        if (data) {
            this.contact = data;
            this.contactId = this.contact.Id;// Assign the contact ID to recordId
            this.loading = false;
        } else if (error) {
            console.error(error);
            this.loading = false;
        }
    }
connectedCallback() {
    
    console.log('isUploadCertificateActive',this.isUploadCertificateActive);
    this.isUploadCertificateActived=this.isUploadCertificateActive;    
   this.isProgramDetailsActive = '';
    this.sValue=this.rbValue;
    if(this.sValue=='RYS200')
    {
        this.designation='RYS® 200';
    }
    else if(this.sValue=='RYS300')
        {
            this.designation='RYS® 300';
            
        }
    else if(this.sValue=='RYS500')
            {
                this.designation='RYS® 500';
                
            }
    this.scredentialName=this.credentialName;
    this.sreceivedValue=this.receivedValue;
    this.sformattedStartDate=new Date(this.formattedstartDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    this.sformattedEndDate=new Date(this.formattedendDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    console.log('sValue',this.sValue);
    console.log('sreceivedValue',this.sreceivedValue);
    console.log('Scredentialname',this.scredentialName);
    console.log('SformattedStartDate',this.sformattedStartDate);
    console.log('SformattedEndDate',this.sformattedEndDate);
}    
renderedCallback() {
    // Construct the full image URL
   
    loadStyle(this, GLOBAL_STYLES)
    .then(() => {
        console.log('Global CSS loaded successfully');
    })
    .catch(error => {
        console.error('Error loading global CSS', error);
    });
 }
     openfileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                this.fileData = {
                    filename: file.name,
                    base64: base64,
                    recordId: this.contactId,//this.contact,//this.recordId // logged teacher Id
                };
                console.log('File data:', this.fileData);
                this.completeUploadCertificate(); // Call method after setting fileData//     
                
            };
            reader.readAsDataURL(file);
        }

}
handleChangeSchool() {
    this.handleProgramDetailsClick();
    // Add logic to handle the "Change" button click
    console.log('School Change button clicked');
    // You can add any specific actions you want here
 }
 
 handleProgramDetailsClick() {
    const ProgramDetailsClickevents = new CustomEvent('setschoolflag', {
        detail: { 
            isUploadCertificateActive: false,  // Correct syntax: key: value
            isGetConfirmationActive: false ,
            isProgramDetailsActive : true,
            isButtonDisabled : true,
            isButtonDisabledConfirm : true,
            isButtonDisabledPgm:false
        }
    });

    // Dispatch the custom event to notify the parent component
    this.dispatchEvent(ProgramDetailsClickevents);        
    //this.updateStepClasses();
 } 
completeUploadCertificate() {
    
    const events = new CustomEvent('setflag', {
        detail: { 
            isUploadCertificateActive: false,  // Correct syntax: key: value
            isGetConfirmationActive: true ,
            isProgramDetailsActive : false,
            isButtonDisabled : true,
            isButtonDisabledConfirm : false,
            isButtonDisabledPgm:true,
            fileData: this.fileData
        }
    });

    // Dispatch the custom event to notify the parent component
    this.dispatchEvent(events);

    // If you need to log the dispatched values, use event details
    console.log('completeUploadCertificate: isGetConfirmationActive:', events.detail.isGetConfirmationActive);
    console.log('completeUploadCertificate: isUploadCertificateActive:', events.detail.isUploadCertificateActive);

}
toggleInsideAccordionCourseCertificate() {
    this.isOpenInsideAccordionCourseCertificate=!this.isOpenInsideAccordionCourseCertificate;
 }
}