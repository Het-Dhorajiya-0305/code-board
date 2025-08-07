import RoomModel from "../model/roomModel.js"
import User from "../model/userModel.js";


const getusers =async(req,res)=>{
    try {
        const room =await RoomModel.findById(req.roomId);

        let users=[];

        room.users.map(async(userId)=>{
            const findUser=await User.findById(userId);
            users.push(findUser.userName);
        })

        return res.status(200).json({
            success:true,
            users:users
        });;

    } catch (error) {
        return error;
    }
}

export {getusers}