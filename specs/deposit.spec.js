const loader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const expect = require('chai').expect;

describe('Deposit gRPC API verification', () => {
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
    client = new BaseProto.AccountService('localhost:9090', grpc.credentials.createInsecure());
  });

  it('should successfully deposit money into the account when a valid account number and amount details are provided', () => {
    return new Promise(function (resolve) {
      const packageDefinition = loader.loadSync('./definitions/proto/exbanking-management-service.proto', {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      });
      const BaseProto = grpc.loadPackageDefinition(packageDefinition);
      const client = new BaseProto.AccountService('localhost:9090', grpc.credentials.createInsecure())

      const request = {"accountNumber": "2345678", "amount": 1000, "currencyId": "001", "remarks": "salary"}
      client.deposit(request, (err, response) => {
        if (err) {
          console.error('Error calling Deposit:', err);
          reject(err);
        } else {

          expect(response).to.be.an('object');
          expect(response).to.have.property('account');
          expect(response.account).to.be.an('object');

          expect(response.account).to.have.property('id').that.is.a('string');
          expect(response.account).to.have.property('userId').that.is.a('string');
          expect(response.account).to.have.property('accountNumber').that.is.a('string');
          expect(response.account).to.have.property('accountType').that.is.a('string');
          expect(response.account).to.have.property('balance').that.is.a('number');
          expect(response.account).to.have.property('currencyId').that.is.a('string');
          expect(response.account).to.have.property('auditInfo').that.is.an('object');

          expect(response.account.auditInfo).to.have.property('createdAt').that.is.an('string');
          expect(response.account.auditInfo).to.have.property('createdBy').that.is.an('string');
          expect(response.account.auditInfo).to.have.property('modifiedAt').that.is.an('string');
          expect(response.account.auditInfo).to.have.property('modifiedBy').that.is.an('string');
          expect(response.account.auditInfo).to.have.property('version').that.equals(0);
          expect(response.account.auditInfo).to.have.property('status').that.equals('ACTIVE');

          expect(response.account).to.have.property('accountNumber').that.equals(request.accountNumber);

          resolve(response);
        }
      });
    });
  });

  it('should return a FAILED_PRECONDITION error when the account number is empty during a deposit', () => {
    return new Promise(function (resolve, reject) {
      const packageDefinition = loader.loadSync('./definitions/proto/exbanking-management-service.proto', {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      });
      const BaseProto = grpc.loadPackageDefinition(packageDefinition);
      const client = new BaseProto.AccountService('localhost:9090', grpc.credentials.createInsecure())

      const request = {"accountNumber": "", "amount": 1000, "currencyId": "001", "remarks": "salary"}
      client.deposit(request, (err, response) => {
        if (err) {
          expect(err.message).to.include('FAILED_PRECONDITION: Account number cannot be empty or null');
          resolve(err);
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  });

  it('should return a FAILED_PRECONDITION error when the deposit amount is a minus value during a deposit', () => {
    return new Promise(function (resolve, reject) {
      const packageDefinition = loader.loadSync('./definitions/proto/exbanking-management-service.proto', {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      });
      const BaseProto = grpc.loadPackageDefinition(packageDefinition);
      const client = new BaseProto.AccountService('localhost:9090', grpc.credentials.createInsecure())

      const request = {"accountNumber": "2345678", "amount": -10, "currencyId": "001"}
      client.deposit(request, (err, response) => {
        if (err) {
          expect(err.message).to.include('FAILED_PRECONDITION: Amount must be greater than 0');
          resolve(err);
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  });
});

