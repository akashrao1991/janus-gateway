// import { store } from "./store";
// import { store2 } from "./store2";
const {
    SvgIcon,
    TextField,
    Button 
  } = MaterialUI;

// import {f} from './temp.js'


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


function Register(){
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

// let root=null
const startButtonContainer = document.getElementById('start');
//   const container = document.getElementById('root');
let root = ReactDOM.createRoot(startButtonContainer);
root.render(<StartCallButton />);

root = ReactDOM.createRoot(document.getElementById('usernameDiv'));
root.render(<UserNameText />);

root = ReactDOM.createRoot(document.getElementById('register'));
root.render(<Register />);


// f()


//   root = ReactDOM.createRoot(document.getElementById('registerComponent'));
//   root.render(<Register />);


