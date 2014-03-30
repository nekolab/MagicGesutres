angular.module('options', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/gestures', {
                templateUrl: 'options.app/template/gestures.html',
                controller: GesturesCtrl,
                resolve: NavContrller.resolve,
                activeTab: 'gestures'
            })
            .when('/settings', {
                templateUrl: 'options.app/template/settings.html',
                controller: SettingsCtrl,
                resolve: NavContrller.resolve,
                activeTab: 'settings'
            })
            .when('/help', {
                templateUrl: 'options.app/template/help.html',
                resolve: NavContrller.resolve,
                activeTab: 'help'
            })
            .otherwise({redirectTo: '/settings'});
    });