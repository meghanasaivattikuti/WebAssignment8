const express=require('express');
const router=express.Router()
const Users= require('../models/task')
const bcrypt = require('bcrypt');
var msg="";
//Regex
const regEXname = /^[a-zA-Z]+$/;
const regexEmail=/^[A-Za-z0-9.]+@northeastern.edu/;
//Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//getting all
router.get('/', async (req,res)=>{
    try{
        const users=await Users.find()
        res.json(users)
    } catch(err){
        res.status(500).json({message: err.message})
    }
})
//getting one

router.get('/:id', getUser , async (req,res)=>{
    // res.send(res.user.name)
    res.json(res.user)

})

//creating one
router.post('/', async (req,res)=>{
    //var message=regexCheck(req)
    console.log(req.body.name)
    var namePost=req.body.name
    var emailPost=req.body.emailAddress
    var passPost=req.body.password
    console.log(passPost)
    if (regEXname.test(namePost)==false){
        console.log(regEXname.test(namePost))
        msg="Please enter a valid name ";
        console.log(msg);
    }
    
    if (regexEmail.test(emailPost)==false) {
        msg+=", please enter a valid email";
        console.log(msg);
    }
    if (regexPassword.test(passPost)==false) {
        msg+=", please enter a valid password";
        console.log(msg);
    }
    if(msg==""){
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
        console.log("salt =>" + salt);
        console.log("hashedPassword =>" + hashedPassword);
        const usr=new Users({
            name:req.body.name,
            emailAddress:req.body.emailAddress,
            password:hashedPassword
            })
            try{
                const newUser=await usr.save()
                res.status(201).json("User created successfully")
            }
            catch (err) {
                res.status(400).json({message:err.message})
            }
    }
    else{
        console.log("NO");
        
        // if(flag==1){
        //     res.json({message: 'Please enter a valid username'})
        // }
        // if(flag==3){
        //     res.json({message: 'Please enter a valid email'})
        // }
        res.json({message: msg})

       
    
    
    }
    msg="";
})


   


//udpating one

router.patch('/:id', getUser , async (req,res)=>{
    msg="";
    var namePost=req.body.name
    var passPost=req.body.password
    var emailPost=req.body.emailAddress

    if(namePost !=null){
        
        if (regEXname.test(namePost)==false){
            console.log(regEXname.test(namePost))
            msg="Please enter a valid name ";
            console.log(msg);
        }
        else{
            res.user.name=req.body.name
        }
    } 
    if(passPost !=null){
        
        console.log(passPost);

        if (regexPassword.test(passPost)==false) {
            
            msg+=", Please enter a valid password";
            console.log(msg);

        }
        else{
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
            console.log("salt =>" + salt);
            console.log("hashedPassword =>" + hashedPassword);
            res.user.password=hashedPassword;
        }
    }
    
    if(emailPost !=null){    
        msg+=", You cannot update an email address, please try again!";


        
    }
    console.log(msg);
    if(msg==""){
        const updateUser= await res.user.save();
        return res.json({message:"Updated"})

        
    } else {
        console.log("Hey ");
        console.log(msg);
       return res.json({message: msg})
       

       
    }

   

})
//deleting one

router.delete("/:emailAddress",  async (req,res)=>{
    let deluser
    let delemail = req.params.emailAddress;
    console.log(delemail);
    try{
        deluser=await Users.findOneAndDelete({emailAddress:delemail})
        console.log(deluser)
        if(deluser==null){
            return res.status(404).json({message:"Cannot find user"})
        }
        else{
            return res.json({message:"Deleted"})
        }
        
        
        // if(delUser==null){
        //     return res.json("Not an existing user")
        // }
        // // return res.json("User deleted");
        
    } 
    catch(err){
        return res.status(500).json({message:err.message})

    }
    res.user=deluser;
    next()
    

    
    
})
    
    
    //     res.user=Users.findOneAndDelete({email:delemail},function (err, data) {
    //         if (err) {
    //             console.log("Error =>" + err);
    //             res.send("Error =>" + err);
    //         }
    //         else {
    //             if (data == null) {
    //                 res.send("Wrong Email Address... " +
    //                     "The data corresponding to the email address is either deleted or not present in the Database");
    //             }
    //             else {
    //                 res.send(data);
    //                 res.send("Deleted");
    
    
    //             }
    
    
    
    //     if(res.user==null){
    //         return res.status(404).json({message:"Cannot find user"})
    //     }
    //     else{
    //         await res.user.remove()
    //         res.json({message: 'Delted user by email'})
    //     }
        
 
    // } catch(err){
    //     res.status(500).json({message:err.message})
    // }


async function getUser(req,res,next){
    let user
    try{
        user=await Users.findById(req.params.id)
        if(user==null){
            return res.status(404).json({message:"Cannot find user"})
        }
    }
    catch(err){
        return res.status(500).json({message:"Cannot find user"})

    }
    res.user=user;
    next()
}

async function getUserByEmail(req,res,next){
    let userone
    try{
        let delemail = req.params.emailAddress
        console.log(delemail)
        userone=await Users.findOneAndDelete(id)
        if(userone==null){
            return res.status(404).json({message:"Cannot find user"})
        }
        
    }
    catch(err){
        
        return res.status(500).json({message: err.message})

    }
    res.user=userone;
    next()
}
module.exports=router

function regexCheck(req)
{
    console.log("Hey");
    console.log(req.body.name);
    if (req.body.name.trim().match(regEXname)){
        console.log(req.body.name.trim.match(regEXname))
        msg.concat("Please enter a valid name ");
        console.log(msg);
    }
    if (!req.body.emailAddress.trim().match(regEeMID)) {
        msg+=", please enter a valid email";
    }
    // if (!req.body.password.match(regPassword)) {
    //         msg+="Please enter valid password";
    // }
        
    
    return msg;
}