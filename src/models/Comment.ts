
export class Comment {
    id?: number|undefined
    post: number|undefined
    name: string
    email: string|undefined
    likes: Array<number>
    dislikes: Array<number>
    body: string
    createdAt: string
}
