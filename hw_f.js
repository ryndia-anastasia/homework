
//1. Написати свою реалізацію функції isNaN

/*function IsNaN (a) {
    if (a !== a){
        return true;
    }
    else return !(a === null || typeof a === "boolean" || typeof a === "number");
}

console.log(IsNaN(NaN));
console.log(IsNaN(10));
console.log(IsNaN("String"));
console.log(IsNaN(undefined));*/

/*2. Написати власну реалізацію функцій padEnd та padStart

function pad (string, symbol, length, place) {

    while (string.length < length) {
        if (place ) {
            string = symbol + string;
        } else {
            string = string + symbol;
        }
    }
    return string;
}
console.log(pad('Cat','*', '15', true));
console.log(pad('Dog','+', '15', false));*/

/* 3. Перевірка теорії ймовірності

function ProbabilityTheory(count) {
    let min =100;
    let max = 1000;
    let even = 0;
    let odd = 0;
    for (let i = 0; i < count; i++) {
        let random =
            Math.random() * (max - min) + min;
        random= Math.ceil(random)
        if (random % 2 === 0) {
            even++
        } else {
            odd++;
        }
    }

    console.log ("Кількість згенерованих чисел:", count)
    console.log("Парних чисел:", even);
    console.log("Непарних чисел:", odd);
    let countEven = (even/count)*100;
    let countOdd = (odd/count)*100;
    console.log("Відсоток парних до не парних:" + countEven + "%" + "/" + countOdd + "%" )
}
ProbabilityTheory(100); */