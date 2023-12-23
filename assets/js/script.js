const getCurrencies = () => {
    const selectCurrencyTag = document.querySelector('#currency');

    fetch('https://mindicador.cl/api') // fetches the service solicited
        .then(response => response.json()) // we get an answer and it is transformed into json
        .then(currencies => { 
            console.log(currencies);

            for (let key in currencies) { 
                if (key !== 'version' && key !== 'autor' && key !== 'fecha') { //filter the info we dont want or need

                    let option = document.createElement("option") // we create the option in html
                    option.value = currencies[key].valor;
                    option.text = currencies[key].nombre;
                    option.id = currencies[key].codigo;

                    selectCurrencyTag.add(option) // inlcude the options in html
                }
            }
        })
        .catch(error => { //if it isnt working we will get the prompt
            alert("Ocurrió un error al obtener las monedas")
            console.log(error);
        });
}

// the actual math section
const calculate = () => {
    // grab the info from html
    const selectCurrency = document.querySelector('#currency');
    const input = document.querySelector('#inputValue');
    const result = document.querySelector('#result');

    let selectEDCurrency = selectCurrency.value;
    let value = input.value;

    result.innerHTML = (value / selectEDCurrency).toFixed(4); // we can determin the amouint of decilams we want. only 4 in this case
    
    let options = selectCurrency.options;
    let currencyType = options[options.selectedIndex].id;

    console.log(currencyType);

    generateChart(currencyType);
}


//now starts mahem=the graph section
const generateChart = (currencyType) => {
    fetch('https://mindicador.cl/api/'+currencyType) // fetching the service once more. Can we fetch all at once?
    .then(response => response.json()) // we get an answer and transform to json
    .then(data => { 
        const ctx = document.getElementById('myChart');
        ctx.innerHTML = ''; // delete the canva to prevent errors when clicking again

        const temporalDiv = document.createElement('canvas');

        new Chart(temporalDiv, {
            type: 'line',
            data: {
                labels: data.serie.map((value) => value.fecha),
                datasets: [{
                    label: 'Timeline currency',
                    data: data.serie.map((value) => value.valor),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        ctx.appendChild(temporalDiv);
        
    })
    .catch(error => { //once more, to get the prompt with the error using the alert command
        alert("Ocurrió un error al obtener las monedas")
        console.log(error);
    });

}

getCurrencies();

// se agrega un evento click al boton convertir y se llama la funcion de calculo
const convert = document.querySelector('#convert');
convert.addEventListener('click', calculate);
