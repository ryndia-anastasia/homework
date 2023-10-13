let measurementUnit = "години";
let amount = 1;

switch (measurementUnit) {
    case "кілометри" :
        console.log(amount,"км - це", amount * 1000, "м");
        break;
    case "години":
        console.log(amount,"г - це", amount * 60, "хв");
        break;
    case "кілограми":
        console.log(amount,"кг - це", amount * 1000, "грм");
}