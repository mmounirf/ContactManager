var app = angular.module('ContactManagerApp', ['vAccordion', 'ngAnimate', 'md.data.table', 'ngMaterial', 'fixed.table.header']);

//Autofocus directive on ng-show  for seachbar
app.directive('showFocus', function($timeout) {
    return function(scope, element, attrs) {
        scope.$watch(attrs.showFocus,
            function(newValue) {
                $timeout(function() {
                    newValue && element.focus();
                });
            }, true);
    };
});


app.controller('ContactManagerCtrl', ['$scope', '$mdDialog', '$timeout', '$q', function($scope, $mdDialog, $timeout, $q) {
    var VCardParser = require('cozy-vcard/lib');
    var app = require('electron').remote;
    var dialog = app.dialog;
    var fs = require('fs');

const remote = require('electron').remote;
    document.getElementById("minimize").addEventListener("click", function (e) {
        var window = remote.getCurrentWindow();
        window.minimize()
    });

    document.getElementById("maximize").addEventListener("click", function (e) {
        var window = remote.getCurrentWindow();
        if (!window.isMaximized()) {
            window.maximize();
        } else {
            window.unmaximize();
        }
    });

    document.getElementById("close").addEventListener("click", function (e) {
        var window = remote.getCurrentWindow();
        window.close()
    });

    //Prevent File Drop Start//
    document.addEventListener('dragover', function(event) {
        event.preventDefault();
        return false;
    }, false);

    document.addEventListener('drop', function(event) {
        event.preventDefault();
        return false;
    }, false);
    //Prevent File Drop End//

    $scope.filePath;
    $scope.hasFile;
    //Select vCard by Drag & Drop Start//
    document.getElementById("dropzone").ondrop = (ev) => {
            $scope.filePath = ev.dataTransfer.files[0].path;
            console.log($scope.filePath);
            buildContactTable();
            ev.preventDefault()
        }
        //Select vCard by Drag & Drop End//


    //Select vCard by Click Start//
    document.getElementById("dropzone").onclick = (ev) => {
        dialog.showOpenDialog(function(fileNames) {

            if (fileNames === undefined) {
                console.log("No file selected");
            } else {
                $scope.filePath = fileNames[0]
                console.log($scope.filePath);
                buildContactTable();
            }
        });
        ev.preventDefault()
    }



    //Select vCard by Click End//
    var buildContactTable = function() {
        $scope.$apply(function() {

            $scope.promise = $timeout(function() {
                $scope.hasFile = true;
                console.log("window refresh");
            }, 2000);

        });

        console.log("WOW, we got the file!");
        console.log($scope.filePath);

        $scope.contacts = [];
        var vcf = fs.readFileSync($scope.filePath, 'utf8');
        var vparser = new VCardParser(vcf);
        $scope.contacts = vparser.contacts;
        // $scope.contactNumbersLength = [];
        for (var i = 0; i < $scope.contacts.length; i++) {
            $scope.allTel = _.where($scope.contacts[i].datapoints, {name: "tel"});
            // $scope.contactNumbersLength.push($scope.allTel.length);
            // console.log($scope.contactNumbersLength);
            //
            // $scope.contactNumbers.push($scope.allTel);
            //
            // $scope.allEmails = _.where($scope.contacts[i].datapoints, {name: "email"});
            // $scope.contactEmails.push($scope.allEmails);

            for (var k = 0; k < $scope.contacts[i].datapoints.length; k++) {

                if (_.contains($scope.contacts[i].datapoints[k], "tel")) {
                    $scope.contacts[i].datapoints[k].value = $scope.contacts[i].datapoints[k].value.split('-').join('');
                }
            }
        }




        $scope.numbersFilter = function(numbers) {
            var numbersArray = [];

            angular.forEach(numbers, function(value, key) {
                if (value.name == "tel") {
                    numbersArray[key] = value;
                }
            });

            return numbersArray;
        };

        $scope.emailsFilter = function(emails) {
            var emailsArray = [];
            angular.forEach(emails, function(value1, key1) {
                if (value1.name == "email") {
                    emailsArray[key1] = value1;
                }
            });
            return emailsArray;
        };

        var promise;
        $scope.refresh = function() {

            console.log("window refresh");
            $scope.promise = $timeout(function() {
                // loading
            }, 2000);
        }

        $scope.colorsArray = _.shuffle(
            [
                '#F44336', '#FF5252',
                '#E91E63', '#FF4081',
                '#9C27B0', '#E040FB',
                '#673AB7', '#7C4DFF',
                '#3F51B5', '#536DFE',
                '#2196F3', '#448AFF',
                '#03A9F4', '#00BCD4',
                '#009688', '#4CAF50',
                '#8BC34A', '#FFA000',
                '#FF9800', '#FF5722',
                '#795548', '#607D8B'
            ]);

        var global_contacts = $scope.contacts;
        var getContactById = function(contactKey) {
            var contactObj = _.findWhere(global_contacts, {
                $$hashKey: contactKey
            });
            return contactObj;
        }



        $scope.createContact = function(){

            var newContact = {};
            $scope.bday="";
            $scope.photo="";

            $scope.n = $scope.lastname + ";" + $scope.firstname + ";" + $scope.middlename + ";" + $scope.prefix + ";" + $scope.lastname;
            $scope.fn = $scope.prefix + " " + $scope.firstname + " " + $scope.middlename + " " + $scope.lastname + " " + $scope.suffix;

            $scope.numberType=["mobile", "work", "home", "work fax", "home fax", "pager", "other"];
            $scope.emailType=['home', 'work', 'other'];
            $scope.addressType=['home', 'work', 'other'];

            function DialogController($scope, $mdDialog) {

                $scope.showSaveProgress = false;
                $scope.disableBtn = true;
                $scope.fields=[];
                $scope.addPhoneNumber = function() {
                  var newItemNo = $scope.fields.length+1;
                  $scope.fields.push({'name':'tel', 'type':'home', 'value':''});
                };

                $scope.addMobileNumber = function() {
                  var newItemNo = $scope.fields.length+1;
                  $scope.fields.push({'name':'tel', 'type':'mobile', 'value':''});
                };

                $scope.addWorkAddress = function() {
                  var newItemNo = $scope.fields.length+1;
                  $scope.fields.push({'name':'adr', 'type':'work', 'value':''});
                };

                $scope.addHomeAddress = function() {
                  var newItemNo = $scope.fields.length+1;
                  $scope.fields.push({'name':'adr', 'type':'home', 'value':''});
                };

                $scope.addEmail = function() {
                  var newItemNo = $scope.fields.length+1;
                  $scope.fields.push({'name':'email', 'type':'work', 'value':''});
                };

                var base64Image;
                $scope.getImage = function() {
                    dialog.showOpenDialog(function(fileNames) {
                        function base64_encode(file) {
                            var bitmap = fs.readFileSync(file);
                            return new Buffer(bitmap).toString('base64');
                        }

                        if (fileNames === undefined) {
                            console.log("No file selected");
                        }

                        base64Image = base64_encode(fileNames[0]);
                        $scope.photo = base64Image;

                        $scope.$apply(function() {

                        });

                    });
                    return $scope.photo;
                }


                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };


                $scope.$watch(function() {
                    if($scope.fields.length>0 && $scope.fields[0].value != ""){
                        $scope.disableBtn = false;
                    }
                    if($scope.showSaveProgress == true){
                        $scope.disableBtn = true;
                    }
                    });

                //Save button action
                $scope.save = function(newContact) {
                    $scope.showSaveProgress = true;
                    $scope.disableBtn = true;
                    $scope.address={
                        name: "adr",
                        type: $scope.addressType,
                        value: $scope.addressValue
                    };

                    $scope.email={
                        name: "email",
                        type: $scope.emailType,
                        value: $scope.emailValue
                    }

                    $scope.number={
                        name: "tel",
                        type: $scope.numberType,
                        value: $scope.numberValue
                    }

                    $scope.newContact = {
                        bday: $scope.bday,
                        datapoints:$scope.fields,
                        fn: $scope.fn,
                        n: $scope.n,
                        org: $scope.org,
                        photo: $scope.photo,
                        title: $scope.title,
                        url: $scope.url
                    };

                    console.log("scope newcontact before save", $scope.newContact);
                    $scope.promise = $timeout(function() {
                        newContact = $scope.newContact;
                        $mdDialog.hide(newContact);
                    }, 2000);


                };
            }

            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'createContact.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true
                })
                //Update contacts array
                .then(function(newContact) {
                    console.log("Changes Saved", newContact);

                    $scope.contacts.push(newContact);
                    console.log("Changes Pushed", $scope.contacts);
                    // fs.appendFile(__dirname + '/vcard.vcf', vcfString, 'utf8');

                }, function() {
                    console.log("Changes Discarded");

                });
        }

        $scope.deletedContacts = [];
        $scope.deleteContact = function(event) {
                $scope.refresh();
                console.log($scope.contacts);
                var selectedContact = getContactById(event.currentTarget.id);
                for(var d=0; d<$scope.contacts.length; d++){
                    if ($scope.contacts[d].$$hashKey == event.currentTarget.id)
                        var contactIndex = d;
                }
                $scope.contacts.splice(contactIndex, 1);
                console.log("Delete contact at index ", contactIndex);

                $scope.deletedContacts.push(selectedContact);
                console.log("deleted contacts ",$scope.deletedContacts);
                console.log($scope.deletedContacts.length);
                
        }

        $scope.undoDelete = function(){
            $scope.refresh();
            $scope.contacts.push($scope.deletedContacts.pop());
            console.log("deleted contacts ",$scope.deletedContacts);
        }

        //Start Edit Contact
        $scope.editContact = function(event) {

            var selectedContact = getContactById(event.currentTarget.id);
            var updatedContact;


            function DialogController($scope, $mdDialog) {
                var contactColor = document.querySelector('[data-id="' + selectedContact.$$hashKey + '"]').getAttribute("ng-attr");
                $scope.contactColor = contactColor;

                $scope.contact = angular.copy(selectedContact);

                $scope.prefix = selectedContact.n.split(';')[3];
                $scope.firstname = selectedContact.n.split(';')[1];
                $scope.middlename = selectedContact.n.split(';')[2];
                $scope.lastname = selectedContact.n.split(';')[0];
                $scope.suffix = selectedContact.n.split(';')[4];

                $scope.contact.fn = selectedContact.fn;
                $scope.contact.n = selectedContact.n;


                if (_.isUndefined($scope.prefix)) {
                    $scope.prefix = "";
                }
                if (_.isUndefined($scope.firstname)) {
                    $scope.firstname = "";
                }
                if (_.isUndefined($scope.middlename)) {
                    $scope.middlename = "";
                }
                if (_.isUndefined($scope.lastname)) {
                    $scope.lastname = "";
                }
                if (_.isUndefined($scope.suffix)) {
                    $scope.suffix = "";
                }


                var base64Image;
                $scope.getImage = function() {
                    dialog.showOpenDialog(function(fileNames) {
                        function base64_encode(file) {
                            var bitmap = fs.readFileSync(file);
                            return new Buffer(bitmap).toString('base64');
                        }

                        if (fileNames === undefined) {
                            console.log("No file selected");
                        }

                        base64Image = base64_encode(fileNames[0]);
                        $scope.contact.photo = base64Image;

                        $scope.$apply(function() {

                        });

                    });
                    return $scope.contact.photo;
                }


                $scope.fields=[];
                $scope.addPhoneNumber = function() {
                  var newItemNo = $scope.fields.length+1;
                  $scope.contact.datapoints.push({'name':'tel', 'type':'home', 'value':''});
                };

                $scope.addMobileNumber = function() {
                  var newItemNo = $scope.fields.length+1;
                  $scope.contact.datapoints.push({'name':'tel', 'type':'mobile', 'value':''});
                };

                $scope.addWorkAddress = function() {
                  var newItemNo = $scope.fields.length+1;
                  $scope.contact.datapoints.push({'name':'adr', 'type':'work', 'value':''});
                };

                $scope.addHomeAddress = function() {
                  var newItemNo = $scope.fields.length+1;
                  $scope.contact.datapoints.push({'name':'adr', 'type':'home', 'value':''});
                };

                $scope.addEmail = function() {
                  var newItemNo = $scope.fields.length+1;
                  $scope.contact.datapoints.push({'name':'email', 'type':'work', 'value':''});
                };




                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                //Save button action
                $scope.save = function(updatedContact) {
                    $scope.disableBtn = true;

                    $scope.promise = $timeout(function() {
                        updatedContact = $scope.contact;
                        $mdDialog.hide(updatedContact);
                    }, 2000);


                };
            }

            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'editContact.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true
                })
                //Update contacts array
                .then(function(updatedContact) {
                    console.log("Changes Saved", updatedContact);
                    var updatedContactIndex = _.indexOf($scope.contacts, selectedContact);
                    $scope.contacts[updatedContactIndex] = updatedContact;
                    // fs.appendFile(__dirname + '/vcard.vcf', vcfString, 'utf8');

                }, function() {
                    console.log("Changes Discarded");

                });

        };
        // End Edit Contact

        $scope.$apply(function(fileLocation) {
            $scope.goback = function() {
                $scope.filePath = false;
            }
        });


        //Preparing data for excel file export
        var numbers = [];
        var emails = [];
        var addresses = [];
        var excelContacts = [];




        //export excel file
        var alasql = require('alasql');
        $scope.exportXLSX = function() {
            for (var x = 0; x < $scope.contacts.length; x++) {

                //get phone numbers for each contact
                var contactNumbers = [];
                var number = [];
                numbers = _.where($scope.contacts[x].datapoints, {
                    name: "tel"
                });
                for (var h = 0; h < numbers.length; h++) {
                    number.push(numbers[h].value);
                }
                var contactNumbers = number.join();


                //get email accounts for each contact
                var contactEmails = [];
                var email = []
                emails = _.where($scope.contacts[x].datapoints, {
                    name: "email"
                });
                for (var h = 0; h < emails.length; h++) {
                    email.push(emails[h].value);
                }
                var contactEmails = email.join();

                //get address for each contact
                var contactAddress = [];
                var address = [];
                var newline = String.fromCharCode(10);
                var linebreak = String.fromCharCode(13);
                addresses = _.where($scope.contacts[x].datapoints, {
                    name: "adr"
                });
                for (var h = 0; h < addresses.length; h++) {
                    address.push(addresses[h].value);
                }
                var contactAddress = address.join();

                var obj = {
                    'Full Name': $scope.contacts[x].fn,
                    'Phone Numbers': contactNumbers.replace(/,/g, newline + linebreak),
                    'Email Accounts': contactEmails.replace(/,/g, newline + linebreak),
                    'Organization': $scope.contacts[x].org,
                    'Title': $scope.contacts[x].title,
                    'Nickname': $scope.contacts[x].nickname,
                    'Birthday': $scope.contacts[x].bday,
                    'Website': $scope.contacts[x].url,
                    'Address': contactAddress
                };

                excelContacts.push(obj);

            }


            var folderPath = dialog.showOpenDialog({
                properties: ['openDirectory']
            });
            var filePath = folderPath + "/Contacts.xlsx";
            var filePath = (filePath).replace(/\\/g, "/");
            if (folderPath){
                var exportExcelFile = alasql.promise('SELECT * INTO XLSX("' + filePath + '", {headers:true, sheetid:"Contact List"}) FROM ?', [excelContacts]);
                alert("The file has been succesfully saved");
                console.log("Exporting excel sheet...");
                console.log(excelContacts);
            }
            else if (!folderPath) {
                console.log("folder path is not defined");
            }
            else{
                console.log("file is being used");
            }

        }


            //export vcard end
            $scope.options = {
                rowSelection: true,
                multiSelect: true,
                autoSelect: true,
                decapitate: false,
                largeEditDialog: false,
                boundaryLinks: true,
                limitSelect: true,
                pageSelect: true
            };

            $scope.count = $scope.contacts.length;
            $scope.limitOptions = [10, 20, 40, 60, 80, 100];
            $scope.query = {
                order: 'name',
                limit: 10,
                page: 1
            };
            $scope.toggleLimitOptions = function() {
                $scope.limitOptions = $scope.limitOptions ? undefined : [10, 20, 40, 60, 80, 100];
            };

    }

    $scope.exportedContacts = [];
    //export vcard start
    $scope.export = function() {
            var exportedContacts = "";
            for (var j = 0; j < $scope.contacts.length; j++) {

                var vcontact = $scope.contacts[j];
                var photo = $scope.contacts[j].photo;
                if (_.isUndefined(photo)) {
                    var photo = null;
                } else {
                    var photo = $scope.contacts[j].photo;
                }
                $scope.exportedContacts.push(vcontact);
                var vcfString = VCardParser.toVCF(vcontact, photo);
                exportedContacts = vcfString + "\n" + exportedContacts;
            }



            dialog.showSaveDialog({
                defaultPath: '/Contacts.vcf'
            }, function(fileName) {
                if (fileName === undefined) {
                    console.log("You didn't save the file");
                    return;
                }
                fs.writeFile(fileName, exportedContacts, function(err) {
                    if (err) {
                        alert("An error ocurred creating the file " + err.message)
                    }

                    alert("The file has been succesfully saved");
                });
            });
            console.log("Exporting vcard...");
            console.log($scope.exportedContacts);
        }

    $scope.import = function() {
        dialog.showOpenDialog(function(fileNames) {

            if (fileNames === undefined) {
                console.log("No file selected");
            } else {
                $scope.filePath = fileNames[0]
                mergeContactTable();

            }
        });
    }

    var mergeContactTable = function() {
        $scope.$apply(function() {

            $scope.promise = $timeout(function() {
                $scope.hasFile = true;
                console.log("window refresh");
            }, 2000);

        });

        console.log("WOW, we got another file!");
        console.log($scope.filePath);

        $scope.contacts2 = [];
        var vcf = fs.readFileSync($scope.filePath, 'utf8');
        var vparser = new VCardParser(vcf);
        $scope.contacts2 = vparser.contacts;

        for (var u=0; u<$scope.contacts2.length; u++){
            $scope.$apply(function() {




                var duplicateEntries = _.findWhere($scope.contacts, {
                    fn: $scope.contacts2[u].fn
                });
                $scope.contacts.push($scope.contacts2[u]);
                console.log("duplicates", duplicateEntries);

                //$scope.contacts = _.uniq($scope.contacts, 'fn');   //ignore contacts with same name
                //$scope.contacts = _.uniq($scope.contacts, 'datapoints[0].value');     //ignore contacts with same phone number
                // $scope.$watch(function() {
                //     var duplicateEntries = _.uniq($scope.contacts, 'fn');
                //
                //     console.log(duplicateEntries);
                // });

            });

        }



        $scope.options = {
            rowSelection: true,
            multiSelect: true,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: true,
            limitSelect: true,
            pageSelect: true
        };

        $scope.count = $scope.contacts.length;
        $scope.limitOptions = [10, 20, 40, 60, 80, 100];
        $scope.query = {
            order: 'name',
            limit: 10,
            page: 1
        };
        $scope.toggleLimitOptions = function() {
            $scope.limitOptions = $scope.limitOptions ? undefined : [10, 20, 40, 60, 80, 100];
        };
    }

}])


