
import { faker } from '@faker-js/faker/locale/en_US'
import {Post, Comment, User} from "../models";
const dateTimeNow = (): string => new Date().toISOString().slice(0, 19) + "Z"
import * as _ from 'lodash'


let categories = ["cats", "dogs", "test"]


export function randomUser(): User {
    const first = faker.name.firstName("male")
    const last = faker.name.lastName("male")
    return {
        name: `${first} ${last}`,
        username: `${faker.internet.userName()}`,
        email: `${faker.internet.email(first, last)}`,
        createdAt: dateTimeNow()
    }
}

export function randomPost(userId: number|undefined): Post {
    return {
        title: `Test Post ${faker.datatype.number({min: 100000, max: 999999})}`,
        subject: `Performance Testing`,
        body: `${faker.lorem.sentences()}`,
        category: _.sample(categories),
        user: userId,
        comments: [],
        createdAt: dateTimeNow()
    }
}

export function randomComment(postId: number|undefined, userEmail: string|undefined): Comment{
    return {
        "name": `Test comment - ${faker.datatype.number({min: 100000, max: 999999})}`,
        "email": userEmail,
        "post": postId,
        "likes": [
            1
        ],
        "dislikes": [
            1
        ],
        "body": "Greeting from " + userEmail,
        "createdAt": dateTimeNow()
    }
}
