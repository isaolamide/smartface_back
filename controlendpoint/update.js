const handleUpdate= (req,res,db,bcrypt)=>{
    const {id}= req.params;
    const {name,email,password}= req.body
    if (!email || !name || !password){
        return res.status(400).json('incorrect submission')
    }
    const hash = bcrypt.hashSync(password);
    
    db.transaction(trx=>{
        trx.update({
            email:email,
            hash:hash
        })
        .where({id})
        .into('login')
        .returning('email')
        .then(loginEmail=>{
          return  trx('users')
          .where({id})
          .returning('*')
          .update({
            email:loginEmail[0].email,
            name:name,
            joined: new Date()
    }).then(user=>{
        res.json(user[0])
    })
  })
     .then(trx.commit)
     .catch(trx.rollback)
    })
    .catch(err=>res.status(400).json(err,'Unable to register'))
};

module.exports={
    handleUpdate:handleUpdate
}