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
