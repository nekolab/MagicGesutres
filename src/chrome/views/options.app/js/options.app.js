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
    })
    .factory('SettingService', function() {
        return  {
            activedProfile: new MagicGestures.Profile(MagicGestures.ProfileManager.activedProfile),
            selectedProfile: new MagicGestures.Profile(MagicGestures.ProfileManager.activedProfile)
        };
    })
    .directive('crModal', function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<div class="overlay"><div class="page" ng-transclude></div></div>',
            scope: {
                showModal: "=show"
            },
            link: function(scope, element, attrs) {

                scope.$watch('showModal', function(value) {
                    element.css({display: value ? "-webkit-box" : "none"});
                });

                element.find('.exit-button').click(function() {
                    element.addClass('transparent');
                    element.on('webkitTransitionEnd', function(e){
                        element.off('webkitTransitionEnd');
                        element.removeClass('transparent');
                        scope.$apply('showModal = false');
                    });
                });

                element.click(function() {
                    var page = element.find('.page');
                    page.addClass('pulse');
                    page.on('webkitAnimationEnd', function() {
                        page.off('webkitAnimationEnd');
                        page.removeClass('pulse');
                    });
                });

                element.find('.page').click(function(e) {
                    e.stopPropagation();
                });

                element.appendTo('body');
            }
        };
    })
    .filter('actionDependency', function() {
        return function(object, dependencyExp) {
            var filteredObject = {};
            for (var key in object) {
                if (object.hasOwnProperty(key) && (dependencyExp.indexOf(object[key].dependency) != -1)) {
                    filteredObject[key] = object[key];
                }
            }
            return filteredObject;
        }
    })
    .filter('mousekey', function() {
        return function(input) {
            switch(input) {
                case 0:
                    return "left";
                case 1:
                    return "middle";
                case 2:
                    return "right";
                default:
                    return "Unknow";
            }
        }
    });