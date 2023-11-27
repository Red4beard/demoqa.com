///<reference types = "cypress"/>

beforeEach(function () {
    cy.viewport(1280, 800);
    cy.clearCookies();
    cy.clearAllSessionStorage({ log: true });
    cy.clearLocalStorage();
    cy.fixture("formData").as('formData');
});

describe('DemoQA website tests', () => {
    describe('Menu Items Verification', () => {
        const expectedMenuItemsNames = [
            'Elements',
            'Forms',
            'Alerts, Frame & Windows',
            'Widgets',
            'Interactions',
            'Book Store Application'
        ];

        it('verify menu items', () => {
            cy.visit('https://demoqa.com');
            cy.get('.card')
                .should('have.length', expectedMenuItemsNames.length)
                .each(($el, idx) => {
                    expect($el.text()).to.equal(expectedMenuItemsNames[idx]);
                });
        });
    });

    describe('Favicon Verification', () => {
        it('favicon should be present', () => {
            cy.request('https://demoqa.com/').then((response) => {
                expect(response.status).to.eq(200);
                const html = document.createElement('html');
                html.innerHTML = response.body;
                const favicon = html.querySelector('link[rel="icon"]');
                expect(favicon).to.exist;
                expect(favicon.href).to.include('favicon.ico');
            });
        });
    });

    describe('WebTables Functionality', () => {
        it('should add a new table (positive case)', () => {
            cy.visit('https://demoqa.com/webtables');
            // add new table
            cy.get('[id="addNewRecordButton"]').click();
            // fill the form with valid data
            cy.get('[id="firstName"]').type('Alex');
            cy.get('[id="lastName"]').type('Smith');
            cy.get('[id="userEmail"]').type('alex.smith@test.com');
            cy.get('[id="age"]').type('40');
            cy.get('[id="salary"]').type('3500');
            cy.get('[id="department"]').type('QAEngineering');
            cy.get('[id="submit"]').click();
            // check the new entry has been added
            cy.get('.rt-tbody').should('contain', 'Alex').and('contain', 'Smith');
        });

        it('should not add a new table (negative case)', () => {
            cy.visit('https://demoqa.com/webtables');
            // add new table
            cy.get('[id="addNewRecordButton"]').click();
            // fill form with invalid data
            cy.get('[id="firstName"]').type('Sara');
            // lastName is a required field, but isn't filled in
            cy.get('[id="userEmail"]').type('sara.smith@test.com');
            cy.get('[id="age"]').type('35');
            cy.get('[id="salary"]').type('3000');
            cy.get('[id="department"]').type('ProductManagment');
            cy.get('[id="submit"]').click();
            // check that table hasn't been added
            cy.get('.rt-tbody').should('not.contain', 'Sara');
        });

        it('successfully edit test', () => {
            cy.visit('https://demoqa.com/webtables');
            cy.get('[id="edit-record-1"]').click();
            // change fields in the record
            cy.get('[id="firstName"]').clear().type('Hamlet');
            cy.get('[id="lastName"]').clear().type('Shakespear');
            cy.get('[id="userEmail"]').clear().type('shakespear@test.com');
            cy.get('[id="age"]').clear().type('42');
            cy.get('[id="salary"]').clear().type('4800');
            cy.get('[id="department"]').clear().type('QA');
            cy.get('[id="submit"]').click();
            // verify the record has been updated
            cy.get('.rt-tbody').should('contain', 'Hamlet')
                .and('contain', 'Shakespear')
                .and('contain', 'shakespear@test.com')
                .and('contain', '42')
                .and('contain', '4800')
                .and('contain', 'QA');
        });

        it('should not edit a record with incomplete data', () => {
            cy.visit('https://demoqa.com/webtables');
            cy.get('[id="edit-record-1"]').click();
            // modify some fields without entering a new value
            cy.get('[id="firstName"]').clear().type('Tom Sawyer');
            cy.get('[id="lastName"]').clear();
            cy.get('[id="submit"]').click();
            // verify the record hasn't been updated
            cy.get('[id="registration-form-modal"]').should('exist');
            // verify the border color of Last Name is red
            cy.get('[id="lastName"]').should('have.css', 'border-color', 'rgb(220, 53, 69)');
        });
    });

    describe('Form Submission with All Fields', () => {
        it('should submit a valid form and validate the data', () => {
            cy.visit('https://demoqa.com/automation-practice-form');
            // hide the advertisement iframe
            cy.get('#google_ads_iframe_\\/21849154601\\,22343295815\\/Ad\\.Plus-Anchor_0').invoke('hide');
            // fill in the basic information
            cy.get('[id="firstName"]').type('Alex');
            cy.get('[id="lastName"]').type('Smith');
            cy.get('[id="userEmail"]').type('alex.smith@example.com');
            cy.get('[for="gender-radio-1"]').click(); 
            cy.get('[id="userNumber"]').type('0123456');
            // set the Date of Birth
            cy.get('[id="dateOfBirthInput"]').click();
            cy.get('.react-datepicker__month-select').select('January');
            cy.get('.react-datepicker__year-select').select('1980');
            cy.get('[class$=day--002]').click();
            cy.get('#subjectsInput').type('Maths').type('{enter}');
            // Select hobbies
            cy.get('[for="hobbies-checkbox-1"]').scrollIntoView().click({ force: true });
            // upload picture
            cy.get('#uploadPicture').selectFile('cypress/fixtures/myImage.jpg')
            // adress
            cy.get('#currentAddress').type('123 Main St');
            cy.contains('Select State').click({ force: true });
            cy.contains('Rajasthan').click({ force: true });
            cy.get('.css-1wa3eu0-placeholder').click({ force: true });
            cy.contains('Jaiselmer').click({ force: true })
            //submit
            cy.get('[id="submit"]').scrollIntoView().click({ force: true });
            // validate the submitted data
            cy.get('.modal-content').should('contain', 'Alex').and('contain', 'Smith');
            cy.get('.modal-content').should('contain', 'alex.smith@example.com');
            cy.get('.modal-content').should('contain', 'Male'); 
            cy.get('.modal-content').should('contain', '2 January,1980');
            cy.get('.modal-content').should('contain', 'Maths');
            cy.get('.modal-content').should('contain', 'Sports');
            cy.get('.modal-content').should('contain', '123 Main St'); 
            cy.get('.modal-content').should('contain', 'Rajasthan'); 
            cy.get('.modal-content').should('contain', 'Jaiselmer'); 
            cy.get('.modal-content').should('contain', 'myImage.jpg'); 
        });
    });
    describe('Progress Bar Test', () => {
        it('simple test that the progress bar is working correctly', () => {
          cy.visit('https://demoqa.com/progress-bar');
          cy.get('#startStopButton').click();
          cy.wait(4000);
          cy.get('.progress-bar').should('have.attr', 'aria-valuenow', '100');
        });
    });
    describe('Complex progress bar Test', () => {
        // function to check the progress bar value at intervals
        function checkProgressBar(expectedValue, timeout = 5000, interval = 200) {
            const startTime = new Date().getTime();
            const checkProgress = () => {
                const currentTime = new Date().getTime();
                if (currentTime - startTime <= timeout) {
                    cy.get('.progress-bar').invoke('attr', 'aria-valuenow').then((value) => {
                        if (value !== expectedValue) {
                            cy.wait(interval).then(checkProgress);
                        }
                    });
                } else {
                    cy.get('.progress-bar').should('have.attr', 'aria-valuenow', expectedValue);
                }
            };
            checkProgress();
        };
        it('should validate complex progress bar', () => {
            cy.visit('https://demoqa.com/progress-bar');
            cy.get('#startStopButton').click();
            checkProgressBar('100'); // Expecting 100% after 5 seconds
        });
        
    });
});
