        var CMD_REG_EXP = /:([ptwi]{1,})$/;

        var kwSearch = {
        
        findBookmarks: function (regex, text, callback) {

            var maxDepth = storage.get(storage.DEPTH_KEY) || 5;
            var results = [];

            chrome.bookmarks.search(text, function (matched) {
                for (var i = 0; i < matched.length && results.length < maxDepth; i++) {
                    if(matched[i].title && regex.test(matched[i].title)) {
                        results.push(matched[i]);
                    }
                }
                callback(results);
            });
        },

        loadUrl: function (url, options) {
            var newTab = storage.get(storage.NEW_TAB_KEY);

            if (options.window) {
                chrome.windows.create({url: url, incognito: options.incognito});
            }

            chrome.tabs.getSelected(null, function (tab) {
                if (tab != null && newTab != "true" && options.tab != true || tab.url == "chrome://newtab/") {
                    chrome.tabs.update(tab.id, {url: url, pinned: options.pinned, selected: true});
                } else {
                    chrome.tabs.create({url: url, pinned: options.pinned, selected: true});
                }
            });
            kwSearch.updateCount();
        },

        updateCount: function() {
            var cnt = storage.get(storage.USE_COUNT_KEY, 0);
            storage.set(storage.USE_COUNT_KEY, parseInt(cnt) + 1);
        },

        getSuggestion: function (bookmarks, text) {
            return bookmarks.map(function (bookmark){
                var t = bookmark.title;
                var re = new RegExp("(" + text + ")");
                
                return {
                    content: bookmark.url,
                    description: 'Open ' + (re.test(t) ? t.replace(re, '<match>' + RegExp.$1 +'</match>') : '<match>' + t + '</match>')
                };
            });
        },

        getRegExp: function(text) {
            var regExp = storage.get(storage.REG_EXP_KEY);
            var reCase = storage.get(storage.REG_EXP_OPT_KEY);
        
            if (reCase != "true") {
                reCase = "i";
            } else {
                reCase = null;
            }
            var r = new RegExp(storage.DEFAULT_REGEXP.replace(/%s/g, text), reCase);
        
            if (regExp) {
                r = new RegExp(regExp.replace(/%s/g, text), reCase);
            }

            return r;
        },

        buildOptions: function(text) {
            if(CMD_REG_EXP.test(text)) {
                var cmd = RegExp.$1;
                return {
                    pinned: cmd.indexOf("p") != -1, 
                    window: cmd.indexOf("w") != -1, 
                    incognito: cmd.indexOf("i") != -1, 
                    tab: cmd.indexOf("t") != -1
                }
            } else {
                return {};
            }
        }
    };
    
    chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
        if (!text) {
            return;
        }

        text = text.replace(CMD_REG_EXP, "");

        kwSearch.findBookmarks(kwSearch.getRegExp(text), text, function (results){
            suggest(kwSearch.getSuggestion(results, text));
        });
    });

    chrome.omnibox.onInputEntered.addListener(function (text) {
        if (!text) {
            return;
        }
        var options = kwSearch.buildOptions(text);

        text = text.replace(CMD_REG_EXP, "");

        if (/(^http:|^https:|^javascript:|^ftp:|^file:)/.test(text)) {
            kwSearch.loadUrl(text, options);
        }
        
        kwSearch.findBookmarks(kwSearch.getRegExp(text), text, function (results) {
            if (results.length > 0) {
                kwSearch.loadUrl(results[0].url, options);
            } 
        });
    });