import { LightningElement, wire, track, api } from 'lwc';
//import CANCEL_RECORD_CHANNEL from '@salesforce/messageChannel/CancelRecordChannel__c';
import { subscribe, MessageContext } from 'lightning/messageService';
import GRID_REFRESH_CHANNEL from '@salesforce/messageChannel/GridRefreshChannel__c';
import userId from '@salesforce/user/Id';
import yaPcrRequest from '@salesforce/apex/yaPcrRequestController.yaPcrRequest';
import UpdateyaPcrRequest from '@salesforce/apex/yaPcrRequestController.UpdateyaPcrRequest';
import yaCommunicationSettings from '@salesforce/apex/yaCommunicationSettingsController.yaCommunicationSettings';
import getContentDocuments from '@salesforce/apex/ContentDocumentController.getFileDownloadUrlByLinkedEntityId';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class YaAccordionPcrList extends LightningElement {
    tableKey = Math.random(); // Unique key to refresh
    @api pcrlistnew;
    @track pcrList = [];
    ContactId;
    userId = userId; // Sample userId, replace as needed
    wiredPcrRequestsResult;
    subscription = null; // To hold message channel subscription
    wireddata;
    isModalOpen = false;
    @track selectedRecordId;
    @track contact; 
    

    @api
    refreshData() {
        console.log('refreshData method called IN LIST');
        refreshApex(this.wireddata);
    }
    @wire(yaCommunicationSettings, { userId: '$userId' })
    wiredContact({ error, data }) {
        if (data) {
            this.contact = data;
            this.ContactId = this.contact.Id;// Assign the contact ID to recordId
            this.loading = false;
        } else if (error) {
            console.error(error);
            this.loading = false;
        }
    }

    @wire(MessageContext)
    messageContext;



    @wire(yaPcrRequest, { ContactId: '$ContactId' })
    wiredPcrRequests(result) {
        this.wiredPcrRequestsResult = result;
        this.wireddata = result;
        const { error, data } = result;
        if (data) {
            console.log('Wired PCR Requests:', result.data);
           //debugger;
            this.pcrList = data.map(record => ({
                ...record,
                isConfirmed: record.Handshake__r.State__c === 'Confirmed',
                isPending: record.Handshake__r.State__c === 'Pending',
                isCancelled: record.Handshake__r.State__c === 'Cancelled',
                ClassLabel: record.Handshake__r.State__c === 'Approved' ? 'approved' :
                    record.Handshake__r.State__c === 'Rejected' ? 'rejected' :
                        record.Handshake__r.State__c === 'Pending' ? 'pending' : '',
                StatusLabel: record.Handshake__r.State__c === 'Approved' ? 'Confirmed' :
                    record.Handshake__r.State__c === 'Rejected' ? 'Denied - Please contact your school or submit a new request' :
                        record.Handshake__r.State__c === 'Pending' ? 'Pending RYS Confirmation' : '',
                DesiLabel: record.Track_Designation_Type__c === 'RYS200' ? 'RYS® 200' :
                    record.Track_Designation_Type__c === 'RYS300' ? 'RYS® 300' :
                        record.Track_Designation_Type__c === 'RYS500' ? 'RYS® 500' : '',
                CreatedDateFormatted: new Date(record.CreatedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),
                CCRStartedOnFormatted: record.CCR_Started_On__c
                    ? new Date(record.CCR_Started_On__c).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    }) : '',
                CCRCompletedOnFormatted: record.CCR_Completed_On__c
                    ? new Date(record.CCR_Completed_On__c).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    }) : ''
            }));
            this.pcrlistnew = this.pcrList.length > 0;
        } else if (error) {
            console.error('Error retrieving PCR requests:', error);
            this.pcrList = [];
        }
    }

    connectedCallback() {
       // debugger;
        this.subscribeToMessageChannel();
        this.refreshData();
        console.log('Component loaded, calling fetchPcrRequests with contactId:', this.ContactId);
    }
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                GRID_REFRESH_CHANNEL,
                (message) => this.handleMessage(message)
            );
        }
    }

    handleMessage(message) {
        console.log('Message received from GRID_REFRESH_CHANNEL:', message.message);
        if (message.message === 'refreshGrid') {
            console.log('refreshGrid message received, refreshing data.');
            this.refreshData();
        }
    }
    closeModal() {
        this.isModalOpen = false;
    }
    
    confirmCancel() {
    console.log('User confirmed the cancellation', this.selectedRecordId);
    this.isModalOpen = false;

    // Call Apex to update the record state to 'Cancel'
    UpdateyaPcrRequest({ Id: this.selectedRecordId, Status: 'PCR Cancelled by Trainee' })
        .then(() => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Record Cancelled successfully.',
                variant: 'success'
            }));

            // Refresh data after update
            console.log('Refreshing the data after cancel.');
            //return refreshApex(this.wireddata);  // Use refreshApex to reload the data
            this.refreshData();
        })
        .then(() => {
            console.log('Data refreshed successfully.');
        })
        .catch(error => {
            console.error('Error updating record:', error);
            let message = 'Unknown error'; // Default message
            if (error && error.body && error.body.message) {
                message = error.body.message;
            } else if (error && error.message) {
                message = error.message;
            } else if (typeof error === 'string') {
                message = error;
            }

            // Handle errors
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: message,
                variant: 'error'
            }));
        });
}

    handleCancel(event) {
        this.isModalOpen = true;      
        this.selectedRecordId = event.target.dataset.id;  
    }
    handleDownload(event) {
        const Id = event.target.dataset.id;
    
        getContentDocuments({ Id })
            .then(url => {
                console.log('url',url);
                this.downloadFile(url);
            })
            .catch(error => {
                this.error = error.body ? error.body.message : error.message;
                console.error('Error fetching file:', this.error);
            });
    }
    
    // Use Lightning Navigation to download the file
    downloadFile(url) {
        console.log('url',url);
        const link = document.createElement('a');
        link.href = url;     
        link.target = '_self'; // Ensure it opens in the same context
        link.setAttribute('download', ''); // Hint to the browser to download
        link.style.display = 'none'; // Hide the link element
        document.body.appendChild(link); // Append link to the document
        link.click(); // Programmatically click to initiate download
        document.body.removeChild(link); // Remove link after download
    }
}