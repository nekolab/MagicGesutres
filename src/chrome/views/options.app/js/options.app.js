angular.module('options', ['ngRoute', 'ngAnimate'])
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
            priority: -1,
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<div class="overlay"><div class="page" ng-transclude></div></div>',
            scope: {
                showModal: "=show",
                onModalClose: "&onClose"
            },
            link: function(scope, element, attrs) {

                scope.$watch('showModal', function(value) {
                    element.css({display: value ? "-webkit-box" : "none"});
                    $('body').css({overflow: value ? 'hidden' : 'visible'});
                });

                element.find('.exit-button').on('click', function() {
                    element.addClass('transparent');
                    element.on('webkitTransitionEnd', function(){
                        element.off('webkitTransitionEnd');
                        element.removeClass('transparent');
                        scope.$apply('showModal = false');
                    });
                    scope.onModalClose();
                });

                element.on('click', function() {
                    var page = element.find('.page');
                    page.addClass('pulse');
                    page.on('webkitAnimationEnd', function() {
                        page.off('webkitAnimationEnd');
                        page.removeClass('pulse');
                    });
                });

                element.find('.page').on('click', function(e) {
                    e.stopPropagation();
                });

                element.appendTo('body');

                scope.$on('$destroy', function() {
                    element.find('.exit-button').off('click');
                    element.find('.page').off('click');
                    element.off('click');
                    element.remove();
                });
            }
        };
    })
    .directive('gestureActionSelect' ,['$filter', function($filter) {
        return {
            restrict: 'E',
            replace: true,
            template: '<li><a><dl><dt><select ng-model="currentAction.name" ng-disabled="!gesture.enabled" ' +
                'ng-options="name as name group by value.category for (name, value) in filteredActions">' +
                '<option value="">No action</option></select></dt><dd>{{description}}</dd></dl></a>' +
                '<a class="delete" ng-show="gesture.enabled" ng-click="currentAction.name=null">delete</a></li>',
            scope: {
                actions: "=",
                gesture: "=",
                gestureActionType: "@"
            },
            link: function(scope, element, attrs) {

                // Insert "On Link" tag.
                if (scope.gestureActionType) {
                    element.find('select').after(angular.element('<ul class="tags"><li>On Link</li></ul>'));
                }

                (scope.bindCurrentAction = function() {
                    // Find currentAction
                    scope.currentAction = undefined;
                    if (!scope.gestureActionType) scope.gestureActionType = "";
                    for (var action_index = scope.gesture.actions.length - 1; action_index >= 0; --action_index) {
                        if (scope.gesture.actions[action_index].dependency === scope.gestureActionType) {
                            scope.currentAction = scope.gesture.actions[action_index];
                            break;
                        }
                    }
                })();

                scope.$on('updateActionSelectReference', scope.bindCurrentAction);

                scope.$watch("currentAction.name", function(newValue, oldValue) {
                    if (newValue === null || newValue === undefined) {
                        if (!scope.gestureActionType) scope.gestureActionType = "";
                        for (var action_index = scope.gesture.actions.length - 1; action_index >= 0; --action_index) {
                            if (scope.gesture.actions[action_index].dependency === scope.gestureActionType) {
                                scope.gesture.actions.splice(action_index, 1);
                                break;
                            }
                        }
                        scope.currentAction = undefined;
                    } else if (oldValue === null || oldValue === undefined) {
                        scope.gesture.actions.push(scope.currentAction = new MagicGestures.Action({
                            name: newValue,
                            dependency: (scope.gestureActionType === "link") ? "link" : ""
                        }));
                    }
                    scope.description = (scope.actions[newValue]) ? scope.actions[newValue].description : "Please select an action";
                });

                var actionDependency = (scope.gestureActionType === "link") ? "none, link" : "none";
                scope.filteredActions = $filter("actionDependency")(scope.actions, actionDependency);

                scope.$on('$destroy', function() {
                    element.remove();
                });
            }
        };
    }])
    .directive('mgThumbnail', function() {
        return {
            restrict: 'A',
            scope: {
                gesture: "=mgThumbnail"
            },
            link: function(scope, element, attrs) {

                var render = function() {
                    element.empty();
                    element.removeAttr('viewBox');

                    var polyline = angular.element(document.createElementNS("http://www.w3.org/2000/svg", "polyline"))
                        .attr('stroke', 'red').attr('stroke-width', '2px').attr('fill', 'transparent').attr('stroke-linecap', 'round');

                    var polyX = [0], polyY = [0];
                    for(var vector_index = 0; vector_index < scope.gesture.featureVectors.length; vector_index += 2) {
                        polyX.push(polyX[polyX.length - 1] + scope.gesture.featureVectors[vector_index] + (vector_index / 2 * 0.001) * 0);
                        polyY.push(polyY[polyY.length - 1] + scope.gesture.featureVectors[vector_index + 1] + (vector_index / 2 * 0.001) * 0);
                    }

                    var max_width = Math.max.apply(null, polyX), min_width = Math.min.apply(null, polyX);
                    var max_height = Math.max.apply(null, polyY), min_height = Math.min.apply(null, polyY);
                    var width = Math.abs(max_width) + Math.abs(min_width), height = Math.abs(max_height) + Math.abs(min_height);

                    var scale = Math.min(112 / (width + Math.SQRT2), 112 / (height + Math.SQRT2)) - 1;

                    var offset_width = Math.round((112 - ((width + Math.SQRT2)) * scale) / 2);
                    var offset_height = Math.round((112 - ((height + Math.SQRT2)) * scale) / 2);

                    if (min_width < 0) {
                        for (var index = 0; index < polyX.length; ++index) {
                            polyX[index] -= min_width;
                        }
                    }
                    if (min_height < 0) {
                        for (var index = 0; index < polyY.length; ++index) {
                            polyY[index] -= min_height;
                        }
                    }

                    var pointsStr = "";
                    for (var index = 0; index < polyX.length; ++index) {
                        pointsStr += (polyX[index] * scale + offset_width) + " " + (polyY[index] * scale + offset_height) + ", ";
                    }
                    pointsStr = pointsStr.substring(0, pointsStr.length - 2);

                    polyline.attr('points', pointsStr);
                    element.append(polyline);

                    /* <=========== Draw arrow ===========> */

                    var polyArrow = angular.element(document.createElementNS("http://www.w3.org/2000/svg", "polyline"))
                        .attr('stroke', 'red').attr('stroke-width', '2px').attr('fill', 'transparent').attr('stroke-linecap', 'round');

                    var lastFeatureVector = scope.gesture.featureVectors.slice(-2);
                    var arrow1x = (Math.SQRT1_2 * lastFeatureVector[0] + Math.SQRT1_2 * lastFeatureVector[1]);
                    var arrow1y = - (Math.SQRT1_2 * lastFeatureVector[0] - Math.SQRT1_2 * lastFeatureVector[1]);
                    var arrow2x = arrow1y; // = (Math.SQRT1_2 * lastFeatureVector[1] - Math.SQRT1_2 * lastFeatureVector[0]);
                    var arrow2y = -arrow1x; // = - (Math.SQRT1_2 * lastFeatureVector[0] + Math.SQRT1_2 * lastFeatureVector[1]);

                    arrow_scale = (scale > 6) ? scale : 6;
                    arrow1x *= arrow_scale; arrow2x *= arrow_scale;
                    arrow1y *= arrow_scale; arrow2y *= arrow_scale;

                    var arrowX = [polyX[polyX.length - 1] * scale + offset_width - arrow1x];
                    var arrowY = [polyY[polyY.length - 1] * scale + offset_height - arrow1y];

                    arrowX.push(arrowX[arrowX.length - 1] + arrow1x);
                    arrowY.push(arrowY[arrowY.length - 1] + arrow1y);
                    arrowX.push(arrowX[arrowX.length - 1] + arrow2x);
                    arrowY.push(arrowY[arrowY.length - 1] + arrow2y);

                    var arrowStr = "";
                    for (var index = 0; index < arrowX.length; ++index) {
                        arrowStr += arrowX[index] + " " + arrowY[index] + ", ";
                    }
                    arrowStr = arrowStr.substring(0, arrowStr.length - 2);

                    polyArrow.attr('points', arrowStr);
                    element.append(polyArrow);
                };

                scope.$watchCollection('gesture', function() {
                    if (scope.gesture && (scope.gesture.code.length !== 0 || scope.gesture.featureVectors.length !== 0)) {
                        render();
                    } else {
                        // This is a question mark svg is created by Acdx at wikipedia project.
                        // http://commons.wikimedia.org/wiki/File:Question_mark2.svg
                        // Thanks for his hard work.
                        element.empty();
                        var path = angular.element(document.createElementNS("http://www.w3.org/2000/svg", "path"))
                            .attr('stroke', '#000000').attr('stroke-width', '2').attr('opacity', '0.3').attr('d', 
                                'M11.938,29.84c0-3.096,0.992-6.233,2.979-9.411c1.985-3.178,4.883-5.811,8.691-7.896' +
                                's8.252-3.13,13.33-3.13c4.72,0,8.888,0.871,12.503,2.612s6.408,4.109,8.379,7.104c1.971,2.995,2.956,6.25,2.956,9.765' +
                                'c0,2.768-0.563,5.192-1.687,7.275s-2.46,3.881-4.007,5.395c-1.548,1.514-4.325,4.061-8.332,7.641' +
                                'c-1.109,1.009-1.999,1.896-2.667,2.66c-0.669,0.765-1.167,1.464-1.493,2.099s-0.579,1.269-0.759,1.903s-0.448,1.749-0.807,3.343' +
                                'c-0.618,3.383-2.554,5.073-5.807,5.073c-1.691,0-3.115-0.553-4.27-1.659c-1.155-1.105-1.732-2.749-1.732-4.929' +
                                'c0-2.732,0.423-5.1,1.27-7.101s1.971-3.758,3.371-5.271c1.4-1.513,3.289-3.311,5.666-5.393c2.084-1.821,3.59-3.195,4.518-4.123' +
                                's1.71-1.961,2.345-3.1s0.953-2.375,0.953-3.709c0-2.603-0.969-4.799-2.905-6.588c-1.938-1.789-4.436-2.685-7.495-2.685' +
                                'c-3.581,0-6.218,0.903-7.91,2.709c-1.693,1.806-3.125,4.465-4.297,7.979c-1.107,3.678-3.207,5.516-6.299,5.516' +
                                'c-1.823,0-3.361-0.64-4.614-1.921C12.564,32.717,11.938,31.332,11.938,29.84z M35.755,83.34c-1.984,0-3.717-0.645-5.197-1.932' +
                                'c-1.48-1.288-2.22-3.09-2.22-5.405c0-2.055,0.715-3.782,2.146-5.185s3.188-2.104,5.271-2.104c2.049,0,3.773,0.701,5.172,2.104' +
                                's2.099,3.13,2.099,5.185c0,2.283-0.732,4.076-2.196,5.381C39.366,82.688,37.674,83.34,35.755,83.34z');
                        element[0].setAttribute('viewBox', '11 6 53 78');
                        element.append(path);
                    }
                });

                scope.$on('$destroy', function() {
                    element.remove();
                });
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