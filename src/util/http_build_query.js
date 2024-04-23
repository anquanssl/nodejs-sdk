const http_build_query = (data, prefix) => {
    if (typeof (data) === 'undefined' || typeof (data) !== 'object') return data
    const _encodeURIComponent = (str) => {
        const map = {
            " ": "+",
            "\n": "%0A",
            "!": "%21",
            "\"": "%22",
            "#": "%23",
            "$": "%24",
            "%": "%25",
            "&": "%26",
            "'": "%27",
            "(": "%28",
            ")": "%29",
            "*": "%2A",
            "+": "%2B",
            ",": "%2C",
            "/": "%2F",
            ":": "%3A",
            ";": "%3B",
            "<": "%3C",
            "=": "%3D",
            ">": "%3E",
            "?": "%3F",
            "@": "%40",
            "[": "%5B",
            "\\": "%5C",
            "]": "%5D",
            "^": "%5E",
            "`": "%60",
            "{": "%7B",
            "|": "%7C",
            "}": "%7D",
            "~": "%7E"
        };
    
        // return str's char replacing in map if exists, origin char if not exists    
        return 'string' != typeof str ? str : str.replace(/[\s\S]/g, function (c) {
            return map[c] || encodeURIComponent(c);
        });
    };

    const query = [];

    for (let param in data) {
        if (data.hasOwnProperty(param)) {
            let key = prefix ? prefix + "[" + param + "]" : param,
                value = data[param];
            query.push(typeof value == "object" ? http_build_query(value, key) : _encodeURIComponent(key) + "=" + _encodeURIComponent(value));
        }
    }

    return query.join('&')
};

export default http_build_query;
