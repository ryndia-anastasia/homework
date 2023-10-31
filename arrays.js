
//1. Напишіть функцію myBlend(arr), яка перемішуватиме переданий їй масив

/*let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function myBlend(array) {
    for (let i = 0; i < arr.length; i++) {
        let a = Math.floor(Math.random() * (arr.length -1)),
            b = Math.floor(Math.random() * (arr.length - 1))

        let num = array[a]
        array[a] = array[b]
        array[b] = num
    }
    return array
}
console.log(arr)
console.log(myBlend(arr)) */


//2. BigBoss

/*const company = {
    name: 'Велика Компанія',
    type:'Головна компанія',
    platform: 'Платформа для продажу квитків',
    sellsSolution: 'Рішення для продажу квитків',
    clients: [
        {
            name: 'Клієнт 1',
            type: 'subCompany',
            uses: 'ПО для продажу квитків',
            sells: 'Рішення для продажу квитків',
            partners: [
                {
                    name: 'Клієнт 1.1',
                    type: 'subSubCompany',
                    uses: 'Рішення для продажу квитків',
                    sells: 'Рішення для продажу квитків',
                },
                {
                    name: 'Клієнт 1.2',
                    type: 'subSubCompany',
                    uses: 'Рішення для продажу квитків',
                    sells: 'Рішення для продажу квитків',
                    partners: [
                        {
                            name: 'Клієнт 1.2.3',
                            type: 'subSubCompany',
                            uses: 'Рішення для продажу квитків',
                            sells: 'Рішення для продажу квитків',
                        },
                    ]
                }
            ]
        },
        {
            name: 'Клієнт 2',
            type: 'subCompany',
            uses: 'ПО для продажу квитків',
            sells: 'Рішення для продажу квитків'
        }
    ]
};


function findValueByKey(companyName) {
    if (company.name === companyName) {
        return {
            name: company.name,
            type: company.type,
            platform: company.platform,
            sellsSolution: company.sellsSolution,
        };
    }

    for (const client of company.clients) {
        if (client.name === companyName) {
            return {
                name: client.name,
                type: client.type,
                uses: client.uses,
                sells: client.sells,
            };
        }

        if (client.partners) {
            const result = findValueByKeyRecursive(client.partners, companyName);
            if (result) {
                return result;
            }
        }
    }

    return null;
}

function findValueByKeyRecursive(partners, companyName) {
    for (const partner of partners) {
        if (partner.name === companyName) {
            return {
                name: partner.name,
                type: partner.type,
                uses: partner.uses,
                sells: partner.sells,
            };
        }

        if (partner.partners) {
            const result = findValueByKeyRecursive(partner.partners, companyName);
            if (result) {
                return result;
            }
        }
    }

    return null;
}

console.log(findValueByKey('Велика Компанія'));*/ 