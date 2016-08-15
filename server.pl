#!/usr/bin/env perl6
use v6;

use lib "../English/lib";
use English;
use Web::App::Ballet;
use JSON::Tiny;

#my $main = "static/index.html".IO.slurp;
#my $js = "static/index.js".IO.slurp;
#my $css = "static/style.css".IO.slurp;

use-http(3000);
get "/parse" => -> $c {
  $c.content-type("application/json");
  my $text = $c.get("text", default => "This is a test.");
  my $match = English::Grammar.parse($text);
  if $match {
    $c.send(to-json({
      sentence => $text,
      ast => English::AST.from-match($match).to-hash
    }));
  } else {
    $c.set-status(500);
    $c.send(to-json({ error => "Couldn't parse input" }));
  }
}

get '/style.css' => -> $c {
  $c.content-type: 'text/css';
  $c.send("static/style.css".IO.slurp);
}

get '/index.js' => -> $c {
  $c.content-type: 'text/javascript';
  $c.send("static/index.js".IO.slurp);
  #$c.send($js);
}

get '/' => -> $c {
  $c.content-type: 'text/html';
  $c.send("static/index.html".IO.slurp);
  #$c.send($main);
}

dance;
#say English::Grammar.parse: "The quick brown fox jumped over the lazy dog.";
#say English::Grammar.parse: "I saw the man with the binoculars.";
#say English::Grammar.parse: "The big group sings terribly";

