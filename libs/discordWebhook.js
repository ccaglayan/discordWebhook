const request = require('request');
const webhook = {};

const defaults = {
  endpoint: '',
  botUsername: '',
  infoPrefix: ':information_source:',
  errorPrefix: ':sos:',
  successPrefix: ':white_check_mark:'
}

function Start(options){
	if (!options.endpoint){
		throw new Error(' Endpoint is mandatory and cannot be empty.');
	}

	if (!options.botUsername){
		throw new Error(' botUsername is mandatory and cannot be empty.');
	}

	defaults.endpoint = options.endpoint;
	defaults.botUsername = options.botUsername;

	if (options.defaultInfoEmoji) {
		defaults.infoPrefix = options.infoPrefix;
	}
	if (options.defaultErrorEmoji) {
		defaults.errorPrefix = options.errorPrefix;
	}
	if (options.defaultSuccessEmoji) {
	    defaults.successPrefix = options.successPrefix;
	}

	request(options.endpoint,  function (error, response, body) {
	    if(error) {
	      	console.error('\n\n\n Could not get webhook info:'+error.stack+' \n\n\n');
	    }
	    try {
	      	hookInfo = JSON.parse(body);
	      	webhook.token = hookInfo.token;
	      	webhook.id = hookInfo.id;
	      	webhook.name = hookInfo.name;
	    } catch(error) {
	      	console.error('\n\n\nCould not use provided hook. Stacktrace: '+error.stack+' \n\n\n');
	    }
  	});
}


function sendMessage(message) {
  try {
    request({
      url: defaults.endpoint,
      method: 'POST',
      body: {
        username: defaults.botUsername,
        content: message
      },
      json:true
    }, function (error, response, body) {
      if (error) {
        console.error('\n\n\nCould not log following message to Discord: '+message+'\nError stack trace: '+error.stack+'\n\n\n');
      }
    });
  } 
  catch (error) {
    console.error('\n\n\nCould not log following message to Discord: '+message+'\nError stack trace: '+error.stack+'\n\n\n');
  }
};

Start.prototype.info = function (message) {
  sendMessage(defaults.infoPrefix+' '+message);
};
Start.prototype.error = function (message) {
  sendMessage(defaults.errorPrefix+' '+message);
};
Start.prototype.success = function (message) {
  sendMessage(defaults.successPrefix+' '+message);
};


module.exports = Start;