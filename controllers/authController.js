// import { comparePassword, hashPassword } from "../helpers/authHelper.js"
// import userModel from '../models/user.js'
// import JWT from 'jsonwebtoken'

// export const registerController = async (req, res) => {
//     try {
//         // console.log(req.body)
//         const {name, email, password, phone, address} = req.body

//         //validatoins
//         if(!name) {
//             return res.send({ message: 'Name is required' })
//         }
//         if(!email) {
//             return res.send({ message: 'Email is required' })
//         }
//         if(!password) {
//             return res.send({ message: 'Password is required' })
//         }
//         if(!phone) {
//             return res.send({ message: 'Phone is required' })
//         }
//         if(!address) {
//             return res.send({ message: 'Address is required' })
//         }

//         //check user
//         const existingUser = await userModel.findOne({email})
//         //existing user
//         if(existingUser) {
//             return res.status(404).send({
//                 success: true,
//                 message: ' User has already registered please Login'
//             })
//         }
//         //register user
//         const hashedPassword = await hashPassword(password)
//         //save
//         const user = new userModel({name, email, phone, address, password: hashedPassword}).save()

//         res.status(201).send({
//             success: true,
//             message: 'User Register Successfully',
//             user
//         })

//     } catch (error) {
//         res.status(500).send({
//             success: false,
//             message: 'Error in Registration',
//             error
//         })
//     }
// }

// //POST LOGIN
// export const loginController = async (req, res) => {
//     try {
//         const { email, password} = req.body

//         //validations
//         if(!email || !password) {
//             return res.status(404).send({
//                 success: false,
//                 message: 'Invalid email or password'
//             })
//         }

//         //check user
//         const user = await userModel.findOne({email})
//         if(!user) {
//             return res.status(404).send({
//                 success: false,
//                 message: 'Email is not registered'
//             })
//         }
//         const match = await comparePassword(password, user.password)
//         if(!match) {
//             return res.status(404).send({
//                 success: false,
//                 message: 'Invalid password'
//             })
//         }

//         //token
//         const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn: '7d'});
//         res.status(200).send({
//             success: true,
//             message: 'Login successfully',
//             user: {
//                 name: user.name,
//                 email: user.email,
//                 phone: user.phone,
//                 address: user.address
//             },
//             token,
//         })

//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             success: false,
//             message: 'Error in login',
//             error
//         })
//     }
// }

// //test controller
// export const testController = (req, res) => {
//     console.log('Protected Route')
// }

