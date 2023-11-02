//1.

/*let str = "CAhristinA visited Miami during her winter vacation"
let re = /[^Aa]{6}/
console.log(str);
console.log(str.match(re));*/


//2.
/*const arr = [
    {
        userName:"Test",
        lastName:"Test",
        email:"test.test@gmail.com"
    },
    {
        userName:"Dmitro",
        lastName:"Porohov",
        email:"dmitro.porohov@yahoo.com"
    },
    {
        userName:"Andrii",
        lastName:"",
        email:"andrii@mail.ru" // Нам такі не підходять
    },];

function validEmail(element){
    for (const value in element) {
        const email = element[value].email;
        const domain = /^(\w+[.]?\w+)*@(gmail\.com|yahoo\.com)$/i;
        if(domain.test(email) === true){
            console.log(email  + " " + "trust");
        }
        else{
            console.log(email + " " + "do not trust");
    }}}
validEmail(arr);*/


