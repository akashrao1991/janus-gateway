function RegisterButton(){
    return(
        <div>
            <Button 
                variant="contained" 
                onClick={() => {
                    // alert('clicked');
                    const username = $('#username').val();
                    customRegisterUsername(username)
                }}
            >
                Register
            </Button>          
        </div>
    )
}


function UserNameText(){
    const [text,setText] = useState("")
    return(
        <div>
            {/* {text} */}
            <TextField 
                id="username" 
                label="User Name" 
                variant="outlined" 
                onKeyDown={
                    event=>{
                    // return
                    // setText(event.target.value)
                    if(event.keyCode == 13){
                        // console.log(event.currentTarget,event)
                        customRegisterUsername(event.target.value)
                    // 	// checkEnter(this, event);
                    }
                }}
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {/* <AccountCircle /> */}
                        <i className="fa fa-user fa-fw"></i> 

                      </InputAdornment>
                    ),
                  }}
            />
        </div>
    )
    
    }
    

function Register(){
    return(
        <Stack spacing={2}>
            <UserNameText />
            <RegisterButton />
        </Stack>
    )
}