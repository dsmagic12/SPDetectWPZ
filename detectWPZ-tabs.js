function convertDetectedWebPartsToTabs(){
    /*
    http://expertsoverlunch.com/sandbox/SitePages/complex%20web%20parts%20page%20layout.aspx
    */
    for ( var instanceElement = 0; instanceElement < detectWPZDict.length; instanceElement++ ) {
        if ( typeof(detectWPZDict[instanceElement].bTabs) === "undefined" ) {
            var tabRow = document.createElement("UL");
            tabRow.setAttribute("instanceElement",instanceElement);
            tabRow.setAttribute("instanceName",detectWPZDict[instanceElement].instanceName);
            tabRow.style.display = "block";
            tabRow.style.width = detectWPZDict[instanceElement].fixedWidth +"px";
            tabRow.className = "tabWrapper";
            //https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
            detectWPZDict[instanceElement].wpz.firstElementChild.insertAdjacentElement('beforebegin', tabRow);
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
                    tab.className = "tab";
                    tab.setAttribute("instanceElement",instanceElement);
                    tab.setAttribute("instanceName",detectWPZDict[instanceElement].instanceName);
                    tab.setAttribute("wpSeq",siblingWebPart.num);
                    tab.setAttribute("wpidContentDivs",siblingWebPart.guid);
                    tab.innerHTML = siblingWebPart.title;
                    if ( bFirstTitle === false ) {
                        tab.className = tab.className +" active";
                        bFirstTitle = true;
                    }
                    else {
                        tab.className = tab.className +" inactive";
                        document.getElementById("WebPartWPQ"+detectWPZDict[instanceElement].arrWPs[detectorWP].num).style.display = "none";
                    }
                    tab.addEventListener("click",function(e){
                        try{console.log("fxTabClick fired");}catch(err){}
                        try{console.log(e);}catch(err){}
                        try{console.log(this);}catch(err){}
                    
                        if ( typeof(this.className) !== "undefined" ){
                            if ( this.className.indexOf(/[ ]active|^active /igm) >= 0 ){
                                // currently active tab was clicked
                                //this.className = this.className.replace(/[ ]active|^active /igm,"");
                                try{console.log("fxTabClick... user clicked the active tab");}catch(err){}
                            }
                            else {
                                try{console.log("fxTabClick... user clicked an inactive tab");}catch(err){}
                                // currently inactive tab was clicked
                    
                                // find active tab, then hide its content and make it inactive
                                var currActiveTab = this.parentElement.querySelector(".active");
                                var strContentGUIDs = currActiveTab.getAttribute("wpidContentDivs");
                                if ( strContentGUIDs.indexOf("|") >= 0 ) {
                                    var arrGUIDs = strContentGUIDs.split("|");
                                    for ( var iG = 0; iG < arrGUIDs.length; iG++ ){
                                        try{
                                            document.querySelector("[webpartid='"+arrGUIDs[iG]+"']").style.display = "none";
                                            document.querySelector("[webpartid='"+arrGUIDs[iG]+"']").parentElement.parentElement.style.display = "none";
                                            try{console.log("fxTabClick hid content for webpartid |"+ arrGUIDs[iG] +"|");}catch(err){}
                                        }
                                        catch(err){
                                            try{console.log("fxTabClick couldn't hide content for webpartid |"+ arrGUIDs[iG] +"|");}catch(err){}
                                        }
                                    }
                                }
                                else if ( strContentGUIDs.length > 0 ) {
                                    document.querySelector("[webpartid='"+strContentGUIDs+"']").style.display = "none";
                                    document.querySelector("[webpartid='"+strContentGUIDs+"']").parentElement.parentElement.style.display = "none";
                                    try{console.log("fxTabClick hid content for webpartid |"+ arrGUIDs[iG] +"|");}catch(err){}
                                }
                                currActiveTab.className = currActiveTab.className.replace(/[ ]active|^active /igm,"");
                                currActiveTab.className = currActiveTab.className +" inactive";

                                // show the content for the clicked tab, then make it active
                                this.className = this.className.replace(/[ ]inactive|^inactive /igm,"");
                                this.className = this.className +" active";
                                var strContentGUIDs = this.getAttribute("wpidContentDivs");
                                if ( strContentGUIDs.indexOf("|") >= 0 ) {
                                    var arrGUIDs = strContentGUIDs.split("|");
                                    for ( var iG = 0; iG < arrGUIDs.length; iG++ ){
                                        try{
                                            document.querySelector("[webpartid='"+arrGUIDs[iG]+"']").style.display = "block";
                                            document.querySelector("[webpartid='"+arrGUIDs[iG]+"']").parentElement.parentElement.style.display = "table";
                                            try{console.log("fxTabClick showed content for webpartid |"+ arrGUIDs[iG] +"|");}catch(err){}
                                        }
                                        catch(err){
                                            try{console.log("fxTabClick couldn't show content for webpartid |"+ arrGUIDs[iG] +"|");}catch(err){}
                                        }
                                    }
                                }
                                else if ( strContentGUIDs.length > 0 ) {
                                    document.querySelector("[webpartid='"+strContentGUIDs+"']").style.display = "block";
                                    document.querySelector("[webpartid='"+strContentGUIDs+"']").parentElement.parentElement.style.display = "table";
                                    try{console.log("fxTabClick showed content for webpartid |"+ arrGUIDs[iG] +"|");}catch(err){}
                                }
                            }
                        }
                    });
                    tabRow.appendChild(tab);
                    tab.innerHTML = tab.innerText;
                    // hide the title for this web part
                    document.getElementById("WebPartTitleWPQ"+siblingWebPart.num).style.display = "none";
                }
                else {
                    tab.setAttribute("wpidContentDivs",tab.getAttribute("wpidContentDivs")+"|"+siblingWebPart.guid);
                }
            }
            detectWPZDict[instanceElement].bTabs = true;
        }
    }
}