var Tracks = (function () {
  var store = "https://s3-us-west-2.amazonaws.com/beats-hack/";

  return {
    all : _.map([
      "A Plus D - Levels That I Used To Know.mp3",
      "A Plus D - We Are Never Ever Getting The Sweater.mp3",
      "Chambaland - Semi-Charmed Call.mp3",
      "DJ Em-Tee - Domino Feels So Close.mp3",
      "DJ MikeA - Die Young In The Cave.mp3",
      "DJ Schmolli - Titanium 500.mp3",
      "DJ Tripp - We Are On Fire.mp3",
      "DJs From Mars - Internet Friends & Scary Monsters Back In Wonderwall.mp3",
      "DJs From Mars - Sweet Child O' Brightside.mp3",
      "Dan Mei - Good Time Gangnam Style.mp3",
      "Daw-Gun - We Found Love And You Came.mp3",
      "Dr. Brixx - Thumping A Tub Of Gasoline.mp3",
      "G3rst - I Want Stacy's Mom.mp3",
      "Lobsterdust - Stronger Enough.mp3",
      "Mighty Mike vs. ViC - Michael83 Down Under.mp3",
      "No Saturday Night Surgery - What Makes You Stop Believing.mp3",
      "The Kleptones - Shout My Name.mp3",
      "Titus Jones - Close To Blowing In The Deep.mp3",
      "Titus Jones - I Wanna Believe In Fire Love.mp3"], function (file) {

        var parts = file.split(" - ");
        return {
          mp3: store + file,
          ogg: store + file.replace(".mp3", ".ogg"),
          artist: parts[0],
          title: parts[1].replace(".mp3", '')
        };
    }),
    get : function (i) {
      return this.all[i];
    }
  };

}());