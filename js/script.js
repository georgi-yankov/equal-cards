var myNameSpace = myNameSpace || {};

myNameSpace.EqualCards = (function() {

	// Shuffle array elements
	function shuffle(o) {
		for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	}

	// Double array elements
	function doubleArr(arr) {
		var doubledArr = [],
			i,
			j;

		for (i = 0; i < arr.length; i++) {
			for (j = 0; j < 2; j++) {
				doubledArr.push(arr[i]);
			}
		}

		return doubledArr;
	}

	function openCard() {
		if ($(this).hasClass('permOpened') || $(this).hasClass('tempOpened')) {
			return;
		}

		if (card.tempOpened === 2) {
			return;
		}

		this.src = 'cards/' + this.alt + '.jpg';
		$(this).addClass('tempOpened');
		card.tempOpened++;

		if (card.tempOpened === 2) {
			var tempOpenedList = $('#play-area img.tempOpened');

			if (tempOpenedList[0].alt === tempOpenedList[1].alt) {
				var audio = new Audio('sounds/ok.mp3');
				audio.play();

				tempOpenedList.addClass('permOpened');
				card.permOpened = card.permOpened + 2;
			} else {
				setTimeout(function() {
					tempOpenedList[0].src = 'img/back-card.jpg';
					tempOpenedList[1].src = 'img/back-card.jpg';
				}, 500);
			}

			tempOpenedList.removeClass('tempOpened');
			card.tempOpened = 0;
		}

		if (isLevelAccomplished(card.permOpened, game.allLevels[game.currentLevel])) {
			if (existSuchLevel(game.allLevels[game.currentLevel + 1])) {
				game.currentLevel++;
				
				setTimeout(function() {
					$('#levels-dropdown').val(game.currentLevel);
					newGame();
				}, 500);
			}
		}
	}

	function existSuchLevel(level) {
		if (level) {
			return true;
		}
	}

	function isLevelAccomplished(countOpened, targetOpened) {
		if (countOpened === targetOpened) {
			return true;
		}
	}

	function newGame() {
		card.tempOpened = 0;
		card.permOpened = 0;

		game.currentLevel = parseInt($('#levels-dropdown').val(), 10);

		var cardsInGame = [];

		cardsInGame = shuffle(possibleCards);
		cardsInGame = possibleCards.slice(0, (game.allLevels[game.currentLevel]) / 2);
		cardsInGame = doubleArr(cardsInGame);
		cardsInGame = shuffle(cardsInGame);

		var cardsOnDeskHtml = '',
			i;

		for (i = 0; i < cardsInGame.length; i++) {
			cardsOnDeskHtml += '<li class="single-card"><img src="img/back-card.jpg" alt="' + cardsInGame[i] + '" /></li>';
		}

		var playArea = document.getElementById('play-area');
		playArea.innerHTML = cardsOnDeskHtml;

		$('#play-area img').on('click', openCard);
	}

	var game = {
		currentLevel: 1,
		allLevels: {
			1: 4,
			2: 8,
			3: 12,
			4: 16
		}
	};

	var possibleCards = [
		'apple',
		'orange',
		'banana',
		'raspberry',
		'prune',
		'strawberry',
		'lemon',
		'mango'
	];

	var card = {
		tempOpened: 0,
		permOpened: 0
	};

	newGame();

	$('#new-game').on('click', newGame);
	$('#change-level').on('click', newGame);
})();