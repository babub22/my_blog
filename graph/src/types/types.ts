export type ArticleType={
    id:number|string
    content: string
    perex: string
    title: string,
    imageId: string,
    createdAt: string
    lastUpdatedAt: Date
    author: string
    comments: Comment[] | null
}

export interface NewUser {
    username: string;
    password: string;
    email:    string;
}


export type CommentType={
    id:number;
    author:string;
    content: string;
    createdAt: string;
    rating: number;
}

export interface UpdateArticle {
    id:         string;
    content:    string;
    perex:      string;
    imageId:    string;
    title:      string;
    __typename: string;
}

export interface UploadFile {
    fieldName:        string;
    filename:         string;
    mimetype:         string;
    encoding:         string;
    createReadStream: Function;
}




