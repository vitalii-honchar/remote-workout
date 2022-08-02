import bcrypt from 'bcrypt'
import crypto from 'crypto'

const randomPassword = async (password) => {
    if (!password) {
        password = crypto.randomBytes(12).toString('hex')
    }
    return {
        raw: password,
        hash: await bcrypt.hash(password, 10)
    }
}

export default randomPassword
