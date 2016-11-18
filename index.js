if (document.getElementById('ingredientSubmit')) {
    document.getElementById('ingredientSubmit').addEventListener('click', function() {
        gatherIngredients();
    });
}
function createUser() {
    sessionStorage.clear();
    var email = document.getElementById("createEmail").value;
    var pass = document.getElementById("createPassword").value;
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("pass", pass);
    renderUser();
}

function signinUser() {
    sessionStorage.clear();
    var email = document.getElementById("signinEmail").value;
    var pass = document.getElementById("signinPassword").value;
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("pass", pass);
        renderUser();
}

function renderUser() {
    if(sessionStorage.getItem("email") && sessionStorage.getItem("pass")) {
        var user = sessionStorage.getItem("email");
        var innerDiv = document.createElement('DIV');
        innerDiv.className = "material-icons";
        var innerDivText = document.createTextNode("account_box");
        innerDiv.appendChild(innerDivText);
        var userNameElement = document.createElement("P");
        var userName = document.createTextNode(user);
        userNameElement.appendChild(userName);
        var userDiv = document.getElementById("userDiv");
        userDiv.appendChild(innerDiv);
        userDiv.appendChild(userNameElement);
    }
}
          
function addIngredient() {
    var ingredient = document.getElementById("ingredientInput").value;
    appendToIngredientList(ingredient);
}

function appendToIngredientList(ingredient) {
    ingredientNode = createListNode(ingredient);            
	if(!inList(ingredient)){
		document.getElementById("ingredientsList").appendChild(ingredientNode);
		document.getElementById("ingredientInput").value = "";
	}
}

function inList(ingredient){
	var inList = false;
	if(ingredient==""){
		inList = true;
	}
	else {
		var list = document.getElementById("ingredientsList");				
		for(i = 0; i < list.children.length; i++){
			if(ingredient == list.children[i].children[0].textContent){
				inList = true;
			}
		}
	}			
	return inList;
}

function createListNode(ingredient){
	ingredientNode = document.createElement("LI");
	ingredientNode.setAttribute("class", "mdl-list__item ingredients");			
    firstSpan = document.createElement("SPAN");
	firstSpan.setAttribute("class","mdl-list__item-primary-content");
	textSpan = document.createElement("SPAN");
	ingredientText = document.createTextNode(ingredient);
	textSpan.appendChild(ingredientText);
	firstSpan.appendChild(textSpan);
	ingredientNode.appendChild(firstSpan);
	secondSpan = document.createElement("SPAN");
	secondSpan.setAttribute("class","mdl-list__item-secondary-content");
	removeAction = document.createElement("BUTTON");
	removeAction.setAttribute("class","mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored");
	removeAction.setAttribute("onclick","removeItem(this.parentNode.parentNode)");
	setIcon = document.createElement("I");
	setIcon.setAttribute("class","material-icons");
	iconToUse = document.createTextNode("remove");
	setIcon.appendChild(iconToUse);
	removeAction.appendChild(setIcon);
	secondSpan.appendChild(removeAction);
	ingredientNode.appendChild(secondSpan);			
	return ingredientNode;		
}

function removeItem(node){
	var list = document.getElementById("ingredientsList");
	list.removeChild(node);
}

function dialogCreate() {
    var dialogButton = document.getElementById('create');
    var dialog = document.getElementById('create-dialog');

    dialog.showModal();
    document.getElementById("close-create").addEventListener('click', function() {
        dialog.close();
    });

    document.getElementById("complete-create").addEventListener('click', function() {
        createUser();
        dialog.close();
    });
}

function dialogInit() {
    var dialogButton = document.getElementById('signin');
    var dialog = document.getElementById('signin-dialog');

    dialog.showModal();
    document.getElementById("close-signin").addEventListener('click', function() {
        dialog.close();
    });

    document.getElementById("complete-signin").addEventListener('click', function() {
        signinUser();
        dialog.close();
    });
}

function gatherIngredients() {
    $( "li" ).remove( ":contains('Recipe')" );
    var ingredientsTags = document.getElementById("ingredientsList").getElementsByTagName("li");
    var ingredients = [];

    for (var i = ingredientsTags.length - 1; i >= 0; i--) {
        ingredients.push(ingredientsTags[i].children[0].textContent);
    }
    if(ingredients.length === 0) {
        alert("Enter ingredients");
        return;
    }

    sendIngredients(ingredients);
}

function sendIngredients(ingredients) {
    var params = {
        app_id: "223b8c0e",
        app_key: "d4b82fd96b209abba79648a260d84375", 
        q: [],
        health: []
    };
 
    for (var i = ingredients.length - 1; i >= 0; i--) {
        params.q.push(ingredients[i]);
    }

    getHealthParams(params);

    $.get('https://api.edamam.com/search', $.param(params, true), function(data) {
        console.log(data);
        console.log(data.hits);
        processRecipeData(data.hits);
        });
}

function getHealthParams(params) {
    if(document.getElementById("vegan-checkbox").checked) {
        params.health.push("vegan");
    }
    if(document.getElementById("peanut-checkbox").checked) {
        params.health.push("peanut-free");
    }
    if(document.getElementById("tree-checkbox").checked) {
        params.health.push("tree-nut-free");
    }
    if(document.getElementById("vegetarian-checkbox").checked) {
        params.health.push("vegetarian");
    }
}

function processRecipeData(data) {
    for (var i = data.length - 1; i >= 0; i--) {
        var recipe = {image: data[i].recipe.image, label: data[i].recipe.label, source: data[i].recipe.source, url: data[i].recipe.url};

        var image = createImage(recipe);
        var label = createLabel(recipe);
        var reUrl = createReUrl(recipe);
                
        var list = document.createElement("LI");

        list.appendChild(image);
        list.appendChild(label);
        list.appendChild(reUrl);

        document.getElementById("recipeList").appendChild(list);
    }
    renderRecipe();
}

function createImage(recipe) {
    var image = document.createElement("IMG");
    image.src = recipe.image;
    return image;
}

function createLabel(recipe) {
    var label = document.createElement("P");
    var labelText = document.createTextNode(recipe.label);
    label.appendChild(labelText);
    return label;
}

function createReUrl(recipe) {
    var reUrl = document.createElement("A");
    var reUrlText = document.createTextNode("Recipe Link");
    reUrl.appendChild(reUrlText);
    reUrl.href = recipe.url;
    return reUrl;
}

function renderRecipe() {
    var dialog = document.getElementById("recipe-dialog");
    dialog.showModal();

    document.getElementById("recipe-close").addEventListener("click", function() {
        dialog.close();
    });
}

function inputInit() {
    document.getElementById("ingredientInput")
    .addEventListener("keyup", function(event) {
        event.preventDefault();

        if (event.keyCode == 13) {
            document.getElementById("ingredientAdd").click();
        }
    });
}