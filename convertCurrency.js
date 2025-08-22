const API_URL = 'https://api.frankfurter.app';
let currentDecimals = "2";

function convertCurrency() {
  const rawInput = $('#amount').val().trim();
  const from = $('#from-currency').val();
  const to = $('#to-currency').val();

  if (rawInput === '') {
    $('#result').text('Enter an amount to convert.');
    return;
  }

  const amount = parseFloat(rawInput);
  if (isNaN(amount)) {
    $('#result').text('Please enter a valid number.');
    return;
  }

  if (from === to) {
    $('#result').text(`${rawInput} ${from} = ${rawInput} ${to}`);
    return;
  }

  $.getJSON(`${API_URL}/latest?base=${from}&symbols=${to}`, function(data) {
    if (data && data.rates && data.rates[to]) {
      const rate = data.rates[to];
      const convertedValue = amount * rate;
      const formattedConverted = (currentDecimals === "ALL")
        ? convertedValue.toString()
        : convertedValue.toFixed(currentDecimals);
      $('#result').text(`${rawInput} ${from} = ${formattedConverted} ${to}`);
    } else {
      $('#result').text('Conversion rate not available.');
    }
  }).fail(function() {
    $('#result').text('Error fetching conversion rate.');
  });
}

function setCurrentDecimals(dec) {
  currentDecimals = dec.toString();
}

if (typeof window !== 'undefined') {
  window.convertCurrency = convertCurrency;
  window.setCurrentDecimals = setCurrentDecimals;
}

if (typeof module !== 'undefined') {
  module.exports = { convertCurrency, setCurrentDecimals };
}
