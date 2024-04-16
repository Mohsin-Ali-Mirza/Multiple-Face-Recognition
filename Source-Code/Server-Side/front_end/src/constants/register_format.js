const mongoos= require("mongoos");
const student=new mongoos.Scheme({
    name:{
        type:String,
        require:true
    },
    ID:{
        type:String,
        require:true
    },
    department:{
        type:String,
        type:true
    }


})

const register= new mongoos.model("student_data",student);
module.exports=Register;