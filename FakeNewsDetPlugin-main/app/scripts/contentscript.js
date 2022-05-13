'use strict';
var elem;
var lineSeparator;
var doubleSpace;
$(document).ready(function() {
    var work = true;
    var border = false;
    lineSeparator = true;
    doubleSpace = false;

    //checking if switch is off
    chrome.runtime.sendMessage({method: "getStatus"}, function(response) {
        if (response.message == "Off"){
            console.log("turned off");
            work = false;
			$("body").addClass("work");
        }
    });

    $("body.work *").mouseenter(function (e) {
        if (work == false) return;
        $(e.target).addClass("hoverActive");
        $(e.target).parent().addClass("hoverActiveParent");
        if (border == true) $(e.target).parent().addClass("border");

    });
    $("body.work *").mouseleave(function () {
        if (work == false) return;
        $(".hoverActive").removeClass("hoverActive");
        $(".hoverActiveParent").removeClass("hoverActiveParent");
        $(".border").removeClass("border");
    });

    $("body.work").mousedown(function (e) {
        if (work == false) return;
        $(".hoverActiveParent").attr("id", "pickMe");
    });

    chrome.runtime.sendMessage({method: "getAutoSegment"}, function(response) {
        if (response.message == "On") {
            setTimeout(function(){
                segmentSection('body');
            },1000);
        }
    });

    chrome.runtime.sendMessage({method: "getParaBorder"}, function(response) {

        if (response.message == "Off"){
            console.log("border turned off");
            border = false;
        }
        else{
            border = true;
        }
    });

    chrome.runtime.sendMessage({method: "getDoubleSpace"}, function(response) {

        if (response.message == "On"){
            console.log("border turned On");
            doubleSpace = true;
        }
        else{
            doubleSpace = false;
        }
    });

    chrome.runtime.sendMessage({method: "getLineSeparator"}, function(response) {
        if (response.message == "Off"){
            lineSeparator = false;
        }
        else if (response.message == "On"){
            lineSeparator = true;
        }
    });

});

var segmentSection = function(which){
    //if (which == "section") elem = "#pickMe";
    //else elem = "body";
    
    var elems = [];
    $("*:visible").each(function() {
        elems.push(this);
    });

    checkElem(elems, 0);
};    

var checkElem = function(arr, index) {
    if (index >= arr.length) return;

    var v = $(arr[index]).html();
    var regexForPeriod = /\.\s/g;       //regex to find period
    var regexForQuestion = /\?\s/g;     //regex to find question mark
    var lineBreak = doubleSpace?".&nbsp;&nbsp;":".<br/>";
    var questionBreak = "?<br/>";
    var separatorElem = doubleSpace?"":"<span class='segmentSeparator'></span>";
    if (lineSeparator) separatorElem = "<span class='segmentSeparator sepBorder'></span>";
    v = v.replace(regexForPeriod, (lineBreak + separatorElem));        //replacing period with period and newline
    v = v.replace(regexForQuestion, (questionBreak + separatorElem));      //replacing questionmark with questionmark and newline

    var theText = $(arr[index]).text();
    theText = theText.trim();
    if (theText.length == 0) return checkElem(arr, index + 1);
    if (theText.indexOf(" ") == -1) return checkElem(arr, index + 1);

    const myJson = fetch('http://127.0.0.1:5000/api/v1/grade/text', {
        method: 'POST',
        body: JSON.stringify({"text": theText}), // string or object
        headers: {
        'Content-Type': 'application/json'
        }
    }).then(res => {
        if(res.ok) {
        console.log('successful response')
        return res.json()
        // console.log(res.json());
      } else {
        return res.json().then(errors => Promise.reject(errors))
        }
    }).then(data => {
        for (let i = 0; i < data.segment_with_scores.length; i++){
            let pattern = new RegExp(data.segment_with_scores[i].text, "gi");
                
            let false_score = data.segment_with_scores[i].false_score;
            let partial_false_score = data.segment_with_scores[i].partial_false_score;
            let truth_score = data.segment_with_scores[i].truth_score;
            let text = data.segment_with_scores[i].text;
                
            if (false_score > 0.5) {
                v = v.replace(pattern, match => `<mark style="background-color:red">${match}</mark>`);
            }
            else if (partial_false_score > false_score && partial_false_score > truth_score) {
                v = v.replace(pattern, match => `<mark style="background-color:yellow">${match}</mark>`);
            }
            else if (truth_score < 0.5) {
                v = v.replace(pattern, match => `<mark style="background-color:orange">${match}</mark>`);
            }
        }
        $(arr[index]).html(v);
    }).catch(err => {
        console.log(err);
    }).finally(() => {
        checkElem(arr, index + 1);
    });

    // const patterns = ["The Empire Strikes Back", "$8 million", "faced production difficulties, including actor injuries, illnesses"];
        
    // for (let i = 0; i < patterns.length; i++){
    //     let pattern = new RegExp(patterns[i], "gi");
    //     v = v.replace(pattern, match => `<mark>${match}</mark>`)
    // }
        
    // let pattern = new RegExp("The Empire Strikes Back", "gi");
    // v = v.replace(pattern, match => `<mark style="background-color:green">${match}</mark>`)
    // v = v.replace(pattern, match => `<mark style="background-color:blue">${match}</mark>`)
    // v = v.replace(pattern, match => `<mark style="background-color:yellow">${match}</mark>`)



    // $(this).html(v);        //adding replaced content back to the DOM element
    //$("#pickMe").attr("id","");
};

// function search(){
//     let pattern = new RegExp(`${text_word}`, "gi");
//     paragraph.innerHTML = paragraph.textContent.replace(pattern, match => `<mark>${match}<mark>`)
// }

