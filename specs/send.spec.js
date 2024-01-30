const loader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const expect = require('chai').expect;

describe('Send gRPC API verification', () => {
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

  it('should successfully transfer money from the given account the other when a valid sender, receiver account and legit amount details are provided', () => {
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

      const request = {"senderAccountNo": "2345678", "receiverAccountNo": "13579", "amount": 200,
        "currencyId": "001", "remarks": "Payment for services"}
      client.send(request, (err, response) => {
        if (err) {
          console.error('Error calling withdraw:', err);
          reject(err);
        } else {

          expect(response).to.be.an('object');
          expect(response).to.have.property('transaction');
          expect(response.transaction).to.be.an('object');

          expect(response.transaction).to.have.property('id').that.is.a('string');
          expect(response.transaction).to.have.property('senderAccountNo').that.is.a('string');
          expect(response.transaction).to.have.property('receiverAccountNo').that.is.a('string');
          expect(response.transaction).to.have.property('amount').that.is.a('number');
          expect(response.transaction).to.have.property('currencyId').that.is.a('string');
          expect(response.transaction).to.have.property('timestamp').that.is.an('string');

          expect(response.transaction).to.have.property('senderAccountNo').that.equals(request.senderAccountNo);
          expect(response.transaction).to.have.property('receiverAccountNo').that.equals(request.receiverAccountNo);
          expect(response.transaction).to.have.property('amount').that.equals(request.amount);
          expect(response.transaction).to.have.property('currencyId').that.equals(request.currencyId);

          resolve(response);
        }
      });
    });
  });

  it('should return a FAILED_PRECONDITION error when the currency id is empty', () => {
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

      const request = {"senderAccountNo": "2345678", "receiverAccountNo": "13579", "amount": 200,
        "currencyId": "", "remarks": "Payment for services"}
      client.send(request, (err, response) => {
        if (err) {
          expect(err.message).to.include('AILED_PRECONDITION: Currency ID cannot be empty or null');
          resolve(err);
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  });

  it('should return a FAILED_PRECONDITION error when the transfer receival account is inactive', () => {
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

      const request = {"senderAccountNo": "2345678", "receiverAccountNo": "987654", "amount": 200,
        "currencyId": "001", "remarks": "Payment for services"}
      client.send(request, (err, response) => {
        if (err) {
          expect(err.message).to.include('FAILED_PRECONDITION: Inactive receiver account');
          resolve(err);
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  });
});

