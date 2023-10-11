let age = prompt("Вкажіть Ваш вік");
age = 19
let count = age

let result = ""

if (age < 0) {
    console.log("Error")
}

if (count>=10 && count<=20){
    result = "років"
}else {
    count = age % 10
    //console.log("count = ", count);

    if (count === 1) {
        result = "рік"
    }else if (count>=2 && count<=4) {
        result = "роки"
    }else {
        result = "років"
    }
}
console.log(age + " " + result);
