const discord = require('discord.js')
	  bot = new discord.Client()
 	  colors = require('colors')
 	  msconvert = require('milliseconds');

////////////////////[Configuration]\\\\\\\\\\\\\\\\\\\\

let token = "";
let dayaccountminimum = 1; // Au moins combien de jours le compte doit être créer
let guildId = "";
let channelLogsId = "";


////////////////////[Other]\\\\\\\\\\\\\\\\\\\\

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
});

////////////////////[Functions]\\\\\\\\\\\\\\\\\\\\

function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return day + '/' + month + '/' + year;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sendEmbed(msg, type, guild, channel){
	if(type == "danger") {
		var Embed = new discord.RichEmbed()
			.setColor(16470357)
			.setDescription(msg)
	} else if(type == "warning") {
		var Embed = new discord.RichEmbed()
			.setColor(15924992)
			.setDescription(msg)
	} else if(type == "success") {
		var Embed = new discord.RichEmbed()
			.setColor(65336)
			.setDescription(msg)
	}
	bot.guilds.get(guild).channels.get(channel).send(Embed);
}

function checkAllMembers() {
	return new Promise(async resolve => {
		const thestreet = bot.guilds.get(guildId);
		thestreet.members.forEach(member => { 

			if(member.user.bot) return;

			const datecreated = member.user.createdAt;

			const date = getFormattedDate(datecreated).split("/");

			const newdate = new Date();
			
			if(date[2] != newdate.getFullYear()) return;
			if(date[1] != (1 + newdate.getMonth()).toString().padStart(2, '0')) return;
			if(date[1] == (1 + newdate.getMonth()).toString().padStart(2, '0')){
				if(date[0] == newdate.getDate().toString().padStart(2, '0')){
					member.user.send("Vous avez été bannis car votre compte à été créer récemment");
					sendEmbed(`${member.user} a été bannis de la street car son compte a été créé récemment`, "danger", guildId, channelLogsId)
					setTimeout(function() {
					    thestreet.member(member).ban("Compte créer avant les normes réspectés du serveur.");
					}, 1000);
				}

		        var i = 0;
				do {
				  	i += 1;
				  	if(date[0] == newdate.getDate().toString().padStart(2, '0') - i){
		            	member.user.send("Vous avez été bannis car votre compte à été créer récemment");
		            	sendEmbed(`${member.user} a été bannis de la street car son compte a été créé récemment`, "danger", guildId, channelLogsId)
		            	setTimeout(function() {
		                	thestreet.member(member).ban("Compte créer avant les normes réspectés du serveur.");
		            	}, 1000);
		            	break;
		        	}
				} while (i < dayaccountminimum);

			}
		});
	});
}

////////////////////[Bot on Ready]\\\\\\\\\\\\\\\\\\\\

bot.on('ready', () => {
    console.log(colors.info('-----------------------------------------------------'))
    console.log('--> '.green + 'Bot by Niroxy'.cyan)
    console.log(colors.green('--> Connecter avec succès'))
    console.log(colors.info('-----------------------------------------------------'))
    var interval = setInterval(checkAllMembers, msconvert.hours(1));
});

////////////////////[Bot on guildMemberAdd]\\\\\\\\\\\\\\\\\\\\

bot.on('guildMemberAdd', (member) => {

	if(member.user.bot) return;

	const guild = member.guild;
	const datecreated = member.user.createdAt;

	const date = getFormattedDate(datecreated).split("/");

	const newdate = new Date();
	
	if(date[2] != newdate.getFullYear()) return;
	if(date[1] != (1 + newdate.getMonth()).toString().padStart(2, '0')) return;
	if(date[1] == (1 + newdate.getMonth()).toString().padStart(2, '0')){
		if(date[0] == newdate.getDate().toString().padStart(2, '0')){
			member.user.send("Vous avez été bannis car votre compte à été créer récemment");
			sendEmbed(`${member.user} a été bannis car son compte a été créé récemment`, "danger", guildId, channelLogsId)
			setTimeout(function() {
			    guild.member(member).kick("Compte créer avant les normes réspectés du serveur.");
			}, 1000);
		}

        var i = 0;
		do {
		  	i += 1;
		  	if(date[0] == newdate.getDate().toString().padStart(2, '0') - i){
            	member.user.send("Vous avez été bannis car votre compte à été créer récemment");
            	sendEmbed(`${member.user} a été bannis car son compte a été créé récemment`, "danger", guildId, channelLogsId)
            	setTimeout(function() {
                	guild.member(member).kick("Compte créer avant les normes réspectés du serveur.");
            	}, 1000);
            	break;
        	}
		} while (i < dayaccountminimum);

	}

})

////////////////////[Bot Login]\\\\\\\\\\\\\\\\\\\\ 

bot.login(token);