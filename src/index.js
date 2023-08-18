import '@/styles/index.scss'
const showMenuBtn = document.getElementById('showMenuBtn');
const changeCurrencyBtn = document.getElementById('changeCurrencyBtn');

const menu = document.querySelector('nav.menu')
const cardList = document.querySelector('.card-list')
const cardExtraPrices = Array.from(cardList.querySelectorAll('.card-extra__price'))
const orderForm = document.querySelector('.order-form')
const orderFormInputs = Array.from(orderForm.querySelectorAll('input'))
let exchangeData = [
	{
		symbol: 'USD',
		token: '$'
	},
	{
		symbol: 'RUB',
		token: '₽'
	},
	{
		symbol: 'UAH',
		token: '₴'
	},
	{
		symbol: 'JPY',
		token: '¥'
	},
	{
		symbol: 'EUR',
		token: '€'
	},
]

const query = `https://api.exchangerate.host/latest?base=USD&symbols=${exchangeData.map(item => item.symbol).join()}`
const getRates = async () => {
	const res = await fetch(query)
	return res.json()
}

const scrollToEl = (id) => {
	const el = document.getElementById(id);
	if (!el) return;

	el.scrollIntoView({ behavior: 'smooth' })
}
const menuHandler = (e) => {
	e.preventDefault();
	const target = e.target;

	if (target.tagName !== 'A') return;

	const id = target.getAttribute('href').slice(1)
	scrollToEl(id)
}
const cardListHandler = (e) => {
	e.preventDefault()
	const target = e.target;
	const button = target.closest('button')
	if (!button) return;

	scrollToEl('order')
}

const formInputValidation = (input) => {
	!input.value
		? input.parentElement.style.background = 'red'
		: input.parentElement.style.background = ''

	return Boolean(input.value)
}

const orderFormHandler = (e) => {
	e.preventDefault()

	const isValid = orderFormInputs
		.map(input => formInputValidation(input))
		.every(item => item === true)

	if (isValid) {
		orderFormInputs.forEach(input => input.value = '')

		alert('Спасибо за заказ!')
	}
}

const changeCurrencyHandler = (e, exchangeData, cardExtraPrices) => {
	{
		let curCurrency = e.target.innerText
		let newCurrency
		
		switch (curCurrency) {
			case '$':
				newCurrency = '₽'
				break;
			case '₽':
				newCurrency = '₴'
				break;
			case '₴':
				newCurrency = '¥'
				break;
			case '¥':
				newCurrency = '€'
				break;
			case '€':
				newCurrency = '$'
				break;
		}

		e.target.innerText = newCurrency
		
		const {rate} = exchangeData.find(item => item.token === newCurrency)

		cardExtraPrices.forEach(item => {
			item.innerText = `${(parseInt(item.dataset.price) * rate).toFixed(0)} ${newCurrency}`
		})
	}
}

document.addEventListener("DOMContentLoaded", async () => {
	const {rates} = await getRates()

	exchangeData = [...exchangeData].map(item => ({
		...item, 
		rate: rates[item.symbol]
	}))

	menu.addEventListener('click', (e) => menuHandler(e))
	cardList.addEventListener('click', (e) => cardListHandler(e))
	showMenuBtn.addEventListener('click', () => scrollToEl('products'))
	orderForm.querySelector('button[type="submit"]').addEventListener('click', (e) => orderFormHandler(e))
	
	changeCurrencyBtn.addEventListener('click', (e) => changeCurrencyHandler(e, exchangeData, cardExtraPrices))
})