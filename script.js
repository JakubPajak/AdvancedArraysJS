'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const displayMovements = function (movements, sort = false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//displayMovements(account1.movements);

const eurToUSD = 1.1;
const movementsUSD = movements.map(mov => mov * eurToUSD);
console.log(movementsUSD);
console.log(movements);

const createUserNames = accounts => {
  accounts.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

const calcPrintBalance = account => {
  account.balance = account.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${account.balance} EUR`;
};

const calcDisplaySummary = acc => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${incomes} EUR`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = Math.abs(out);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = interest;
};

//calcDisplaySummary(account1.movements);
console.log(createUserNames(accounts));
console.log(accounts);

const deposits = movements.filter(mov => mov > 0);
console.log(deposits);

//calcPrintBalance(account1.movements);

const updateUI = function (currAccount) {
  displayMovements(currAccount.movements);
  calcPrintBalance(currAccount);
  calcDisplaySummary(currAccount);
};

let currAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
  //OPTIONAL CHAINING !! currAccount?.pin

  if (currAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${
      currAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }
  updateUI(currAccount);
  console.log('Tescik jak tam gites');
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(a => a.userName === inputTransferTo.value);
  console.log(amount, receiverAcc);
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  if (
    amount > 0 &&
    currAccount.balance >= amount &&
    receiverAcc?.userName !== currAccount.userName
  ) {
    currAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currAccount.userName &&
    Number(inputClosePin.value) === currAccount.pin
  ) {
    const index = accounts.findIndex(i => i.userName === currAccount.userName);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currAccount.movements.some(mov => mov >= amount * 0.1)) {
    currAccount.movements.push(amount);
    updateUI(currAccount);
  }
  inputLoanAmount.value = '';
});

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];

const accountMovements = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(accountMovements);

const accountMovementsMAP = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(accountMovementsMAP);

const owners = ['Jonas', 'Zack', 'Adam', 'Martha'];
console.log(owners.sort());
movements.sort((a, b) => {
  if (a > b) return 1;
  if (b > a) return -1;
});
console.log(movements);

//Descending
movements.sort((a, b) => b - a);
console.log(movements);

let sortedState = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currAccount.movements, !sortedState);
  sortedState = !sortedState;
});

const x = new Array(7);
// console.log(x.fill(1));

x.fill(1, 3, 5);

//Output ==> array of 7 one's
Array.from({ length: 7 }, () => 1);

const z = Array.from({ length: 7 }, (_, i) => i + 1);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelector('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );

  console.log(movementsUI);
});

const { deposit, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, curr) => {
      // cur > 0 ? (sums.deposit += cur) : (sums.withdrawals += cur)
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposit: 0, withdrawals: 0 }
  );

const convertTitle = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'in', 'on', 'with'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};
console.log(convertTitle('this is a nice title'));
console.log(convertTitle('this is a LONG title'));

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(dog =>
  Math.trunc((dog.recommendedFood = dog.weight ** 0.75 * 28))
);

const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'
  }`
);

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);
