/**/
/*http://expertsoverlunch.com/sandbox/SitePages/complex%20wiki%20page%20layout.aspx*/
/*http://expertsoverlunch.com/sandbox/SitePages/complex%20web%20parts%20page%20layout.aspx*/
var detectWPZ = detectWPZ || {
    instances: [],
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
    otherWPsInZone: {
        forEach: function(oWP) {
            try { console.log(oWP); } catch (err) {}
        },
        afterFx: function() {
            try { console.log("Finished looping through my WPZ's web parts"); } catch (err) {}
        }
    }
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