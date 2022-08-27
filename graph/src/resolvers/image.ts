const path = require('path')
const fs = require('fs')
let md5 = require('md5')

import { UploadFile } from "../types/types"

module.exports = {
    Mutation:{
        // uploading images
        singleUpload: async (_: any, {file}: { file: UploadFile }) => {

            const {createReadStream, filename, mimetype, encoding} = await file
            const stream = createReadStream()
            const pathName = path.join(__dirname, `../../data/images/${md5(filename) + '.jpg'}`)
            await new Promise((resolve, reject) => {
                stream.pipe(fs.createWriteStream(pathName)).on('finish', resolve).on('error', reject)
            })

            return {filename, mimetype, encoding};
        }
    }
}