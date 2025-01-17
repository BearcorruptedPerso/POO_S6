class PC_Effet {
	constructor(desc,bonus,duration,unit,player,rtH = 0,htR =100000){
		this.id=PC_Effet.generate_ID();
		this.rtH = rtH;
		this.htR = htR;
		this.desc = desc;
		this.bonus = bonus;
		this.duration = duration;
		this.unit = unit;
		this.player = player;
	}
	roundToHour(round){
		//Conversion du nombre de rounds en nombre d'heures
		var hour = round*this.rtH;
		return hour;
	}
	hourToRound(hour){
		//Conversion du nombre d'heures en nombre de rounds
		var round = hour*this.htR;
		return round;
	}
	live(in_fight,qte){
		if (in_fight) { //L'effet s'applique en combat qte en round
      if (this.unit ==0) { //L'effet est compté en heures
       this.apply(this.roundToHour(qte)); //On applique l'effet après l'avoir converti en rounds
      }
      else {
        this.apply(qte); //Pas besoin de conversion, on applique l'effet
      }
    }
    else { // l'effet s'applique hors combat qte en heures
      if (this.unit ==0) {
        this.apply(qte); //Pas besoin de conversion, on applique l'effet
      }
      else {
        this.apply(this.hourToRound(qte)); //On applique l'effet après l'avoir converti en heures
      }
    }
		if (this.duration <= 0) { //Si la durée est inférieure ou égale à 0, il faut détruire l'effet
			return false;
		}
		return true;

	}
	apply(qte){
		this.duration -= qte;
	}

	static generate_ID() {

    	if( typeof PC_Effet.counter == 'undefined' ) {
        	PC_Effet.counter = -1;
   		}
    	PC_Effet.counter++;
    	return "PC_Effet"+PC_Effet.counter;
	}
}

//_______________________________Tests________________________________________

// var int = false;
// var ctx;
// var c;
// var bonus = 1;
// var dur = 4;
// var unit = 1; //round
// var unitef = 1;
// var fight = 0; //hors combat
// var qte = 1;
// $(document).ready(function(){
//   screenlog("SpringTurquoise","pour voir le code source : F12")
//   var canvas = document.getElementById('tutoriel');
//   ctx = canvas.getContext('2d');
//   if (bonus ==1) {
//   	  screenlog("green","creation d'un effet")
//   	 screenlog('green'," var e  = new PC_Effet('bonus de test',1,4,1,10)")
//   }
//   else {
//   	  screenlog("Red","creation d'un effet")
//   	  screenlog('red'," var e  = new PC_Effet('bonus de test',1,4,1,10)")
//   }

//   e  = new PC_Effet('bonus de test',bonus,dur,unit,10)
//   screenlog("pink","durée de l'effet = ")
//   screenlog("pink",e.duration.toString())
//   if (unitef ==1) {
// 	screenlog('pink'," ROUNDS ")
//   }
//   else {
// 	screenlog('pink'," HEURES ")
//   }

// });

// function screenlog(color,message) {
//   var dt = new Date();
//   var time = "["+dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()+"]";
//   $("#screenlog").append("<span style='color:"+color+";'><b>"+time+"</b>"+message+"</span></br>")

// }

// function play() {

// 	e.live(fight,qte)
// 	screenlog('blue',"desc =")
// 	screenlog('blue',e.desc)
// 	screenlog('blue'," il reste : ")
// 	screenlog('blue',e.duration.toString())
// 	if (fight ==1) {
// 		screenlog('blue'," ROUNDS ")
// 	}
// 	else {
// 		screenlog('blue'," HEURES ")
// 	}
// }
