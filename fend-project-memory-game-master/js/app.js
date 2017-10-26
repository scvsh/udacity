/*
 * Create a list that holds all of your cards
 */
const cardlist = ['diamond', 'paper-plane', 'anchor', 'bolt', 'heart', 'heart', 'cube', 'leaf', 'diamond', 'bicycle', 'bolt', 'leaf', 'anchor', 'bicycle', 'paper-plane', 'cube'];
const deck = document.querySelector('.deck');



//startGame();

function setHandler() {
    let cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', flipCard);
    };
};
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function flipCard() {
    this.classList.add('open');
    this.classList.add('show');
}

class User {

    constructor(name) {
        this.name = name;
    }

    sayHi() {
        alert(this.name);
    }

}

function Dumb() {
    alert(1);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

class Card {

    constructor(suit, id) {
        this.suit = suit;
        this.id = id;
        deck.innerHTML += `<li id="${ id }" class="card"><i class="fa fa-${ suit }"></i></li>`;
        this.flip = e => this.flip(e);
        this.element = document.getElementById(id);
        this.createHandler(id);
    };

    createHandler(id) {
        let element = document.getElementById(id);
        console.log(element);
            element.addEventListener('click', Dumb);
    }
    flip() {
        this.element.classList.add('open');
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

class Deck {
    constructor() {
        this.moves = 0;
        this.stars = 3;
        this.cards = [];
    }

    newGame() {
        /* Create new cards */
        for (let card in shuffle(cardlist)) {
            this.cards.push(new Card(cardlist[card], card));
        };
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

//test = new Card('anchor');
MainDeck = new Deck();
MainDeck.newGame();
/*
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
