function UserNameText(){
    return(
        <div>
            <TextField 
                id="username" 
                label="User Name" 
                variant="outlined" 
                onKeyDown={
                    event=>{
                    // return
                    if(event.keyCode == 13){
                        // console.log(event.currentTarget,event)
                        customRegisterUsername(event.target.value)
                    // 	// checkEnter(this, event);
                    }
                }}
            />
        </div>
    )
    
    }
    