app.filter('iconfilter', function() {
    return function(icon) {
        ///////////Datapoints Icons///////////
        if (icon == "tel-cell") {
            icon = "smartphone";
            return icon;
        }
        if (icon == "tel-cell") {
            icon = "smartphone";
            return icon;
        }
        if (icon == "tel-mobile") {
            icon = "smartphone";
            return icon;
        } else if (icon == "tel-pref") {
            icon = "phone";
            return icon;
        } else if (icon == "tel-home") {
            icon = "phone";
            return icon;
        } else if (icon == "tel-work") {
            icon = "phone";
            return icon;
        } else if (icon == "tel-work fax") {
            icon = "print";
            return icon;
        } else if (icon == "tel-home fax") {
            icon = "print";
            return icon;
        } else if (icon == "tel-pager") {
            icon = "perm_phone_msg";
            return icon;
        } else if (icon == "tel-voice") {
            icon = "phone";
            return icon;
        } else if (icon == "email-home") {
            icon = "email";
            return icon;
        } else if (icon == "email-work") {
            icon = "email";
            return icon;
        } else if (icon == "email-internet") {
            icon = "email";
            return icon;
        } else if (icon == "adr-home") {
            icon = "room";
            return icon;
        } else if (icon == "adr-work") {
            icon = "room";
            return icon;
        } else if (icon == "about-anniversary") {
            icon = "today";
            return icon;
        } else if (icon == "about-") {
            icon = "today";
            return icon;
        } else if (icon == "chat") {
            icon = "chat";
            return icon;
        }
        ///////////Main Icons///////////
        else if (icon == "bday") {
            icon = "cake";
            return icon;
        } else if (icon == "fn") {
            icon = "account_circle";
            return icon;
        } else if (icon == "org") {
            icon = "work";
            return icon;
        } else if (icon == "title") {
            icon = "account_box";
            return icon;
        } else if (icon == "url") {
            icon = "link";
            return icon;
        }
    }
})


