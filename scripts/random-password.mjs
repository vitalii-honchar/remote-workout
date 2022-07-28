import bcrypt from 'bcrypt'
import crypto from 'crypto'

const password = crypto.randomBytes(12).toString('hex')
const hash = await bcrypt.hash(password, 10)
console.dir({password: password, hash: hash})
