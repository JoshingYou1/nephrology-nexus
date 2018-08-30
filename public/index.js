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

const MOCK_LAB_RESULTS_DATA = {
    "labResults": [
        {
            "id": "12345",
            "hematology": {
                "wbcCount": "5.97",
                "rbcCount": "4.28",
                "hemoglobin": "11.1",
                "hematocrit": "33.8",
                "plateletCount": "207"
            },
            "chemistry": {
                "bun": "44",
                "creatinine": "8.42",
                "sodium": "137",
                "potassium": "4.1",
                "calcium": "10.3",
                "phosphorus": "4.6",
                "albumin": "4.2",
                "glucose": "184",
                "iron": "67",
                "cholesterol": "194",
                "triglycerides": "439"
            }
        },

        {
            "id": "12344",
            "hematology": {
                "wbcCount": "6.32",
                "rbcCount": "5.13",
                "hemoglobin": "12.4",
                "hematocrit": "35.2",
                "plateletCount": "194"
            },
            "chemistry": {
                "bun": "51",
                "creatinine": "6.95",
                "sodium": "143",
                "potassium": "3.7",
                "calcium": "10.8",
                "phosphorus": "3.9",
                "albumin": "5.3",
                "glucose": "154",
                "iron": "72",
                "cholesterol": "148",
                "triglycerides": "398"
            }
        },

        {
            "id": "23456",
            "hematology": {
                "wbcCount": "5.32",
                "rbcCount": "5.11",
                "hemoglobin": "21.8",
                "hematocrit": "29.7",
                "plateletCount": "197"
            },
            "chemistry": {
                "bun": "42",
                "creatinine": "9.15",
                "sodium": "153",
                "potassium": "4.9",
                "calcium": "10.8",
                "phosphorus": "4.2",
                "albumin": "5.7",
                "glucose": "179",
                "iron": "61",
                "cholesterol": "123",
                "triglycerides": "419"
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