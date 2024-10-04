import jwt from 'jsonwebtoken'

export const generateToken=(userId:string):string =>{
    const token = jwt.sign(
        {userId},
        process.env.JWT_SECRET!,
        {expiresIn:"2h"}
    );

    return token
}

