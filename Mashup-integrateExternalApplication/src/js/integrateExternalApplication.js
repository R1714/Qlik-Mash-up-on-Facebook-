var prefix = window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1);
var config = {
    host: window.location.hostname,
    prefix: prefix,
    port: window.location.port,
    isSecure: window.location.protocol === "https:"
};
require.config({
    baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
});

require(["js/qlik"], function (qlik) {
    qlik.setOnError(function (error) {
        console.log('Qlik error', error);
    });
    var whatsApp = angular.module("whatsApp", ['ngRoute']);

    function getQlikApp(id) {
        return qlik.openApp(id);
    }

    whatsApp.config(function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('')
        $routeProvider.when('/', {
                redirectTo: '/dashboard'
            })
            .when('/dashboard', {
                templateUrl: 'src/template/dashboard.html',
                controller: 'dashboard'
            })
            .when('/imageEditor', {
                templateUrl: 'src/template/imageEditor.html',
                controller: 'imageEditor'
            })
            .when('/whatsapp', {
                templateUrl: 'src/template/whatsapp.html',
                controller: 'whatsapp'
            })
            .otherwise({
                redirectTo: '/dashboard'
            });
    });

    whatsApp.controller("main", ['$scope', '$rootScope', function ($scope, $rootScope) {

        $rootScope.callApi = (url, method = "GET", data = {}) => {
            return new Promise((resolve, reject) => {
                let options = {
                    "method": method,
                    "mode": "cors",
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "body": JSON.stringify(data)
                }
                fetch(`http://localhost:3000/${url}`, options)
                    .then(response => {
                        if (!response.ok) reject(response);
                        resolve(response.json());
                    }).catch(error => {
                        reject(error);
                    });
            })
        }

    }]);

    whatsApp.controller("dashboard", ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.selectedApp = 'select';
        $scope.qlikApp = null;
        $scope.sheetProps = [];
        $scope.objectType = null;
        $scope.imageURL = null;
        qlik.getAppList(function (lists) {
            $scope.appList = lists;
        })
        $scope.chooseApp = function () {
            $scope.qlikApp = getQlikApp($scope.selectedApp);
            getSheetProps($scope.qlikApp, function (props) {
                $scope.sheetProps = props;
                console.log(props);
            })
        }

        $scope.toggleExpand = function () {

        }

        $scope.shareSnap = function () {
            let element = null;
            if ($scope.objectType === 'sheet') {
                element = $('#iFrameElement')[0];
            } else {
                element = $('#custom__obj')[0];
            }
            html2canvas(element, {
                allowTaint: true,
                taintTest: false,
                onrendered: function (canvas) {
                    $rootScope.imageURL = canvas.toDataURL();
                }
            });

        }

        $scope.applyObj = function (id, type) {
            $scope.objectType = type;
            if (type === 'sheet') {
                // $scope.qlikApp.getObject('custom__obj', 'AppNavigationBar', {
                //     sheetId: id
                // });
                let url = (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix;
                $scope.sheetsrc = `${url}single/?appid=${$scope.qlikApp.id}&sheet=${id}&select=clearall`;
            } else {
                $scope.qlikApp.getObject("custom__obj", id);
            }
        }



    }]);

    whatsApp.controller("imageEditor", ['$scope', '$rootScope', function ($scope, $rootScope) {

        $scope.credentials = {
            email: 'Testing@gmail.com',
            password: 'Test@123'
        }

        $scope.friendsList = [];
        $scope.updatedImg = null;

        // function convertURIToImageData(URI) {
        //     return new Promise(function (resolve, reject) {
        //         if (URI == null) return reject();
        //         var canvas = document.createElement('canvas'),
        //             context = canvas.getContext('2d'),
        //             image = new Image();
        //         image.addEventListener('load', function () {
        //             canvas.width = image.width;
        //             canvas.height = image.height;
        //             context.drawImage(image, 0, 0, canvas.width, canvas.height);
        //             resolve(context.getImageData(0, 0, canvas.width, canvas.height));
        //         }, false);
        //         image.src = URI;
        //     });
        // }

        $scope.getImageFn = (img) => {
            // convertURIToImageData(img).then(function(imageData) {
            //     $scope.updatedImg = imageData;
            //     console.log(img);
            //     console.log(imageData);
            //   });

            $scope.updatedImg = img;
            $scope.$apply();
        }

        $scope.toggleUsers = (user) => {
            let updatedUsers = $scope.friendsList.filter((u) => {
                if (u.userID == user.userID) u['active'] = !u['active'];
                return u;
            });
            $scope.friendsList = updatedUsers;
        }

        $scope.sendMessage = () => {
            $scope.friendsList.map((user) => {
                if (user.active) {
                    let message = {
                        id: user.userID,
                        url: $scope.updatedImg,
                        text: `Hello ${user.fullName}`
                    }
                    $rootScope.callApi('sendMessage', 'POST', message).then((data) => {
                        console.log(data);
                        let updatedUsers = $scope.friendsList.filter((u) => {
                            if (u.userID == user.userID) u['active'] = false;
                            return u;
                        });
                        $scope.friendsList = updatedUsers;
                        $scope.$apply();
                    }).catch((err) => {
                        console.log(err);
                    })
                }
            })
        }

        $scope.loginFn = function () {
            $rootScope.callApi('login', 'POST', $scope.credentials).then((res) => {
                $scope.friendsList = res.data;
                $scope.$apply();
                console.log(res.data);
            }).catch((err) => {
                console.log(err);
            })
        }

        editImg('imgEditor', $rootScope.imageURL, {
            width: '100%',
            height: '100%'
        }, $scope.getImageFn);
    }]);

    whatsApp.controller("whatsapp", ['$scope', '$rootScope', function ($scope, $rootScope) {

    }]);
    angular.bootstrap(document, ["whatsApp", "qlik-angular"]);
});