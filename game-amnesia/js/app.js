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
        this.gameStarted = false;
        stopwatch.stop();
        stopwatch.reset();
        stopwatch.print();
    }
    
    newGame() {
        /* Create 16 instances of the #Card class. */
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
        /* Add fixed cards to the list for the future win determination */
        for (let id in this.open) {
            this.fixed.push(this.open[id]);
        };
        /* Clear hand */
        this.open = [];
        /* Check if won already? */
        this.fixed.length == 16 ? this.win() : false;
        /* Count user's star rating */
        this.countStars();

    }

    matchNotFound() {
        /* Show not matching cards and close again */
        for (let id in this.open) {
            this.open[id].fail()
        };
        /* Set timeout to delay the failed match hiding */
        setTimeout(() => {
            for (let id in this.cards) {
                this.cards[id].close();
                this.open = [];
            };
        }, 500);
        /* Count user's star rating */
        this.countStars();
    }

    move() {
        /* Has the game started? If no, start. */
        if ( !MainDeck.gameStarted  ) {
            MainDeck.gameStarted = true, 
                stopwatch.restart(); 
        };
        /* Take a card and add it to the list of opened cards */
        function openCard(id) {
            this.open.push(this.cards[id]);
        }
        /* Flip the opened card and check match */
        function flipCard(id) {
            this.cards[id].flip();
            if (this.open.length > 1) {
                this.checkMatch() ? this.matchFound() : this.matchNotFound();
            };
            /* Render the scoreboard */
            this.render();
        }
        /* move() method is used as a callback in the click handler. Use 'call' to set the context back to the Deck. */
        openCard.call(MainDeck, this.id);
        flipCard.call(MainDeck, this.id);


    }
    countStars() {
        /* Calculate user rating on every move */
        if (this.moves == 8) {
            this.stars -= 1;
        } else if (this.moves == 16) {
            this.stars -= 1;
        };
    }
    /* Game is won already! */ 
    win() {
        stopwatch.stop();
        spawnPopup(this.moves, stopwatch.format(stopwatch.times), this.stars);
    }

    render() {
        /* Render the scoreboard */
        starboard.innerHTML = '';
        moveboard.innerHTML = this.moves;
        /* Render the stars */
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
        /* Render the card into the DOM */
        let element = this.element;
        element.id = this.id;
        element.className = 'card';
        element.innerHTML = `<i class="fa fa-${ this.suit }"></i></li>`;
        element.addEventListener('click', MainDeck.move);
        deck.appendChild(element);
    }

    flip() {
        /* Render the flip */
        this.open = true;
        this.html.classList.add('open');
        this.html.classList.add('show');
        this.element.removeEventListener('click', MainDeck.move);
    }

    fix() {
        /* Render the fix */
        this.open = true;
        this.html.classList.add('match');
        /* Remove event listener to make card unaccessible */
        this.element.removeEventListener('click', MainDeck.move);
    }

    close() {
        /* Render the close */
        this.open = false;
        this.html.classList.remove('open');
        this.html.classList.remove('show');
        this.html.classList.remove('fail');
        /* Remove event listener to make card unaccessible */
        this.element.addEventListener('click', MainDeck.move);
    }

    fail() {
        /* Turn the card RED */
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
    /* Initialize the game */
    hidePopup();
    MainDeck = new Deck();
    MainDeck.newGame();
}

function spawnPopup(moves, time, stars) {
    /* Render the popup with game stats */
    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('.popup').style.display = 'flex';
    document.querySelector('.fmoves').innerHTML = moves;
    document.querySelector('.ftime').innerHTML = time;
    document.querySelector('.fstars').innerHTML = stars;
}

function hidePopup() {
    /* Hide popup before game restart */
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.popup').style.display = 'none';
    document.querySelector('.fmoves').innerHTML = 0;
    document.querySelector('.ftime').innerHTML = 0;
    document.querySelector('.fstars').innerHTML = 0;
}

/* Add common listeners */
restart.addEventListener('click', createDeck);
button.addEventListener('click', createDeck);

/* Create game */
createDeck();
