'use strict';

var cryptoStream = require('../../src/stream/crypto.js'),
  enums = require('../../src/enums.js'),
  crypto = require('../../src/crypto'),
  util = require('../../src/util.js');


var chai = require('chai'),
	expect = chai.expect;

describe("CFB Stream", function() {
  it("should work when calling write once", function(done) {
    var opts = {};
    opts['algo'] = enums.read(enums.symmetric, enums.symmetric.aes256);
    opts['key'] = crypto.generateSessionKey(opts['algo']);
    opts['cipherfn'] = crypto.cipher[opts['algo']];
    opts['prefixrandom'] = crypto.getPrefixRandom(opts['algo']);
    
    var plaintext_a = "This is the end,";
    var plaintext_b = "my only friend,";
    var plaintext_c = "the end.";

    var encrypted_data = new Buffer([]);
    var cs = new cryptoStream.CipherFeedback(opts);
    
    cs.on('data', function(d) {
      encrypted_data = Buffer.concat([encrypted_data, d]);
    });

    cs.on('end', function(d) {
      var decrypted = crypto.cfb.decrypt(opts['algo'], opts['key'],
                                         util.bin2str(encrypted_data), true); 
      expect(decrypted).equal(plaintext_a+plaintext_b+plaintext_c);
      expect(encrypted_data.length).equal(cs.blockSize + (plaintext_a+plaintext_b+plaintext_c).length + 2);
      done();
    });
    cs.write(plaintext_a+plaintext_b);
    cs.end(plaintext_c);

  });

  it("should decrypt when calling write multiple times", function(done) {
    var opts = {};
    opts['algo'] = enums.read(enums.symmetric, enums.symmetric.aes256);
    opts['key'] = crypto.generateSessionKey(opts['algo']);
    opts['cipherfn'] = crypto.cipher[opts['algo']];
    opts['prefixrandom'] = crypto.getPrefixRandom(opts['algo']);
    
    var plaintext_a = "This is the end,";
    var plaintext_b = "my only friend,";
    var plaintext_c = "the end.";

    var encrypted_data = new Buffer([]);
    var cs = new cryptoStream.CipherFeedback(opts);
    
    cs.on('data', function(d) {
      encrypted_data = Buffer.concat([encrypted_data, d]);
    });

    cs.on('end', function(d) {
      var decrypted = crypto.cfb.decrypt(opts['algo'], opts['key'],
                                         util.bin2str(encrypted_data), true); 
      expect(decrypted).equal(plaintext_a+plaintext_b+plaintext_c);
      expect(encrypted_data.length).equal(cs.blockSize + (plaintext_a+plaintext_b+plaintext_c).length + 2);
      done();
    });
    cs.write(plaintext_a);
    cs.write(plaintext_b);
    cs.end(plaintext_c);

  });

  it("should decrypt when calling write and end with null", function(done) {
    var opts = {};
    opts['algo'] = enums.read(enums.symmetric, enums.symmetric.aes256);
    opts['key'] = crypto.generateSessionKey(opts['algo']);
    opts['cipherfn'] = crypto.cipher[opts['algo']];
    opts['prefixrandom'] = crypto.getPrefixRandom(opts['algo']);
    
    var plaintext_a = "This is the end,";
    var plaintext_b = "my only friend,";
    var plaintext_c = "the end.";

    var encrypted_data = new Buffer([]);
    var cs = new cryptoStream.CipherFeedback(opts);
    
    cs.on('data', function(d) {
      encrypted_data = Buffer.concat([encrypted_data, d]);
    });

    cs.on('end', function(d) {
      var decrypted = crypto.cfb.decrypt(opts['algo'], opts['key'],
                                         util.bin2str(encrypted_data), true); 
      expect(decrypted).equal(plaintext_a+plaintext_b+plaintext_c);
      expect(encrypted_data.length).equal(cs.blockSize + (plaintext_a+plaintext_b+plaintext_c).length + 2);
      done();
    });
    cs.write(plaintext_a+plaintext_b+plaintext_c);
    cs.end();

  });

  it("should work on UTF-8 characters", function(done) {
    var opts = {};
    opts['algo'] = enums.read(enums.symmetric, enums.symmetric.aes256);
    opts['key'] = crypto.generateSessionKey(opts['algo']);
    opts['cipherfn'] = crypto.cipher[opts['algo']];
    opts['prefixrandom'] = crypto.getPrefixRandom(opts['algo']);
    
    var plaintext_a = "实事求是。";
    var encrypted_data = new Buffer([]);
    var cs = new cryptoStream.CipherFeedback(opts);
    
    cs.on('data', function(d) {
      encrypted_data = Buffer.concat([encrypted_data, d]);
    });

    cs.on('end', function(d) {
      var decrypted = crypto.cfb.decrypt(opts['algo'], opts['key'],
                                         util.bin2str(encrypted_data), true); 
      util.pprint(encrypted_data);
      decrypted = decodeURIComponent(escape(decrypted));
      expect(decrypted).equal(plaintext_a);
      expect(encrypted_data.length).equal(cs.blockSize + (new Buffer(plaintext_a)).length + 2);
      done();
    });
    cs.write(plaintext_a);
    cs.end();

  });



});
