let md5 = require('md5')

module.exports.createId = (input: any) => {
    const id = md5(input.title+input.createdAt+input.author)

    return {
        id, ...input
    }
}
