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

const nodeCrypto = require("crypto")


export let options: Options = {
    vus: 1,
    duration: '30s'
}


/* Node-Forge */
/*
function generateKeys(): {privateKeyPEM: string, publicKeyPEM: string} {
    const keypair = forge.pki.rsa.generateKeyPair({bits: 2048, e: 0x10001});
    const publicKeyPEM = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKeyPEM = forge.pki.privateKeyToPem(keypair.privateKey);
    return { privateKeyPEM, publicKeyPEM }
}

function createSignature(privateSignKey: string, data: string = "test"){
    const sign_key = forge.pki.privateKeyFromPem(privateSignKey)
    const md = forge.md.sha256.create()
    md.update(data);
    const signature = sign_key.sign(md)
    return forge.util.encode64(signature)
}
*/

/* Node-Crypto */
function generateKeys(): {privateKeyPEM: string, publicKeyPEM: string} {
    const { publicKeyPEM, privateKeyPEM } = nodeCrypto.generateKeyPairSync('rsa',
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
    return { privateKeyPEM, publicKeyPEM }
}

function createSignature(privateKey: string, data: string = "test"){
    return nodeCrypto.createSign('RSA-SHA256')
        .update(data)
        .sign(privateKey, 'base64')
}


export default ()=> {
    sleep(1)
    console.log("start")
    const keys = generateKeys()
    const signature = createSignature(keys.privateKeyPEM)
    console.log(signature)
    console.log("finish")
}
