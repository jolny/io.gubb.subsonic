"use strict";

const Homey = require("homey");

var Client = require("node-rest-client").Client;
var client = new Client();

//var args = {parameters: { u: Homey.ManagerSettings.get("username"), p: Homey.ManagerSettings.get("password"), c: "Homey Subsonic App", v: "1.15.0", f: "json", albumCount: "0", artistCount: "0"}};

class SubsonicPlayer extends Homey.App {

    onInit() {
        this.log("Subsonic Player is running.");
        var logger = this.log;

        Homey.ManagerMedia.on("search", (query, callback) => {
            var search_args = getArgsCopy();

            search_args.parameters.query = query.searchQuery;
            search_args.parameters.albumCount = "0";
            search_args.parameters.artistCount = "0";

            var search3 = client.get(Homey.ManagerSettings.get("server")+"/rest/search3", search_args, function (data, response) {
                var tracks = data["subsonic-response"]["searchResult3"]["song"];

                const result = [];
                if (!tracks) {
                    return callback(null, result);
                }
                tracks.forEach((track) => {

                    var current = track;//["$"];
                    var artworklist = getCoverArtUrls(current.coverArt);

                    result.push({
                        type: "track",
                        id: current.id,
                        title: current.title,
                        artist: [
                            {
                                name: current.artist,
                                type: "artist"
                            }
                        ],
                        album: current.album,
                        duration: parseInt(current.duration)*1000,
                        artwork: artworklist,
                        genre: "music",
                        release_date: current.created,
                        bitrate: current.bitRate,
                        codecs: ["homey:codec:mp3"],
                        //bpm: track.bpm,
                        confidence: 0.5
                    });
                });
                logger(result[0]);
                callback(null, result);
            });

            search3.on("responseTimeout", function (res) {
                this.log("response has expired");
            });

            search3.on("error", function (err) {
                this.log("request error", err);
            });
        });

        Homey.ManagerMedia.on("play", (track, callback) => {
            logger(track);
            args.parameters.id = track.trackId;
            var result = {};
            result.stream_url = "https://chit.se/rest/stream" + getArgsUrl();
            //logger(stream_url);
            return callback(null, result);
        });

        function getCoverArtUrls(id) {
            var url = "https://chit.se/rest/getCoverArt";
            var url2 = getArgsUrl();
            url += url2;
            url += "&id=";
            if (!id) {
                url += "0";
            }
            else {
                url += id; //coverArt ID
            }
            var artwork_data = {small:url+"&size=67",
            medium:url+"&size=300",
            large:url+"&size=500"};
            return artwork_data;
        }

        function getArgsUrl() {
            var url2 = "?";
            for (var key in args.parameters) {
                if (url2 != "?") {
                    url2 += "&";
                }
                url2 += key + "=" + encodeURIComponent(args.parameters[key]);
            }
            return url2;
        }

        function getArgsCopy() {
            var args ={parameters:
                { u: Homey.ManagerSettings.get("username"),
                p: Homey.ManagerSettings.get("password"),
                c: "Homey Subsonic App",
                v: "1.15.0",
                f: "json"}};

            return JSON.parse(JSON.stringify(args));
        }
    }
}
module.exports = SubsonicPlayer;
