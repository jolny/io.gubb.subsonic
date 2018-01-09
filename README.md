# Homey Subsonic plugin

This music plugin will enable you to listen to songs from a server sporting the Subsonic API, on your Homey.
Besides [Subsonic](http://www.subsonic.org/), it will work with forks like [Airsonic](https://airsonic.github.io/), and also [AMPache](http://ampache.org/) since it implements the API.

To use, specify your server and login credentials in the app settings. Use the same url *(including http/https)* that the Subsonic web app uses, the app will add */rest/* etc automatically. Test your login before saving.

*Note:* [Search](http://www.subsonic.org/pages/api.jsp#search) is deprecated since API version 1.4.0 and is only suitable for very old installs. Use [Search2](http://www.subsonic.org/pages/api.jsp#search2) (API version 1.4.0 and later) or [Search3](http://www.subsonic.org/pages/api.jsp#search3) (API version 1.8.0 and later). Results are grouped differently, where *search3* groups by ID3 tags.

## Version history
#### 0.0.3
* Better error messages (in Music UI)
* Secure (salted+hashed) login implemented (using md5 and string magic)
* Search method selection in Settings (Search3 default)
#### 0.0.2
* FIX: *Node_modules* folder was in .gitignore ... :D
#### 0.0.1
* First release, search and playback working.

## Plans for future releases
* Playlist(s) support
* --API and/or search method selection-- v 0.0.3
* --Salted password when logging in-- v 0.0.3
