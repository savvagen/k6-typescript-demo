import encoding from "k6/encoding";
import {postReaderScn} from "./post-reader.scn";
import {postWriterScn} from "./post-writer.scn";

export function encodedCredentials(username: string, password: string) {
    return encoding.b64encode(`${username}:${password}`)
}

export const defaultParams = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
}

export const defaultAuthParams = (username: string, password: string) => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: `Basic ${encodedCredentials(username, password)}`,
        }
    }
}

export const defaultAuthTokenParams = (token: string) => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    }
}


export {
    postReaderScn,
    postWriterScn
}
