

var gettys = "Fourscore and seven years ago our fathers brought forth on this continent a new nation, conceived in liberty and dedicated to the proposition that all men are created equal. Now we are engaged in a great civil war, testing whether that nation or any nation so conceived and so dedicated can long endure. We are met on a great battlefield of that war. We have come to dedicate a portion of that field as a final resting-place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this. But in a larger sense, we cannot dedicate, we cannot consecrate, we cannot hallow this ground. The brave men, living and dead who struggled here have consecrated it far above our poor power to add or detract. The world will little note nor long remember what we say here, but it can never forget what they did here. It is for us the living rather to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced. It is rather for us to be here dedicated to the great task remaining before us--that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion--that we here highly resolve that these dead shall not have died in vain, that this nation under God shall have a new birth of freedom, and that government of the people, by the people, for the people shall not perish from the earth."



var makedim = function (dimension, initial) {
    var a = [], i;
    for (i = 0; i < dimension; i += 1) {
        a[i] = initial;
    }
    return a;
};

var makematrix = function(m, n, initial)
{
    var a, i, j, mat = [];
    for (i = 0; i < m; i += 1) {
        a = [];
        for (j = 0; j < n; j += 1) {
            a[j] = initial;
        }
        mat[i] = a;
    }
    return mat;
}

var shiftarray =  function (ary ) 
{
    ary.splice(0, 1);
}

var delay = 150;
var blocksize = 12;
var mid = 7;
var original = "#302eb8";
var mix = "#f24730";
var blocks = makematrix(blocksize+1,blocksize,original);

GraphicBlocks = new Meteor.Collection("blocks");
GraphicRows = new Meteor.Collection("rows");
GraphicCells = new Meteor.Collection("cells");


if (Meteor.isClient) {
  Meteor.subscribe("blocks");
    Session.set("blocks", blocks);
    
  Template.hello.greeting = function () {
    return "Welcome to the gettysburg address";
  };

  Template.address.blocks = function() {return Session.get("blocks");}
  Template.words.word = function() {return Session.get("word");}

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

    Meteor.setTimeout(function(){animategettys()}, 500);

    WebFontConfig = {
    google: { families: [ 'Mr+De+Haviland::latin', 'Pinyon+Script::latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();

}

var shiftColumns = function ()
{
    _.each(blocks, shiftarray);
}




var animate = function(word, height, current, up)
{
//    console.log("current height: " + height);
//    console.log("current current: " + current);
//    console.log("current up: " + up);
//    console.log("current - mid: " + (mid - current));
//    console.log("current + mid: " + (mid + current));

    shiftColumns();
    for(var i =0; i< blocksize + 1; i++)
    {
        if (i >mid-current &&  i < mid+ current)
        {
//            console.log("setting i = " + i);
            blocks[i][blocksize-1] = mix;
        }
        else
        {
            blocks[i][blocksize-1] = original;
        }
    }
    Session.set("blocks", blocks);

    if (height === current)
    {
        if (up)
        { 
            up = false;
            current--;
            Session.set("word", word);

        }
    }
    else
    {
        if (up){ current++;}
        else { current--;}
    }

    if (!up && current === 0)
    {
        if(splitgettys.length > 0)
        {
            splitgettys.splice(0,1);
        }
        animategettys();
    }
    else
    {
        Meteor.setTimeout(function(){animate(word, height, current, up)}, delay);
    }


//    console.log("=====done=====");
 
}       

var splitgettys = gettys.split(" ");

var animategettys = function() 
{
    if (splitgettys.length > 0)
        {
            var word = splitgettys[0];
            console.log("now animating " + word);
            animate(word, word.length, 0, true);
        }
}

if (Meteor.isServer) 
{
  Meteor.publish("blocks", function() { return GraphicBlocks.find({});});
                 
  Meteor.startup(function () {
    // code to run on server at startup

  });
}


