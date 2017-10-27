/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* Amnesia memory game 
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 

const cardlist = ['diamond', 'paper-plane', 'anchor', 'bolt', 'heart', 'heart', 'cube', 'leaf', 'diamond', 'bicycle', 'bolt', 'leaf', 'anchor', 'bicycle', 'paper-plane', 'cube'];
const deck = document.querySelector('.deck');
const restart = document.querySelector('.restart');
const moveboard = document.querySelector('.moves');
const starboard = document.querySelector('.stars');
const button = document.querySelector('.button');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* Main gaming class
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

class Deck {
    constructor() {
        deck.innerHTML = '';
        this.moves = 0;
        this.stars = 3;
        this.cards = [];
        this.open = [];
        this.fixed = [];
        this.render();
        stopwatch.restart();

    }

    newGame() {
        /* Create new cards */
        for (let card in shuffle(cardlist)) {
            this.cards.push(new Card(cardlist[card], card));
        };
    }

    checkMatch() {
        /* Compare two cards in hand */
        this.moves += 1;
        return this.open[0].suit == this.open[1].suit;
    }

    matchFound() {
        /* Fix cards with equal suit */
        for (let id in this.open) {
            this.open[id].fix();
        };
        for (let id in this.open) {
            this.fixed.push(this.open[id]);
        };
        this.open = [];
        this.fixed.length == 16 ? this.win() : false;
        this.countStars();

    }

    matchNotFound() {
        /* Show not matching cards and close again */
        for (let id in this.open) {
            this.open[id].fail()
        };

        setTimeout(() => {
            for (let id in this.cards) {
                this.cards[id].close();
                this.open = [];
            };
        }, 500);
        this.countStars();
    }

    move() {
        /* Make move */
        function openCard(id) {
            this.open.push(this.cards[id]);
        }

        function flipCard(id) {
            this.cards[id].flip();
            if (this.open.length > 1) {
                this.checkMatch() ? this.matchFound() : this.matchNotFound();
            };
            this.render();
        }

        openCard.call(MainDeck, this.id);
        flipCard.call(MainDeck, this.id);


    }
    countStars() {
        if (this.moves == 8) {
            this.stars -= 1;
        } else if (this.moves == 16) {
            this.stars -= 1;
        } else if (this.moves == 24) {
            this.stars -= 1;
        };
    }
    
    win() {
        stopwatch.stop();
        spawnPopup(this.moves, stopwatch.format(stopwatch.times), this.stars);
    }

    render() {
        /* Render the Deck */
        starboard.innerHTML = '';
        moveboard.innerHTML = this.moves;
        for (let i = 0; i < this.stars; i++) {
            let star = document.createElement('li');
            star.innerHTML = '<li><i class="fa fa-star"></i></li>';
            starboard.appendChild(star);
        }
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* Card class 
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 

class Card {

    constructor(suit, id) {
        this.suit = suit;
        this.id = id;
        this.open = false;
        this.element = document.createElement('li');
        this.appendCard();
        this.html = document.getElementById(this.id);
    }

    appendCard() {
        let element = this.element;
        element.id = this.id;
        element.className = 'card';
        element.innerHTML = `<i class="fa fa-${ this.suit }"></i></li>`;
        element.addEventListener('click', MainDeck.move);
        deck.appendChild(element);
    }

    flip() {
        this.open = true;
        this.html.classList.add('open');
        this.html.classList.add('show');
        this.element.removeEventListener('click', MainDeck.move);
    }

    fix() {
        this.open = true;
        this.html.classList.add('match');
        this.element.removeEventListener('click', MainDeck.move);
    }

    close() {
        this.open = false;
        this.html.classList.remove('open');
        this.html.classList.remove('show');
        this.html.classList.remove('fail');
        this.element.addEventListener('click', MainDeck.move);
    }

    fail() {
        this.html.classList.add('fail');
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* Shuffle function from http://stackoverflow.com/a/2450976
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 

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

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* Helping functions
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 


function createDeck() {
    hidePopup();
    MainDeck = new Deck();
    MainDeck.newGame();
}

function spawnPopup(moves, time, stars) {
    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('.popup').style.display = 'flex';
    document.querySelector('.fmoves').innerHTML = moves;
    document.querySelector('.ftime').innerHTML = time;
    document.querySelector('.fstars').innerHTML = stars;
}

function hidePopup() {
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.popup').style.display = 'none';
    document.querySelector('.fmoves').innerHTML = 0;
    document.querySelector('.ftime').innerHTML = 0;
    document.querySelector('.fstars').innerHTML = 0;
}


restart.addEventListener('click', createDeck);
button.addEventListener('click', createDeck);
createDeck();
