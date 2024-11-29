async function getLocalUser(username){
    let response = await fetch('/api/set/users',{
        headers: {
                    'Content-Type': 'application/json'
        },
    })

    if(response.ok){
        let users = await response.json()
        console.log(users)
        let user = users.find(u=>u.username===username)
        return user
    }else{
        return {message:"failed to get users"}
    }
}

export async function authenticateLocalUser(username,password){
    await getLocalUser(username).then(
        user=>{
            console.log('User returned',user)
            if(password === user.password){
                console.log("Successful")
                return user.role
            }else{
                return false
            }
        }
    )
}