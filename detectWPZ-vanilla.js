var detectWPZ = detectWPZ || {
    instances: [],
    wpz: null,
    arrWPs: [],
    arrRows: [],
    pageInEditMode:false,
    isPageInEditMode: function() {
        /*https://sharepoint.stackexchange.com/questions/149096/a-way-to-identify-when-page-is-in-edit-mode-for-javascript-purposes*/
        var result = (window.MSOWebPartPageFormName != undefined) && ((document.forms[window.MSOWebPartPageFormName] && document.forms[window.MSOWebPartPageFormName].MSOLayout_InDesignMode && ("1" == document.forms[window.MSOWebPartPageFormName].MSOLayout_InDesignMode.value)) || (document.forms[window.MSOWebPartPageFormName] && document.forms[window.MSOWebPartPageFormName]._wikiPageMode && ("Edit" == document.forms[window.MSOWebPartPageFormName]._wikiPageMode.value)));
        detectWPZ.pageInEditMode = result || false;
        return result || false;
    },
    parentsUntilHasAttribute: function(element, attributeName, iBreakAt){
        if ( typeof(attributeName) === "undefined" ){ var attributeName = "webpartid"; }
        if ( typeof(iBreakAt) === "undefined" ){ var iBreakAt = 100; }
        var iBreak = 0;
        var parent = element.parentElement;
        while ( parent.hasAttribute(attributeName) === false && iBreak < iBreakAt ) {
            parent = parent.parentElement;
            iBreak++;
        }
        if ( parent.hasAttribute(attributeName) === true ){
            return parent;
        }
        else {
            return false;
        }
    },
    parentsUntilMatchingSelector: function(element, selector, iBreakAt){
        if ( typeof(selector) === "undefined" ){ var selector = ".ms-webpartzone-cell"; }
        if ( typeof(iBreakAt) === "undefined" ){ var iBreakAt = 100; }
        var iBreak = 0;
        var parent = element.parentElement;
        while ( parent.querySelectorAll(selector).length < 1 && iBreak < iBreakAt ) {
            parent = parent.parentElement;
            iBreak++;
        }
        if ( parent.querySelectorAll(selector).length > 0 === true ){
            return parent.querySelectorAll(selector)[0];
        }
        else {
            return false;
        }
    },
    scriptTag: document.querySelector("SCRIPT[src*='detectWPZ']"),
    guid: "",
    getGuid: function(){
        var ancestor = detectWPZ.parentsUntilHasAttribute(detectWPZ.scriptTag, "webpartid", 20);
        if ( ancestor.hasAttribute("webpartid") === true ){
            detectWPZ.guid = ancestor.attributes["webpartid"].value;
            return ancestor.attributes["webpartid"].value;
        }
        else {
            detectWPZ.guid = "";
            return "";
        }
    },
    getZoneWebParts: function(wpzDetector, fxEach, afterFx){
        var collWPs = wpzDetector.wpz.querySelectorAll("DIV.ms-webpartzone-cell[id^='MSOZoneCell_WebPartWPQ']");
        for ( var webPart = 0; webPart < collWPs.length; webPart++ ){
            var wp = {
                id: collWPs[webPart].id,
                num: 0
            };
            try{wp.num = collWPs[webPart].id.replace("MSOZoneCell_WebPartWPQ","");}catch(err){}
            try{wp.title = document.getElementById("WebPartTitleWPQ"+wp.num).innerHTML;}catch(err){}
            try{wp.body = document.getElementById("WebPartWPQ"+wp.num).innerHTML;}catch(err){}
            try{wp.guid = document.getElementById("WebPartWPQ"+wp.num).attributes["webpartid"].value;}catch(err){}
            /*if ( wp.guid !== detectWPZ.guid && !wp.title === false ) {*/
            if ( wp.guid !== detectWPZ.guid ) {
                wpzDetector.arrWPs.push(wp);
                if ( typeof(fxEach) === "function" ) {
                    fxEach(wp);
                }
            }
        }
        if ( typeof(afterFx) === "function" ) {
            afterFx();
        }
    },
    getMyWPZ: function(afterFx){
        detectWPZ.wpz = detectWPZ.parentsUntilMatchingSelector(detectWPZ.scriptTag, "TD[name='_invisibleIfEmpty'], DIV.ms-rte-layoutszone-inner", 50);
        if ( typeof(afterFx) === "function" ) {
            afterFx(detectWPZ.wpz);
        }
    },
    otherWPsInZone: {
        forEach: function(oWP){
            try{console.log(oWP);}catch(err){}
        },
        afterFx: function(){
            try{console.log("Finished looping through my WPZ's web parts");}catch(err){}
        }
    }
    /*
    ,
    onLoad: setTimeout(function(){
        try{console.log("detectWPZ initialized... running code to detect other webparts in same zone");}catch(err){}
        if ( detectWPZ.isPageInEditMode() === false ) {
            detectWPZ.getMyWPZ(function(elmWPZ){
                detectWPZ.getZoneWebParts(detectWPZ, detectWPZ.otherWPsInZone.forEach, detectWPZ.otherWPsInZone.afterFx);
            });
        }
    },13)
    */
};
var wpzDetector = wpzDetector || function(instanceName) {
    return {
        instanceName: instanceName,
        wpz: null,
        arrWPs: [],
        arrRows: [],
        scriptTag: null,
        guid: "",
        myWebPart: null
    }
};
