var storage = {
    USE_COUNT_KEY: "use_count",
    DEPTH_KEY: "depth",
    NEW_TAB_KEY: "newtab",
    REG_EXP_KEY: "regexp",
    REG_EXP_OPT_KEY: "regexp_opt",
    DEFAULT_REGEXP: "^\\\[%s.*\\\]",

    get: function(key, defaultValue) {
        if (defaultValue != null || defaultValue != "undefined") {
            return localStorage[key] || defaultValue;
        } else {
            return localStorage[key];
        }
    },

    set: function(key, value) {
        localStorage[key] = value;
    }

};
