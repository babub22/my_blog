export interface Article{
    __typename:    string;
    id:            string;
    perex:         string;
    title:         string;
    author:        string;
    imageId:       string;
    createdAt:     Date;
    lastUpdatedAt: Date;
    comments:      null;
}

export interface User {
    id: string;
    email: string;
    username: string;
    iat: number;
    exp: number;
}
