import { LightningElement,api,track,wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import GRID_REFRESH_CHANNEL from '@salesforce/messageChannel/GridRefreshChannel__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveHandshakePCRData from '@salesforce/apex/SubmitPCRequest.saveHandshakePCRData';
import uploadFile from '@salesforce/apex/yaFileUploaderClass.uploadFile';
import yaCommunicationSettings from '@salesforce/apex/yaCommunicationSettingsController.yaCommunicationSettings';
import userId from '@salesforce/user/Id';
import { PCRSUBMIT,PCRUPLOAD} from 'c/constants';
export default class YaAccordionPcrRequestSubmit extends LightningElement {
    head = PCRUPLOAD.HEAD;
    head1 = PCRUPLOAD.HEADNAME;
    pgmDate = PCRUPLOAD.PGMDATE;
    rys = PCRUPLOAD.RYS;
    note = PCRSUBMIT.HEAD;
    note1 = PCRSUBMIT.HEADNAME;
    note2 = PCRSUBMIT.NOTE;
    note3 = PCRSUBMIT.NOTE1;
    note4 = PCRSUBMIT.NOTE2;
    note5 = PCRSUBMIT.NOTE3;
    note6 = PCRSUBMIT.NOTE4;

    @wire(MessageContext)
    messageContext;
    @api isGetconfirmationactive;
    @api rbValue;
    @api formattedstartDate;
    @api formattedendDate;
    @api startDate;
    @api endDate;
    @api receivedValue;
    @api schoolidSelected ;
    @api credentialName;
    @api fileData;
    @track scredentialName;
    @track sschoolidSelected;
    @track sValue;
    @track sformattedStartDate;
    @track sformattedEndDate;
    @track sstartDate;
    @track sendDate;
    @track sreceivedValue;
    @track sfileData;
    @track isGetConfirmationActived;
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
        this.sschoolidSelected=this.schoolidSelected ;
        this.sValue=this.rbValue;
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
        this.sfileData=this.fileData;
        this.sstartDate=this.startDate;
        this.sendDate=this.endDate;
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
        console.log('sValue',this.sValue);
        console.log('sValue',this.sreceivedValue);
        console.log('scredentialName',this.scredentialName);
        console.log('sformattedStartDate',this.sformattedStartDate);
        console.log('sformattedEndDate',this.sformattedEndDate);
        console.log('SfileData',this.sfileData);
        console.log('Sschoolidselected',this.sschoolidSelected);
        
        this.isGetConfirmationActived=this.isGetconfirmationactive;
        console.log(this.isGetconfirmationactive,'isGetconfirmationactive in Submit',this.isGetConfirmationActived);
    }
    
    submitRequest() {
        // Ensure fileData has values before proceeding
        console.log('submitRequest...');
        this.isLoading = true;
        debugger;
        if (this.sfileData && this.sfileData.base64 && this.sfileData.filename && this.sfileData.recordId) {
            const { base64, filename, recordId } = this.sfileData;
            uploadFile({ base64, filename, recordId })
                .then(result => {
                    this.sfileData = {}; // Clear file data
                    this.showToast('Success', `${filename} uploaded successfully!`, 'success');
                    console.log('Uploaded successfully!!');// Now call the Apex method to save the handshake and course/program confirmation
                return saveHandshakePCRData({
                    loggedContactId: this.contactId,//this.contact,this.recordId,
                    SchoolId: this.sschoolidSelected,
                    certificateFileId: result, // Assuming the result is the file ID
                    message:'PCR',
                    Startdate:this.sstartDate,
                    Enddate:this.sendDate,
                    SelectedCredential:this.sValue,
                });
                }) 
                .then(() => {
                    
                this.showToast('Records created successfully!');
                console.log('Records created successfully!');
                this.handleSubmitClick();
                const payload = { message: 'refreshGrid' };
        publish(this.messageContext, GRID_REFRESH_CHANNEL, payload);
            })
                .catch(error => {
                    this.showToast('Error', 'File upload failed', 'error');
                    console.error('Error uploading file:', error.body.message);
                })
                .finally(() => {
                    this.isLoading = false; // Hide spinner and enable button
                });
        } else {
            this.showToast('Error', 'File data is incomplete. Please try again.', 'error');
        }
     }
     handleSubmitClick() {
        const ProgramDetailsClickevents = new CustomEvent('setsubmit', {
            detail: { 
                isUploadCertificateActive: false,  // Correct syntax: key: value
                isGetConfirmationActive: false ,
                isProgramDetailsActive : false,
                isAfterConfirmationActive: true,
                isAddingProgrambtn:false,
                fileData:null,
            }
        });
    
        // Dispatch the custom event to notify the parent component
        this.dispatchEvent(ProgramDetailsClickevents);        
        //this.updateStepClasses();
        
     } 
     showToast(title, message, variant = 'info') {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
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
     completeProgramDetails() {
        this.isProgramDetailsActive = false;
        this.isUploadCertificateActive = true;
        //this.updateStepClasses();
     }
     handleChangeUpload() {
        this.handleUploadCertificateClick();
        // Add logic to handle the "Change" button click
        console.log('Upload Change button clicked');
        // You can add any specific actions you want here
     }
     handleUploadCertificateClick() {
        const UploadCertificateClickevents = new CustomEvent('setuploadflag', {
            detail: { 
                isUploadCertificateActive: true,  // Correct syntax: key: value
                isGetConfirmationActive: false ,
                isProgramDetailsActive : false,
                isButtonDisabled : false,
                isButtonDisabledConfirm : true,
                isButtonDisabledPgm:true
            }
        });
    
        // Dispatch the custom event to notify the parent component
        this.dispatchEvent(UploadCertificateClickevents);
     }
}