var assert = require('assert');
var fs = require('fs');
var asn1 = require('../../../');
var rfc5280 = require('..');

var Buffer = require('buffer').Buffer;

describe('asn1.js RFC5280', function() {

  it('should decode Certificate', function() {
    var data = fs.readFileSync(__dirname + '/fixtures/cert1.crt');
    var res = rfc5280.Certificate.decode(data, 'der');

    var tbs = res.tbsCertificate;
    assert.equal(tbs.version, 'v3');
    assert.deepEqual(tbs.serialNumber,
                     new asn1.bignum('462e4256bb1194dc', 16));
    assert.equal(tbs.signature.algorithm.join('.'),
                 '1.2.840.113549.1.1.5');
    assert.equal(tbs.signature.parameters.toString('hex'), '0500');
  });

  it('should decode ECC Certificate', function() {
    // Symantec Class 3 ECC 256 bit Extended Validation CA from
    // https://knowledge.symantec.com/support/ssl-certificates-support/index?page=content&actp=CROSSLINK&id=AR1908
    var data = fs.readFileSync(__dirname + '/fixtures/cert2.crt');
    var res = rfc5280.Certificate.decode(data, 'der');

    var tbs = res.tbsCertificate;
    assert.equal(tbs.version, 'v3');
    assert.deepEqual(tbs.serialNumber,
                     new asn1.bignum('4d955d20af85c49f6925fbab7c665f89', 16));
    assert.equal(tbs.signature.algorithm.join('.'),
                 '1.2.840.10045.4.3.3');  // RFC5754
    var spki = rfc5280.SubjectPublicKeyInfo.encode(tbs.subjectPublicKeyInfo,
                                                   'der');
// spki check to the output of
// openssl x509 -in ecc_cert.pem -pubkey -noout |
// openssl pkey -pubin  -outform der | openssl base64
    assert.equal(spki.toString('base64'),
                 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE3QQ9svKQk5fG6bu8kdtR8KO' +
                 'G7fvG04WTMgVJ4ASDYZZR/1chrgvaDucEoX/bKhy9ypg1xXFzQM3oaqtUhE' +
                 'Mm4g=='
                );
  });

  it('should decode AuthorityInfoAccess', function() {
    var data = new Buffer('305a302b06082b06010505073002861f687474703a2f2f70' +
                          '6b692e676f6f676c652e636f6d2f47494147322e63727430' +
                          '2b06082b06010505073001861f687474703a2f2f636c6965' +
                          '6e7473312e676f6f676c652e636f6d2f6f637370',
                          'hex');

    var info = rfc5280.AuthorityInfoAccessSyntax.decode(data, 'der');

    assert(info[0].accessMethod);
  });

  it('should decode directoryName in GeneralName', function() {
    var data = new Buffer('a411300f310d300b06022a03160568656c6c6f', 'hex');

    var name = rfc5280.GeneralName.decode(data, 'der');
    assert.equal(name.type, 'directoryName');
  });

  it('should decode Certificate Extensions', function() {
    var data;
    var cert;

    var extensions = {}
    data = fs.readFileSync(__dirname + '/fixtures/cert3.crt');
    cert = rfc5280.Certificate.decode(data, 'der');
    cert.tbsCertificate.extensions.forEach(function(e) {
      extensions[e.extnID] = e
    });
    assert.equal(extensions.basicConstraints.extnValue.cA, false);
    assert.equal(extensions.extendedKeyUsage.extnValue.length, 2);

    extensions = {}
    data = fs.readFileSync(__dirname + '/fixtures/cert4.crt');
    cert = rfc5280.Certificate.decode(data, 'der');
    cert.tbsCertificate.extensions.forEach(function(e) {
      extensions[e.extnID] = e
    });
    assert.equal(extensions.basicConstraints.extnValue.cA, true);
    assert.equal(extensions.authorityInformationAccess.extnValue[0]
                 .accessLocation.value, 'http://ocsp.godaddy.com/')

    extensions = {}
    data = fs.readFileSync(__dirname + '/fixtures/cert5.crt');
    cert = rfc5280.Certificate.decode(data, 'der');
    cert.tbsCertificate.extensions.forEach(function(e) {
      extensions[e.extnID] = e
    });
    assert.equal(extensions.basicConstraints.extnValue.cA, true);

    extensions = {}
    data = fs.readFileSync(__dirname + '/fixtures/cert6.crt');
    cert = rfc5280.Certificate.decode(data, 'der');
    cert.tbsCertificate.extensions.forEach(function(e) {
      extensions[e.extnID] = e
    });
    assert.equal(extensions.basicConstraints.extnValue.cA, true);
  });
});
