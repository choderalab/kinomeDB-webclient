function viewModel() {
    var self = this;
    self.currentPage = {
        type: ko.observable()
    }

    self.currentURL = ko.observable();
    self.newSearchString = ko.observable();
    self.dbURI = 'http://ec2-54-227-62-182.compute-1.amazonaws.com/kinomeDBAPI/entry?ac=';
    self.dbtarget = new targetModel();
    self.currentTargetAC = ko.observable();
    self.uniprot_href = ko.computed(function() {
        return "http://www.uniprot.org/uniprot/" + self.currentTargetAC();
    });

    self.ajax = function(uri, method, data) {
        var request = {
            url: uri,
            type: method,
            contentType: "application/json",
            accepts: "application/json",
            cache: false,
            dataType: 'json',
            data: JSON.stringify(data),
            error: function(jqXHR) {
                console.log("ajax error " + jqXHR.status);
            }
        };
        return $.ajax(request);
    };

    self.sammyapp = Sammy(function () {
        this.get('target/:target_ac', function () {
            self.currentPage.type('target');
            self.currentURL('target/' + this.params.target_ac);
            self.currentTargetAC(this.params.target_ac);
            self.ajax(self.dbURI + self.currentTargetAC(), 'GET').done(function(data) {
                self.dbtarget.updatedata(data);
            });
        });

        this.get('', function () {
            self.currentPage.type('home');
            self.currentURL('');
            self.currentTargetAC(null);
        });

    });

    self.sammyapp.run();
    // self.sammyapp.run('kinomeDB/target/P00519');


    self.searchHandler = function() {
        if (true) {
            href = 'target/' + self.newSearchString();
            location.assign(href);
        }
    };


}

var vm = new viewModel();
ko.applyBindings(vm);
// vm.sammyapp.run('kinomeDB/target/P00519');

// $(document).ready(function() {
//     $('#pdbtable').dataTable({
//         "sPaginationType": "full_numbers"
//     });
// });
