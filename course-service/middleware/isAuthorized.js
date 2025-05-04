export default function isAuthorized(role){
    return (req,res,next) => {
        const userRole = req.body.role
        if(userRole === role){
            next()
        }
        else{
            res.status(404).json({
                message : "Forbidden"
            })
        }
    }
}