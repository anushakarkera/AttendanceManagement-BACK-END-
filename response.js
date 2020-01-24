class Response{
    constructor(res){
        this.res = res;
        this.code=200;
    }
    setCode(code){
        this.code = code;
    }
    setMessage(msg){
        this.message = msg;
    }
    setData(data){
        this.data = data;
    }
    setStatus(sts){
        this.status = sts;
    }
    send(){
        if(!this.code || !this.message || !this.status)
            throw('code , message or status is missing');
        this.res.status(this.code).send(constructResponseStructure());
    }
    constructResponseStructure(){
        if(this.code === 200){
            return{
                resCode:this.code,
                resStatus:this.status,
                resMessage:this.message,
                resData:this.data
            }
        }else{
            return{
                resCode:this.code,
                resStatus:this.status,
                resMessage:this.message,
                resData:this.data
            }
        }
    }
}
module.exports = Response;