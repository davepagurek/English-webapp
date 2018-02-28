#!/usr/bin/env perl6
use v6;

use lib "../English/lib";
use English;
use Bailador;

#my $main = "static/index.html".IO.slurp;
#my $js = "static/index.js".IO.slurp;
#my $css = "static/style.css".IO.slurp;

get "/parse" =>  {
  content_type("application/json");
  my $text = request.params<text> || "This is a test.";
  my $match = English::Grammar.parse($text.trim);
  if $match {
    to-json({
      sentence => $text,
      ast => English::AST.from-match($match).to-hash
    });
  } else {
    status(500);
    to-json({ error => "Couldn't parse input" });
  }
}

get '/style.css' => {
  content_type('text/css');
  "static/style.css".IO.slurp;
}

get '/index.js' => {
  content_type('text/javascript');
  "static/index.js".IO.slurp;
}

get '/' => {
  content_type('text/html');
  "static/index.html".IO.slurp;
  #$c.send($main);
}

config.port = 3001;
baile;
#say English::Grammar.parse: "The quick brown fox jumped over the lazy dog.";
#say English::Grammar.parse: "I saw the man with the binoculars.";
#say English::Grammar.parse: "The big group sings terribly";

