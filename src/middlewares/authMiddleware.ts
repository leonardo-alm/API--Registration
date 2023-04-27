import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '../helpers/api-erros'
import { userRepository } from '../repositories/userRepository'
import jwt from 'jsonwebtoken'

type JwtPayload = {
	id: string
}

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { authorization } = req.headers

	if (!authorization) {
		throw new UnauthorizedError('Unauthorized')
	}

	const token = authorization.split(' ')[1]

	try {
		const { id } = jwt.verify(token, process.env.JWT_SECRET ?? '') as JwtPayload
		const user = await userRepository.findOneBy({ id })

		if (!user) {
			throw new UnauthorizedError('Unauthorized')
		}

		const { password: _, ...loggedUser } = user
		req.user = loggedUser
		
		next()
	}
	catch (error) {
		throw new UnauthorizedError('Invalid token')
	}
}
