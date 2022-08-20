
// @ts-ignore
module.exports.validateMail=(email)=>{
    const errors={};
    if(!email.match(/^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/))
    {
        // @ts-ignore
        errors.email='Email must be a valid email adress'
    }

    return{
        errors,
        valid:Object.keys(errors).length<1
    }

}
