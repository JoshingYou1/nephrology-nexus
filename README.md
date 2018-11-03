# Nephrology Nexus

Live Link: https://nephrology-nexus-portal.herokuapp.com/users/login

## API Reference

### Controllers
#### Clinics
##### Methods
###### DELETE /clinics/:id
    Removes an existing clinic. The database id of the clinic to be deleted must be provided. This method includes  
    cascade delete functionality which removes all patients who belong to said clinic as well as all of the lab  
    results that belong to each individual patient.

###### GET /clinics
    Returns all clinics within the database.

###### GET /clinics/create
    Returns the create page for a clinic. This page contains the clinic form which has a built-in POST method.

###### GET /clinics/show/:id
    Returns a single clinic. The database id of said clinic must be provided.

###### GET /clinics/update/:id
    Returns the update page for a clinic. The database id of the clinic to be updated must be provided. This page  
    contains the clinic form which has a built-in PUT method.

###### POST /clinics
    Creates a new clinic and adds it to the database.

###### PUT /clinics/:id
    Updates an existing clinic. The database id of the clinic to be updated must be provided.

#### Lab Results
##### Methods
###### DELETE /clinics/:clinicId/patients/:patientId/lab-results/:id
    Removes an existing set of lab results from the database. The database id of the lab results to be deleted, the  
    patient who said lab results belong to, and the clinic which said patient belongs to must be provided.

###### GET /clinics/:clinicId/patients/:patientId/lab-results
    Returns all lab results that belong to a specific patient. The database id of both said patient and that  
    patient's corresponding clinic must be provided.

###### GET /clinics/:clinicId/patients/:patientId/lab-results/create
    Returns the create page for a set of lab results. The database id of both the patient in which the new set of  
    lab results should belong to and that patient's corresponding clinic must be provided. This page contains the  
    lab results form which has a built-in POST method.

###### GET /clinics/:clinicId/patients/:patientId/lab-results/show/:id
    Returns a single set of lab results that belong to a specific patient. The database id of said lab results, the  
    patient who said lab results belong to, and that patient's corresponding clinic to must be provided.

###### GET /clinics/:clinicId/patients/:patientId/lab-results/update/:id
    Returns the update page for a set of lab results. The database id of the lab results to be updated, the patient  
    who said lab results belong to, and that patient's corresponding clinic must be provided. This page contains the  
    lab results form which has a built-in PUT method.

###### POST /clinics/:clinicId/patients/:patientId/lab-results
    Creates a new set of lab results and adds it to the lab results object of a specific patient. The database id of  
    both said patient and that patient's corresponding clinic must be provided.

###### PUT /clinics/:clinicId/patients/:patientId/lab-results/:id
    Updates an existing set of lab results. The database id of said lab results, the patient who said lab results  
    belong to, and that patient's corresponding clinic must be provided.

#### Patients
##### Methods
###### DELETE /clinics/:clinicId/patients/:id
    Removes an existing patient from the database. The database id of both the patient to be deleted and that  
    patient's corresponding clinic must be provided. This method includes cascade delete functionality which removes  
    all lab results that belong to said patient.

###### GET /clinics/:clinicId/patients
    Returns all patients who belong to a specific clinic. The database id of said clinic must be provided.

###### GET /clinics/:clinicId/patients/create
    Returns the create page for a patient. The database id of the clinic in which the new patient should belong to  
    must be provided. This page contains the patient form which has a built-in POST method.

###### GET /clinics/:clinicId/patients/show/:id
    Returns a single patient who belongs to a specific clinic. The database id of both said patient and said  
    patient's corresponding clinic must be provided.

###### GET /clinics/:clinicId/patients/update/:id
    Returns the update page for a patient. The database id of both the patient to be updated and that patient's  
    corresponding clinic must be provided. This page contains the patient form which has a built-in PUT method.

###### POST /clinics/:clinicId/patients
    Creates a new patient and adds it to the patient object of a specific clinic. The database id of said clinic must  
    be provided.

###### PUT /clinics/:clinicId/patients/:id
    Updates an existing patient. The database id of both said patient and said patient's corresponding clinic must be  
    provided.

#### Users
##### Methods
###### GET /users/login
    Returns the user login page. This page contains the user login form which has a built-in POST method.

###### GET /users/logout
    Logs the user out of the database and returns the user to the login page.

###### GET /users/register
    Returns the user register page. This page contains the user registration form which has a built-in POST method.

###### POST /users/login
    Logs the user into the database.

###### POST /users/register
    Creates a new user and logs them into the database.

### Models
#### Clinics
Each clinic is assigned a database id on creation and has a one-to-many relationship with the patients model. This model includes the following data:

    - name: the clinic's name
    - address: the clinic's address(street, city, state, and zip code)
    - phoneNumber: the clinic's phone number
    - faxNumber: the clinic's fax number
    - clinicManager: the clinic manager's name(first name, last name)
    - patients: the patients that belong the clinic

