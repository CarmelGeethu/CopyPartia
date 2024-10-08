import { LightningElement, wire, track ,api} from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import PCR_MESSAGE_CHANNEL from '@salesforce/messageChannel/PcrMessageChannel__c';
import getItems from '@salesforce/apex/ItemController.getItemsbyCredential';
import { loadStyle } from 'lightning/platformResourceLoader';
import GLOBAL_STYLES from '@salesforce/resourceUrl/common';
import userId from '@salesforce/user/Id';
import customHelpIcon from '@salesforce/resourceUrl/customHelpIcon';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import yaCommunicationSettings from '@salesforce/apex/yaCommunicationSettingsController.yaCommunicationSettings';
import backgroundImages from '@salesforce/resourceUrl/backgroundImages';
import { PCRPARENT} from 'c/constants';

export default class YaAccordionPcrRequestParent extends LightningElement {

head = PCRPARENT.HEAD;
btnName = PCRPARENT.BTNNAME;
rys200 = PCRPARENT.RYS200;
rys300 = PCRPARENT.RYS300;
rys500 = PCRPARENT.RYS500;
pgmDate = PCRPARENT.PRGDATES;
pgmBtn=PCRPARENT.PRGBTN;
uplBtn=PCRPARENT.UPLBTN;
subBtn=PCRPARENT.SUBBTN;
trnDes=PCRPARENT.TRNDES;
schDes=PCRPARENT.SCHDES;
schDes1=PCRPARENT.SCHDES1;
schDes2=PCRPARENT.SCHDES2;
schDes3=PCRPARENT.SCHDES3;
schDes4=PCRPARENT.SCHDES4;
schDes5=PCRPARENT.SCHDES5;
schDes6=PCRPARENT.SCHDES6;
schDes7=PCRPARENT.SCHDES7;
cityFil1=PCRPARENT.CITYFIL1;
cityFil2=PCRPARENT.CITYFIL2;
@track PCRRequest = [];
@track recordId;
@track contentDocuments = [];
@api hideDiv ;
flag=false;
@track isModalOpen = false;
customHelpIconUrl = customHelpIcon;
@track isOpenSettings = false;
@track isAddingProgram = false;
@track hasPcrRequests = false;
@track isButtonDisabled = true;
@track isButtonDisabledConfirm = true;
@track isButtonDisabledPgm=false;
@api fileData;
@api selectedCredential;
@track isOpenInsideAccordionCourseCertificate=false;
@track isFinishedInsideAccordionCourseCertificate=false;
// Track the state of the steps
@track isProgramDetailsActive = true;
@track isUploadCertificateActive = false;
@track isGetConfirmationActive = false;
@track isAfterConfirmationActive=false;
@track isAddingProgrambtn=true;
@track isrys200=false;
@track iserys200=false;
@track isrys500=false;
@track iserys500=false;
@track isrcys=false;
@track isrpys=false;
@track selectedCredentials;
@track isPCRRequest=false;
isLoading = false;
// CSS classes for step states
@track programDetailsClass = 'current';
@track uploadCertificateClass = '';
@track getConfirmationClass = '';
@track searchTerm = '';
@track triggerSearchTerm = '';
@track startDate;
@track endDate;
@track formattedStartDate;
@track formattedEndDate;
@track startDateErrorMessage = ''; // Variable to hold the error message for Start Date
@track endDateErrorMessage = '';   // Variable to hold the error message for End Date
@track value = ''; // Holds the selected value
@track courseId = ''; // Holds the selected value
@track uploadFlag=false;
@track receivedValue = ''; // Variable to hold the value from the child
@track schoolId = ''; 
@track credentialName='';
@track credentialDescription='';
@track showErrorMessage = false; // Tracks visibility of error message
@track errorMessage = ''; // Stores the error message text
@track showErrorMessagerd = false; // Tracks visibility of error message
@track errorMessagerd = ''; // Stores the error message text
@track triggerSearch=false;
@track selectedValue = '';
@track City='';
@track showMore=false;
@track isAddingBtn=true;
@track contact;
contactId;
items= null;
userId=userId;

imageUrl = `${backgroundImages}/backgroundImages/ya_active.png`;

 
@wire(yaCommunicationSettings, { userId: '$userId' })
wiredContact({ error, data }) {
    if (data) {
        this.contact = data;
        this.contactId=this.contact.Id;
        this.loading = false;
    } else if (error) {
        console.error(error);
        this.loading = false;
    }
}
@wire(MessageContext)
    messageContext;


@wire(getItems, { selectedCredential: '$credentialName' })
wiredItems({ error, data }) {
    if (data) {
        // Clone the data and map it to include additional properties if needed
        this.items = data;
        console.log('Wired fetched ITEMS PARENTS:',JSON.stringify(this.items));
    } else if (error) {
        console.error('Error fetching items:', error);
    }
}
renderedCallback() {
   // Construct the full image URL
   this.imageUrl = `${backgroundImages}/backgroundImages/ya_active.png`;

   // Log the image URL to ensure it is correct
   console.log('Image URL:', this.imageUrl);

   // Set the CSS variable on the host element
   this.template.host.style.setProperty('--background-image-url', `url("${this.imageUrl}")`);


   // Log to check if the variable is set correctly
   console.log(getComputedStyle(this.template.host).getPropertyValue('--background-image-url'));
   loadStyle(this, GLOBAL_STYLES)
   .then(() => {
       console.log('Global CSS loaded successfully');
   })
   .catch(error => {
       console.error('Error loading global CSS', error);
   });
}


connectedCallback() {
    //debugger;
    console.log('selectedCredential',this.selectedCredential);
   this.programDetailsClass = 'current';
   this.uploadCertificateClass = '';
   this.getConfirmationClass = '';   
   this.isButtonDisabled =true;
   this.isButtonDisabledConfirm =true;
   this.isButtonDisabledPgm=false;
   this.isProgramDetailsActive = true;
   this.isUploadCertificateActive = false;
   this.isGetConfirmationActive = false;// Call the clear method
   this.isAfterConfirmationActive=false;
   this.subscription = subscribe(
       this.messageContext,
       PCR_MESSAGE_CHANNEL,
       (message) => this.handleMessage(message)
   );
   //this.loadPCRRequests();
   console.log('In connectedCallback PARENT',this.subscription);
   if(this.subscription==null)
   {
    this.hideDiv=false;
   }
}



handleCity(event)
{
    this.City= event.target.value;
    console.log('city',this.City);
}
toggleShowMore()
{
    this.showMore=!this.showMore;
}
   

handleRadioChange(event) {
 
   this.selectedValue = event.target.value;
   console.log('Selected value:', this.selectedValue); // Logs the selected value
}
handleUpdateComplete(event) {
   this.isAfterConfirmationActive=event.detail.isUpdated;
   console.log('Update status received from child:', this.isAfterConfirmationActive);
   
}
handleMessage(message) {   
   this.programDetailsClass = 'current';
   this.uploadCertificateClass = '';
   this.getConfirmationClass = '';
   this.isProgramDetailsActive = true;
   this.isUploadCertificateActive = false;
   this.isGetConfirmationActive = false;// Call the clear method
   console.log('handleMessage');
   this.fileData=null;
   this.selectedCredential = message.selectedCredential;
   console.log('handleMessage:in Parent', this.selectedCredential.credentialId);   
   this.credentialName = this.selectedCredential.label;
   this. selectedCredentials=this.selectedCredential;

   if (this.credentialName) {
       // Trigger the wire service when the credentialName is set
       console.log('Triggering getItems wire service for:', this.credentialName);
   }

   if(this.selectedCredential.credentialId=='ryt200')
   {              
   console.log('ryt200:', this.selectedCredential.credentialId);
   this.isrys200=true;
   this.iserys200=false;
   this.isrys500=false;
   this.iserys500=false;
   this.isrcys=false;
   this.isrpys=false;
   }
   else if(this.selectedCredential.credentialId=='eryt200')
   {
       
   console.log('eryt200: in Parent', this.selectedCredential.credentialId);
   this.iserys200=true;
   this.isrys200=false;
   this.isrys500=false;
   this.iserys500=false;
   this.isrcys=false;
   this.isrpys=false;
   }
   else if(this.selectedCredential.credentialId=='ryt500')
   {
      
   console.log('ryt500:in Parent', this.selectedCredential.credentialId);
   this.iserys200=false;
   this.isrys200=false;
   this.isrys500=true;
   this.iserys500=false;
   this.isrcys=false;
   this.isrpys=false;
   }
   else if(this.selectedCredential.credentialId=='eryt500')
       {
         
   console.log('eryt500:in Parent', this.selectedCredential.credentialId);
           this.iserys200=false;
           this.isrys200=false;
           this.isrys500=false;
           this.iserys500=true;
           this.isrcys=false;
           this.isrpys=false;
       }
       else if(this.selectedCredential.credentialId=='rcyt')
           {
            
   console.log('rcyt:in Parent', this.selectedCredential.credentialId);
               this.iserys200=false;
               this.isrys200=false;
               this.isrys500=false;
               this.iserys500=false;
               this.isrcys=true;
               this.isrpys=false; 
           }
            else if(this.selectedCredential.credentialId=='ercyt')
               {
                  
   console.log('ercyt:in Parent', this.selectedCredential.credentialId);
                   this.iserys200=false;
                   this.isrys200=false;
                   this.isrys500=false;
                   this.iserys500=false;
                   this.isrcys=true;
                   this.isrpys=true;
               }
   this.PCRRequest=message.PCRRequest;
   console.log('Received variable from parent via LMS:in Parent', this.PCRRequest);
   if(this.PCRRequest!=null)        
   this.isPCRRequest=true;
   this.isOpenSettings=true;
   //this.hasPcrRequests=true;
   this.isAddingProgram=true;
   this.triggerSearch=false;
}

handleSetFlag(event) {
   // Set the flag value based on the event detail
   this.isUploadCertificateActive = event.detail.isUploadCertificateActive;
   this.isGetConfirmationActive = event.detail.isGetConfirmationActive;
   this.isButtonDisabled =event.detail.isButtonDisabled;
   this.isButtonDisabledConfirm =event.detail.isButtonDisabledConfirm;
   this.isButtonDisabledPgm=event.detail.isButtonDisabledPgm;
   this.fileData=event.detail.fileData;
   this.isAfterConfirmationActive=false;
   this.updateStepClasses();
}
handleSetSubmit(event) {
    //debugger;
   // Set the flag value based on the event detail
   this.isUploadCertificateActive = event.detail.isUploadCertificateActive;
   this.isGetConfirmationActive = event.detail.isGetConfirmationActive;
   this.isProgramDetailsActive=event.detail.isProgramDetailsActive;
   this.isAfterConfirmationActive=event.detail.isAfterConfirmationActive;
   this.isAddingBtn=event.detail.isAddingProgrambtn;
   this.fileData=event.detail.isAddingProgrambtn;
   this.updateStepClasses();
}
handleSetUploadFlag(event) {
   // Set the flag value based on the event detail
   this.isUploadCertificateActive = event.detail.isUploadCertificateActive;
   this.isGetConfirmationActive = event.detail.isGetConfirmationActive;
   this.isProgramDetailsActive=event.detail.isProgramDetailsActive;
   this.isButtonDisabled =event.detail.isButtonDisabled;
   this.isButtonDisabledConfirm =event.detail.isButtonDisabledConfirm;
   this.isButtonDisabledPgm=event.detail.isButtonDisabledPgm;
   this.isAfterConfirmationActive=false;
   this.updateStepClasses();
}
handleSetSchoolFlag(event) {
   // Set the flag value based on the event detail
   this.isUploadCertificateActive = event.detail.isUploadCertificateActive;
   this.isGetConfirmationActive = event.detail.isGetConfirmationActive;
   this.isProgramDetailsActive=event.detail.isProgramDetailsActive;
   this.isButtonDisabled =event.detail.isButtonDisabled;
   this.isButtonDisabledConfirm =event.detail.isButtonDisabledConfirm;
   this.isButtonDisabledPgm=event.detail.isButtonDisabledPgm;
   this.isAfterConfirmationActive=false;
   this.updateStepClasses();
}
handleValueChange(event) {
   console.log('handleValueChange',this.receivedValue);
   this.receivedValue = event.detail.value; // Update the received value
   this.schoolId=event.detail.id;
   console.log('SchoolId',this.schoolId);
   if(this.fileData!=null)
   {
       this.uploadFlag=true;
   }
   else{
       this.uploadFlag=false;
       
   }
   this.isGetConfirmationActive =false;
   this.uploadCertificateClass = 'current';
   this.getConfirmationClass = '';
   this.programDetailsClass='';
   this.isButtonDisabled =false;
   this.isButtonDisabledConfirm =true;
   this.isButtonDisabledPgm=true;
   //this.updateStepClasses();
}

handleEnableButtonconfirm() {
   // Enable the button when the event is received
   this.isButtonDisabledConfirm = false;
   this.isButtonDisabledPgm=true;
}

handleEnableButton() {
   // Enable the button when the event is received
   this.isButtonDisabled = false;
   this.isProgramDetailsActive = false;
   this.triggerSearch=false;
   if(this.uploadFlag==false){
   this.fileData=null;
   this.isUploadCertificateActive = true;
   this.isGetConfirmationActive = false;
   }
else{
   this.isUploadCertificateActive = false;
   this.isGetConfirmationActive = true;}
}
handleStartDateChange(event) {
    this.startDate = event.detail.startDate;
    console.log(this.startDate);
}

handleEndDateChange(event) {
    this.endDate = event.detail.endDate;
    console.log(this.endDate);
}

formatDateToMMDDYYYY(date) {
   if (!date) return '';
   const [year, month, day] = date.split('-');
   return `${month}-${day}-${year}`;
}

getTodayDate() {
   const today = new Date();
   const year = today.getFullYear();
   const month = (today.getMonth() + 1).toString().padStart(2, '0');
   const day = today.getDate().toString().padStart(2, '0');
   return `${year}-${month}-${day}`;
}
toggleAccordionSettings() {
    if(this.selectedCredentials!=null && this.selectedCredentials!=undefined)
    {
   this.isOpenSettings = !this.isOpenSettings;
    }
}

handleGetConfirmationClick() {
   this.isProgramDetailsActive = false;
   this.isUploadCertificateActive = false;
   this.isGetConfirmationActive = true;
   this.updateStepClasses();
}

showAddTrainingProgram() {
   console.log('showAddTrainingProgram');
   this.isAddingProgram = true;
   this.isAddingProgrambtn=true;
   this.isAddingBtn=true;
   console.log(this.selectedCredential);
   if(this.selectedCredential==null)
   {
      this.isOpenSettings = !this.isOpenSettings;
   }
    this.isAfterConfirmationActive=false;
    this.programDetailsClass = 'current';
   this.uploadCertificateClass = '';
   this.getConfirmationClass = '';   
   this.isButtonDisabled =true;
   this.isButtonDisabledConfirm =true;
   this.isButtonDisabledPgm=false;
   this.isProgramDetailsActive = true;
   this.isUploadCertificateActive = false;
   this.isGetConfirmationActive = false;
   this.fileData=null;
}




showToast(title, message, variant = 'info') {
   const event = new ShowToastEvent({
       title: title,
       message: message,
       variant: variant,
   });
   this.dispatchEvent(event);
}

updateStepClasses() {
   this.programDetailsClass = this.isProgramDetailsActive ? 'current' : '';
   this.uploadCertificateClass = this.isUploadCertificateActive ? 'current' : '';
   this.getConfirmationClass = this.isGetConfirmationActive ? 'current' : '';
   console.log('this.programDetailsClass',this.isProgramDetailsActive,this.programDetailsClass);
   console.log('this.uploadCertificateClass',this.uploadCertificateClass,this.isUploadCertificateActive);
   console.log('this.getConfirmationClass',this.getConfirmationClass,this.isGetConfirmationActive);
}
openModal() {
   this.isModalOpen = true;
}

closeModal() {
   this.isModalOpen = false;
} 

handleInputChange(event) {
   this.searchTerm = event.target.value.trim();
   console.log(this.searchTerm);
}
handleSearch() {
   const allInputs = this.template.querySelectorAll('[data-id="inputField"]');
    
   // Ensure the radioGroup is initialized correctly before accessing it
   const radioGroup = this.template.querySelectorAll('input[name="program"]');
   
   let radioValid = false;
   let selectedValue = null;

   // Check validity of each input field
   const allValid = [...allInputs].reduce((validSoFar, inputField) => {
       inputField.reportValidity();
       return validSoFar && inputField.checkValidity();
   }, true);

   // Check if any radio button is selected
   radioGroup.forEach((radio) => {
       if (radio.checked) {
           radioValid = true;
           selectedValue = radio.value;
       }
   });

   if (!radioValid) {
       // Display error message if no radio is selected
       this.errorMessagerd = 'Please select a Program Designation.';
       this.showErrorMessagerd = true;
       this.triggerSearch = false;
       return;
   }

   if (!allValid) {
       // Display error message if input fields are invalid
       this.errorMessage = 'Please enter a School Name.';
       this.showErrorMessage = true;
       this.triggerSearch = false;
       return;
   }

       // Clear the error message if all inputs are valid
       this.showErrorMessage = false;
       this.errorMessage = '';
       this.errorMessagerd='';
       this.triggerSearch=true;        
           
           // Proceed with form submission logic
           // For example, you can call an Apex method or navigate to another page
       
   this.triggerSearchTerm = this.searchTerm || null; // Ensure searchTerm is correctly assigned
console.log('Trigger Search Term:', this.triggerSearchTerm);
}

toggleInsideAccordionFindYacep() {
   this.isOpenInsideAccordionFindYacep = !this.isOpenInsideAccordionFindYacep;
   
}
}