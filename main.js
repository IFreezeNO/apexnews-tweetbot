const request = require('request');
const cheerio = require('cheerio');
const twit = require('twit');

//grabbing the website url
var searchUrl = 'https://www.apexnews.gg/';

//Going to save the information here
var savedData = "";

// twitter api config
var Twitter = new twit({
    consumer_key: '',
    consumer_secret: '',
    access_token: '',
    access_token_secret: '',
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
})

setInterval( tweet, 10000); // checking every 30 min

//making it run through this at the begining
var status = true;


function tweet(){
    //if true, it will go through the scraping and could tweet aswell
    if(status === true) {
            request(searchUrl, function(err, response, html) {
            // First we'll check to make sure no errors occurred when making the request
            if (err) {
                return res.status(500).send(err);
            }
            var $ = cheerio.load(html);
            // Getting the first news from apexnews.gg
            const author = $("body > div.container.main-content.clearfix > div > div.col-sm-7.panel-holder.col-12 > div > div > div > div > div:nth-child(2) > a > div > div.news-info.text-right.ml-auto > span.author").text();

            const title = $("body > div.container.main-content.clearfix > div > div.col-sm-7.panel-holder.col-12 > div > div > div > div > div:nth-child(2) > a > div > div.news-title").text().replace("                                    ","").replace("\n","").replace("                                ","");
            const articlelink = $("body > div.container.main-content.clearfix > div > div.col-sm-7.panel-holder.col-12 > div > div > div > div > div:nth-child(2) > a").attr('href');



    
                //checking if the there is anything in the selector, if not we will just console.log that there is no new news 
                if(title === "" || author === "") {
                    console.log("no news")
                } else {
                    //saving the data
                    savedData = title + author;
                    console.log("📰Fresh Ink by " +author+ " \n \n " +title+ " \n \n " + "Read, Like & Retweet: \n \n" + "https://apexnews.gg"+articlelink)
    
                    //twitter post 
                    Twitter.post('statuses/update', {
                      status: "📰Fresh Ink by " +author+ " \n \n " +title+ " \n \n " + "Read, Like & Retweet: \n \n https://apexnews.gg"+articlelink
                  }, function(err, data, response) {});
                        
                }

            //changing status so it doesnt tweet every 30min
            status = title + author;
            });
            

    }

    //made this so it does not tweet out every 30 min about the same news
    if(status === savedData) {
    } else {
    status = true;
    }
}