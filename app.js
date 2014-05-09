/**
 * Created by xerxes on 5/9/14.
 */
var app = angular.module('newsFeed', []);

app.factory('fetchNews', function ($http, $q) {
    var fetchNews = {};
    fetchNews.latest = undefined;
    fetchNews.fetch = function () {
        var d = $q.defer();
        var url = 'http://www.thedailystar.net/front/ajax/get_tricker_news';
        $http({'method': 'GET', 'url': url}).success(function (data, status, headers, config) {
            fetchNews.latest = data;
            d.resolve();
        });
        return d.promise;
    }
    return  fetchNews;
});
function show_notifications(cur_news) {
    return (function (news) {

    })(cur_news)
};
app.controller('newsFeed', function ($scope, $timeout, fetchNews) {
    var previousNews = undefined;
    var interval = undefined;
    var rewind = undefined;
    var notification = undefined;
    var tension = 30;
    setInterval(function () {
        fetchNews.fetch().then(function () {
            interval = interval || 3000000;
            if (_.isEqual(previousNews, fetchNews.latest)) {
                if (rewind === 'rewind') {
                    rewind = undefined;
                    _(fetchNews.latest).each(function (item, indx) {
                        setTimeout(function () {
                            if (_.isUndefined(notification) === false) {
                                notification.cancel();
                            }
                            notification = webkitNotifications.createNotification(
                                "notifications.png",
                                item['headline'],
                                ""
                            );
                            notification.onclick = function () {
                                chrome.tabs.create({'url': item['href']});
                            };
                            notification.show();
                            if (fetchNews.latest.length == indx + 1) {
                                rewind = 'rewind';
                            }
                        }, tension * 1000 * indx);
                    });
                }
            } else {
                rewind = undefined;
                previousNews = fetchNews.latest;
                _(fetchNews.latest).each(function (item, indx) {
                    setTimeout(function () {
                        if (_.isUndefined(notification) === false) {
                            notification.cancel();
                        }
                        notification = webkitNotifications.createNotification(
                            "notifications.png",
                            item['headline'],
                            ""
                        );
                        notification.onclick = function () {
                            chrome.tabs.create({'url': item['href']});
                        };
                        notification.show();
                        if (fetchNews.latest.length == indx + 1) {
                            rewind = 'rewind';
                        }
                    }, tension * 1000 * indx);
                });
            }
        });
    }, interval || 0);
});