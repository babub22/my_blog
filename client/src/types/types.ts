export interface Article {
    __typename: string;
    id: string;
    perex: string;
    title: string;
    author: string;
    imageId: string;
    commentCount: number;
    createdAt: Date;
    lastUpdatedAt: Date;
    comments: Comments[] | null;
}

export interface User {
    id: string;
    email: string;
    username: string;
    iat: number;
    exp: number;
}

export interface Comments {
    __typename: string;
    id: string;
    author: string;
    content: string;
    createdAt: Date;
    likeCount: number;
    likes: Like[] | null;
}

export interface Like {
    __typename: string;
    id: string;
    username: string;
    createdAt: Date;
}

