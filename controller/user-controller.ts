import User from "../models/users";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import {Request, Response} from "express";
import { Nodemailer } from "../nodemailer";
import { Query } from "mongoose";
import moment = require("moment");

export class UserController {
	static setVerified(req: Request, res: Response) {
		let token = req.body.OtpVerify;
		const useremail = (req as any).userData.email;
		User.findOne({email:useremail}).then((user)=>{
			if(user.code === token){
				return User.findOneAndUpdate({ email: useremail }, { verified: true }, { new: true }).exec().then((data) => {
					if (data) {
						console.log("happy");
						return res.status(201).send(data);
					} else {
						res.send('user not exist');
					}
				}).catch((err) => {
					res.status(500).send(err);
				})
			}
		});
	}
    static signUp(req: Request, res: Response) {
        // if (!req.body.email && !req.body.password) {
        //     res.status(422).json({
        //         message: 'Please provide all details',
        //         status_code: 422
        //     })
        // } else if (!req.body.email) {
        //     res.status(422).json({
        //         message: 'Please provide an email',
        //         status_code: 422
        //     })
        // } else if (!req.body.password || !req.body.confirm_password) {
        //     res.status(422).json({
        //         message: 'Please provide a password and confirm password',
        //         status_code: 422
        //     })
        // } else if (req.body.password !== req.body.confirm_password) {
        //     res.status(422).json({
        //         message: 'Password and confirm password does not match',
        //         status_code: 422
        //     })
        // } else if (!req.body.name) {
        //     res.status(422).json({
        //         message: 'Please provide your full name',
        //         status_code: 422
        //     })
        // } else if (!req.body.job_category) {
        //     res.status(422).json({
        //         message: 'Please provide your job Category',
        //         status_code: 422
        //     })
        // } else if (!req.body.experience_level) {
        //     res.status(422).json({
        //         message: 'Please provide your Experience Level',
        //         status_code: 422
        //     })
        // } else {
        //     User.find({email: req.body.email})
        //         .exec()
        //         .then(user => {
        //             if (user.length >= 1) {
        //                 return res.status(409).json({
        //                     message: "Mail already exists",
        //                     status_code: 409
        //                 });
        //             } else {
		const otpcode = Nodemailer.otpgenerator();
                                const user = new User({
                                    firstname: req.body.firstname,
									lastname: req.body.lastname,
									username: req.body.username,
									email: req.body.email,
									password: req.body.password,
									code: otpcode
                                });
								console.log(user);
                                user.save().then((data) => {
									Nodemailer.sendEmail("jaiswalmayank450@gmail.com",req.body.email,"verification-mail-is-here",otpcode);
                                    return res.status(201).send(data);
                                    }).catch(err => {
                                        return res.status(500).send(err)
                                    });


        //             }
        //         });
        // }

    }


    static login(req: Request, res: Response) {
        const email = req.query.email;
		const password = req.query.password
		console.log(email,password);
        if (!email || !password) {
            res.status(422).json({
                message: 'please provide an email and password',
                status_code: 422
            })
        }
		User.findOne({ email: email }).then((user) => {
            if (user.length < 1) {
                return res.status(422).json({
                    message: "Email Does not exist",
                    status_code: 422
                });
            }
            let User = (user as any);
			console.log(User);

                if (User.password === password) {
					const token = jwt.sign({
						email: User.email,
						userID: User._id
					}, 'secret', {
						expiresIn: '10days'
					});
					return res.status(200).json({
						token: token,
						user: User
					})
                } else {
                    return res.status(422).json({
                        message: "Email and password does not match",
                        status_code: 422
                    });
                }
            });
		}




	static getUserDetails(req: Request, res: Response) {
		console.log("cozy");
		const date = moment().format('LLLL');
		const userId = (req as any).userData.userID;
		User.findOneAndUpdate({ _id: userId }, { last_active: date }, { new: true })
			.then(data => {
				res.status(200).send(data);
			}).catch((err) => {
				res.status(500).send(err);
			})
	}
    }
