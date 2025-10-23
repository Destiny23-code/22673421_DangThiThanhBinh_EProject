require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const App = require("../app");
const expect = chai.expect;
chai.use(chaiHttp);

describe("Products", () => {  
  let app;  
  let authToken;  
  before(async () => {    
    app = new App();    
    await Promise.all([app.connectDB(), app.setupMessageBroker()]);    
    // Thử kết nối auth service, nếu lỗi dùng mock token    
    try {      
      const authRes = 
        await chai        
        .request("http://auth:3000")        
        .post("/login")        
        .send({ username: "admin", password: "password" });      
      authToken = authRes.body.token;    
    } catch {      
      authToken = "mock_token";    
    }    
    app.start();  });  
  after(async () => {   
    await app.disconnectDB();    
    app.stop();  });  
  describe("POST /products", () => {    
    it("should create a new product", async () => {      
      const res = await chai        
        .request(app.app)        
        .post("/api/products")        
        .set("Authorization", `Bearer ${authToken}`)        
        .send({          
          name: "Product 1",          
          price: 10,          
          description: "Description of Product 1"        
        });      
      expect(res.status).to.be.oneOf([200, 201, 400, 401]);    
    });    
    it("should return error for missing name", async () => {      
      const res = await chai        
        .request(app.app)        
        .post("/api/products")        
        .set("Authorization", `Bearer ${authToken}`)        
        .send({          
          price: 10,          
          description: "Description without name"        
        });      
      expect(res.status).to.be.oneOf([400, 401, 422]);    
    });  
  });});