/**/
/*http://expertsoverlunch.com/sandbox/SitePages/complex%20wiki%20page%20layout.aspx*/
/*http://expertsoverlunch.com/sandbox/SitePages/complex%20web%20parts%20page%20layout.aspx*/
var detectWPZ = detectWPZ || {
    instances: [],
    settings: {
        bDebug: true
    },
    pageInEditMode: false,
    isPageInEditMode: function() {
        /*https://sharepoint.stackexchange.com/questions/149096/a-way-to-identify-when-page-is-in-edit-mode-for-javascript-purposes*/
        var result = (window.MSOWebPartPageFormName != undefined) && ((document.forms[window.MSOWebPartPageFormName] && document.forms[window.MSOWebPartPageFormName].MSOLayout_InDesignMode && ("1" == document.forms[window.MSOWebPartPageFormName].MSOLayout_InDesignMode.value)) || (document.forms[window.MSOWebPartPageFormName] && document.forms[window.MSOWebPartPageFormName]._wikiPageMode && ("Edit" == document.forms[window.MSOWebPartPageFormName]._wikiPageMode.value)));
        detectWPZ.pageInEditMode = result || false;
        return result || false;
    },
    parentsUntilHasAttribute: function(element, attributeName, iBreakAt) {
        if (typeof(attributeName) === "undefined") { var attributeName = "webpartid"; }
        if (typeof(iBreakAt) === "undefined") { var iBreakAt = 100; }
        var iBreak = 0;
        var parent = element.parentElement;
        while (parent.hasAttribute(attributeName) === false && iBreak < iBreakAt) {
            parent = parent.parentElement;
            iBreak++;
        }
        if (parent.hasAttribute(attributeName) === true) {
            return parent;
        } else {
            return false;
        }
    },
    parentsUntilMatchingSelector: function(element, selector, iBreakAt) {
        if (typeof(selector) === "undefined") { var selector = ".ms-webpartzone-cell"; }
        if (typeof(iBreakAt) === "undefined") { var iBreakAt = 100; }
        var iBreak = 0;
        var parent = element.parentElement;
        while (parent.querySelectorAll(selector).length < 1 && iBreak < iBreakAt) {
            parent = parent.parentElement;
            iBreak++;
        }
        if (parent.querySelectorAll(selector).length > 0) {
            var coll = parent.querySelectorAll(selector);
            for (var iWPZ = 0; iWPZ < coll.length; iWPZ++) {
                var wpz = coll[iWPZ];
                if (wpz.querySelectorAll("#" + element.id).length > 0) {
                    try { console.log(wpz); } catch (err) {}
                    parent = wpz;
                    break;
                }
            }

            return parent;
        } else {
            return false;
        }
    },
    getGuid: function(wpzDetector) {
        var ancestor = detectWPZ.parentsUntilHasAttribute(wpzDetector.scriptTag, "webpartid", 20);
        if (ancestor.hasAttribute("webpartid") === true) {
            wpzDetector.guid = ancestor.getAttribute("webpartid");
            return ancestor.getAttribute("webpartid");
        } else {
            wpzDetector.guid = "";
            return "";
        }
    },
    getZoneWebParts: function(wpzDetector, fxEach, afterFx) {
        var collWPs = wpzDetector.wpz.querySelectorAll("[id^='MSOZoneCell_WebPartWPQ']");
        for (var webPart = 0; webPart < collWPs.length; webPart++) {
            var wp = {
                id: collWPs[webPart].id,
                num: 0
            };
            try { wp.num = collWPs[webPart].id.replace("MSOZoneCell_WebPartWPQ", ""); } catch (err) {}
            try { wp.title = document.getElementById("WebPartTitleWPQ" + wp.num).innerHTML; } catch (err) {}
            try { wp.body = document.getElementById("WebPartWPQ" + wp.num).innerHTML; } catch (err) {}
            try { wp.guid = document.getElementById("WebPartWPQ" + wp.num).getAttribute("webpartid"); } catch (err) {}
            /*if ( wp.guid !== detectWPZ.guid && !wp.title === false ) {*/
            if (wp.guid !== wpzDetector.guid) {
                wpzDetector.arrWPs.push(wp);
                if (typeof(fxEach) === "function") {
                    fxEach(wp);
                }
            }
        }
        if (typeof(afterFx) === "function") {
            afterFx();
        }
    },
    getMyWPZ: function(wpzDetector, afterFx) {
        wpzDetector.wpz = detectWPZ.parentsUntilMatchingSelector(wpzDetector.scriptTag, "TD[name='_invisibleIfEmpty'], DIV.ms-rte-layoutszone-inner", 50);
        if (typeof(afterFx) === "function") {
            afterFx(wpzDetector.wpz);
        }
    },
    log: function(message, bIgnoreDebugReq) {
        if (typeof(bIgnoreDebugReq) === "undefined") { var bIgnoreDebugReq = false; }
        if (detectWPZ.settings.bDebug === true || bIgnoreDebugReq === true) {
            try { console.log(message); } catch (err) {}
        }
    },
    theme: {
        getThemeColors: function(afterFx){
            var elm = document.createElement("div"), collColors = null, x1 = null; 
            /*
                better 2018/05/31 1436:
                1) getWeb
                2) get file: web.ThemedCssFolderUrl+"/theme.spcolor"
                3) get file: web.ThemedCssFolderUrl+"/theme.spfont"
                4) get file: web.ThemedCssFolderUrl+"/theme.sptheme"
            */
            detectWPZ.ajax.read(
                _spPageContextInfo.webAbsoluteUrl+"/_api/Web?$select=ThemedCssFolderUrl",
                function(xWeb, dWeb){
                    detectWPZ.log("Page");
                },
                function(xlWeb, dlWeb){
                    detectWPZ.log("Last page");
                    detectWPZ.ajax.readXML(
                        dlWeb.d.ThemedCssFolderUrl+"/theme.spcolor",
                        function(xColors, dColors){
                            detectWPZ.log(xColors);
                            x1 = xColors.response;
                            /* also parse s:colorPalette */
                            elm.innerHTML = x1.replace(/ \/\>/igm,"></s:color>");
                            collColors = elm.getElementsByTagName("s:color");
                            for ( var iC = 0; iC < collColors.length; iC++ ){
                                detectWPZ.theme.colors[collColors[iC].getAttribute("name")] = "#"+collColors[iC].getAttribute("value");
                            }
                            detectWPZ.ajax.readXML(
                                dlWeb.d.ThemedCssFolderUrl+"/theme.spfont",
                                function(xFonts, dFonts){
                                    detectWPZ.log(xFonts);
                                    x1 = xFonts.response;
                                    elm.innerHTML = x1;
                                    collSlots = elm.getElementsByTagName("s:fontSlot");
                                    for ( var iS = 0; iS < collSlots.length; iS++ ){
                                        var fontSlot = collSlots[iS];
                                        detectWPZ.theme.fonts[fontSlot.getAttribute("name")] = {};
                                        var slotFonts = fontSlot.getElementsByTagName("s:latin");
                                        for ( var iSF = 0; iSF < slotFonts.length; iSF++ ){
                                            detectWPZ.theme.fonts[fontSlot.getAttribute("name")]["latin"] = slotFonts[iSF].getAttribute("typeface");
                                        }
                                        var slotFonts = fontSlot.getElementsByTagName("s:cs");
                                        for ( var iSF = 0; iSF < slotFonts.length; iSF++ ){
                                            detectWPZ.theme.fonts[fontSlot.getAttribute("name")]["cs"] = slotFonts[iSF].getAttribute("typeface");
                                        }
                                        var slotFonts = fontSlot.getElementsByTagName("s:ea");
                                        for ( var iSF = 0; iSF < slotFonts.length; iSF++ ){
                                            detectWPZ.theme.fonts[fontSlot.getAttribute("name")]["ea"] = slotFonts[iSF].getAttribute("typeface");
                                        }
                                        var slotFonts = fontSlot.getElementsByTagName("s:font");
                                        for ( var iSF = 0; iSF < slotFonts.length; iSF++ ){
                                            detectWPZ.theme.fonts[fontSlot.getAttribute("name")][slotFonts[iSF].getAttribute("script")] = slotFonts[iSF].getAttribute("typeface");
                                        }
                                    }                        
                                    if ( typeof(afterFx) === "function" ){
                                        afterFx();
                                    }
                                }
                            );
                        },
                        function(){
                            detectWPZ.log("Failed");
                        }
                    );
                },
                function(){
                    detectWPZ.log("Failed");
                },
                "json"
            );
        },
        colors: {},
        fonts: {}
    },
    ajax: {
        lastCall: {},
        read: function(restURL, fxCallback, fxLastPage, fxFailed, sDataType) {
            if ( typeof(sDataType) === "undefined" ){
                var sDataType = "json";
            }
            detectWPZ.ajax.lastCall = { xhr: null, readyState: null, data: null, status: null, url: restURL, error: null };
            var xhr = new XMLHttpRequest();
            xhr.open('GET', restURL, true);
            var now = new Date();
            /* 4 hours later */
            var later = new Date(now.valueOf()+(1000*60*60*4));
            xhr.setRequestHeader("Expires", later);
            xhr.setRequestHeader("Last-Modified", now);
            xhr.setRequestHeader("Cache-Control", "Public");
            xhr.setRequestHeader("X-RequestDigest", document.getElementById("__REQUESTDIGEST").value);
            switch (sDataType) {
                case "json":
                    xhr.setRequestHeader("accept", "application/json;odata=verbose");
                    xhr.setRequestHeader("content-type", "application/json;odata=verbose");
                    break;
                case "xml":
                    xhr.setRequestHeader("content-type", "text/xml");
                    break;
                case "html":
                    xhr.setRequestHeader("content-type", "text/html");
                    break;
                case "text":
                    xhr.setRequestHeader("content-type", "text/plain");
                    break;
                case "css":
                    xhr.setRequestHeader("accept", "text/css");
                    xhr.setRequestHeader("content-type", "text/css");
                    break;
                default:
                    detectWPZ.log("detectWPZ.ajax.read... unknown sDataType value |"+ sDataType +"|",true);
            }
            xhr.onreadystatechange = function() {
                detectWPZ.ajax.lastCall.readyState = xhr.readyState;
                detectWPZ.ajax.lastCall.status = xhr.status;
                if (xhr.readyState === 4) {
                    if (xhr.status !== 200) {
                        detectWPZ.ajax.lastCall.data = xhr.response;
                        if (typeof(fxFailed) === "function") {
                            fxFailed(xhr, xhr.response, xhr.status);
                        }
                    } else {
                        switch (sDataType){
                            case "json":
                                var resp = JSON.parse(xhr.response);
                                break;
                            case "html":
                                var resp = document.createElement("div");
                                resp.innerHTML = xhr.response;                            
                                break;
                            case "xml":
                                var resp = xhr.responseXML;
                                break;
                            default: 
                                var resp = xhr.response;
                        }
                        detectWPZ.ajax.lastCall.data = resp;
                        if (typeof(fxCallback) === "function") {
                            fxCallback(xhr, resp);
                        }
                        try{
                            if (typeof(resp.d.__next) !== "undefined") {
                                detectWPZ.ajax.read(resp.d.__next, fxCallback, fxLastPage);
                            } 
                            else if (typeof(fxLastPage) === "function") {
                                fxLastPage(xhr, resp);
                            }    
                        }
                        catch(err){
                            if (typeof(fxLastPage) === "function") {
                                fxLastPage(xhr, resp);
                            }
                        }
                    }
                }
            };
            detectWPZ.ajax.lastCall.xhr = xhr;
            xhr.send();
        },
        readXML: function(restURL, fxCallback, fxFailed) {
            detectWPZ.ajax.read(restURL, fxCallback, undefined, fxFailed, "xml");
        }
    },
    otherWPsInZone: {
        forEach: function(oWP) {
            try { console.log(oWP); } catch (err) {}
        },
        afterFx: function() {
            try { console.log("Finished looping through my WPZ's web parts"); } catch (err) {}
        }
    },
    init: setTimeout(function(){
        detectWPZ.theme.getThemeColors()
    },12)
};
var wpzDetector = wpzDetector || function(instanceName) {
    return {
        instanceName: instanceName,
        wpz: null,
        arrWPs: [],
        arrRows: [],
        scriptTag: null,
        guid: "",
        myWebPart: null,
        fixedWidth: 0
    }
};