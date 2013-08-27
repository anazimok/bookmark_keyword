window.onload = function() {
	loadOptions();

	$("saveBtn").addEventListener('click', save);

	var helpElements = document.getElementsByClassName("help");

	for(var i = 0; i < helpElements.length; i++) {
		helpElements[i].addEventListener('click', function() {
			this.addEventListener('click', showHelp(this.id.substring(1)));	
		});
	}
}

var MAX_DEPTH = 5;

function $(id) {
    return document.getElementById(id);
}

function save() {
    storage.set(storage.REG_EXP_KEY, $("regexp").value);
    storage.set(storage.REG_EXP_OPT_KEY, $("regexpcase").checked);
    storage.set(storage.NEW_TAB_KEY, $("newtab").checked);
    storage.set(storage.DEPTH_KEY, parseInt($("maxDepth").value));
    
    window.close();
}

function loadOptions() {
    var re = storage.get(storage.REG_EXP_KEY);
    var reCase = storage.get(storage.REG_EXP_OPT_KEY);
    var newTab = storage.get(storage.NEW_TAB_KEY);
    var maxDepth = storage.get(storage.DEPTH_KEY, 5);
    
    $("regexp").value = (re ? re : storage.DEFAULT_REGEXP);
    $("regexpcase").checked = (reCase == "true" ? true : false);
    $("newtab").checked = (newTab == "true" ? true : false);
    $("maxDepth").value = maxDepth;
    $("range").innerHTML = maxDepth;
    $("usageCount").innerHTML = storage.get(storage.USE_COUNT_KEY, 0);
}

function showHelp(index) {
    var helpText = [
        'Regular Expression defines the expression by which the extension identifies the portion of the bookmark title to be used as keyword. For example if the bookmark title is "[fb] Facebook" then the "[fb]" represents the keyword portion of the bookmark.',
        'Case Sensitive option defines if the keyword searches are cases sensetive.',
        'Open in New Tab option defines if the bookmark should be opened in the new tab.',
        '# of Suggestions defines how many suggestions should the search return if there is more then one match. Note that even if there is more then one match the first entry from the list will be loaded.',
        'Keyword Expended keeps track of how many times you used the extension to expan/load a bookmark using the keyword'
    ];
    $("msg").innerHTML = helpText[index];
}
