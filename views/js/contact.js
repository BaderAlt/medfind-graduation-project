


const form = document.querySelector("#myform");
const msg = document.querySelector("#msg");


form.addEventListener('submit', e=>{
  
	let massages = [];

    massages = isFilled("#first-name",massages,"First Name is missing");
    massages = isFilled("#last-name",massages,"Last Name is missing");
    massages = isFilled("#email",massages,"Email is missing");
    massages = isEmail("#email",massages,"Email format is wrong");
    massages = isFilled("#mobile",massages,"Mobile Number is missing");
    massages = isMobile("#mobile",massages,"Mobile Number must contain numbers only");
    massages = isFilled("#date-of-birth",massages,"Date of birth is missing");
    massages = isFilled("#details",massages,"Details is missing");

  

    if(massages.length>0){
    	
    	msg.innerHTML = "Issues found ["+ massages.length +"]: " + massages.join (", ") + ".";

    	e.preventDefault();
     }

})
    
function isFilled(selector,massages,msg){
    const element = document.querySelector(selector).value.trim();
    if(element.length<1){
        massages.push(msg);
    }
     return massages;
}


function isEmail(selector,massages,msg){
    const element = document.querySelector(selector).value.trim();
    if(!element.match("[a-z0-9]+@[a-z]+\.[a-z]{2,4}")){
       massages.push(msg);
    }
     return massages;


}

function isMobile(selector,massages,msg){
    const element = document.querySelector(selector).value.trim();
    if(!element.match("[0-9]{9}")){
       massages.push(msg);
    }
     return massages;
 }



