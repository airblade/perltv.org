var data;
var show_length;
var show_date;
var show_featured;

function get_state(name) {
	var state = localStorage.getItem(name);	
	if (state === null) {
		state = false;
	} else {
		state = JSON.parse(state);
	}
	return state;
}

function toggle() {
	//console.log(this.id);
	var state = get_state(this.id);
	state = ! state;
	localStorage.setItem(this.id, state);

	if (this.id == 'show_featured') {
		show('show_featured', 'featured');
	}
	if (this.id == 'show_date') {
		show('show_date', 'date');
	}
	if (this.id == 'show_length') {
		show('show_length', 'length');
	}
}

function show(id, cls) {
	//console.log('show ' + id + ' ' + cls);
	var state = get_state(id);
	var elements = document.getElementsByClassName(cls);
	for (var i=0; i < elements.length; i++) {
		elements[i].style.display = state ? 'inline' : 'none';
	};
}

function sort_rows() {
	//console.log('sort: ' + this.className);
	var convert = function(v) { return v };
	var column = 3; // title
	if (/sort_date/.exec(this.className)) {
		column = 0;
	}
	if (/sort_featured/.exec(this.className)) {
		column = 1;
	}
	if (/sort_length/.exec(this.className)) {
		column = 2;
		convert = function(v) { return (v.length == 8) ?  v : "00:" + v; };
	}
	if (/sort_title/.exec(this.className)) {
		column = 3;
	}

	var blocks = document.getElementsByClassName('videos');
	for (var i=0; i < blocks.length; i++) {
		var ch = blocks[i].children;
		//console.log(ch.length);
		var html = '<li>' + ch[0].innerHTML + '</li>';
		//console.log(html);

		//var sort_descending = get_status('sort_descending');

		var arr = new Array;
		for (var j = 1; j < ch.length; j++) {
			arr.push({
				"field" : convert(ch[j].children[column].innerHTML),
				"html"  : ch[j].innerHTML
			});
		}
		arr.sort(function(a, b) { return a['field'].localeCompare(b['field']) });
		html += arr.map(function(a) { return '<li>' + a['html'] + '</li>' }).join('');
		//console.log(html);
		blocks[i].innerHTML = html;
	}
	add_listeners();
}


function on_load() {
	show_date     = document.getElementById('show_date');

	// page with list of videos
	// TODO: recognize this in a more readable way.
	if (show_date) {
		show_date.addEventListener('click', toggle);
		show('show_date', 'date');

		show_featured = document.getElementById('show_featured');
		show_featured.addEventListener('click', toggle);
		show('show_featured', 'featured');

		show_length = document.getElementById('show_length');
		show_length.addEventListener('click', toggle);
		show('show_length', 'length');

		add_listeners();
	}
}

function add_listeners() {
	['sort_date', 'sort_featured', 'sort_length', 'sort_title'].forEach(function(f) {
		var elements = document.getElementsByClassName(f);
		for (var i=0; i < elements.length; i++) {
			elements[i].addEventListener('click', sort_rows);
		}
	});
}

on_load();


