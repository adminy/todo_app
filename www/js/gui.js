//CONST UTILS
const $ = id => document.getElementById(id),
    $TV = id => $(id).value.trim(),
    $is = id => typeof ($(id)) != 'undefined' && $(id) !== null,
    $rm = id => {
        if ($is(id)) {
            return $(id).parentNode.removeChild($(id))
        }
    },
    $TCB = (bool, isTrueCallback) => bool ? isTrueCallback() : 0,
    $DATE = (timestamp) => new Date(parseInt(timestamp)).toISOString().split('T')[0].split('-').reverse().join('/'),
    $scrollBottom = id => $(id).scrollTop = $(id).scrollHeight,
    randomColour = () => "#" + ((1 << 24) * Math.random() | 0).toString(16),
    $genRand = (min, max, decimalPlaces) => {
        const rand = Math.random() * (max - min) + min
        const power = Math.pow(10, decimalPlaces)
        return Math.floor(rand * power) / power
    },
    $randFromArray = array => array[Math.floor(Math.random() * array.length)],
    $indexList = N => Array(N).fill(0).map((_, index) => index),
    appendElement = (where, elementName, props) => {
        const element = document.createElement(elementName)
        where.appendChild(element)
        const html5Attr = new Set(['for', 'rows', 'cols', 'src', 'value', 'id', 'class', 'type', 'placeholder', 'checked', 'multiple', 'selected', 'disabled'])
        const eventsAttr = new Set(['onclick', 'ontouchstart'])
        if (props)
            for (const propName in props)
                if (propName == 'text')
                    element.appendChild(document.createTextNode(props.text))
                else if (html5Attr.has(propName))
                    element.setAttribute(propName, props[propName])
                else if (propName.substring(0, 5) == 'data-')
                    element.setAttribute(propName, props[propName])
                else if(eventsAttr.has(propName))
                    element[propName] = props[propName]
                else if (propName == 'child') {
                    const elementName = Object.keys(props[propName])[0]
                    const elementProps = Object.values(props[propName])[0]
                    appendElement(element, elementName, elementProps)
                } else if (propName == 'children') {
                    for (const child of props.children) {
                        const elementName = Object.keys(child)[0]
                        const elementProps = Object.values(child)[0]
                        appendElement(element, elementName, elementProps)
                    }
                }
                else
                    element.style[propName] = props[propName]
        element.style.minWidth = element.style.width
        element.style.maxWidth = element.style.width
        return element
    },
    elementChildren = (where, children) => {
        for (const child of children) {
            const elementName = Object.keys(child)[0]
            const elementProps = Object.values(child)[0]
            appendElement(where, elementName, elementProps)
        }
    },
    $SYS_METHODS = {},
    SYSTEM = {
        DEF: (name, method) => $SYS_METHODS[name] = method,
        GET: (name) => $SYS_METHODS[name],
        CALL: (name, ...rest) => $SYS_METHODS[name].apply(null, rest),
        HTML: (element, html) => document.querySelector(element).innerHTML = html,
        FILTER: (elements, conditional) => {
            const newElements = []
            for(const element of elements)
              if(conditional(element))
                  newElements.push(element)
            return newElements
        },
        FILTER_INDEX: (elements, conditional) => {
            const newElements = []
            for(let i = 0; i < elements.length; i++)
              if(conditional(elements[i]))
                  newElements.push(i)
            return newElements
        },
    },
    style = appendElement(document.head, 'style', {}),
    css = (tagName, tagStyle) => {

        style.innerHTML += tagName + "{"
        for (const prop in tagStyle)
            style.innerHTML += prop + ':' + tagStyle[prop] + ';'
        style.innerHTML += "}"
    },
    getSelectValues = (select) => {
        var result = [];
        var options = select && select.options;
        var opt;
      
        for (var i=0, iLen=options.length; i<iLen; i++) {
          opt = options[i];
      
          if (opt.selected) {
            result.push(opt.value || opt.text);
          }
        }
        return result;
    },
    blackOrWhite = colour => {
        if (colour.indexOf('#') === 0)
            colour = colour.slice(1)
        if (colour.length === 3)
            colour = colour[0] + colour[0] + colour[1] + colour[1] + colour[2] + colour[2];
        if (colour.length !== 6)
            throw new Error('Invalid colour color.');
        var r = parseInt(colour.slice(0, 2), 16),
            g = parseInt(colour.slice(2, 4), 16),
            b = parseInt(colour.slice(4, 6), 16);
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF'
    },
    lightenDarkenColour =(col, amt) => {
        var usePound = false;
        if ( col[0] == "#" ) {
            col = col.slice(1);
            usePound = true;
        }
    
        var num = parseInt(col,16);
    
        var r = (num >> 16) + amt;
    
        if ( r > 255 ) r = 255;
        else if  (r < 0) r = 0;
    
        var b = ((num >> 8) & 0x00FF) + amt;
    
        if ( b > 255 ) b = 255;
        else if  (b < 0) b = 0;
    
        var g = (num & 0x0000FF) + amt;
    
        if ( g > 255 ) g = 255;
        else if  ( g < 0 ) g = 0;
    
        return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
    },
    FRIENDLY_COLOURS = ['#41B3A3', '#C38D9E', '#E8A87C', '#85DCB0', '#E27D60', '#659DBD', '#DAAD86', '#FBEEC1', '#5CDB95', '#97CAEF', '#AFD275', '#FF6347', 
        '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'
    ]

