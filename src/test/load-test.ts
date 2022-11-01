import { Options } from "k6/options"
import { postReaderScn, postWriterScn } from "../scenarios"
// @ts-ignore
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js'
// @ts-ignore
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js"
// @ts-ignore
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js"


export let options: Options = {
    discardResponseBodies: false,
    scenarios: {
        readerScn: {
            //executor: "per-vu-iterations",
            //vus: 1,
            //iterations: 1
            executor: 'constant-vus',
            exec: "readScn",
            vus: 5,
            duration: '40s'
        },
        writerScn: {
            //executor: "per-vu-iterations",
            //vus: 1,
            //iterations: 1
            executor: 'constant-vus',
            exec: "writeScn",
            vus: 5,
            duration: '40s'
        }
    },
    thresholds: {
        http_req_failed: ['rate<=0'], // During the whole test execution, the error rate must be equal to 0%.
        //http_req_failed: [{threshold: 'rate<=0', abortOnFail: true}], // Abort if there is more than 0% failed tests
        http_req_duration: ['p(95)<500'],
        checks: ['rate>=1'], // the rate of successful checks should be equal to 100%
        'checks{status:ok}': ['rate>0.99']
    },
    //httpDebug: "full"
}


export function readScn() { postReaderScn() }

export function writeScn() { postWriterScn() }



export function handleSummary(data: object) {
    return {
        "result.html": htmlReport(data),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}
