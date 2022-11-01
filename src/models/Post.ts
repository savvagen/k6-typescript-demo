export class Post{
    readonly id?: number
    title: string
    subject: string
    body: string
    category: string|undefined
    user: number|undefined
    comments: Array<number>
    createdAt: string
}
