// import { store } from "./store";
// import { store2 } from "./store2";
const {
    SvgIcon,
    TextField,
    Button ,
    Grid
  } = MaterialUI;

const {
    useEffect,
    useState,
    useCallback,    
}  = React;

// import {f} from './temp.js'





// let root=null
const startButtonContainer = document.getElementById('start');
//   const container = document.getElementById('root');
let root = ReactDOM.createRoot(startButtonContainer);
root.render(<StartCallButton />);

root = ReactDOM.createRoot(document.getElementById('usernameDiv'));
root.render(<UserNameText />);

root = ReactDOM.createRoot(document.getElementById('register'));
root.render(<RegisterButton />);


// f()


//   root = ReactDOM.createRoot(document.getElementById('registerComponent'));
//   root.render(<Register />);