#### Lab Results
Each set of lab results is assigned a database id on creation and has a many-to-one relationship with the patients model. Lab results are acquired through a sample of a patient's blood. This model includes the following data:

    hematology:
        - wbcCount: white blood cell count(1000/mcL)
        - rbcCount: red blood cell count(mill/mcL)
        - hemoglobin: the amount of hemoglobin in whole blood(g/dL)
        - hematocrit: the amount of a person's blood that is made up of red blood cells(%)
        - plateletCount: the amount of platelets in a person's blood(1000/mcL)

    chemistry:
        - bun: the amount of urea nitrogen in a person's blood(mg/dL)
        - creatinine: the amount of creatinine in a person's blood(mg/dL)
        - sodium: the amount of sodium in a person's blood(mEq/L)
        - potassium: the amount of potassium in a person's blood(mEq/L)
        - calcium: the amount of calcium in a person's blood(mg/dL)
        - phosphorus: the amount of phosphorus in a person's blood(mg/dL)
        - albumin: the amount of albumin in a person's blood(g/dL)
        - glucose: the amount of glucose in a person's blood(mg/dL)
        - iron: the amount of iron in a person's blood(mcg/dL)
        - cholesterol: the total blood cholesterol in a person's body(mg/dL)
        - triglycerides: the amount of tryglycerides in a person's blood(mg/dL)

    patient: the patient in which a set of lab results belongs to

#### Patients
Each patient is assigned a database id on creation and has a many-to-one relationship with the clinic model as well as a one-to-many relationship with the lab results model. This model includes the following data:

    - name: the patient's name(first name, last name)
    - dateOfBirth: the patient's date of birth
    - sex: the patient's biological sex
    - socialSecurityNumber: the patient's social security number
    - address: the patient's address(street, city, state, and zip code)
    - phoneNumbers: the patient's applicable phone numbers(home, cell, and work)
    - clinic: the clinic in which a patient belongs to
    - labResults: the patient's lab results

#### Users
Each user is assigned a database id on creation. This model includes the following data:

    - username: the user's unique chosen username
    - password: the user's desired password
    - firstName: the user's first name
    - lastName: the user's last name

### Services
#### Clinics
###### getAllClinicsAlphabetically
    This method gathers all of the clinics within the database and sorts them alphabetically.

#### Lab Results
###### getAllLabResultsByPatientChronologically
    This method gathers all of the lab results that belong to a single patient, based on their database id, and then  
    sorts them chronologically.

#### Patients
###### getAllPatientsByClinicAlphabetically
    This method gathers all of the patients that belong to a single clinic, based on its database id, and then sorts  
    them alphabetically.

## Screenshots

![Nephrology Nexus Registration Page](https://github.com/JoshingYou1/nephrology-nexus/blob/master/public/screenshot-registration.png)
![Nephrology Nexus Clinics Index Page](https://github.com/JoshingYou1/nephrology-nexus/blob/master/public/screenshot-clinics.png)
![Nephrology Nexus Patients Index Page](https://github.com/JoshingYou1/nephrology-nexus/blob/master/public/screenshot-patients.png)
![Nephrology Nexus Lab Results Index Page](https://github.com/JoshingYou1/nephrology-nexus/blob/master/public/screenshot-lab-results.png)

## Summary

The goal of this application is to provide a more efficient way for nephrologists/nurse practitioners and hemodialysis clinics to communicate by providing crucial information about dialysis clinics, patients with kidney failure, and those patient's lab results. Registered users have the ability to create, read, update, and delete data within the database. The manipulatable data available in this application includes clinical data, patient data, and lab results data. Once a user signs in, they will be directed to the clinics index page. There, they will select an available clinic or choose to create a new clinic to add to the current list. After selecting a clinic, the user will be taken to the clinic show page. This page contains important information about a clinic, including its address, phone number, fax number, etc. While on this page, the user has the option of deleting the clinic as well as updating its information. The link at the bottom of the page leads the user to the patients index page. Similar to the clinics page, it contains a list of the patients associated with that particular clinic. The user may create a new patient on this page as well. Once the user chooses a patient on the list, they will be directed to the patient show page. Once there, they can view all of the information about that patient, including date of birth, social security number, address, etc. As with clinics, the user has the option of updating the patient's information or deleting the patient altogether. The link at the bottom of the page will take the user to the lab results index page. This page is comprised of a list of lab results unique to the patient previously selected. New lab results data can be created on this page in addition to selecting one of the available sets of the lab results. Once a set has been chosen, the user is taken to the lab results show page. This page consists of the tests included in a routine blood sample for a patient with renal failure. This is also the page where the user can delete or update said lab results. With all of this power at the user's finger tips, there's no telling how much progress can be made toward bringing doctors and patients closer together!

## Technologies Used

- Chai
- CircleCi
- CSS
- EJS
- Express.js
- HTML
- Javascript
- mLab
- Mocha
- MongoDB
- Mongoose
- Node.js







