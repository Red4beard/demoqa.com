///<reference types = "cypress"/>
describe('User Registration and Login tests', () => {
    const baseUsername = 'testUser';
    const validPassword = 'Test12345!';

    function generateUniqueUsername(baseUsername) {
        const timestamp = new Date().getTime();
        return `${baseUsername}_${timestamp}`;
    }

    function signUpAndGetCredentials() {
        const userName = generateUniqueUsername(baseUsername);
        const password = validPassword; 
        const requestBody = { userName, password };
        
        return cy.request('POST', 'https://demoqa.com/Account/v1/User', requestBody)
            .then(response => {
                expect(response.status).to.eq(201);
                return { userName, password };
            });
    }

    beforeEach(function () {
        cy.viewport(1280, 800);
        cy.clearCookies();
        cy.clearAllSessionStorage({ log: true });
        cy.clearLocalStorage();
        cy.fixture("formData").as('formData');
    });
    it('User should successfully register with a unique username (positive test)', () => {
        const uniqueUsername = generateUniqueUsername('testUser');
        cy.request({
            method: 'POST',
            url: 'https://demoqa.com/Account/v1/User',
            body: {
            userName: uniqueUsername,
            password: validPassword
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(201);
        });
    });
    it('should fail to register with an existing username (negative test)', () => {
        const existingUsername = 'knownExistingUsername'
        cy.request({
            method: 'POST',
            url: 'https://demoqa.com/Account/v1/User',
            body: {
            userName: existingUsername,
            password: validPassword 
            },
            failOnStatusCode: false 
        }).then((response) => {
            expect(response.status).to.eq(406); 
            expect(response.body.message).to.include('User exists!');
            cy.log(response.body);
        });
        
    });
    
    it('should successfully log in with valid credentials (positive test)', () => {
        signUpAndGetCredentials().then(credentials => {
            cy.request('POST', 'https://demoqa.com/Account/v1/Login', {
            userName: credentials.userName,
            password: credentials.password
            }).then(loginResponse => {
            expect(loginResponse.status).to.eq(200);
                expect(loginResponse.body).to.have.property('token');
                Cypress.env('token', loginResponse.body.token);
                Cypress.env('userId',loginResponse.body.userId);
            });
        });
    });
    it('User should fail to login with invalid passvord (negative test)', () => {
        cy.request({
            method: 'POST',
            url: 'https://demoqa.com/Account/v1/User',
            body: {
                userName: 'uniqueUsername',
                password: 'invalidPassword'
            },
            failOnStatusCode: false 
        }).then((response) => {
            expect(response.status).to.eq(400); 
        });
    });

    it('should successfully post a book to user profile', () => {
        const token = Cypress.env('token'); 
        const userId = Cypress.env('userId'); 
        const validBookIsbn = '9781449325862'; 

        cy.request({
            method: 'POST',
            url: 'https://demoqa.com/BookStore/v1/Books',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: {
                userId: userId, 
                isbn: validBookIsbn
            }
        }).then(postResponse => {
            expect(postResponse.status).to.eq(200); 
        });
    });

    it('should successfully delete all books from user profile', () => {
        const token = Cypress.env('token');
        const userId = Cypress.env('userId');
        if (!token) {
            throw new Error('Token is null, cannot proceed with DELETE request');
        }
    
        cy.request({
            method: 'DELETE',
            url: `https://demoqa.com/BookStore/v1/Books?UserId=${userId}`,
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(deleteResponse => {
            expect(deleteResponse.status).to.eq(200);
        });
    });
 
});
