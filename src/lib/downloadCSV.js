"use strict";
function DataEnc(a) {
    this.config(a);
}
/*
* http://www.iana.org/assignments/character-sets/character-sets.xhtml
* */
DataEnc._enctype = {
        u8    : ['u8', 'utf8'],
        // RFC-2781, Big endian should be presumed if none given
        u16be : ['u16', 'u16be', 'utf16', 'utf16be', 'ucs2', 'ucs2be'],
        u16le : ['u16le', 'utf16le', 'ucs2le']
};
DataEnc._BOM = {
        'none'     : '',
        'UTF-8'    : '%ef%bb%bf', // Discouraged
        'UTF-16BE' : '%fe%ff',
        'UTF-16LE' : '%ff%fe'
};
DataEnc.prototype = {
    // Basic setup
    config : function(a) {
        var opt = {
            charset: 'u8',
            mime   : 'text/csv',
            base64 : 0,
            bom    : 0
        }, p;
        a = a || {};
        for (p in opt) {
            if (opt.hasOwnProperty(p))   
                this[p] = a.hasOwnProperty(p) ? a[p] : opt[p];
        }
        this.buf  = '';
        this.lead = '';
        this.__intro();
        return this;
    },
    // Create lead based on config
    // data:[<MIME-type>][;charset=<encoding>][;base64],<data>
    __intro : function() {
        var
            g = [],
            c = this.charset || '',
            b = 'none'
        ;
        if (this.mime && this.mime !== '')
            g.push(this.mime);
        if (c !== '') {
            c = c.replace(/[-\s]/g, '').toLowerCase();
            if (DataEnc._enctype.u8.indexOf(c) > -1) {
                c = 'UTF-8';
                if (this.bom)
                    b = c;
                this.enc = this.utf8;
            } else if (DataEnc._enctype.u16be.indexOf(c) > -1) {
                c = 'UTF-16BE';
                if (this.bom)
                    b = c;
                this.enc = this.utf16be;
            } else if (DataEnc._enctype.u16le.indexOf(c) > -1) {
                c = 'UTF-16LE';
                if (this.bom)
                    b = c;
                this.enc = this.utf16le;
            } else {
                if (c === 'copy')
                    c = '';
                this.enc = this.copy;
            }
        }
        if (c !== '')
            g.push('charset=' + c);
        if (this.base64)
            g.push('base64');
        this.lead = 'data:' + g.join(';') + ',' + DataEnc._BOM[b];
        return this;
    },
    // Deliver
    pay : function() {
        return this.lead + this.buf;
    },
    // UTF-16BE
    utf16be : function(t) { // U+0500 => %05%00
        var i, c, buf = [];
        for (i = 0; i < t.length; ++i) {
            if ((c = t.charCodeAt(i)) > 0xff) {
                buf.push(('0' + (c >> 0x08).toString(16)).substr(-2));
                buf.push(('0' + (c  & 0xff).toString(16)).substr(-2));
            } else {
                buf.push('00');
                buf.push(('0' + (c  & 0xff).toString(16)).substr(-2));
            }
        }
        this.buf += '%' + buf.join('%');
        // Note the hex array is returned, not string with '%'
        // Might be useful if one want to loop over the data.
        return buf;
    },
    // UTF-16LE
    utf16le : function(t) { // U+0500 => %00%05
        var i, c, buf = [];
        for (i = 0; i < t.length; ++i) {
            if ((c = t.charCodeAt(i)) > 0xff) {
                buf.push(('0' + (c  & 0xff).toString(16)).substr(-2));
                buf.push(('0' + (c >> 0x08).toString(16)).substr(-2));
            } else {
                buf.push(('0' + (c  & 0xff).toString(16)).substr(-2));
                buf.push('00');
            }
        }
        this.buf += '%' + buf.join('%');
        // Note the hex array is returned, not string with '%'
        // Might be useful if one want to loop over the data.
        return buf;
    },
    // UTF-8
    utf8 : function(t) {
        this.buf += encodeURIComponent(t);
        return this;
    },
    // Direct copy
    copy : function(t) {
        this.buf += t;
        return this;
    }
};




export function downloadCSV(array) {
    let finalArray = [];
    finalArray.push("")
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                if (array[j][i][k]) {
                    let escape = array[j][i][k]
                        .replace(/\\/g, "\\\\")
                        .replace(/\n/g, "\\n")
                        .replace(/,/g, "\\,");
                    finalArray.push(escape);
                } else {
                    finalArray.push("");
                }
            }
            if(j == 2){
                finalArray.push("\n")
            }
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 3; j < 6; j++) {
            for (let k = 0; k < 3; k++) {
                if (array[j][i][k]) {
                    let escape = array[j][i][k]
                        .replace(/\\/g, "\\\\")
                        .replace(/\n/g, "\\n")
                        .replace(/,/g, "\\,");
                    finalArray.push(escape);
                } else {
                    finalArray.push("");
                }
            }
            if(j == 5){
                finalArray.push("\n")
            }
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 6; j < 9; j++) {
            for (let k = 0; k < 3; k++) {
                if (array[j][i][k]) {
                    let escape = array[j][i][k]
                        .replace(/\\/g, "\\\\")
                        .replace(/\n/g, "\\n")
                        .replace(/,/g, "\\,");
                    finalArray.push(escape);
                } else {
                    finalArray.push("");
                }
            }
            if(j == 8){
                finalArray.push("\n")
            }
        }
    }

    finalArray.join()

    let encoder = new DataEnc({
        mime   : 'text/csv',
        charset: 'utf16le',
        bom    : true
    });

    for (let i = 0; i < finalArray.length; ++i) {
        encoder.enc(finalArray[i] + (i < finalArray.length - 1 ? "\t": ""));
    }  

    let encodedURI = encoder.pay();
    console.log(encodedURI)

    var link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "九宮格法.csv");
    link.setAttribute('target', '_new');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
