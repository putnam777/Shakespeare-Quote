// View a demonstration here: http://m.me/triviabotdemo

// The contents of this file should be pasted into a Node.js Module in Motion AI on https://dashboard.motion.ai

exports.handler = (event, context, callback) => {

    /* "event" object contains payload from Motion AI
        {
            "from":"string", // the end-user's identifier (may be FB ID, email address, Slack username etc, depends on bot type)
            "session":"string", // a unique session identifier
            "botId":"string", // the Motion AI ID of the bot
            "botType":"string", // the type of bot this is (FB, Slack etc)
            "customPayload":"string", // a developer-defined payload for carrying information
            "reply":"string", // the end-user's reply that led to this module
            "moduleId":"string", // the current Motion AI Module ID
            "result":"string" // any extracted data from the prior module, if applicable
        }
    */

      // this is the object we will return to Motion AI in the callback
      var responseJSON = {
          "response": "", // what the bot will respond with (more is appended below)
          "continue": false, // denotes that Motion AI should hit this module again, rather than continue further in the flow
          "customPayload": "", // working data to examine in future calls to this function to keep track of state
          "quickReplies": null, // a JSON object containing suggested/quick replies to display to the user
          "cards": null // a cards JSON object to display a carousel to the user (see docs)
      }

      var request = require('request'); // require the request library so that we can make an API call below

      if (event.customPayload) { // if the customPayload exists, that means we have some prior working data (in this case, the correct answer to the prior question)

          var rand = getRandomInt(1,4);

          if (event.customPayload == event.reply) {
              if (rand == 1)
              responseJSON.response = "Bingo!  Good job!";
              if (rand == 2)
              responseJSON.response = "I'm impressed.";
              if (rand == 3)
              responseJSON.response = "Well done.";
              if (rand == 4)
              responseJSON.response = "Very nice.";
          } else {
              responseJSON.response = "That is incorrect. It was: "+event.customPayload;
          }

      } else {
          // customPayload was empty - AKA, this was the first trivia question
      }

    // API call to Open Trivia DB
      // We need this to build our post string
        var querystring = require('querystring');
        var http = require('http');
        var fs = require('fs');

        function PostCode(codestring) {
           // Build the post string from an object
           var post_data = querystring.stringify({
               'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
               'output_format': 'json',
               'output_info': 'compiled_code',
               'warning_level' : 'QUIET',
               'js_code' : codestring
  });

  // An object of options to indicate where to post to
  var post_options = {
      host: 'closure-compiler.appspot.com',
      port: '80',
      path: '/compile',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });

  // post the data

        // return the data to Motion AI!
        callback(null, responseJSON);

      });
};
}
