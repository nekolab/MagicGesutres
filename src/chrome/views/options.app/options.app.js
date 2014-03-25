angular.module('options', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/gestures', {
                templateUrl: 'options.app/gestures.html',
                controller: GesturesCtrl,
                activeTab: 'gestures'
            })
            .when('/settings', {
                templateUrl: 'options.app/settings.html',
                controller: SettingsCtrl,
                activeTab: 'settings'
            })
            .when('/help', {
                templateUrl: 'options.app/help.html',
                activeTab: 'help'
            })
            .otherwise({redirectTo: '/settings'});
    });