app.filter('textfilter', function() {
    return function(text) {
        ///////////Datapoints Icons///////////
        if (text == "tel-cell") {
            text = "Mobile";
            return text;
        } else if (text == "tel-mobile") {
            text = "Mobile";
            return text;
        } else if (text == "tel-home") {
            text = "Home";
            return text;
        } else if (text == "tel-work") {
            text = "Work";
            return text;
        } else if (text == "tel-pref") {
            text = "Main Tel";
            return text;
        } else if (text == "tel-work fax") {
            text = "Work Fax";
            return text;
        } else if (text == "tel-home fax") {
            text = "Home Fax";
            return text;
        } else if (text == "tel-pager") {
            text = "Pager Tel";
            return text;
        } else if (text == "tel-voice") {
            text = "Other Tel";
            return text;
        } else if (text == "email-home") {
            text = "Home Email";
            return text;
        } else if (text == "email-work") {
            text = "Work Email";
            return text;
        } else if (text == "email-internet") {
            text = "Email";
            return text;
        } else if (text == "adr-home") {
            text = "Home Address";
            return text;
        } else if (text == "adr-work") {
            text = "Work Address";
            return text;
        } else if (text == "about-anniversary") {
            text = "Anniversary";
            return text;
        } else if (text == "about-") {
            text = "Other Anniversary";
            return text;
        } else if (text == "chat-skype-username") {
            text = "Skype Username";
            return text;
        }
        ///////////Main Text///////////
        else if (text == "bday") {
            text = "Birthday";
            return text;
        } else if (text == "fn") {
            text = "Full Name";
            return text;
        } else if (text == "org") {
            text = "Organization";
            return text;
        } else if (text == "title") {
            text = "Title";
            return text;
        } else if (text == "url") {
            text = "Website";
            return text;
        }

    }
})

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('blue');
});
