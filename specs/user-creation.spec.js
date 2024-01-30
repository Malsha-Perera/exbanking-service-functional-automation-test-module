const loader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const expect = require('chai').expect;

describe('Create user gRPC API verification', () => {
  let client;
  let pbReq;

  before(() => {
    const packageDefinition = loader.loadSync('./definitions/proto/exbanking-management-service.proto', {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    const BaseProto = grpc.loadPackageDefinition(packageDefinition);
    client = new BaseProto.UserService('localhost:9090', grpc.credentials.createInsecure());
  });

  it('should successfully register user and create an account when valid user details are provided', () => {
    return new Promise(function (resolve) {
      const packageDefinition = loader.loadSync('./definitions/proto/exbanking-management-service.proto', {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      });
      const BaseProto = grpc.loadPackageDefinition(packageDefinition);
      const client = new BaseProto.UserService('localhost:9090', grpc.credentials.createInsecure())

      const request = {"user": { "firstName": "Deepani", "lastName": "Silva", "passportNo": "N767378",
          "contactInfo": { "email": "deepani.silva@hotmail.com", "telephone": {"countryCode": "+372", "number": "7755413"}},
          "address": "1037 Charles Road, Brandonbury, OR 08016"}}
      client.create_user(request, (err, response) => {
        if (err) {
          console.error('Error calling withdraw:', err);
          reject(err);
        } else {

          expect(response).to.be.an('object');
          expect(response.user).to.be.an('object');
          expect(response.account).to.be.an('object');

          expect(response.user).to.have.property('id').that.is.a('string');
          expect(response.user).to.have.property('firstName').that.is.a('string');
          expect(response.user).to.have.property('lastName').that.is.a('string');
          expect(response.user).to.have.property('passportNo').that.is.a('string');
          expect(response.user.contactInfo).to.be.an('object');
          expect(response.user.contactInfo).to.have.property('email').that.is.a('string');
          expect(response.user.contactInfo).to.have.property('telephone').to.be.an('object');
          expect(response.user.contactInfo.telephone).to.have.property('countryCode').that.is.a('string');
          expect(response.user.contactInfo.telephone).to.have.property('number').that.is.a('string');
          expect(response.user).to.have.property('auditInfo').that.is.an('object');

          expect(response.user).to.have.property('firstName').that.equals(request.user.firstName);
          expect(response.user).to.have.property('lastName').that.equals(request.user.lastName);
          expect(response.user).to.have.property('passportNo').that.equals(request.user.passportNo);
          expect(response.user.contactInfo).to.have.property('email').that.equals(request.user.contactInfo.email);
          expect(response.user.contactInfo.telephone).to.have.property('countryCode').that.equals(request.user.contactInfo.telephone.countryCode);
          expect(response.user.contactInfo.telephone).to.have.property('number').that.equals(request.user.contactInfo.telephone.number);

          expect(response.account).to.have.property('id').that.is.a('string');
          expect(response.account).to.have.property('userId').that.is.a('string');
          expect(response.account).to.have.property('accountNumber').that.is.a('string');
          expect(response.account).to.have.property('accountType').that.is.a('string');
          expect(response.account).to.have.property('balance').that.is.a('number');
          expect(response.account).to.have.property('currencyId').that.is.a('string');
          expect(response.account).to.have.property('auditInfo').that.is.an('object');

          expect(response.account).to.have.property('userId').that.equals(response.user.id);

          resolve(response);
        }
      });
    });
  });

  it('should return a FAILED_PRECONDITION error when a invalid email is provided', () => {
    return new Promise(function (resolve, reject) {
      const packageDefinition = loader.loadSync('./definitions/proto/exbanking-management-service.proto', {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      });
      const BaseProto = grpc.loadPackageDefinition(packageDefinition);
      const client = new BaseProto.UserService('localhost:9090', grpc.credentials.createInsecure())

      const request = {"user": { "firstName": "Deepani", "lastName": "Silva", "passportNo": "N767378",
          "contactInfo": { "email": "deepani.silva.com", "telephone": {"countryCode": "+372", "number": "7755413"}},
          "address": "1037 Charles Road, Brandonbury, OR 08016"}}
      client.create_user(request, (err, response) => {
        if (err) {
          expect(err.message).to.include('FAILED_PRECONDITION: Invalid email');
          resolve(err);
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  });

  it('should return a FAILED_PRECONDITION error when a invalid passport is provided', () => {
    return new Promise(function (resolve, reject) {
      const packageDefinition = loader.loadSync('./definitions/proto/exbanking-management-service.proto', {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      });
      const BaseProto = grpc.loadPackageDefinition(packageDefinition);
      const client = new BaseProto.UserService('localhost:9090', grpc.credentials.createInsecure())

      const request = {"user": { "firstName": "Deepani", "lastName": "Silva", "passportNo": "34465657",
          "contactInfo": { "email": "deepani.silva@hotmail.com", "telephone": {"countryCode": "+372", "number": "7755413"}},
          "address": "1037 Charles Road, Brandonbury, OR 08016"}}
      client.create_user(request, (err, response) => {
        if (err) {
          expect(err.message).to.include('FAILED_PRECONDITION: Invalid passport number');
          resolve(err);
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  });
});

