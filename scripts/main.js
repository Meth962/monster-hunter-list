/*
    TO DO List
    1. Saving to local storage doesn't work on safari. Try/catch it and save to cookie instead?
    2. Add + and - buttons on the items instead of using one set up top?
    3. Change item element selection so we don't have to "safeString()" id/name.
*/

var list = [];
var materialobj = [];

function addItem(name, qty){
    if(name.length == 0) return;
    var id = safeString(name);
    name = name.replace("'","");
    var index = list.findIndex(x => x.name == name);
    if(index >= 0)
        list[index].quantity += qty;
    else{
        list.push({name: name, quantity: qty});
        index = list.length-1;
    }
    // update or add element
    var elem = $('#' + id + ' .itemQty')[0];
    //var elem = $(`.item[name=${name}] .itemQty`)[0];
    if(elem != undefined)
        elem.innerText = list[index].quantity;
    else{
        addItemElem(name,qty);
    }
    save();
}

function removeItem(name, qty){
    var id = safeString(name);
    var index = list.findIndex(x => x.name == name);
    var elem = $('#' + id + ' .itemQty')[0];
    //var elem = $(`.item[name=${name}] .itemQty`)[0];
    if(index >= 0){
        list[index].quantity -= qty;
        if(list[index].quantity <= 0){
            list.splice(index,1);
            $('#' + id).remove();
        }else{
            elem.innerText = list[index].quantity;
        }
    }
    save();
}

function select(name){
    $('.item').removeClass('selected');

    var id = safeString(name);
    $('#' + id).addClass('selected');
    //$(`.item[name='${name}']`).addClass('selected');
    $('#input').val(name);
}

function save(){
    localStorage.setItem("mh-item-list", JSON.stringify(list));
}

function load(){
    list = JSON.parse(localStorage.getItem("mh-item-list"));
	//var request = new XMLHttpRequest();
	//request.open("GET","scripts/material.js", false);
	//request.send(null);
	//materialobj = JSON.parse(request.responseText);
    refresh();
}

function refresh(){
    if(list == null) list = [];
    filter(list, []);
}

function filter(items,mats){
    $('.item').remove();
    items.forEach(i => {
        addItemElem(i.name, i.quantity);
    });
    mats.forEach(m => {
        addItemElem(m.materialName, 0);
    });
}

function addItemElem(name,qty){
    var id = safeString(name);
	var picID = getMaterialID(name);
	var imgSRC = "img/items/"+ picID +".png";
    $('#list').append(`<div id="${id}" class="item" onclick="select('${name}');"><div class="itemImg"><img src="${imgSRC}"/></div><div class="itemName">${name}</div><div class="itemQty">${qty}</div></div>`);
}

function download() {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(list)], {type: "text/plain"});
    a.href = URL.createObjectURL(file);
    a.download = "mh-item-list.json";
    a.click();
}

function upload(file){
    var reader = new FileReader();
    reader.onload = function(e) {
        list = JSON.parse(e.target.result);
        save();
        refresh();
    }
    reader.readAsText(file);
}

function safeString(str){
    return str.replace(/ /g,"-").replace("'","").replace("+","plus");
}

function getMaterialID(name){
	var i = null;
	var result = "001";
	for(i=0; materialobj.length > i; i += 1)
	{
		if(name === materialobj[i].materialName)
		{
			result = materialobj[i].picID;
			break;
		}
	}
	return result;
}