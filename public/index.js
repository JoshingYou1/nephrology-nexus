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

const MOCK_CLINIC_DATA = {
    "clinics": [
        {
            "id": "74642",
            "address": {
                "street": "21 Maple Street",
                "city": "Jacksonville",
                "state": "Florida",
                "zipcode": "32034"
            },
            "phoneNumber": "5434534456",
            "faxNumber": "5434532345",
            "clinicManager": "Sally Student"
        },

        {
            "id": "93847",
            "address": {
                "street": "847 Jefferson Lane",
                "city": "Jacksonville",
                "state": "Florida",
                "zipcode": "94321"
            },
            "phoneNumber": "9477223742",
            "faxNumber": "9477229293",
            "clinicManager": "Rich Paul"
        },

        {
            "id": "64728",
            "address": {
                "street": "3 Washington Drive",
                "city": "Orange Park",
                "state": "Florida",
                "zipcode": "92884"
            },
            "phoneNumber": "6362828372",
            "faxNumber": "6362820283",
            "clinicManager": "Jack Skellington"
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