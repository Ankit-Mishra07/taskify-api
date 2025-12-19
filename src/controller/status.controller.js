const StatusSchema = require("../model/status.model")

const getStattusList = async (req, res) => {
    try {
        const statuslist = await StatusSchema.find();
        return res.status(200).json({
            success:true, message: 'Status list fetched successfully',
            data: statuslist
        })
    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        })  
    }
}
const createStattus = async (req, res) => {
    try {
        await StatusSchema.create({
            status: req.body.status
        });
        const statuslist = await StatusSchema.find();
        return res.status(200).json({
            success:true, message: 'Status list fetched successfully',
            data: statuslist
        })
    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        })  
    }
}
const updateStattusList = async (req, res) => {
    try {
        await StatusSchema.findByIdAndUpdate(req.params.statusId, req.body, {new: true, runValidators:true})
        const statuslist = await StatusSchema.find();
        return res.status(200).json({
            success:true, message: 'Status list fetched successfully',
            data: statuslist
        })
    }catch(error) {
        return res.status(500).json({
            success: false, message: 'Something went wrong',
            errorMessage: error,
        })  
    }
}

module.exports = {getStattusList, createStattus, updateStattusList}

