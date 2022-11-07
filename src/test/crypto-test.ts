import {group, sleep} from "k6"
import { Options } from "k6/options"
// @ts-ignore
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js"
// @ts-ignore
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js"
// @ts-ignore
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';



//global.window = {};
//const forge = require("node-forge")
//import * as CryptoJS from "crypto-js/core";

//const nodeCrypto = require("crypto")


export let options: Options = {
    vus: 1,
    duration: '30s'
}


export default ()=> {
    sleep(1)
    const randomUUID = uuidv4()
    console.log(randomUUID)
    const privateKeyExample = '-----BEGIN RSA PRIVATE KEY-----\n'+
        'MIIBOQIBAAJAVY6quuzCwyOWzymJ7C4zXjeV/232wt2ZgJZ1kHzjI73wnhQ3WQcL\n'+
        'DFCSoi2lPUW8/zspk0qWvPdtp6Jg5Lu7hwIDAQABAkBEws9mQahZ6r1mq2zEm3D/\n'+
        'VM9BpV//xtd6p/G+eRCYBT2qshGx42ucdgZCYJptFoW+HEx/jtzWe74yK6jGIkWJ\n'+
        'AiEAoNAMsPqwWwTyjDZCo9iKvfIQvd3MWnmtFmjiHoPtjx0CIQCIMypAEEkZuQUi\n'+
        'pMoreJrOlLJWdc0bfhzNAJjxsTv/8wIgQG0ZqI3GubBxu9rBOAM5EoA4VNjXVigJ\n'+
        'QEEk1jTkp8ECIQCHhsoq90mWM/p9L5cQzLDWkTYoPI49Ji+Iemi2T5MRqwIgQl07\n'+
        'Es+KCn25OKXR/FJ5fu6A6A+MptABL3r8SEjlpLc=\n'+
        '-----END RSA PRIVATE KEY-----'

    /*const keypair = forge.pki.rsa.generateKeyPair({bits: 2048, e: 0x10001});
    const pubKeyPEM = forge.pki.publicKeyToPem(keypair.publicKey);
    const privKeyPEM = forge.pki.privateKeyToPem(keypair.privateKey);
    console.log(pubKeyPEM);
    console.log(privKeyPEM);

    const enc_key = forge.pki.privateKeyFromPem(privKeyPEM)
    const hmacDecrypted = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512("test", randomUUID));
    console.log(hmacDecrypted)

    const sign_key = forge.pki.privateKeyFromPem(privKeyPEM)
    const md = forge.md.sha256.create();
    md.update(hmacDecrypted);
    const signature = sign_key.sign(md);
    console.log(forge.util.encode64(signature))*/


    /*const { publicKey, privateKey } = nodeCrypto.generateKeyPairSync('rsa',
        {
            modulusLength: 2048,  // the length of your key in bits
            publicKeyEncoding: {
                type: 'spki',       // recommended to be 'spki' by the Node.js docs
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',      // recommended to be 'pkcs8' by the Node.js docs
                format: 'pem',
                //cipher: 'aes-256-cbc',   // *optional*
                //passphrase: 'top secret' // *optional*
            }
        })
    const signature = nodeCrypto.createSign('RSA-SHA256')
        .update('some data to sign')
        .sign(privateKey, 'base64');
    console.log(privateKey)
    console.log(signature)*/

}
