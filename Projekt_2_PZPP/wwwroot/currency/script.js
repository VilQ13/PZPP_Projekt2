document.addEventListener("DOMContentLoaded", () => {
    const currencyOne = document.getElementById("currency-one");
    const amountOne = document.getElementById("amount-one");
    const currencyTwo = document.getElementById("currency-two");
    const amountTwo = document.getElementById("amount-two");
    const rate = document.getElementById("rate");
    const swap = document.getElementById("swap");

    function calculate() {
        const currency_one = currencyOne.value;
        const currency_two = currencyTwo.value;
        fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
            .then((res) => res.json())
            .then((data) => {
                const currentRate = data.rates[currency_two];
                rate.innerText = `1 ${currency_one} = ${currentRate} ${currency_two}`;
                amountTwo.value = (amountOne.value * currentRate).toFixed(2);
            });
    }

    currencyOne.addEventListener("change", calculate);
    amountOne.addEventListener("input", calculate);
    currencyTwo.addEventListener("change", calculate);
    amountTwo.addEventListener("input", calculate);

    swap.addEventListener("click", () => {
        const storedValue = currencyOne.value;
        currencyOne.value = currencyTwo.value;
        currencyTwo.value = storedValue;
        calculate();
    });

    calculate();

    function updateTopRates() {
        fetch('https://api.exchangerate-api.com/v4/latest/USD')
            .then(res => res.json())
            .then(data => {
                document.getElementById("usd-eur").innerText = data.rates["EUR"].toFixed(2);
                document.getElementById("usd-rub").innerText = data.rates["RUB"].toFixed(2);
                document.getElementById("usd-pln").innerText = data.rates["PLN"].toFixed(2);
                document.getElementById("usd-uah").innerText = data.rates["UAH"].toFixed(2);
            })
            .catch(err => console.error('Failed to fetch top rates:', err));
    }

    updateTopRates();

    const ctx = document.getElementById('rateChart').getContext('2d');
    let chart;

    function loadChart(base = "USD", target = "EUR", days = 30) {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        fetch(`https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${endDate}&base=${base}&symbols=${target}`)
            .then(res => res.json())
            .then(data => {
                const labels = Object.keys(data.rates).sort();
                const values = labels.map(date => data.rates[date][target]);

                if (chart) chart.destroy();

                chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels,
                        datasets: [{
                            label: `${base} to ${target}`,
                            data: values,
                            borderColor: 'rgb(75, 192, 192)',
                            fill: false,
                            tension: 0.1
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: { title: { display: true, text: 'Date' } },
                            y: { title: { display: true, text: 'Rate' } }
                        }
                    }
                });
            });
    }

    document.getElementById("time-range").addEventListener("change", (e) => {
        loadChart("USD", "EUR", parseInt(e.target.value));
    });

    loadChart();
});
