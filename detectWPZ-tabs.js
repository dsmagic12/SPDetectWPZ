/*
http://expertsoverlunch.com/sandbox/SitePages/complex%20web%20parts%20page%20layout.aspx
*/
for ( var instanceElement = 0; instanceElement < detectWPZDict.length; instanceElement++ ) {
    var tabRow = document.createElement("UL");
    tabRow.setAttribute("instanceElement",instanceElement);
    tabRow.setAttribute("instanceName",detectWPZDict[instanceElement].instanceName);
    /*
    tabRow.style.position = "absolute";
    tabRow.style.left = "0px";
    tabRow.style.top = "0px";
    */
    tabRow.style.display = "block";
    /*
    detectWPZDict[instanceElement].wpz.style.position = "relative";
    detectWPZDict[instanceElement].wpz.style.left = "0px";
    detectWPZDict[instanceElement].wpz.style.top = "0px";
    */
    detectWPZDict[instanceElement].wpz.prepend(tabRow);
    var bFirstTitle = false;
    for ( var detectorWP = 0; detectorWP < detectWPZDict[instanceElement].arrWPs.length; detectorWP++ ) {
        var siblingWebPart = detectWPZDict[instanceElement].arrWPs[detectorWP];
        if ( siblingWebPart.hasOwnProperty("title") === true ) {
            var tab = document.createElement("LI");
            tab.style.display = "inline-block";
            tab.style.backgroundColor = "#e6e6e6";
            tab.style.padding = "20px 10px";
            tab.style.margin = "5px 10px 0px 0px";
            tab.style.cursor = "pointer";
            tab.style.border = "1px solid black";
            tab.setAttribute("instanceElement",instanceElement);
            tab.setAttribute("instanceName",detectWPZDict[instanceElement].instanceName);
            tab.setAttribute("wpSeq",detectWPZDict[instanceElement].arrWPs[detectorWP].num);
            tab.innerHTML = detectWPZDict[instanceElement].arrWPs[detectorWP].title
            if ( bFirstTitle === false ) {
                tabRow.className = tabRow.className +" active";
                bFirstTitle = true;
            }
            else {
                document.getElementById("WebPartWPQ"+detectWPZDict[instanceElement].arrWPs[detectorWP].num).style.display = "none";
            }
            tabRow.appendChild(tab);
            document.getElementById("WebPartTitleWPQ"+detectWPZDict[instanceElement].arrWPs[detectorWP].num).style.display = "none";
        }
    }
}