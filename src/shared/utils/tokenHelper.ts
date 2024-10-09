import jwt from 'jsonwebtoken'

export const generateToken=(userId:string,role:string):string =>{
    const token = jwt.sign(
        {userId,role},
        process.env.JWT_SECRET!,
        {expiresIn:"2h"}
    );

    return token
}

