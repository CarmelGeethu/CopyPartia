import { LightningElement, api, track, wire } from 'lwc';
//import searchAccounts from '@salesforce/apex/SearchAccounts.searchSchool';
import getSchoolData from '@salesforce/apex/yaPCRSearchSchool.getSchoolData';

export default class YaAccordionPcrRequestSearch extends LightningElement {

    @api searchTerm;
    @api triggerSearchTerm;
     @api startDate;
     @api endDate;
     @api selectedRb;
     @api citysearch;
    @track paginatedAccounts = [];
    @track currentPage = 1;
    @track pageSize = 5;
    @track totalPages = 0;
    @track searchKey=''; // Property to be used for Apex call	
    @track Accounts = []; 
    @track sDate;
    @track eDate;
    @track rbVal;
    @track cityName;
    @api value ='';
    connectedCallback() {
        console.log(this.triggerSearchTerm);
        // Set the searchKey property based on some logic
        console.log('Search Term in child component:', this.searchTerm);
        this.searchKey = this.searchTerm;
        this.sDate = this.startDate;        
        this.eDate = this.endDate;
        this.rbVal=this.selectedRb;
        this.cityName=this.citysearch;
        console.log('searchKey set in connectedCallback:', this.searchKey);
        console.log('StartDate set in connectedCallback:', this.sDate);
        console.log('Enddate set in connectedCallback:',this.eDate);
        console.log('rbn set in connectedCallback:',this.rbVal);
        console.log('City set in connectedCallback:',this.cityName);
    }

    updatePagination() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedAccounts = this.Accounts.slice(start, end);
        console.log(this.paginatedAccounts);
    }

    handleSearch(event) {
        this.searchKey = event.target.value;
        this.searchTerm = event.target.value;
        this.triggerSearchTerm = event.target.value;
    }

    handlePageChange(event) {
        this.currentPage = parseInt(event.target.dataset.page, 10);
        this.updatePagination();
    }

    handleRowAction(event) {
        const accountId = event.target.dataset.id;
        this.Accounts = this.Accounts.map(account => {
            if (account.id === accountId) {
                account.isExpanded = !account.isExpanded;
            }
            return account;
        });
        this.updatePagination();
    }

    get pages() {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
    @wire(getSchoolData, { 
        searchTerm: '$searchTerm', 
        sDate: '$sDate', 
        eDate: '$eDate', 
        rbVal: '$rbVal' 
    })
    wiredSchoolData({ error, data }) {
        if (data) {
            this.Accounts = data.map(record => ({
                ...record,
                buttonLabel: record.flag === true ? 'Select' : 'Invalid',
                isButtonDisabled: record.flag === true ? false : true,
                isExpanded: false,
                detailsKey: record.id + '_details',
                OtherLocation: record.OtherLocation ? record.OtherLocation.split('<br>') : []
            }));
            console.log('School Data: ', JSON.stringify(this.Accounts)); this.totalPages = Math.ceil(this.Accounts.length / this.pageSize);
            this.updatePagination();
            this.error = undefined;
        } else if (error) {
            this.error = error;
            console.error('Error fetching school data: ', error);
            this.Accounts = undefined;
        }
    }
    // @wire(searchAccounts, { searchTerm: '$searchTerm', sDate:'$sDate', eDate:'$eDate', rbVal:'$rbVal',city:'$cityName'})
    // wiredAccounts({ error, data }) {
    //     if (data) {
    //         this.Accounts = data.map(account => {
    //             const ISCITY =  account.BillingCity && account.BillingCity.trim() !== '' ? 'Select' : 'Invalid'; 
    //             console.log('ISCITY',ISCITY);
    //                 return {
    //                       ...account,
    //             isSelect: account.Name && account.Name.trim() !== '',  // Ensures Name is not null, undefined, or empty
    //             buttonLabel: account.BillingCity && account.BillingCity.trim() !== '' ? 'Select' : 'Invalid',
    //             isExpanded: false,
    //             isButtonDisabled:ISCITY==='Invalid'?true:false,
    //             detailsKey: account.Id + '_details',
    //     };
    // });
    //         this.totalPages = Math.ceil(this.Accounts.length / this.pageSize);
    //         this.updatePagination();
    //     } else if (error) {
    //         console.error('Error:', error);
    //         this.Accounts = [];
    //     }
    // }
  
    handleSearch(event) {
        this.searchKey = event.target.value;
    }
    
   
    handleSelect(event) {
        const accountsId = event.target.dataset.id;
        const selectedAccount = this.Accounts.find(account => account.id === accountsId);
        if (selectedAccount) { 
            console.log('Account Name: ' + selectedAccount.schoolName);
    
            // Dispatch the first custom event
            const sendValueEvent = new CustomEvent('sendvalue', {
                detail: { value: selectedAccount.schoolName,
                    id:selectedAccount.id
                 } // Optionally wrap in an object
            });
            this.dispatchEvent(sendValueEvent);
    
            // Dispatch the second custom event with additional settings
            const enableButtonEvent = new CustomEvent('enablebutton', {
                bubbles: true,
                composed: true // Optionally wrap in an object
            });
            this.dispatchEvent(enableButtonEvent);
    
            console.log('Events dispatched: sendvalue and enablebutton');
        } else {
            console.error('Account not found');
        }
    }
    
    get paginatedAccountsWithStates() {
     console.log(this.paginatedAccounts);  
        return this.paginatedAccounts.map(account => ({
            ...account,
            buttonDisabled: account.isButtonDisabled,
            tooltipMessage: account.isButtonDisabled ? 
                `${account.schoolName} is not an eligible School for the course dates you have entered. This School may not have been verified with Yoga Alliance at that time. Please check the course dates listed on your course completion certificate or contact ${account.schoolName} to confirm that they are verified with Yoga Alliance.` 
                : '',
            selectHandler: this.handleSelect.bind(this)  // Bind the handler to pass as the event listener
        }));
    }
}