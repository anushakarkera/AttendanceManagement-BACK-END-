user{
    _id:
     fullName:
    email: 
    password:
    phone:
    gender:
    city: 
    saltSecret: 
    tokens: [{ 
                token: 
            }]
}

class{
    _id:
    Name:
    RoomNumber:
}

subject{
    _id:
    Name:
}

classSubject{
    _id:
    class_id:
    subjevt_id:
}

student{
    _id:
    name:
    //other student related fields:
    class_id:
}

userTimeTable{
    _id:
    user_id:
    mon:[
        {classSubject_id:   ,time:   },
        {classSubject_id:   ,time:   },
        ..............................
    }]
    tue:[
        {classSubject_id:   ,time:   },
        {classSubject_id:   ,time:   },
        ..............................
    }]
    ...................................
    sat:[
        {classSubject_id:   ,time:   },
        {classSubject_id:   ,time:   },
        ..............................
    }]
}