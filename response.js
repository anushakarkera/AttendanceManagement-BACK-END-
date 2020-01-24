module.exports = class Response{
    constructor(res){
        this.res = res;
        this.code=200;
    }
    setError(err){
        this.error = err;
        return this;
    }
    setCode(code){
        this.code = code;
        return this;
    }
    setMessage(msg){
        this.message = msg;
        return this;
    }
    setData(data){
        this.data = data;
        return  this;
    }
    setStatus(sts){
        this.status = sts;
        return this;
    }
    async send(){
        this.res.status(this.code).send(await this.prepareStructure());
    }
    prepareStructure(){
        //will add the fields which are 'set' to 'structure' 
        let structure = {};
        if(this.status) structure.resStatus = this.status;
        if(this.message) structure.resMessage = this.message;
        if(this.data) structure.data = this.data;
        if(this.error) structure.error = this.error;
        return structure;
    }
}

//by default respose code will be set to 200 (assuming postive response)

/*
let r = new Response(res)    //pass res object to constructor
r.setMessage('message to client')
r.setStatus('Success')
//we can also chain the methods
r.setData(clientData).send();
*/