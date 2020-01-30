module.exports = class Response{
    constructor(resCode){
    	let res = {};
        this.setStatus  = (sts)  => { res.status =sts;      return this;    }
        this.setMessage = (msg)  => { res.message = msg;    return this;    }
        this.setData    = (data) => { res.data = data;      return this; 	}
        this.setError   = (err)  => { res.error = err;      return this; 	}
        
        this.send = (resObj) => {
            if(Object.keys(res).length)
                resObj.status(resCode).send(res);
            else{
                if(defaultResponse[resCode] === undefined)
                    resObj.status(404).send(defaultResponse[404]);
                else
                    resObj.status(resCode).send(defaultResponse[resCode]);
            }
        }
    }
}

/*
-- add negative response here using response code as a key --
*/
let defaultResponse = {
    200 :  {},
    201 :  {},

    404 :  {
        error  : 'Default Response Not Defined'
    },

    401 : {
    },

    409 : {
        error   : 'Email Conflict'
    },

    422 : {
        error : 'Unprocessable Entity : Update Failed'
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