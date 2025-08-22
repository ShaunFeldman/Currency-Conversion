const $ = require('jquery');
global.$ = $;
const { convertCurrency, setCurrentDecimals } = require('../convertCurrency.js');

describe('convertCurrency', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="amount" />
      <select id="from-currency">
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>
      <select id="to-currency">
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>
      <div id="result"></div>
    `;
    setCurrentDecimals('2');
    $.getJSON = jest.fn();
  });

  test('selecting the same currency echoes the input amount', () => {
    $('#amount').val('100');
    $('#from-currency').val('USD');
    $('#to-currency').val('USD');

    convertCurrency();

    expect($('#result').text()).toBe('100 USD = 100 USD');
    expect($.getJSON).not.toHaveBeenCalled();
  });

  test('different decimal settings produce correctly rounded output', () => {
    $('#amount').val('1.005');
    $('#from-currency').val('USD');
    $('#to-currency').val('EUR');

    $.getJSON.mockImplementation((url, success) => {
      success({ rates: { EUR: 0.5 } });
      return { fail: jest.fn() };
    });

    setCurrentDecimals('2');
    convertCurrency();
    expect($('#result').text()).toBe('1.005 USD = 0.50 EUR');

    setCurrentDecimals('3');
    convertCurrency();
    expect($('#result').text()).toBe('1.005 USD = 0.503 EUR');
  });
});
