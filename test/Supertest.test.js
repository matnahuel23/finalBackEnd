/*SUPERTEST
*   tengo que ejecutar npm start en una terminal y esperar a que node abra OK
*   abro otra terminar y ejecuto npm test
*/ 
const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
const requester = supertest("http://localhost:8080");

let sessionCookie

describe("Testing SuperTest", () => {
       describe("Test", () => {    
        it('Debe loguear correctamente un usuario y devolver una COOKIE', async function (){
            const mockUser = {
                "email": "usuarioprueba@email.com",
                "password": "123456"
            }
            const result = await requester.post('/login').send(mockUser)
            const cookies = result.headers['set-cookie'];
        
            expect(cookies).to.be.an('array').and.not.empty;
        
            // Encuentra la cookie 'connect.sid'
            sessionCookie = cookies.find(cookie => cookie.includes('connect.sid'));
        
            expect(sessionCookie).to.be.ok.and.include('connect.sid');
        })     
    });
});
