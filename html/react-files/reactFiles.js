// import { store } from "./store";
// import { store2 } from "./store2";
const {
    SvgIcon,
    TextField,
    Button 
  } = MaterialUI;

// import {f} from './temp.js'

function StartCallButton() {

const render = ()=>{
    console.log('----------------------------',store.getState().toString())
}
store2.subscribe(render)
// const value = 

return (
    <div>
        <Button variant="contained">Start Call</Button>          
    </div>
) 
}

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

    <div class="col-md-6 container hide" id="login">
                        <div class="input-group margin-bottom-sm">
                            <span class="input-group-addon"><i class="fa fa-user fa-fw"></i></span>

                            <div id = "usernameDiv"></div>
                        </div>
                        <button class="btn btn-success margin-bottom-sm" autocomplete="off" id="register">Register</button> <span class="hide label label-info" id="youok"></span>
                    </div>


)
}


const startButtonContainer = document.getElementById('start');
//   const container = document.getElementById('root');
let root = ReactDOM.createRoot(startButtonContainer);
root.render(<StartCallButton />);

root = ReactDOM.createRoot(document.getElementById('usernameDiv'));
root.render(<UserNameText />);

f()


//   root = ReactDOM.createRoot(document.getElementById('registerComponent'));
//   root.render(<Register />);


