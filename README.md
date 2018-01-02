# Homey Subsonic plugin

This music plugin will enable you to listen to songs from a server sporting the Subsonic API, on your Homey.
Besides [Subsonic](http://www.subsonic.org/), it will work with forks like [Airsonic](https://airsonic.github.io/), and also [AMPache](http://ampache.org/) since it implements the same API.

To use, specify your server and login credentials in the app settings. Use the same url as the Subsonic web app uses, the app will add */rest/* etc automatically. Test your login before saving.

*Note:* as [Search3](http://www.subsonic.org/pages/api.jsp#search3) is currently the only available search method, API version *1.8.0* and above are supported.

## Version history
#### 0.0.1
* First release, search and playback working.

## Plans for future releases
* Playlist(s) support
* API and/or search method selection
* Use of salted login instead of URL parameters
