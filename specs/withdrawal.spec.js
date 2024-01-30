const loader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const expect = require('chai').expect;

describe('Withdraw gRPC API verification', () => {
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

  it('should successfully withdraw money from the account when a valid account number and legit amount details are provided', () => {
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

      const request = {"accountNumber": "2345678", "amount": 1000, "currencyId": "001"}
      client.withdraw(request, (err, response) => {
        if (err) {
          console.error('Error calling withdraw:', err);
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

  it('should return a FAILED_PRECONDITION error when the withdrawing account is inactive', () => {
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

      const request = {"accountNumber": "987654", "amount": 100, "currencyId": "001"}
      client.withdraw(request, (err, response) => {
        if (err) {
          expect(err.message).to.include('FAILED_PRECONDITION: Inactive account');
          resolve(err);
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  });

  it('should return a FAILED_PRECONDITION error when the account has no enough funds for the withdrawal', () => {
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

      const request = {"accountNumber": "2345678", "amount": 80000, "currencyId": "001"}
      client.withdraw(request, (err, response) => {
        if (err) {
          expect(err.message).to.include('FAILED_PRECONDITION: No sufficient funds in the account');
          resolve(err);
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  });
});

