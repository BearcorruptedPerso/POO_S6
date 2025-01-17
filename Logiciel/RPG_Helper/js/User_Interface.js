class User_Interface{
	constructor(app){

		this.view={}
		this.app_PC = app ;
		this.createview();


		}

	addView(obj,name,val){
		Object.defineProperty(obj,name,{value : val,
			writable : true,
			configurable : true,
			enumerable : true});

		}

		//initialisation vues
		createview(){
			//vue initiale
			this.view.init = new View($("#LaunchScreen"),[
				new PC_Button($(".bt_create"),"w3-button w3-blue","Créer",() => {this.clickcreercamp();}),
				new PC_Button($(".bt_quit"),"w3-button w3-red w3 large","x",() => {window.close();})
			]);
			//vue écran de connexion
			this.view.launch = new View($("#ConnectScreen"),[
				new PC_Button($("#btn_dem"),"w3-button w3-blue","Démarrer",() => {this.startCamp(this.getCampaignName());}),
				new PC_Button($("#btn_ret"),"w3-button w3-red","Retour",() => {this.closeComm_return();}),
				new PC_Button($("#help"),"w3-button w3-purple","help",() => {this.help();})
			]);
			//vue header
			this.view.header = new View($("#Header"),[

				new PC_Button($("#barre1"),"w3-button w3-blue w3-large","Histoire",() => {this.btnHandler("header",["header","footer","histoire"],0);}),
				new PC_Button($("#barre1"),"w3-button w3-blue w3-large","Combats",() => {this.btnHandler("header",["header","footer","combats"],1);}),
				new PC_Button($("#barre1"),"w3-button w3-blue w3-large","Règles",() => {this.btnHandler("header",["header","footer","regles"],2);}),
				//new PC_Button($("#barre1"),"w3-button w3-blue w3-large","Générateurs",() => {this.btnHandler("header",["header","footer","generateurs"],3);}),
				new PC_Button($("#barre1"),"w3-button w3-blue w3-large","Joueurs",() => {this.btnHandler("header",["header","footer","joueurs"],3);}),
				new PC_Button($("#barre1"),"w3-button w3-red w3 large sq","Save and quit",() => {this.saveAndQuit();}),


			]);

			//vue footer
			this.view.footer = new View($("#Footer"),[
				new PC_Button($("#btnmoins"),"w3-button  w3-blue","-",() => {this.app_PC.campaigns[this.getCampaignName()].modhour(-parseInt($("#modhour").val()))}),
				new PC_Button($("#btnplus"),"w3-button  w3-blue","+",() => {this.app_PC.campaigns[this.getCampaignName()].modhour(parseInt($("#modhour").val()))})
			]);

			//vue onglet Histoire
			this.view.histoire = new View($("#Histoire"),[
				new TextArea($(".txtarea"),$(".txtarea"),undefined,50,170)
			]);


			//vue onglet Combats
			this.view.combats = new View($("#Combats"),[
				new PC_Button($("#rencontres"),"w3-button w3-round w3-blue","+",() => {this.newEncounter();})
			]);


			//vue onglet Règles
			this.view.regles = new View($("#Regles"),[]);


			//vue onglet géné
			this.view.generateurs = new View($("#Generateurs"),[
				new PC_Button($(".test2"),"w3-button w3-blue","generateurs",null)
			]);


			//vue onglet Joueurs
			this.view.joueurs = new View($("#Joueurs"),[
			]);

			this.hideAll();

		}

		clickcreercamp(){
			//popup jquery-confirm
			var ui = this

			$.confirm({
				title: '',
				useBootstrap:false,
				boxWidth:'50%',
				content: '' +
				'<form action="" class="formName">' +
				'<div class="form-group">' +
				'<label>Entrez le nom de votre campagne :          </label>' +
				'<input type="text" placeholder="Nom" class="name form-control" required autofocus />' +
				'</div>' +
				'</form>',
				buttons: {
					formSubmit: {
						text: 'Valider',
						btnClass: 'btn-blue',
						action: function () {
							var name = this.$content.find('.name').val();
							if(!name){
								$.alert('Nom de classe non valide');
								return false;
							}

							//Instanciation d'une campagne
							ui.app_PC.AddCampaign(name);

                            //Creation de la div Camp et des boutons
                            ui.displayCampButton(name);

                            //affichage de la campagne direct
                            ui.modifCamp(name);



						}
					},
					Revenir: function () {
						//close
					},
				},
				onContentReady: function () {
					// bind to events
					var jc = this;
					this.$content.find('form').on('submit', function (e) {
						// if the user submits the form by pressing enter in the field.
						e.preventDefault();
						jc.$$formSubmit.trigger('click'); // reference the button and click it
					});
				}
			});
		}


		newEncounter(){
			var term = "Nouvelle rencontre"
			var UI = this;
			// affichage d'un popup
			$.confirm({
				title: term,
				type: 'green',
				theme: 'material',
				boxWidth: '80%',
				useBootstrap: false,
				content: '' +
				'<form action="" class="formName">' +
				'<div class="form-group">' +
				'<label>Nom de la rencontre</label></br>' +
				'<input type="text" placeholder="name" class="name form-control" required autofocus/>' +
				'</div>' +
				'</form>',
				buttons: {
					formSubmit: {
						text: 'Créer',
						btnClass: 'btn-green',
						action: function () {
							// callback apeler lors de l'apuis sur "Créer"
							// on recupere le nom
							var name = this.$content.find('.name').val();
							// on verifie le nom et compatible et qui n'existe pas deja
							if(!name){
								$.alert('provide a valid name');
								return false;
							}
							try {
								var n = $("#"+name.replace(/ /g,'_')).length;
							} catch (e) {
								var n = 1;
							}
							if(n){
								$.alert('provide another name');
								return false;
							}

							name = name.replace(/ /g,'_')
							UI.addEncounter(name);
							//Instancie une rencontre dans la campagne

							UI.app_PC.campaigns[UI.getCampaignName()].addEncounter(name)


						}
					},
					cancel: {
						text: 'Annuler',
						cancel: function () {

						}

					}
				},
				onContentReady: function () {
					// bind to events
					var jc = this;
					this.$content.find('form').on('submit', function (e) {
						// if the user submits the form by pressing enter in the field.
						e.preventDefault();
						jc.$$formSubmit.trigger('click'); // reference the button and click it
					});
				}
			});
		}

		addEncounter(name){
			//ajout d'une div pour les rencontres
			$("#vue_rencontres").append('<div class="rencontre" id="'+name.replace(/ /g,'')+'" ></div>');

			//création de la vue rencontre "name"

			this.addView(this.view,name,new View($("#"+name),[]));

			this.view[name].addElem($("#"+ name).append('<h1 class = "titre_rencontre">' + name + "</h1>"));
			//UI.view[name].addElem(new TextArea($("#"+name),$("#"+name),undefined,5,30,undefined,undefined));

			// Tableau des monstres et affichage principal
			$("#"+ name).append('<div class="w3-row">'+
			'<div class="w3-col w3-light-grey" style="width:74%">'+
			'<div class="w3-responsive"'+
			'<div class = "tab_monstre"> <table class="w3-table-all">' +
			'<tr id = "M_nom_'+ name + '"> <th> <div> Monstres :</div></th> </tr>' +
			'<tr id = "M_PV_'+ name + '"> <th> <div> PV :</div></th> </tr>' +
			'<tr id = "M_CA_'+ name + '"> <th> <div> CA :</div></th> </tr>' +
			'</table>' +
			'</div>' +
			'</div>'+


			'<div class="w3-col" id = "btn_add_M_' + name + '"  style="width:3%">'+
			'</div>'+


			'<div id = "players_turn'+name+'" class="players_turn w3-col w3-dark-grey w3-center tours_combat" style="width:22%"">' +
      '<div id="inandout'+name+'" class="ino"></div>'+

			'<p> Combattants </p>' +
				'<div id = "btn_next_turn'+name + '"></div>' +
				'<div id = "FighterList'+ name + '"></div>' +
				'<div id = "btn_start_fight'+name+'"></div>' +
				'<div id = "btn_end_fight' +name+'"></div>' +


			'</div>'+
			'<div class="w3-col" id = "btn_desc_M_' + name + '"></div>'
		);
		new PC_Button($("#inandout"+name),"w3-button w3-purple","<",() => {$(".players_turn").css("transform","translate(0%, 0px)")});
		new PC_Button($("#inandout"+name),"w3-button w3-purple",">",() => {$(".players_turn").css("transform","translate(110%, 0px)")});


		// Test rajout monstre
		//UI.view[name].addElem($("#btn_add_M").append('<td> <div contenteditable="">Monstre 2</div></td>'));
		new PC_Button($("#btn_add_M_"+ name +""),"w3-button w3-round w3-blue","+",() => {this.addMonster(name);});


		//ajout du btn pour cree des description
		new PC_Button($("#btn_desc_M_"+ name +""),"w3-button  w3-blue","Ajouter Description",() => {this.addDesc(name);});
		// btn pour supprimer la rencontre
		new PC_Button($("#btn_desc_M_"+ name +""),"w3-button  w3-red","Supprimer la rencontre",() => {this.delConfirm(name,()=>{this.delEncounter(name)});});

		var nb = this.view.combats.getNbElem();
		// Ajouter un bouton rencontre au bon endroit // Callback affiche header, btns rencontres et la rencontre en question
		this.view.combats.addElem(new PC_Button($("#rencontres"),"w3-button w3-round w3-blue rencontre",name,() => {this.btnHandler("combats",["header","footer","combats",name],nb);}));


		new PC_Button($("#btn_start_fight"+name),"w3-button w3-round w3-blue","Démarrer Combat",()=>{
			if (this.app_PC.campaigns[this.getCampaignName()].InFight==0){
				this.startFight(this.getCampaignName(),name);
			}
			else {
				$.alert({
    title: 'Un Combat est déjà en cours !',
		type: 'purple',
		theme: 'material',
		boxWidth: '80%',
		useBootstrap: false,

    content: '<ul>'

});

			}




		});





		//Affiche uniquement la vue qui vient d'être créée
		this.btnHandler("combats",["header","footer","combats",name],nb);




	}
	addDesc(name){
		this.app_PC.campaigns[this.getCampaignName()].addDesc(name,new Description($("#descs"),name,this.app_PC))

	}

	addMonster(rencontre){

		var term = "Nouveau monstre"
		var UI = this;
		// affichage d'un popup
		$.confirm({
			title: term,
			type: 'green',
			theme: 'material',
			boxWidth: '80%',
			useBootstrap: false,
			content: '' +
			'<form action="" class="formName">' +
			'<div class="form-group">' +
			'<label>Nom du monstre</label></br>' +
			'<input type="text" placeholder="name" class="name form-control" required autofocus/>' +
			'</div>' +
			'<div class="form-group">' +
			'<label>PV</label></br>' +
			'<input type="text" placeholder="PV" class="PV form-control" required autofocus/>' +
			'</div>' +
			'<div class="form-group">' +
			'<label> CA </label></br>' +
			'<input type="text" placeholder="CA" class="CA form-control" required autofocus/>' +
			'</div>' +
			'</form>',
			buttons: {
				formSubmit: {
					text: 'Créer',
					btnClass: 'btn-green',
					action: function () {
						// callback apeler lors de l'apuis sur "Créer"
						// on recupere les infos
						var name = this.$content.find('.name').val();
						var PV = this.$content.find('.PV').val();
						var CA = this.$content.find('.CA').val();
						// on verifie le nom et compatible et qui n'existe pas deja
						if(!name){
							$.alert('provide a valid name');
							return false;
						}
						try {
							var n = $("#"+name.replace(/ /g,'')).length;
						} catch (e) {
							var n = 1;
						}
						if(n){
							$.alert('provide another name');
							return false;
						}
						name = name.replace(/ /g,'-');
						if (UI.app_PC.campaigns[UI.getCampaignName()].isMonsterNameExist(name,rencontre)) {
							$.alert('provide another name');
							return false;
						}
						UI.loadMonster(rencontre,name,PV,CA)
						//Création du monstre
						var m = new Monster(name,PV,CA);
						UI.app_PC.campaigns[UI.getCampaignName()].addMonster(rencontre,m);

					}

				},
				cancel: function () {
					//close
				},
			},
			onContentReady: function () {
				// bind to events
				var jc = this;
				this.$content.find('form').on('submit', function (e) {
					// if the user submits the form by pressing enter in the field.
					e.preventDefault();
					jc.$$formSubmit.trigger('click'); // reference the button and click it
				});
			}
		});
	}

	loadMonster(rencontre,name,PV,CA){
			//Création du tableau
		this.view[rencontre].addElem($("#M_nom_"+rencontre).append('<td id="MonsterName'+name+rencontre+'" class = "w3-center"> <div contenteditable="">'+ name + '</div> <div class="delMonster" id="delMonster'+name+rencontre+'"></div></td>'));
		this.view[rencontre].addElem($("#M_PV_"+rencontre).append('<td id="MonsterPV'+name+rencontre+'" class = "w3-center"> <div contenteditable="">'+ PV +'</div></td>'));
		this.view[rencontre].addElem($("#M_CA_"+rencontre).append('<td id="MonsterCA'+name+rencontre+'" class = "w3-center"> <div contenteditable="">'+ CA +'</div></td>'));
		new PC_Button($("#delMonster"+name+rencontre),"","",()=>{this.delConfirm(name,()=>{this.delMonster(rencontre,name)})},"image",'./assets/fermer.png');
	}

	delMonster(rencontre,name){
		var encounters = this.app_PC.campaigns[this.getCampaignName()].encounters;
		for (var e in encounters) {
			if (encounters[e].name == rencontre) {
				var monster = encounters[e].monsters;
				for (var m in monster) {
					if (monster[m].name == name) {
						this.app_PC.campaigns[this.getCampaignName()].encounters[e].monsters.splice(m,1);
						$("#M_nom_"+rencontre+" #MonsterName"+name+rencontre).remove();
						$("#M_PV_"+rencontre+" #MonsterPV"+name+rencontre).remove();
						$("#M_CA_"+rencontre+" #MonsterCA"+name+rencontre).remove();
					}
				}
			}
		}


	}
	saveAndQuit(){

		this.btnHandler("header",["init"]);
		this.app_PC.SaveCampaign(this.getCampaignName());
		this.app_PC.campaigns[this.getCampaignName()].active = 0;
		this.initUI();


	}

	initUI(){
		$("#vue_rencontres").children().each((n)=>{
			var id = $("#vue_rencontres").children()[n].id;
			//vue onglet Combats

			delete app.UI.view[id];

		})
		$("#rencontres").children().each(function(){$(this).remove()})
		this.view.combats = new View($("#Combats"),[
			new PC_Button($("#rencontres"),"w3-button w3-round w3-blue","+",() => {this.newEncounter();})
		]);
		$(".rencontre").remove();
		this.view.histoire.elements[0].setText("");

		$("#descs").empty();

		$("#display_players").empty();
	}

	displayCampButton(name){

		$('.bts_camp').append("<div id='"+name+"' class='camp'><div class='campname'></div></div>");

		$("#"+name +" .campname").append(name);

		new PC_Button($("#"+name),"w3-button w3-blue","Lancer", () => {this.launchCamp(name);});
		new PC_Button($("#"+name),"w3-button w3-blue","Modifier",() => {this.modifCamp(name);});
		new PC_Button($("#"+name),"w3-button w3-red","Supprimer",() => {this.delCamp(name);});

	}


	modifCamp(name){
		this.app_PC.ModCampaign(name);
		this.btnHandler("init",["header","footer","histoire"]);
		this.setalltextArea();

	}


	delEncounter(nom){
		var encounters = this.app_PC.campaigns[this.getCampaignName()].encounters
		for (var e in encounters) {
			if(encounters[e].name == nom){
				encounters.splice(e,1);
				this.initUI();
				this.app_PC.ModCampaign(this.getCampaignName());
				if (this.view["combats"].getNbElem() > 1 ) {
					this.btnHandler("combats",["header","footer","combats",this.view["combats"].getElem(1).getText()],1);

				}
				else {
					this.btnHandler("combats",["header","footer","combats"]);
				}

			}
		}

	}
	delDesription(id,en){
		var encounters = this.app_PC.campaigns[this.getCampaignName()].encounters;
		for (var e in encounters) {
			if (encounters[e].name == en) {
				var desc = encounters[e].description;
				for (var d in desc) {
					if (desc[d].id == id) {
						this.app_PC.campaigns[this.getCampaignName()].hideAll();
						this.app_PC.campaigns[this.getCampaignName()].encounters[e].description.splice(d,1);
						this.app_PC.campaigns[this.getCampaignName()].setDesc(en);
					}
				}
			}
		}

		}

	delCamp(name){
		this.delConfirm("la campagne",()=>{this.app_PC.DeleteCampaign(name)})
	}

	delConfirm(name, cb ){
		var UI = this;
		// affichage d'un popup
		$.confirm({
			title: "Voulez vous vraiment supprimer "+name+" ?",
			type: 'red',
			theme: 'material',
			boxWidth: '80%',
			useBootstrap: false,
			content:"",
			buttons: {
				formSubmit: {
					text: 'Supprimer',
					btnClass: 'btn-red',
					action: function () {
						cb();

					}

				},
				cancel: {
					text: 'Annuler',
					cancel: function () {

					}

				},
			},
			onContentReady: function () {
				// bind to events
				var jc = this;
				this.$content.find('form').on('submit', function (e) {
					// if the user submits the form by pressing enter in the field.
					e.preventDefault();
					jc.$$formSubmit.trigger('click'); // reference the button and click it
				});
			}
		});
	}

	showView(name){
		this.view[name].show();
	}

	hideView(name){
		this.view[name].hide();
	}

	hideAll(){
		for (var v in this.view){
			this.hideView(v);
		}
	}

	unsetAllBtn(v){
    for (var i = 0; i < this.view[v].getNbElem(); i++) {
      if (this.view[v].getElem(i) instanceof PC_Button){
        this.view[v].getElem(i).unset();
      }
    }
    return this;
  }

	btnHandler(vue,show,num = undefined ){

		this.hideAll();

		for(var v in show) {
			this.showView(show[v]);
		}
		if(typeof num !== 'undefined'){
			this.unsetAllBtn(vue);
	    // on selectionne celui de la vue active
	    this.view[vue].getElem(num).set();
		}
		if (vue == "init") {
			this.unsetAllBtn("header");
	    // on selectionne celui de la vue active
	    this.view.header.getElem(0).set();
		}
		// condition pour s'assurer que l'on affiche une vue lorque l'on change d'onglet
		if (vue == "header") {

			for (var i = 0; i < this.view.combats.getNbElem(); i++) {
				if(this.view.combats.getElem(i) instanceof PC_Button && this.view.combats.getElem(i).getstate()){

					this.showView(this.view.combats.getElem(i).getText());
				}

			}
		}
		if (vue == "combats") {
				this.app_PC.campaigns[this.getCampaignName()].setDesc(show[show.length-1]);
		}
	}



	startFight(name,rencontre){

		var term = "Jets d'initiative" ;
		var PlayerName = [];
		var MonsterName = [];
		var idPlayers = [];
		var labandinput='';
		var lmonster = undefined;
		var idMonsters =[];


		//On veut trouver  le nombre de monstres pour chaque rencontre pour chaque campagne
		for (var i = 0; i <= this.app_PC.campaigns[name].encounters.length-1;i++){


			if (this.app_PC.campaigns[name].encounters[i].name == rencontre ){

				lmonster = this.app_PC.campaigns[name].encounters[i].monsters.length ;


			//ici on prend l'id et le nom de chaque monstre de chaque rencontre de chaque campagne
			for (var j=0; j<this.app_PC.campaigns[name].encounters[i].monsters.length;j++){
				idMonsters = this.app_PC.campaigns[name].encounters[i].monsters[j].id;
				MonsterName[j] = this.app_PC.campaigns[name].encounters[i].monsters[j].name;

			}
			}
		}




		for (var i = 0; i < (this.app_PC.campaigns[name].players.length); i++){// Pour chaque joueur, on donne son jet d'initiative

			PlayerName[i]=this.app_PC.campaigns[name].players[i].infos.name ;
			idPlayers[i]=this.app_PC.campaigns[name].players[i].id;

			labandinput=labandinput +
						'<form action="" class="formName">' +
						'<div class="form-group" id="'+idPlayers[i]+'">' +
						'<label>'+PlayerName[i]+'</label></br>' +
						'<input type="number" id="'+PlayerName[i]+'" placeholder="initiative" class="initiative form-control" required autofocus/>'+
						'</div>' +
						'</form>'
}

		for (var i = 0; i < (lmonster); i++){// Pour chaque monstre, on donne son jet d'initiative

			labandinput=labandinput +
						'<form action="" class="formName">' +
						'<div class="form-group" id="'+idMonsters[i]+'">' +
						'<label>'+MonsterName[i]+'</label></br>' +
						'<input type="number" id="'+MonsterName[i]+'" placeholder="initiative" class="initiative form-control" required autofocus/>'+
						'</div>' +
						'</form>'
}
				var UI = this;
				// affichage d'un popup
				$.confirm({
					title: term,
					type: 'green',
					theme: 'material',
					boxWidth: '80%',
					useBootstrap: false,
					content:
					labandinput,
					buttons: {
						formSubmit: {
							text: 'Valider',
							btnClass: 'btn-green',
							action: function () {
								//on met l'intitiative et les noms de chaque joueurs dans un tableau
								var initiative = this.$content.find('.initiative');
								for (var i = 0; i < initiative.length; i++){

									var tableau= { init: $(initiative[i]).val(),
												nom: $(initiative[i]).attr("id"),
												active: false}
									UI.app_PC.campaigns[UI.getCampaignName()].FightList.push(tableau);

								}

								//algorithme de tri
								UI.app_PC.campaigns[UI.getCampaignName()].FightList.sort(function(a,b){
									return b.init - a.init;
								});

								UI.app_PC.campaigns[UI.getCampaignName()].FightList[0].active=true;



								//on retourne dans l'interface les noms triés dans le bon ordre
								UI.DisplayPlayers(UI.app_PC.campaigns[UI.getCampaignName()].FightList,rencontre);

								//on supprime le bouton de démarrage de combat
								$("#btn_start_fight"+rencontre).remove();


								//bouton tour suivant
								UI.setStartBtn(rencontre);

								//faire bouton fin combat
								new PC_Button($("#btn_end_fight"+rencontre),"w3-button w3-round w3-blue","Fin Combat",()=>{UI.EndFight(rencontre);});


								UI.Next_Turn(true);

								if(!initiative){
									$.alert('provide a valid name');
									return false;

								}
								//if(!name){
								//	$.alert('provide a valid name');
								//	return false;
								//}
								/*try {
									var n = $("#"+name.replace(/ /g,'')).length;
								} catch (e) {
									var n = 1;
								}
								if(n){
									$.alert('provide another name');
									return false;


								}*/


							}
						},
						cancel: function () {
							//close
						},
					},
					onContentReady: function () {
						// bind to events
						var jc = this;
						this.$content.find('form').on('submit', function (e) {
							// if the user submits the form by pressing enter in the field.
							e.preventDefault();
							jc.$$formSubmit.trigger('click'); // reference the button and click it
						});
					}
				});
			}

	setStartBtn(rencontre) {


		if (this.app_PC.campaigns[this.getCampaignName()].InFight==0) {

			new PC_Button($("#btn_next_turn"+rencontre),"w3-button w3-round w3-blue","Tour Suivant",()=>{this.Next_Turn();});

			}
		else  {

			$.alert({
    			title: 'Un autre combat est déjà en cours !',
				type: 'purple',
				theme: 'material',
				boxWidth: '50%',
				useBootstrap: false,

    			content: '<ul>',

});
		}
		this.app_PC.campaigns[this.getCampaignName()].InFight=1;
	}


	EndFight(rencontre){
		// vide la liste
		this.delConfirm('le combat',()=>{this.DelFight(rencontre);});

	}


	DelFight(rencontre){
		//on vide la liste des combattants
		this.app_PC.campaigns[this.getCampaignName()].FightList = [];
		//Aucun des combattants n'est en combat
		this.app_PC.campaigns[this.getCampaignName()].InFight=0;
		//on vide les divs
		$("#FighterList"+rencontre).empty();
		$("#btn_next_turn"+rencontre).empty();
		$("#btn_end_fight"+rencontre).empty();
	}
	// affichage des joueurs et monstres dans l'interface (barre d'onglet -> combat -> Combattants)
	DisplayPlayers(FightList,rencontre){

		var f = this.app_PC.campaigns[this.getCampaignName()].FightList;
		for (var i = 0; i < FightList.length; i++){

			$("#FighterList"+rencontre).append('<div id="div_'+FightList[i].nom +'" class = "w3-container w3-panel ">'+
										//'<div class="w3-row">'+
										//'<div class="w3-col w3-container" style="width:100%;">'+
										'<div id = "n_player">'+FightList[i].nom+'</div>'+
									'</div>'+
								'</div>'+
							'</div>');
			}

	}


	Next_Turn(bypass = false){
		var f = this.app_PC.campaigns[this.getCampaignName()].FightList;
		var perso = this.app_PC.campaigns[this.getCampaignName()].players;
		//on affiche tous les joueurs en gris
		for (var n in f) {
			$("#div_"+f[n].nom+"").css("background-color","grey");
		}
		for (var i = 0; i < f.length; i++){
			if (f[i].active == true){
				$("#div_"+f[i].nom+"").css("background-color","green");
				f[i].active = false;
				for(var p in perso){
					if(perso[p].name == f[i].nom){
						perso[p].comm_handler.vibrate()
					}
				}
				if (typeof f[i+1] == "undefined"){
					f[0].active = true;
				}
				else {
					f[i+1].active =true;
					if (i==0 && !bypass){
					this.liveEffect(this.getCampaignName(),true,1);
					}
				}
				break;
			}
		}


}

	getCampaignName(){
		var that = this;
		var ret
		$(".camp").each(function(){


			if (that.app_PC.campaigns[this.id].active == 1){
				ret = this.id
			}

		});
		return ret;
	}

	launchCamp(name){
		this.app_PC.LaunchCampaign(name);
		this.btnHandler("init",["launch"]);
		this.setalltextArea();

	}

	setalltextArea(){
		this.view.histoire.elements[0].switching();
		for (var e in this.app_PC.campaigns[this.getCampaignName()].encounters) {
			var enc = this.app_PC.campaigns[this.getCampaignName()].encounters[e];
			for (var d in enc.description) {
				enc.description[d].textarea.switching();
			}
		}

	}

	closeComm_return(){
		this.btnHandler("launch",["init"]);
	}


	startCamp(n_camp){
		this.btnHandler("init",["header","footer"]);
		this.app_PC.startCampaign(n_camp);

		//affichage des joueurs connecté dans l'onglet joueurs et de leurs carac modifiables
		for (var i = 0 ; i <= this.app_PC.campaigns[n_camp].players.length -1 ; i++){


			var n_pl = this.app_PC.campaigns[n_camp].players[i].infos.name;
			var pv_pl = this.app_PC.campaigns[n_camp].players[i].infos.PV;
			var ca_pl = this.app_PC.campaigns[n_camp].players[i].infos.CA;

			this.dispPlayers(n_pl,ca_pl,pv_pl,n_camp);
		}




	}


	dispPlayers(n_pl,ca_pl,pv_pl,n_camp){

		$("#display_players").append('<div id="div_'+n_pl+'" class = "w3-container w3-panel w3-border">'+
										'<div class="w3-row">'+
											'<div class="w3-col w3-container" style="width:15%;">'+
												'<div class = "n_player">'+n_pl+'</div>'+
											'</div>'+
      										'<div class="w3-col w3-container" style="width:15%;">'+
      											'<div class = "grid">'+
      												'<div id = "btnminPV_'+n_pl+'" class = "btnmin"></div>'+
      												'<div id = "PV_'+n_pl+'" class = "PV_player">PV: '+pv_pl+'</div>'+
      												'<div id = "btnplusPV_'+n_pl+'"class = "btnplus"></div>'+

      											'</div>'+
      										'</div>'+
      										'<div class="w3-col w3-container" style="width:15%; display: grid;">'+
      											'<div id = "btnminCA_'+n_pl+'" class = "btnmin"></div>'+
      											'<div id = "CA_'+n_pl+'" class = "CA_player">CA: '+ca_pl+'</div>'+
      											'<div id = "btnplusCA_'+n_pl+'" class = "btnplus"></div>'+
      										'</div>'+
      										'<div class="w3-rest">'+
      											'<table id = "tab_effects_'+n_pl+'" class = "w3-table-all">'+
      												'<tr>'+
      													'<th id = title_effect'+n_pl+'> Effets </th>'+
      												'</tr>'+
      										'</div>'+

										'</div>'+
								  '</div>');


		//boutons chgmt de stats
		new PC_Button($("#btnminPV_"+n_pl),"w3-button w3-round w3-blue","-",()=> {this.modStat(n_camp,n_pl,"PV-");});
		new PC_Button($("#btnplusPV_"+n_pl),"w3-button w3-round w3-blue","+",()=> {this.modStat(n_camp,n_pl,"PV+");});
		new PC_Button($("#btnminCA_"+n_pl),"w3-button w3-round w3-blue","-",()=> {this.modStat(n_camp,n_pl,"CA-");});
		new PC_Button($("#btnplusCA_"+n_pl),"w3-button w3-round w3-blue","+",()=> {this.modStat(n_camp,n_pl,"CA+");});

		//Bouton d'ajout d'effets
		new PC_Button($("#title_effect"+n_pl),"w3-button w3-round w3-tiny w3-blue","+",()=>{this.addEffect(n_camp,n_pl);});
	}


	addEffect(n_camp,n_pl){

		var UI = this;
		// affichage d'un popup
		$.confirm({
			title: "Nouvel effet",
			type: 'green',
			theme: 'material',
			boxWidth: '80%',
			useBootstrap: false,
			content: '' +
			'<form action="" class="formName">' +
			'<div class="form-group">' +
			'<label>Description : </label></br>' +
			'<input type="text" placeholder="" class="effect form-control" required autofocus/>' +
			'</div>' +
			'<div class="form-group">' +
			'<label>Durée : </label></br>' +
			'<input type="text" placeholder="1" class="duration form-control" required autofocus/>' +
			'</div>' +
			'<div class="form-group">' +
			'<label> Unité : </label></br>' +
			'<input type="radio" name ="unit_H" value="unit_H" >Heure<br>' +
			'<input type="radio" name ="unit_H" value="unit_R" >Round<br>'+
			'<label> Type : </label></br>' +
			'<input type="radio" name ="bonus" value="bonus" >Bonus<br>' +
			'<input type="radio" name ="bonus" value="malus" >Malus<br>'+
			'</div>' +
			'</form>',
			buttons: {
				formSubmit: {
					text: 'Créer',
					btnClass: 'btn-green',
					action: function () {
						// callback apeler lors de l'apuis sur "Créer"
						// on recupere les infos
						var eff = this.$content.find('.effect').val();
						var dur = this.$content.find('.duration').val();
						var u_H = $('input[name="unit_H"]:checked').val();

						var bonus = $('input[name="bonus"]:checked').val();

						// retunr bonus ou malus !!!!
						// on verifie le nom et compatible et qui n'existe pas deja
						if(!eff){
							$.alert('write a description');
							return false;
						}

						if ((parseFloat(dur)!=parseInt(dur))&& isNaN(dur)){
							$.alert('duration must be an number');
							return false;
						}

						if(dur == 0){
							$.alert('duration cannot be equal to 0');
						}




						//affichage de l'effet dans le tableau + portable
						UI.dispEffect(eff,dur,u_H,UI,n_camp,n_pl,bonus);


					}

				},
				cancel: function () {
					//close
				},
			},
			onContentReady: function () {
				// bind to events
				var jc = this;
				this.$content.find('form').on('submit', function (e) {
					// if the user submits the form by pressing enter in the field.
					e.preventDefault();
					jc.$$formSubmit.trigger('click'); // reference the button and click it
				});
			}
		});

	}



	liveEffect(n_camp,in_fight,qte){


		for (var i in this.app_PC.campaigns[n_camp].players){

			for(var j in this.app_PC.campaigns[n_camp].players[i].effects){

				var effect = this.app_PC.campaigns[n_camp].players[i].effects[j];


				//update de l'effet dans l'objet
				effect.live(in_fight,qte);
				//update de l'effet sur l'écran
				if (effect.unit == 0){
					$("#dur_"+effect.id).text('pendant '+ effect.duration +' heures');
				}
				else{
					$("#dur_"+effect.id).text('pendant '+ effect.duration +' rounds');
				}
				//suppression de l'effet à l'écran
				if (effect.duration <= 0){
					this.delEffet(n_camp,this.app_PC.campaigns[n_camp].players[i].name,effect.id,effect.desc);
				}

			}

		}
		//update de l'effet sur le portable
		if (typeof this.app_PC.campaigns[n_camp].players[i].comm_handler != "undefined" ){

			this.app_PC.campaigns[n_camp].players[i].comm_handler.com.modTime(1,true,this.app_PC.campaigns[n_camp].infos_campaign.hour);
		}

	}







	dispEffect(eff,dur,u_H,ui,n_camp,n_pl,bonus){


//couleur bonus malus
		var color = "";
		var boolcolor = 0;
		if (bonus == 'malus'){
			color = "#FF1A1A";//rouge
			boolcolor = 0; }
		else{ color = "#66FF66" ;
			boolcolor = 1;	} //vert


//instanciation de l'effet dans le joueur
	var un = 0;
	if (u_H=="unit_H"){
		un = 0}
	else{un = 1} //unit = 0 : heures / unit = 1 : rounds


//création de l'objet effet
	var effect = new PC_Effet(eff,boolcolor,dur,un,undefined);


//affichage du tableau

		if (effect.unit == 1){
			$("#tab_effects_"+n_pl).append('<tr id ="'+effect.id+'">'+'<td style = "background-color : '+color+'">'+eff+'</td>'+'<td id = "dur_'+effect.id+'" style = "background-color : '+color+'">pendant '+dur+' rounds</td>'+ '<td id ="btn_'+effect.id+'" style ="background-color : '+color+'"></td> </tr>');
			u_H = false;}
		else{
			$("#tab_effects_"+n_pl).append('<tr id ="'+effect.id+'">'+'<td style = "background-color : '+color+'">'+eff+'</td>'+'<td id = "dur_'+effect.id+'" style = "background-color : '+color+'">pendant '+dur+' heures</td>'+'<td id ="btn_'+effect.id+'" style ="background-color : '+color+'"></td> </tr>');
			u_H = true;}


//Affichage du btn suppression effet

	new PC_Button($("#btn_"+effect.id),"w3-button w3-purple","X", () => {this.delEffet(n_camp,n_pl,effect.id,effect.desc);});



	//ajout de l'effet dans la liste d'effets du joueur
	for (var i = 0 ; i <= ui.app_PC.campaigns[n_camp].players.length -1 ; i++){
			if(ui.app_PC.campaigns[n_camp].players[i].name == n_pl){

			ui.app_PC.campaigns[n_camp].players[i].addEffect(effect);

			//link joueur et effet
			effect.player = ui.app_PC.campaigns[n_camp].players[i];

			//affichage sur le portable
			if(typeof ui.app_PC.campaigns[n_camp].players[i].comm_handler != "undefined"){
				ui.app_PC.campaigns[n_camp].players[i].comm_handler.modEffect(effect);
			}

			}
	}



	}

	delEffet(n_camp,n_pl,id_eff,desc_eff){


				for(var j =0; j<= this.app_PC.campaigns[n_camp].players.length -1; j++){
					if(this.app_PC.campaigns[n_camp].players[j].name == n_pl){

						for(var k =0; k<= this.app_PC.campaigns[n_camp].players[j].effects.length -1; k++ ){
							if(this.app_PC.campaigns[n_camp].players[j].effects[k].id == id_eff){
								var idj = this.app_PC.campaigns[n_camp].players[j].id;

								this.app_PC.campaigns[n_camp].players[j].effects.splice(k,1);

								//effacage de la ligne sur le PC
								$("#"+id_eff).remove();

								//Effacage de l'effet sur le portable
								if(typeof this.app_PC.campaigns[n_camp].players[j].comm_handler != "undefined"){
								this.app_PC.campaigns[n_camp].players[j].comm_handler.delEffect(desc_eff);
								}
							}
						}
					}
				}



	}


	modStat(n_camp,n_pl,stat){

		if (stat == "PV+"){

			for (var i = 0 ; i <= this.app_PC.campaigns[n_camp].players.length -1 ; i++){
			if (this.app_PC.campaigns[n_camp].players[i].infos.name == n_pl){

				//incrémentation de 1 dans l'objet

				var pvint = parseInt(this.app_PC.campaigns[n_camp].players[i].infos.PV)
				pvint += 1;
				this.app_PC.campaigns[n_camp].players[i].infos.PV = pvint;


				//incrémentation de 1 dans l'affichage
				$("#PV_"+this.app_PC.campaigns[n_camp].players[i].infos.name).text("PV: "+this.app_PC.campaigns[n_camp].players[i].infos.PV)


				//incrementation sur le téléphone
				if(typeof this.app_PC.campaigns[n_camp].players[i].comm_handler != "undefined"){
					this.app_PC.campaigns[n_camp].players[i].comm_handler.modCar(this.app_PC.campaigns[n_camp].players[i].infos.PV,this.app_PC.campaigns[n_camp].players[i].infos.CA);
				}



				}
			}
		}


	else if(stat == "PV-"){

		for (var i = 0 ; i <= this.app_PC.campaigns[n_camp].players.length -1 ; i++){
			if (this.app_PC.campaigns[n_camp].players[i].infos.name == n_pl){


				//incrémentation de 1 dans l'objet

				var pvint = parseInt(this.app_PC.campaigns[n_camp].players[i].infos.PV)
				pvint -= 1;
				this.app_PC.campaigns[n_camp].players[i].infos.PV = pvint;


				//incrémentation de 1 dans l'affichage
				$("#PV_"+this.app_PC.campaigns[n_camp].players[i].infos.name).text("PV: "+this.app_PC.campaigns[n_camp].players[i].infos.PV)

				//incrementation sur le téléphone
				if(typeof this.app_PC.campaigns[n_camp].players[i].comm_handler != "undefined"){
					this.app_PC.campaigns[n_camp].players[i].comm_handler.modCar(this.app_PC.campaigns[n_camp].players[i].infos.PV,this.app_PC.campaigns[n_camp].players[i].infos.CA);
				}


				}
			}

	}

	else if(stat == "CA+"){

		for (var i = 0 ; i <= this.app_PC.campaigns[n_camp].players.length -1 ; i++){
			if (this.app_PC.campaigns[n_camp].players[i].infos.name == n_pl){

				//incrémentation de 1 dans l'objet

				var pvint = parseInt(this.app_PC.campaigns[n_camp].players[i].infos.CA)
				pvint += 1;
				this.app_PC.campaigns[n_camp].players[i].infos.CA = pvint;


				//incrémentation de 1 dans l'affichage
				$("#CA_"+this.app_PC.campaigns[n_camp].players[i].infos.name).text("CA: "+this.app_PC.campaigns[n_camp].players[i].infos.CA)

				//incrementation sur le téléphone
				if(typeof this.app_PC.campaigns[n_camp].players[i].comm_handler != "undefined"){
					this.app_PC.campaigns[n_camp].players[i].comm_handler.modCar(this.app_PC.campaigns[n_camp].players[i].infos.PV,this.app_PC.campaigns[n_camp].players[i].infos.CA);
				}
				}
			}
	}

	else if(stat == "CA-"){

		for (var i = 0 ; i <= this.app_PC.campaigns[n_camp].players.length -1 ; i++){
			if (this.app_PC.campaigns[n_camp].players[i].infos.name == n_pl){

				//incrémentation de 1 dans l'objet

				var pvint = parseInt(this.app_PC.campaigns[n_camp].players[i].infos.CA)
				pvint -= 1;
				this.app_PC.campaigns[n_camp].players[i].infos.CA = pvint;


				//incrémentation de 1 dans l'affichage
				$("#CA_"+this.app_PC.campaigns[n_camp].players[i].infos.name).text("CA: "+this.app_PC.campaigns[n_camp].players[i].infos.CA)

				//incrementation sur le téléphone
				if(typeof this.app_PC.campaigns[n_camp].players[i].comm_handler != "undefined"){
					this.app_PC.campaigns[n_camp].players[i].comm_handler.modCar(this.app_PC.campaigns[n_camp].players[i].infos.PV,this.app_PC.campaigns[n_camp].players[i].infos.CA);
				}

				}
			}
		}
}






	CampagneTest(name){

		var p1 = new Player("Joueur1","66","33",undefined);

		var p2 = new Player("Joueur2","100","50",undefined);
		var p3 = new Player("Joueur3","100","50",undefined);

		this.app_PC.campaigns[name].players.push(p1);
		this.app_PC.campaigns[name].players.push(p2);
		this.app_PC.campaigns[name].players.push(p3);
		this.initUI();
		this.startCamp(name);

	}

	help(){
		$.alert({
    title: 'Impossible de connecter les téléphones au PC ?',
		type: 'purple',
		theme: 'material',
		boxWidth: '80%',
		useBootstrap: false,

    content: '<ul>'+
  						'<li>Il faut tout d’abord être connecté au même sous-réseau (ex : hotspot WiFi).</li>'+
  						'<li>Si toutefois cela ne marche pas, il se peut que votre routeur bloque la connexion. Il faut donc ouvrir le port 8080 du firewall de votre routeur.</br> <b>QuickFix :</b> un téléphone en mode partage de connexion fonctionne très bien ! :) </li>'+
  						'<li>Il se peut aussi que ce soit le PC qui bloque la connexion vous devez autoriser l’application nw.exe au port 8080.</li>'+
						'</ul>',
});
	}



}
