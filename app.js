"use strict";

const Homey = require("homey");

var md5 = require('md5');

var Client = require("node-rest-client").Client;
var client = new Client();

class SubsonicPlayer extends Homey.App {

    onInit() {
        this.log("Subsonic Player is running.");
        //var logger = this.log;
        var sendAlert = Homey.alert;

        Homey.ManagerMedia.on("search", (query, callback) => {

            if (!verifyLogin()) {
                return callback(new Error("login_values_null_edit_app_settings"));
            }

            var search_args = getArgsCopy();

            search_args.parameters.query = query.searchQuery;
            search_args.parameters.albumCount = "0";
            search_args.parameters.artistCount = "0";

            var search3 = client.get(Homey.ManagerSettings.get("server")+"/rest/"+Homey.ManagerSettings.get("search"),
            search_args, function (data, response) {
                var tracks = data["subsonic-response"]["searchResult3"]["song"];

                const result = [];
                if (!tracks) {
                    return callback(null, result);
                }
                tracks.forEach((track) => {

                    var current = track;
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
                        genre: (current.genre ? current.genre : "music"),
                        release_date: current.created,
                        bitrate: current.bitRate,
                        codecs: ["homey:codec:mp3"],
                        //bpm: track.bpm,
                        confidence: 0.5
                    });
                });
                //logger(result[0]);
                callback(null, result);
            });

            search3.on("responseTimeout", function (res) {
                this.log("response has expired");
                return callback(new Error("response_timeout"));
            });

            search3.on("error", function (err) {
                this.log("request error", err);
                return callback(new Error("request_error"));
            });
        });

        Homey.ManagerMedia.on("play", (track, callback) => {
            var args = getArgsCopy();
            args.parameters.id = track.trackId;
            var result = {};
            result.stream_url = Homey.ManagerSettings.get("server")+"/rest/stream"+getArgsUrl(args);
            return callback(null, result);
        });

        function getCoverArtUrls(id) {
            var url = Homey.ManagerSettings.get("server")+"/rest/getCoverArt";
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

        function getArgsUrl(args) {
            if (!args) {
                args = getArgsCopy();
            }
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
            var salt = randomSalt(6);

            var args = {parameters:
                { u: Homey.ManagerSettings.get("username"),
                t: md5(Homey.ManagerSettings.get("password")+salt),
                s: salt,
                c: "Homey Subsonic App",
                v: "1.8.0",
                f: "json"}};

            return JSON.parse(JSON.stringify(args));
        }

        function verifyLogin() {
            var credentialList = [
                "server",
                "username",
                "password"
            ];
            credentialList.forEach((key) => {
                if (!Homey.ManagerSettings.get(key)) {
                    return false;
                }});
            return true;
        }

        function randomSalt(length) {
            var charset = "0123456789abcdefghijklmnopqrstuvwxyz";
            var i = 0;
            var salt = "";
            while (i < length) {
                var charNo = Math.floor(Math.random() * charset.length);
                if (Math.floor(Math.random() * 2) == 1) {
                    salt = salt + charset[charNo].toUpperCase();
                }
                else {
                    salt = salt + charset[charNo];
                }
                i++;
            }
            return salt;
        }
    }
}
module.exports = SubsonicPlayer;
