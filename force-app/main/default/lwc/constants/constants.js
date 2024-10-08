// constants.js
const ACCEPTDECLINEPCR = {
    HEADHELPPOP: 'Trainee Program Confirmation Requests',
    PARA1: 'An RYS must confirm each trainee’s program completion date by selecting the training program the trainee completed from the drop down menu and clicking the green "Confirm" button.',
    PARA2: 'A RYS should decline a trainee’s program confirmation request if the dates entered are inaccurate or for not having completed the training requirements. If a trainee has been issued a certificate and they have any outstanding requirements that should prevent them from registering as an RYT, an RYS should decline the request and send a notification to the trainee with the reasons they were declined. The trainee may submit a new program confirmation request when they have met all the outstanding requirements of the RYS.',
    PARA3: 'PLEASE NOTE: If an RYS does not respond to a trainee’s program confirmation request within 2 weeks, the YA credentialing team may confirm or reject the trainee’s request. A signed teacher training certificate that matches the sample certificate on file for the RYS indicates to YA that an applicant has successfully completed the training.',
    PARA4: ' Once the completion date of an applicant is confirmed, the confirmation is final and cannot be changed.'
};

export { ACCEPTDECLINEPCR };

const ACCEPTDECLINEPCRMSG = {
    PARA1: 'Confirm: Trainee has successfully completed your training and the designation and the certificate they have provided are accurate.',
    PARA2: 'Decline: Trainee has not successfully completed your training. Other reasons for declining include but are not limited to:',
    PARA3: 'Providing an incorrect certificate, training date, or school nameTrainee’s account name does not match the name on the certificate',
    PARA4: 'Please Note:',
    PARA5: 'When you confirm a trainee’s program confirmation request they will be required to complete a review of your school to register with Yoga Alliance.',
};

export { ACCEPTDECLINEPCRMSG };

const ACCEPTDECLINEPCRPOPUP = {
    HEAD:'Trainee Program Confirmation Requests',
    POPHEAD: 'Confirm Trainee Request?',
    POPUP1: 'Do you confirm that',
    POPUP2: '✔ Is eligible for the RYT 200 designation based on their training with AIReal Yoga Training Center',
    POPUP3: '✔ Completed their training on Sep 01, 2024',
    POPUP4: 'This cannot be undone.',
};

export { ACCEPTDECLINEPCRPOPUP };

const PCRPARENT={
    HEAD: 'Program Confirmation Requests',
    BTNNAME: 'Add Training Program',
    RYS200:'RYS® 200',
    RYS300:'RYS® 300',
    RYS500:'RYS® 500',
    PRGDATES:'Enter Program Dates',
    PRGBTN:'Program Details',
    UPLBTN:'Upload Certificate',
    SUBBTN:'Get Confirmation',
    TRNDES:'Training requirements:',
    SCHDES:'Find your Registered Yoga School',
    SCHDES1:'Search for your school',
    SCHDES2:'When searching for your school all information entered must be an exact match.  We suggest using just the name or part of the name of your school in the search fields to return the broadest results.',
    SCHDES3:'A program request has been sent to',
    SCHDES4:'. If ',
    SCHDES5:' does not respond to this request within 2 weeks, Yoga Alliance will review your request.',
    SCHDES6:'See what steps remain',
    SCHDES7:' to complete your registration.',
    CITYFIL1:'Filter by City ▼',
    CITYFIL2:'Filter by City (optional)'
}
export { PCRPARENT };

const PCRUPLOAD={
    HEAD: 'Training Program Details',
    HEADNAME: 'Program Designation',
    PGMDATE:'Program Dates',
    RYS:'RYS',
    NOTE:'Upload a copy of your course completion certificate. Compatible file types are PDF, Word, JPG, GIF, or PNG.',
    NOTE1:'Browse for and choose the file you wish to upload',
    NOTE2:'Confirm the selected file is correct',
    NOTE3:'Click Upload File'
}
export { PCRUPLOAD };

const PCRSUBMIT={
    HEAD: 'Upload Certificate',
    HEADNAME: 'Request Program Confirmation',
    NOTE:'Your RYS must confirm that you completed the training program entered. When you click ',
    NOTE1:' "Send Request" a request will be sent to Teacher Training With',
    NOTE2:' to ',
    NOTE3:'confirm you completed this training program.',
    NOTE4:'Send Request'
}
export { PCRSUBMIT };

const PCRSCHOOLSEARCH={
    HEAD: 'This Program Confirmation Request has not shared any additional details. If you are sure this is your Program Confirmantion Request go ahead and select them. Otherwise, please reach out to your Program Confirmation Request and ask them to put in identifying information.',
    NOTE: ' is not an eligible RYS for the program dates and/or the program designation you have entered.',
    NOTE1: ' This school may not have been registered with Yoga Alliance at that time or they may not be registered with the designation you selected.',
    NOTE2: ' Please check the dates and the designation listed on your certificate or contact',
    NOTE3:' to confirm that they are registered with Yoga Alliance.',
    NOTE4:' Was my training a RYS',
    NOTE5:'®',
    NOTE6:' 300 or RYS',
    NOTE7:' 500?',
    NOTE8:'Primary Location :',
    NOTE9:'Other Location :',
    NOTE10:'Trainers :'
}
export { PCRSCHOOLSEARCH };