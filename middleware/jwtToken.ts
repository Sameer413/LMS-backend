import jwtToken from 'jsonwebtoken'
require('dotenv').config();

const generateToken = (id: string) => {
    return jwtToken.sign({ id }, process.env.JWT_SECRET || '', { expiresIn: '3d' });
}

export default generateToken;