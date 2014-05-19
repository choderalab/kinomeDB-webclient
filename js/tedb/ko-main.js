function viewModel() {
    var self = this;
    self.currentPage = {
        type: ko.observable()
    }

    self.currentURL = ko.observable();
    self.currentSearchString = ko.observable();
    self.dbURI = 'http://ec2-54-227-62-182.compute-1.amazonaws.com/kinomeDBAPI/';
    self.dbtarget = new targetModel();
    self.targetlist = new targetListModel();
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
            request_url = self.dbURI + 'entry?ac=' + self.currentTargetAC();
            self.ajax(request_url, 'GET').done(function(data) {
                self.dbtarget.updatedata(data);
            });
        });

        this.get('search', function () {
            self.currentPage.type('search_results');
            self.currentURL('search?query=' + encodeURIComponent(this.params.query));
            self.currentSearchString(this.params.query);
            request_url = self.dbURI + 'search?query=' + self.currentSearchString();
            self.ajax(request_url, 'GET').done(function(data) {
                self.targetlist.updatedata(data.results);
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
        uniprot_ac_regex = new RegExp('[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}');
        uniprot_ac_regex_result = uniprot_ac_regex.exec(self.currentSearchString());
        if (uniprot_ac_regex_result != null) {
            href = 'target/' + self.currentSearchString();
            location.assign(href);
        }
        else {
            href = 'search?query=' + encodeURIComponent(self.currentSearchString());
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
