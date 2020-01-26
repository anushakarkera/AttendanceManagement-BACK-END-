module.exports = class Response{
    constructor(resCode){
    	let res = {Status : 'SUCCESS'};

        this.setMessage = (msg)  => { res.Message = msg;    return this;    }
        this.setData    = (data) => { res.Data = data;      return this; 	}
        this.setError   = (err)  => { res.Error = err;      return this; 	}
        
        this.send = (resObj) => {
            if(resCode === 200)
                resObj.status(resCode).send(res);
            else{
                res.Status = 'FAILED';
                if(defaultResponse[resCode] === undefined)
                    resObj.status(404).send(defaultResponse[404]);
                else
                    resObj.status(resCode).send(Object.assign(res,defaultResponse[resCode]));
            }
        }
    }
}

/*
-- add negative response here using response code as a key --
*/
let defaultResponse = {
    404 :  {
        Message : 'Unknown Request',
        Error  : 'Default Response Not Defined'
    },

    401 : {
        Message : 'Incorrect Email or Password',
        Error   : 'Incorrect Credential : User Authentication Unsuccessful'
    },

    409 : {
        Message : 'User Already Exist',
        Error   : 'Email Conflict : User Registration Unsuccessful'
    },

    422 : {
        Message : 'Update Failed',
        Error : 'Unprocessable Entity'
    }
}

/*
-- Available Methods --
setMessage()
setData()
setError()
send(res)  //pass 'res' object 


-- How to Use --

Sending Successful Response       (pass 200 as response code)

let response = new Response( responseCode );       
response.setMessage('Response Message');
response.setData (ResponseData);
response.send(res);     

        -OR-

new Response( responseCode )                       
    .setMessage('Response Message')
    .setData (ResponseData)
    .send(res);



Sending Negative Response   (pass a standard code as responseCode)

    new Response( responseCode )
        .send(res);

Note : Define response content in defaultResponse { } (defined above)
        
*/