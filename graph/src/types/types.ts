export type Article={
    id:number|string
    content: string
    perex: string
    title: string,
    imageId: string,
    createdAt: string
    lastUpdatedAt: string
    author: string
    comments: Comment[] | null
}


export type  Comment={
    id:number
    author:string
    content: string
    createdAt: string
    rating: number
}


