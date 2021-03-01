//Logging
const admin =  

  {
  username: "admin", password: "admin"
  };



function getInfo(){
    
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  if(username === admin.username && password === admin.password ){
    location.replace("./index.html")
  }

}