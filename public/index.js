const MOCK_PATIENT_DATA = {
    "patients": [
        {
            "id": "12345",
            "clinicId": "abc",
            "firstName": "John",
            "middleName": "Robert",
            "lastName": "Doe",
            "dateOfBirth": "05/12/68",
            "gender": "Male",
            "socialSecurityNumber": "123456789",
            "address": {
                "street": "123 International Drive",
                "city": "Jacksonville",
                "state": "Florida",
                "zipcode": "32204"
            },
            "phoneNumbers": {
                "home": "1234567890",
                "cell": "9876543210",
                "work": "1234565432"
            }
        },
        {
            "id": "12344",
            "clinicId": "abs",
            "firstName": "Betty",
            "middleName": "Ann",
            "lastName": "Crocker",
            "dateOfBirth": "08/02/51",
            "gender": "Female",
            "socialSecurityNumber": "987654321",
            "address": {
                "street": "456 Colonial Drive",
                "city": "Orange Park",
                "state": "Florida",
                "zipcode": "43213"
            },
            "phoneNumbers": {
                "home": "4356432443",
                "cell": "8774878434",
                "work": null
            }
        },
        {
            "id": "23456",
            "clinicId": "abs",
            "firstName": "Michael",
            "middleName": "Larry",
            "lastName": "Johnson",
            "dateOfBirth": "02/17/74",
            "gender": "Male",
            "socialSecurityNumber": "345678912",
            "address": {
                "street": "789 Wallaby Way",
                "city": "Jacksonville",
                "state": "Florida",
                "zipcode": "432432"
            },
            "phoneNumbers": {
                "home": "8478437584",
                "cell": null,
                "work": null
            }
        }
    ]
};



function getPatientInformation(callbackFn) {
    setTimeout(function() {callbackFn(MOCK_PATIENT_DATA)}, 100);
}

function displayPatientInformation(data) {
    for (let index in data.patients) {
        $("body").append(`<p>${data.patients[index].firstName} ${data.patients[index].middleName} ${data.patients[index].lastName}</p>`);
    }
}

function getAndDisplayPatientInformation() {
    getPatientData(displayPatientInformation);
}

$(function() {
    getAndDisplayPatientInformation();
})